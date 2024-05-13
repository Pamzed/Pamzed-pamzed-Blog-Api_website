'use client';

import axios from 'axios';

export const httpService = axios.create({
  baseURL: 'https://test.larihq.com/api/v1',
});

httpService.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    const { status, data } = error.response || {}; // Handle potential missing response object

    // Check status code and error message
    if (status === 401 && data.message === 'You are Unauthenticated.') {
      localStorage.removeItem(process.env.NEXT_PUBLIC_KEY || '');
      location.replace('/admin/sign-in');
    }

    return Promise.reject(error); // Re-throw the error for further handling
  }
);
