'use client';

import React, { useEffect, useState } from 'react';
import Filter from './Filter';
import Post from './Post';
import { Chip, Skeleton } from '@nextui-org/react';
import CreatePostTrigger from './CreatePostTrigger';
import { PostType } from '@/app/types/post';
import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import Pagination from './Pagination';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

function paginateData(list: any[], currentPage: number, itemPerPage: number) {
  // Validation (optional)
  if (currentPage < 1 || itemPerPage <= 0) {
    throw new Error('Invalid pagination parameters');
  }

  // Calculate start and end index for the current page
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = Math.min(startIndex + itemPerPage, list.length);

  // Slice the data to get the current page data
  return list.slice(startIndex, endIndex);
}

const PostList = () => {
  const [list, setList] = useState<PostType[]>([]);
  const [postList, setPostList] = useState<PostType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [pageNumber, setPageNumber] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const postListQuery = useQuery({
    queryFn: () =>
      httpService.get('/admin/post_list', {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    queryKey: ['post-list-query'],
  });

  useEffect(() => {
    const paginatedData = paginateData(list, pageNumber, postsPerPage);
    setPostList(paginatedData);
  }, [pageNumber]);

  useEffect(() => {
    if (postListQuery.isSuccess) {
      const paginatedData = paginateData(
        postListQuery.data.data.data,
        pageNumber,
        postsPerPage
      );
      setPostList(paginatedData);
      setList(postListQuery.data.data.data);
    }
  }, [postListQuery.data]);

  useEffect(() => {
    if (postListQuery.error instanceof AxiosError)
      toast.error(postListQuery.error.response?.data.message);
    if (postListQuery.error instanceof Error)
      toast.error(postListQuery.error.message);
  }, [postListQuery.isError]);

  useEffect(() => {
    if (!searchTerm) setPostList(list);

    if (searchTerm) {
      const result = list.filter((p) =>
        p.blog_title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setPostList(result);
    }
  }, [searchTerm]);

  return (
    <div className="space-y-10">
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="space-y-4">
        <div className="col-span-3">
          <p className="flex gap-1 text-sm">
            <span>Showing</span>
            <Chip as="span" color="primary" size="sm">
              {postList.length}
            </Chip>
            <span>
              {postList.length > 1 ? 'Posts' : 'Post'} of {list.length}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full min-h-[8rem]">
          {postListQuery.isLoading && !Boolean(postList.length) && (
            <>
              <Skeleton className="h-[20rem] rounded-md w-full" />
              <Skeleton className="h-[20rem] rounded-md w-full" />
              <Skeleton className="h-[20rem] rounded-md w-full" />
              <Skeleton className="h-[20rem] rounded-md w-full" />
              <Skeleton className="h-[20rem] rounded-md w-full" />
              <Skeleton className="h-[20rem] rounded-md w-full" />
            </>
          )}

          {postListQuery.isSuccess &&
            !postListQuery.isLoading &&
            !Boolean(postList.length) && (
              <div className="grid place-content-center place-items-center h-full w-full col-span-3">
                <article className="text-center flex flex-col items-center">
                  <h4 className="text-sm">No posts yet.</h4>
                  <p className="text-xs text-gray-500 mb-2">Try adding one</p>
                  <CreatePostTrigger size="sm" />
                </article>
              </div>
            )}

          {postListQuery.isSuccess &&
            !postListQuery.isLoading &&
            Boolean(postList.length) &&
            postList.map((post) => <Post key={post.id} data={post} />)}
        </div>
      </div>

      <Pagination
        posts={list}
        postsPerPage={postsPerPage}
        currentPage={pageNumber}
        onPageNumberChange={setPageNumber}
      />
    </div>
  );
};

export default PostList;
