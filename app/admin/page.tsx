import { useRouter } from 'next/router';
import React from 'react';
import { redirect } from 'next/navigation';

const page = () => {
  redirect('/admin/dashboard');
};

export default page;
