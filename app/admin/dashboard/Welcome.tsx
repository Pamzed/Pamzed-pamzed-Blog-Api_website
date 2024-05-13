'use client';

import React, { useEffect } from 'react';
import CreatePostTrigger from './CreatePostTrigger';
import useUserStore from '@/app/stores/user';
import { useQuery } from '@tanstack/react-query';
import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';

const Welcome = () => {
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.user?.role);
  const setAdminId = useUserStore((state) => state.setAdminId);

  const profileQuery = useQuery({
    queryFn: () =>
      httpService.get('/admin/fetch_profile', {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    queryKey: ['fetch-user-admin'],
  });

  useEffect(() => {
    if (profileQuery.data) {
      setAdminId(profileQuery.data.data.data.id);
    }
  }, [profileQuery.data]);

  return (
    <>
      <article className="space-y-1">
        <h1 className="font-bold text-3xl space-x-1">
          <span>Hello {user?.full_name || 'Anonymous'}</span>
          {role && (
            <span className="font-normal text-[.99rem] text-gray-500">
              ({role})
            </span>
          )}
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back, what&apos;s on your mind?
        </p>
      </article>

      <div className="">
        <CreatePostTrigger />
      </div>
    </>
  );
};

export default Welcome;
