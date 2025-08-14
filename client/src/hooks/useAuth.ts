import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('auth_token')
  );
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      if (!token) return null;
      try {
        // Remove /api prefix - apiRequest adds it automatically
        const response = await apiRequest('/auth/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        return response.user as User;
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        return null;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    queryClient.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    // Update token in localStorage whenever it changes
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  return {
    user: userData,
    token,
    isLoading,
    isAuthenticated: !!userData && !!token,
    setToken,
    logout,
  };
}

export function useSignup() {
  const { toast } = useToast();
  const { setToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      // Remove /api prefix - apiRequest adds it automatically
      const response = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      
      // Update the user query cache
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      toast({
        title: "Account created successfully!",
        description: data.message,
      });
      
      // Small delay to ensure state updates
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });
}

export function useLogin() {
  const { toast } = useToast();
  const { setToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Remove /api prefix - apiRequest adds it automatically
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      
      // Update the user query cache
      queryClient.setQueryData(['auth', 'user'], data.user);
      
      toast({
        title: "Welcome back!",
        description: data.message,
      });
      
      // Small delay to ensure state updates
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });
}

export function useForgotPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      // Remove /api prefix - apiRequest adds it automatically
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as { message: string };
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset sent",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request failed",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    },
  });
}

export function useResetPassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const response = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as { message: string };
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset successful",
        description: data.message,
      });
      window.location.href = '/login';
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });
}