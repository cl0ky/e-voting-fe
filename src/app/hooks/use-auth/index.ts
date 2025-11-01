'use client';

import { useCallback, useContext } from 'react';

import { DialogResultController } from '@amani-group-id/toolkit/mobile';
import { useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { AuthContext, authDefaultValue } from '@/src/app/components/auth-context';
import axiosWithAuth from '@/src/app/utils/axiosWithAuth';

import { axiosWithoutAuth } from '../../utils/axiosWithoutAuth';

type User = {
  userId: string;
  name: string;
  email: string;
  phone: string;
};

type Response = {
  message: string;
  data: {
    user: User;
    isVerified: boolean;
    hasFillQuestionnaire: boolean;
    accessToken: string;
  };
};

export const useAuth = () => {
  const { setAuthenticated, setIsLogout } = useContext(AuthContext);
  const { replace } = useRouter();

  const { setAuth, auth } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const signIn = useCallback(
    async (value: { emailPhone: string; password: string }) => {
      const newValue = value.emailPhone.includes('@')
        ? value.emailPhone
        : value.emailPhone.replace(/^62|^0/, '');
      const { data: result } = await axiosWithoutAuth<Response>({
        method: 'POST',
        url: '/auth/login',
        data: {
          email_phone: newValue,
          password: value.password,
        },
      });
      const { data } = result;

      axiosWithAuth.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
      setIsLogout(false);
      setAuth({
        userId: data.user.userId,
        email: data.user.email,
        name: data.user.name,
        phone: data.user.phone,
      });
      setAuthenticated(data.accessToken);
      return result;
    },
    [setAuth, setAuthenticated, setIsLogout],
  );

  const forgotPassword = useCallback(async (value: { email: string }) => {
    const { data: result } = await axios.post<Response>(`/auth/send-reset-password/${value.email}`);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    try {
      const result = await axiosWithoutAuth.get(`/auth/logout`, {
        withCredentials: true,
      });
      setIsLogout(true);
      axiosWithAuth.defaults.headers.common['Authorization'] = '';
      replace('/auth/login');
      queryClient.clear();
      setAuth(authDefaultValue);
      return result.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        DialogResultController.open({
          content: error.response?.data.message || error.message,
          variant: 'error',
          closeButtonTitle: 'Tutup',
        });
      }
    }
  }, [setIsLogout, replace, queryClient, setAuth]);

  return { auth, setAuth, signIn, signOut, forgotPassword };
};
