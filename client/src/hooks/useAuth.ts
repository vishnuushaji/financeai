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

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    // Set up axios interceptor for auth token
    const originalRequest = apiRequest;
    
    // Add token to all requests
    if (token) {
      localStorage.setItem('auth_token', token);
    }
  }, [token]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    setToken,
    logout,
  };
}

export function useSignup() {
  const { toast } = useToast();
  const { setToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const response = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      toast({
        title: "Account created successfully!",
        description: data.message,
      });
      window.location.href = '/dashboard';
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

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      return response as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      toast({
        title: "Welcome back!",
        description: data.message,
      });
      window.location.href = '/dashboard';
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
      const response = await apiRequest('/api/auth/forgot-password', {
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
      const response = await apiRequest('/api/auth/reset-password', {
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