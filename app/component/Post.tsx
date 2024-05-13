'use client';

import React from 'react';
import { PostType } from '@/app/types/post';
import PostDetail from './PostDetail';
import { Avatar } from '@nextui-org/react';
import { FaCalendar, FaUser } from 'react-icons/fa6';
import { FaCalendarAlt } from 'react-icons/fa';

const Post = ({
  data,
  titleOnly,
  variant,
}: {
  titleOnly?: boolean;
  data: PostType;
  variant: boolean;
}) => {
  return (
    <PostDetail id={data.id}>
      <article
        className={`overflow-hidden border-black grid items-center ${
          titleOnly
            ? 'border-b pb-6 grid-cols-[1fr_5fr]'
            : 'min-h-[15rem] grid-cols-1 md:grid-cols-[1fr_2fr] border-t pt-6'
        }
        ${variant ? 'border-none' : ''}`}
      >
        <figure
          className={`block rounded-md overflow-hidden bg-gray-100 h-full w-full`}
        >
          <img
            src={data.blog_feature_image}
            className="w-full h-full object-cover"
            alt=""
          />
        </figure>

        <article className={`flex flex-col px-1 md:px-5 gap-4`}>
          <h3
            className={`font-bold 
            ${titleOnly ? 'text-sm' : 'text-xl'}
            ${variant ? 'max-w-[20ch]' : !titleOnly && 'max-w-[25ch]'}
            ${!titleOnly && 'line-clamp-1'}
            ${variant && 'line-clamp-2'}
            `}
          >
            {data.blog_title}
          </h3>

          {!titleOnly && (
            <p className="text-xs text-gray-500 line-clamp-3">
              {data.blog_short_description}
            </p>
          )}

          {!titleOnly && (
            <div className="flex flex-col md:flex-row gap-1 md:gap-5">
              <div className="flex gap-1 items-center text-xs">
                {/* <Avatar className="w-6 h-6 bg-gray-100 border" /> */}
                <FaUser />
                <span className="text-gray-500">{data.blog_author}</span>
              </div>
              <span className="hidden md:block text-gray-300">|</span>
              <div className="flex gap-2 items-center justify-start text-xs">
                <FaCalendarAlt />
                <p className="text-xs text-gray-500">20th March, 2023</p>
              </div>
            </div>
          )}
        </article>
      </article>
    </PostDetail>
  );
};

export default Post;
