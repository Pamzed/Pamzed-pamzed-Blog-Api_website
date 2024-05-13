'use client';

import { useEffect } from 'react';
import { checkIfToken } from '../../utils/token';
import { useRouter } from 'next/navigation';

const Redirect = () => {
  const navigate = useRouter();

  useEffect(() => {
    checkIfToken(
      localStorage,
      () => {},
      () => navigate.push('/admin/sign-in')
    );
  }, []);

  return null;
};

export default Redirect;
