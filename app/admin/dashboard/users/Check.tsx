'use client';

import useUserStore from '@/app/stores/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Check = () => {
  const navigate = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && user?.role.trim() !== 'Admin')
      navigate.replace('/admin/dashboard');
  }, []);

  return '';
};

export default Check;
