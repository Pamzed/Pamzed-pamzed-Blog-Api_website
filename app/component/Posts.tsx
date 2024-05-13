'use client';

import React, { useEffect, useState } from 'react';
import Post from './Post';
import { PostType } from '@/app/types/post';
import { httpService } from '@/app/utils/httpService';
import Pagination from '../admin/dashboard/Pagination';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Filter from './Filter';
import { Skeleton } from '@nextui-org/react';
import { FaNewspaper } from 'react-icons/fa6';

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

const Posts = () => {
  const [topLists, setTopList] = useState<PostType[]>([]);
  const [list, setList] = useState<PostType[]>([]);
  const [postList, setPostList] = useState<PostType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [pageNumber, setPageNumber] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  const postListQuery = useQuery({
    queryFn: () => httpService.get('/blog/fetch_all_post'),
    queryKey: ['post-list-query'],
  });

  const topPostListQuery = useQuery({
    queryFn: () => httpService.get('/blog/fetch_top_post'),
    queryKey: ['top-post-list-query'],
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
    if (topPostListQuery.isSuccess) {
      setTopList(topPostListQuery.data.data.data);
    }
  }, [topPostListQuery.data]);

  useEffect(() => {
    if (postListQuery.error instanceof AxiosError)
      toast.error(postListQuery.error.response?.data.message);
    if (postListQuery.error instanceof Error)
      toast.error(postListQuery.error.message);
  }, [postListQuery.isError]);

  useEffect(() => {
    if (topPostListQuery.error instanceof AxiosError)
      toast.error(topPostListQuery.error.response?.data.message);
    if (topPostListQuery.error instanceof Error)
      toast.error(topPostListQuery.error.message);
  }, [topPostListQuery.isError]);

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
    <section className="max-w-6xl mx-auto">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[60fr_40fr]">
        <main className="order-2 md:order-1 pb-10">
          <article className="px-8 pt-8 pb-4 border-black">
            <h1 className="text-xl md:text-3xl font-bold uppercase">
              Discover our lastest posts
            </h1>
          </article>

          <div className="grid p-5 gap-5">
            {postListQuery.isLoading && !Boolean(postList.length) && (
              <>
                <Skeleton className="h-[10rem] rounded-md w-full" />
                <Skeleton className="h-[10rem] rounded-md w-full" />
                <Skeleton className="h-[10rem] rounded-md w-full" />
                <Skeleton className="h-[10rem] rounded-md w-full" />
                <Skeleton className="h-[10rem] rounded-md w-full" />
                <Skeleton className="h-[10rem] rounded-md w-full" />
              </>
            )}

            {!postListQuery.isLoading && !Boolean(postList.length) && (
              <div className="grid place-content-center place-items-center min-h-[15rem] w-full col-span-3">
                <article className="text-center text-gray-600 flex gap-2 flex-col items-center">
                  <FaNewspaper className="" />
                  <h4 className="text-sm">No posts yet.</h4>
                </article>
              </div>
            )}

            {postList.map((post) => (
              <Post variant={false} key={post.id} data={post} />
            ))}
          </div>

          <div className="px-5 mt-5">
            <Pagination
              currentPage={pageNumber}
              postsPerPage={postsPerPage}
              posts={postList}
              onPageNumberChange={setPageNumber}
            />
          </div>
        </main>

        <aside
          className={`flex flex-col gap-5 p-5 h-full border-l border-black order-1 md:order-2`}
        >
          <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="flex flex-col gap-5">
            <article>
              <h2 className="text-xl font-bold uppercase">Top posts</h2>
            </article>

            <div className="flex flex-col w-full gap-5">
              {topPostListQuery.isLoading && !Boolean(topLists.length) && (
                <>
                  <Skeleton className="h-[3rem] rounded-md w-full" />
                  <Skeleton className="h-[3rem] rounded-md w-full" />
                </>
              )}

              {!topPostListQuery.isLoading && !Boolean(topLists.length) && (
                <div className="grid place-content-center place-items-center min-h-[7rem] md:min-h-[15rem] w-full col-span-3">
                  <article className="text-center text-gray-600 flex gap-2 flex-col items-center">
                    <FaNewspaper className="" />
                    <h4 className="text-sm">No posts yet.</h4>
                  </article>
                </div>
              )}

              {postList.map((post) => (
                <Post
                  variant={false}
                  titleOnly={true}
                  key={post.id}
                  data={post}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Posts;
