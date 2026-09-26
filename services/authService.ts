import { User } from '../types';

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong');
  }

  return data;
}

export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const data = await request<{ user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  return data.user;
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const data = await request<{ user: User; message?: string }>(
    '/api/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  );

  return data.user;
};

export const forgotPassword = async (
  email: string
): Promise<void> => {
  await request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await request<{ user: User | null }>(
      '/api/auth/me'
    );

    return data.user || null;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  await request('/api/auth/logout', {
    method: 'POST',
  });
};
