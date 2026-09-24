import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { 
  getFallbackDestinationOptions, 
  getFallbackTripPlan, 
  getFallbackLocalGuideInsights 
} from "./fallbackData";
import { 
  DestinationOption, 
  TripPlan, 
  LocalGuideInsights, 
  UserPreferences 
} from "./types";

// Lazy-initialized Gemini Client to prevent server startup crash if key is missing initially
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helpers
const cleanJson = (text: string) => {
  if (!text) return "";
  const match = text.match(/```json\s*([\s\S]*?)\s*(?:```|$)/);
  let cleaned = match ? match[1] : text;
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return cleaned;
};

// Cache store for travel responses with general 1-hour TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cacheStore = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getFromCache<T>(key: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

function setToCache<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

// Keep track of the current primary model dynamically. If Pro/Flash errors out with RESOURCE_EXHAUSTED or similar,
// we transition to the next available model permanently at runtime for lightning-fast subsequent responses.
let currentPrimaryModel = "gemini-2.5-pro";

// Tiered Gemini execution with sequential retries and model failovers (Pro -> Flash -> Flash-Lite)
async function generateContentWithTieredFallback(
  prompt: string,
  schema: Schema,
  systemInstruction: string
): Promise<string> {
  const ai = getAI();

  // Sequence of standard text models to try
  const modelOptions = ["gemini-2.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

  // Filter list so we start from currentPrimaryModel, preserving any dyn downgrade done previously,
  // but keeping other options as fallback.
  let startIndex = modelOptions.indexOf(currentPrimaryModel);
  if (startIndex === -1) startIndex = 0;
  const modelsToTry = modelOptions.slice(startIndex);

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    console.log(`[Gemini Pipeline INFO] Trying model '${modelName}' in tiered fallback chain...`);

    // Retry transient errors (like 503 UNAVAILABLE or temporary 500)
    // but on 429 RESOURCE_EXHAUSTED failover to the next option immediately.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[Gemini Pipeline] Calling model '${modelName}' - Attempt ${attempt}/${maxAttempts}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            systemInstruction,
          },
        });
        const txt = response.text;
        if (!txt) {
          throw new Error(`Empty response text from model ${modelName}`);
        }
        console.log(`[Gemini Pipeline INFO] Model '${modelName}' success on attempt ${attempt}`);

        // Update the currentPrimaryModel dynamically to this successful model
        // to fast-path any subsequent requests.
        if (modelName !== currentPrimaryModel) {
          console.log(`[Gemini Pipeline INFO] Updating currentPrimaryModel dynamically to '${modelName}' for subsequent requests.`);
          currentPrimaryModel = modelName;
        }
        return txt;
      } catch (error: any) {
        lastError = error;
        const status = error.status || error.code || (error.error && error.error.code);
        const errStr = (String(error.message || "") + " " + String(error.status || "")).toLowerCase();

        console.log(`[Gemini Pipeline WARN] Model '${modelName}' attempt ${attempt}/${maxAttempts} failed: ${error.message || error}`);

        // If non-retriable input or auth error (400, 403), stop retrying and stop fallback immediately
        if (status === 400 || status === 403) {
          console.log(`[Gemini Pipeline INFO] Non-retriable status code ${status}. Propagating immediately.`);
          throw error;
        }

        // If rate limited or quota exceeded, skip further retries of this model. Move to the next model immediately.
        if (
          status === 429 ||
          status === "RESOURCE_EXHAUSTED" ||
          errStr.includes("resource_exhausted") ||
          errStr.includes("quota") ||
          errStr.includes("rate limit") ||
          errStr.includes("limit: 0") ||
          errStr.includes("exhausted")
        ) {
          console.log(`[Gemini Pipeline INFO] Quota/Rate-limit encountered on '${modelName}'. Failover to next model option.`);
          
          // Switch currentPrimaryModel dynamically to the next option in modelOptions
          const nextIndex = modelOptions.indexOf(modelName) + 1;
          if (nextIndex < modelOptions.length) {
            currentPrimaryModel = modelOptions[nextIndex];
          }
          break; // break the attempt loop to try the next model option
        }

        // If temporary 503 error, wait and retry
        if (attempt < maxAttempts) {
          const delay = attempt * 1500;
          console.log(`[Gemini Pipeline INFO] Waiting ${delay}ms before retrying '${modelName}' due to possible temporary exception...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  // All fallback options failed
  console.log(`[Gemini Pipeline FATAL] All models in tiered fallback chain failed.`);
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  
  // CORS for development
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
    next();
  });

  // API Routes (must precede Vite or static files middleware)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // 1. Generate Destination Options (List of 12)
  app.post("/api/generateDestinationOptions", async (req, res) => {
    try {
      const { prefs } = req.body;
      if (!prefs) {
        res.status(400).json({ error: "Preferences are required" }); return;
      }

      // Check Cache First
      const cacheKey = `destinations_${JSON.stringify(prefs)}`;
      const cached = getFromCache<DestinationOption[]>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] Returning cached destinations for:`, JSON.stringify(prefs));
        res.json(cached); return;
      }

      console.log(`[Cache MISS] Segmenting tiered model generator for destinations...`);

      let parsedOptions;
      try {
        const schema: Schema = {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              description: { type: Type.STRING },
              highlightActivity: { type: Type.STRING },
              estimatedTotalCost: { type: Type.NUMBER, description: "Total estimated cost for the whole trip in INR" },
              matchScore: { type: Type.NUMBER, description: "Score from 0-100 indicating how well this matches user preferences" },
              matchReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
              weather: {
                type: Type.OBJECT,
                properties: {
                  temp: { type: Type.STRING },
                  condition: { type: Type.STRING }
                }
              },
              crowdLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'Peak'] },
              safetyScore: { type: Type.NUMBER, description: "Safety score from 0-100" },
              imageUrl: { type: Type.STRING, description: "A relevant Unsplash image URL for this destination (https://images.unsplash.com/...)" }
            }
          }
        };

        const scopePrompt = prefs.locationScope === "India" 
          ? "inside India" 
          : "outside India (International destinations popular for Indians)";

        const prompt = `
          Suggest 6 premium, highly targeted, distinct travel destinations ${scopePrompt} based on these user preferences:
          - Intent: ${prefs.intent}
          - Month: ${prefs.month}
          - Duration: ${prefs.days} days
          - Daily Budget: ₹${prefs.budget}
          - Companions: ${prefs.companions}
          - Transport Preference: ${prefs.transport || "No Preference"}
          - Accommodation Preference: ${prefs.accommodation || "Mid-range Hotel"}
          
          CRITICAL LENGTH LIMITS (to prevent JSON truncation):
          - id: unique string (e.g., "1", "2")
          - description: extremely concise, maximum 20 words or 120 characters.
          - highlightActivity: brief, maximum 10 words.
          - matchReasons: return exactly 3 reasons, each maximum 6 words.
          
          Return a JSON array matching the schema.
        `;

        const systemInstruction = "You are a travel consultant. Suggest exactly 6 distinct travel destinations. Ensure descriptions, highlightActivity, and matchReasons are extremely short and concise to prevent any response truncation.";

        const text = await generateContentWithTieredFallback(prompt, schema, systemInstruction);
        const cleanedText = cleanJson(text);
        parsedOptions = JSON.parse(cleanedText);

        // Store active result in Cache
        setToCache(cacheKey, parsedOptions);
      } catch (geminiError: any) {
        console.log(`[WARN] Gemini execution for generateDestinationOptions failed: ${geminiError.message || geminiError}. Activating premium fallback controller.`);
        parsedOptions = getFallbackDestinationOptions(prefs);
        setToCache(cacheKey, parsedOptions); // Buffer fallback under keys to prevent storming broken endpoints
      }

      res.json(parsedOptions);
    } catch (error: any) {
      console.log(`[ERROR] Express Error (generateDestinationOptions): ${error.message || error}`);
      res.status(500).json({ error: error.message || "Failed to generate destination options" });
    }
  });

  // 2. Generate Full Trip Plan
  app.post("/api/generateTripPlan", async (req, res) => {
    try {
      const { prefs, selectedDestination } = req.body;
      if (!prefs || !selectedDestination) {
        res.status(400).json({ error: "prefs and selectedDestination are required" }); return;
      }

      // Check Cache First
      const cacheKey = `plan_${JSON.stringify(prefs)}_${selectedDestination.id}_${selectedDestination.name}`;
      const cached = getFromCache<TripPlan>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] Returning cached trip plan for destination:`, selectedDestination.name);
        res.json(cached); return;
      }

      console.log(`[Cache MISS] Segmenting tiered model generator for trip plan...`);

      let planResult;
      try {
        const schema: Schema = {
          type: Type.OBJECT,
          properties: {
            destinationId: { type: Type.STRING },
            destination: { type: Type.STRING },
            country: { type: Type.STRING },
            description: { type: Type.STRING },
            currency: { type: Type.STRING },
            exchangeRateToINR: { type: Type.NUMBER },
            safetyScore: { type: Type.INTEGER },
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalEstimatedCost: { type: Type.NUMBER },
            budgetBreakdown: {
              type: Type.OBJECT,
              properties: {
                travel: { type: Type.NUMBER },
                stay: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                localTransport: { type: Type.NUMBER },
                emergency: { type: Type.NUMBER }
              }
            },
            thingsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
            hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
            packingList: { type: Type.ARRAY, items: { type: Type.STRING } },
            hotelRecommendation: {
              type: Type.OBJECT,
              properties: {
                area: { type: Type.STRING },
                reason: { type: Type.STRING },
                avgPrice: { type: Type.NUMBER }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        costEstimate: { type: Type.NUMBER },
                        type: { type: Type.STRING, enum: ['food', 'activity', 'relax', 'travel'] }
                      }
                    }
                  }
                }
              }
            }
          }
        };

        const prompt = `
          Create a detailed trip plan for ${selectedDestination.name}, ${selectedDestination.country}.
          Month: ${prefs.month}
          Intent: ${prefs.intent}
          Companions: ${prefs.companions}
          Duration: ${prefs.days} days
          Daily Budget: ₹${prefs.budget}
          Transport Preference: ${prefs.transport || "No Preference"}
          Accommodation Style: ${prefs.accommodation || "Mid-range Hotel"}
          
          CRITICAL CONCISENESS LIMITS (to prevent JSON truncation):
          - safetyTips: maximum 4 items, each under 10 words.
          - thingsToAvoid: maximum 4 items, each under 10 words.
          - hiddenGems: maximum 4 items, each under 15 words.
          - packingList: maximum 6 items, each under 5 words.
          - itinerary: include exactly 3 key items per day (e.g. morning, afternoon, evening). Each item activity name maximum 8 words, description maximum 15 words.
          
          Provide:
          - safetyScore (0-100) and brief safetyTips.
          - budgetBreakdown matching the totals in INR.
          - hotelRecommendation matching the Accommodation style if specified.
          - packingList suited for the season/month and activities.
          - thingsToAvoid and hiddenGems.
          - full day-by-day itinerary. Include costEstimates.
          
          Return the JSON matching the schema.
        `;

        const systemInstruction = "You are an expert startup-grade travel planner. Create realistic and authentic itineraries. Ensure all text arrays and descriptions are extremely short and concise to prevent any response truncation.";

        const text = await generateContentWithTieredFallback(prompt, schema, systemInstruction);
        const cleanedText = cleanJson(text);
        planResult = JSON.parse(cleanedText);

        setToCache(cacheKey, planResult);
      } catch (geminiError: any) {
        console.log(`[WARN] Gemini execution for generateTripPlan failed: ${geminiError.message || geminiError}. Activating premium fallback controller.`);
        planResult = getFallbackTripPlan(prefs, selectedDestination);
        setToCache(cacheKey, planResult);
      }

      res.json(planResult);
    } catch (error: any) {
      console.log(`[ERROR] Express Error (generateTripPlan): ${error.message || error}`);
      res.status(500).json({ error: error.message || "Failed to generate detailed plan" });
    }
  });

  // 3. Generate Local Guide Insights
  app.post("/api/generateLocalGuideInsights", async (req, res) => {
    try {
      const { plan } = req.body;
      if (!plan) {
        res.status(400).json({ error: "Trip plan context is required" }); return;
      }

      // Check Cache First
      const cacheKey = `insights_${plan.destinationId || plan.destination}`;
      const cached = getFromCache<LocalGuideInsights>(cacheKey);
      if (cached) {
        console.log(`[Cache HIT] Returning cached insights for:`, plan.destination);
        res.json(cached); return;
      }

      console.log(`[Cache MISS] Segmenting tiered model generator for local insights...`);

      let insightsResult;
      try {
        const schema: Schema = {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              properties: {}, // Note generic definitions
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  icon: { type: Type.STRING, enum: ['food', 'stay', 'activity', 'transport', 'secret'] },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        priceRange: { type: Type.STRING },
                        rating: { type: Type.STRING },
                        bestFor: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        };

        const prompt = `
          Provide local insights for ${plan.destination}, ${plan.country}.
          Current Plan Context: ${plan.description}
          Deliver concrete local secrets for accommodation, food, stays, transport hacks, and packing.
          Return JSON matching the schema.
        `;

        const text = await generateContentWithTieredFallback(prompt, schema, "You are an expert local guide. Return JSON matching the schema.");
        insightsResult = JSON.parse(cleanJson(text));

        setToCache(cacheKey, insightsResult);
      } catch (geminiError: any) {
        console.log(`[WARN] Gemini execution for generateLocalGuideInsights failed: ${geminiError.message || geminiError}. Activating premium fallback controller.`);
        insightsResult = getFallbackLocalGuideInsights(plan);
        setToCache(cacheKey, insightsResult);
      }

      res.json(insightsResult);
    } catch (error: any) {
      console.log(`[ERROR] Express Error (generateLocalGuideInsights): ${error.message || error}`);
      res.status(500).json({ error: error.message || "Failed to generate local guide insights" });
    }
  });

  // 4. Generate Speech (TTS)
  app.post("/api/generateSpeech", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: "Text is required" }); return;
      }

      const ai = getAI();
      const model = "gemini-2.5-flash-preview-tts"; 

      let response;
      let lastErrorSpec;
      // Retry up to 3 times for speech generation with progressive backoff on transient errors
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`[generateSpeech] Calling model '${model}' - Attempt ${attempt}/3`);
          response = await ai.models.generateContent({
            model,
            contents: [{ parts: [{ text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
              },
            },
          });
          break;
        } catch (err: any) {
          lastErrorSpec = err;
          console.log(`[generateSpeech] Attempt ${attempt}/3 failed: ${err.message || err}`);
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
          }
        }
      }

      if (!response) {
        throw lastErrorSpec;
      }

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio data returned");
      }

      res.json({ base64Audio });
    } catch (error: any) {
      console.log(`[ERROR] Express Error (generateSpeech): ${error.message || error}`);
      const errMsg = (error as any)?.message || "Failed to generate speech";
      const isUnavailable = errMsg.includes("not found") || errMsg.includes("not supported");
      res.status(isUnavailable ? 503 : 500).json({ error: isUnavailable
        ? "Voice guide unavailable — TTS model may not be enabled on your API tier."
        : errMsg });
    }
  });

  // 5. Chat Assistant (Streaming support proxying)
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, newMessage, tripContext } = req.body;
      if (!newMessage) {
        res.status(400).json({ error: "newMessage is required" }); return;
      }

      const ai = getAI();

      let contextPrompt = "";
      if (tripContext) {
        contextPrompt = `
          Current Trip Context:
          Destination: ${tripContext.destination}, ${tripContext.country}
          Currency: ${tripContext.currency} (1 ${tripContext.currency} = ${tripContext.exchangeRateToINR} INR)
        `;
      }

      let chat;
      let streamResponse;
      // Chat dynamic tiered model selection - avoids Pro model to save quota, falls back gracefully to flash-lite
      // Build ordered unique chat model list (skip Pro to conserve quota)
      const chatModelPool = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
      if (currentPrimaryModel !== "gemini-2.5-pro") {
        chatModelPool.unshift(currentPrimaryModel);
      }
      const uniqueChatModels = Array.from(new Set(chatModelPool));

      let lastChatError: any = null;
      for (const chatModel of uniqueChatModels) {
        try {
          console.log(`[Chat Assistant] Intializing chat with model: '${chatModel}'`);
          chat = ai.chats.create({
            model: chatModel,
            history: history || [],
            config: {
              systemInstruction: `You are an elite, startup-grade concierge travel assistant. Provide deep, actual practical utilities, secret tips, authentic stay suggestions, safety score explanations, packing hacks, and local expertise. ${contextPrompt}`,
            },
          });
          streamResponse = await chat.sendMessageStream({ message: newMessage });
          break;
        } catch (chatErr: any) {
          lastChatError = chatErr;
          console.log(`[Chat Assistant] Init with model '${chatModel}' failed: ${chatErr.message || chatErr}. Trying fallback.`);
        }
      }

      if (!streamResponse) {
        throw lastChatError;
      }

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of streamResponse) {
        let textContent = '';
        try {
          if (typeof chunk.text === 'string') textContent = chunk.text;
          else if (chunk.candidates?.[0]?.content?.parts?.[0]?.text)
            textContent = chunk.candidates[0].content.parts[0].text;
        } catch {}
        if (textContent) res.write(JSON.stringify({ text: textContent }) + '\n');
      }
      res.end();
    } catch (error: any) {
      console.log(`[ERROR] Express Error (chat): ${error.message || error}`);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to send message" });
      } else {
        res.end();
      }
    }
  });

  // 6. Find Nearby Places (Maps Grounding)
  app.post("/api/findNearbyPlaces", async (req, res) => {
    try {
      const { query, location } = req.body;
      if (!query) {
        res.status(400).json({ error: "Query is required" }); return;
      }

      const ai = getAI();
      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng,
            },
          },
        };
      }

      let response;
      let lastPlacesError;
      // Maps Grounding support through tiered models with retry failover
      const mapModels = [currentPrimaryModel, "gemini-2.0-flash", "gemini-2.0-flash-lite"];
      const uniqueMapModels = Array.from(new Set(mapModels));

      for (const mapModel of uniqueMapModels) {
        try {
          console.log(`[findNearbyPlaces] Running maps grounding with model: '${mapModel}'`);
          response = await ai.models.generateContent({
            model: mapModel,
            contents: query,
            config,
          });
          break;
        } catch (mapErr: any) {
          lastPlacesError = mapErr;
          console.log(`[findNearbyPlaces] Failed with model '${mapModel}': ${mapErr.message || mapErr}. Trying next.`);
        }
      }

      if (!response) {
        throw lastPlacesError;
      }

      res.json({
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      });
    } catch (error: any) {
      console.log(`[ERROR] Express Error (findNearbyPlaces): ${error.message || error}`);
      res.status(500).json({ error: error.message || "Failed to find nearby places" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Serving development Vite assets...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving built static production assets.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((e) => {
  console.log(`[FATAL] Server Crash on Startup: ${e.message || e}`);
});
