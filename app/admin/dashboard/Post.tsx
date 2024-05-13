'use client';

import React from 'react';
import { PostType } from '@/app/types/post';
import PostDetail from './PostDetail';
import DeletePost from './DeletePost';
import EditPostTrigger from './EditPostTrigger';
import useUserStore from '@/app/stores/user';

const Post = ({ data }: { data: PostType }) => {
  const role = useUserStore((state) => state.user?.role);
  const adminId = useUserStore((state) => state.adminId);

  const getEditButton = (id: any) => {
    if (role === 'Editor') {
      if (String(adminId) === String(id))
        return <EditPostTrigger size="sm" data={data} />;
      else return;
    }

    if (role === 'Moderator' || role === 'Admin')
      return <EditPostTrigger size="sm" data={data} />;
  };

  return (
    <article className="border rounded-md overflow-hidden bg-white grid">
      <figure className="block rounded-none overflow-hidden bg-gray-100 h-[10rem] w-full">
        <img
          src={data.blog_feature_image}
          className="w-full h-full object-cover"
          alt=""
        />
      </figure>

      <article className="space-y-3 py-4 px-4">
        <h3
          className="text-
        xl font-bold"
        >
          {data.blog_title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-3">
          {data.blog_short_description}
        </p>
        <div className="flex gap-4 items-center text-xs">
          <p>
            <span className="text-gray-500">Author:</span> {data.blog_author}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 mt-5 items-center">
          <PostDetail id={data.id} />
          {getEditButton(data.admins_id)}
          {role === 'Admin' && <DeletePost id={data.id} />}
        </div>
      </article>
    </article>
  );
};

export default Post;
