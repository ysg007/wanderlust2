import { User } from '../types';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<User> => {
  await delay(1000); // Simulate API latency
  
  // Basic validation simulation
  if (!email.includes('@')) {
    throw new Error("Invalid email address");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Simulate success
  return {
    id: 'user-' + Date.now(),
    name: (() => {
      const raw = email.split('@')[0].replace(/[._\-\d]+/g, ' ').trim();
      return raw.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Traveler';
    })(),
    email: email
  };
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  await delay(1500);
  
  if (!email.includes('@')) throw new Error("Invalid email address");
  if (!name) throw new Error("Name is required");
  if (password.length < 6) throw new Error("Password too short");

  return {
    id: 'user-' + Date.now(),
    name,
    email
  };
};

export const forgotPassword = async (email: string): Promise<void> => {
  await delay(1000);
  if (!email.includes('@')) throw new Error("Invalid email address");
  // In a real app, this would trigger a backend email
  return; 
};