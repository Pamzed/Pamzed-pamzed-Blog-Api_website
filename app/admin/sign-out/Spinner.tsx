'use client';

import useUserStore from '@/app/stores/user';
import { httpService } from '@/app/utils/httpService';
import { getToken, removeToken } from '@/app/utils/token';
import { Spinner as SpinnerComponent } from '@nextui-org/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const Spinner = () => {
  const navigate = useRouter();
  const removeUser = useUserStore((state) => state.removeUser);

  useEffect(() => {
    const signOut = async () => {
      try {
        const token: String = getToken(localStorage);
        await httpService.get('/admin/logout', {
          headers: { Authorization: `Bearer ${token}` },
        });
        removeToken(localStorage);
        removeUser();
        navigate.replace('/admin/sign-in');
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response)
            if (error.response.data.message.includes('Unauthenticated')) {
              removeToken(localStorage);
            }
        }

        if (error instanceof AxiosError) {
          navigate.replace('/admin/sign-in');
          return;
        }
        if (error instanceof Error) {
          navigate.replace('/admin/sign-in');
          return;
        } else toast.error('Something went wrong.');
      }
    };
    signOut();
  }, []);

  return (
    <div className="grid place-content-center h-screen">
      <SpinnerComponent size="lg" color="primary" />
    </div>
  );
};

export default Spinner;
