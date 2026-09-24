import { UserPreferences, TripPlan, DestinationOption, LocalGuideInsights, GenerateContentResponse } from "../types";

// --- Audio Helper Functions For Client Decoding ---
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// ------ 1. Generate Destination Options ------
export const generateDestinationOptions = async (prefs: UserPreferences): Promise<DestinationOption[]> => {
  try {
    const response = await fetch("/api/generateDestinationOptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefs }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Destination options request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Destination Options Proxy Error:", error);
    throw error;
  }
};

// ------ 2. Generate Detailed Trip Plan ------
export const generateTripPlan = async (prefs: UserPreferences, selectedDestination: DestinationOption): Promise<TripPlan> => {
  try {
    const response = await fetch("/api/generateTripPlan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefs, selectedDestination }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Trip plan generation failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Trip Plan Generation Proxy Error:", error);
    throw error;
  }
};

// ------ 3. Generate Local Guide Insights ------
export const generateLocalGuideInsights = async (plan: TripPlan): Promise<LocalGuideInsights> => {
  try {
    const response = await fetch("/api/generateLocalGuideInsights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Local Guide request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Local Guide Generation Proxy Error:", error);
    throw error;
  }
};

// ------ 4. generateSpeech (TTS) ------
export const generateSpeech = async (text: string): Promise<AudioBufferSourceNode> => {
  try {
    const response = await fetch("/api/generateSpeech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Speech synthesis request failed");
    }

    const { base64Audio } = await response.json();
    if (!base64Audio) throw new Error("No speech returned");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      audioContext,
      24000,
      1
    );

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    return source;
  } catch (error) {
    console.error("Speech Generation Proxy Error:", error);
    throw error;
  }
};

// ------ 5. Chat Assistant (Streaming support over chunked JSON) ------
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  tripContext: TripPlan | null
): Promise<AsyncIterable<any>> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, newMessage, tripContext }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Chat failed");
    }

    if (!response.body) {
      throw new Error("No response body stream for chat");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    return {
      async *[Symbol.asyncIterator]() {
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          
          // Hold the last incomplete line
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                yield JSON.parse(line);
              } catch (e) {
                console.warn("Proxy streaming parse error:", e, "Line:", line);
              }
            }
          }
        }
        if (buffer.trim()) {
          try {
            yield JSON.parse(buffer);
          } catch (e) {
            console.warn("Proxy streaming buffer parse error:", e);
          }
        }
      }
    };
  } catch (error) {
    console.error("Chat Message Proxy Error:", error);
    throw error;
  }
};

// ------ 6. Maps Grounding ------
export const findNearbyPlaces = async (query: string, location?: { lat: number; lng: number }) => {
  try {
    const response = await fetch("/api/findNearbyPlaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, location }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Find nearby places request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Nearby Places Grounding Proxy Error:", error);
    throw error;
  }
};
