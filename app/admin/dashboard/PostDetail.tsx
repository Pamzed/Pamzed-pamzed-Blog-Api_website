'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Skeleton,
  Chip,
  Textarea,
  Avatar,
} from '@nextui-org/react';
import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { PostType } from '@/app/types/post';
import DeletePost from './DeletePost';
import EditPostTrigger from './EditPostTrigger';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useUserStore from '@/app/stores/user';
import moment from 'moment';
import { FaClock, FaUser } from 'react-icons/fa6';
import Post from '@/app/component/Post';
import Pagination from '@/app/admin/dashboard/Pagination';

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

type CommentType = {
  blog_posts_id: string;
  content: string;
  created_at: string;
  id: number;
  updated_at: string;
};

const PostDetail = ({ id }: { id: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [postDetail, setPostDetail] = useState<PostType>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentList, setCommentList] = useState<any[]>([]);
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

  const { isLoading, isError, data, error, refetch } = useQuery({
    enabled: false,
    queryKey: ['post-details-query'],
    queryFn: () =>
      httpService.get(`/admin/post_details/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(2);

  const commentMutation = useMutation({
    mutationFn: (data) => httpService.post(`/blog/add_a_comment`, data),
    onSuccess: async () => {
      toast.success('Comment published!');
      formik.setFieldValue('comment', '');
      formik.setFieldTouched('comment', false);
      refetch();
    },
    onError: () => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const formik = useFormik({
    initialValues: {
      blog_posts_id: id,
      comment: '',
    },
    validationSchema: Yup.object({
      blog_posts_id: Yup.string().max(100).required(),
      comment: Yup.string().min(3).max(500).required(),
    }),
    onSubmit: (values) => {
      //@ts-ignore
      commentMutation.mutate(values);
    },
  });

  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen]);

  useEffect(() => {
    const paginatedData = paginateData(comments, pageNumber, postsPerPage);
    setCommentList(paginatedData);
  }, [pageNumber]);

  useEffect(() => {
    if (data) {
      setPostDetail(data.data.data);
      setComments(data?.data.data.comments);

      const paginatedData = paginateData(
        data?.data.data.comments,
        pageNumber,
        postsPerPage
      );
      setCommentList(paginatedData);
    }
  }, [data]);

  useEffect(() => {
    if (error instanceof AxiosError) toast.error(error.response?.data.message);
    if (error instanceof Error) toast.error(error.message);
  }, [isError]);

  return (
    <>
      <Button onPress={onOpen} color="primary" size="sm" radius="sm">
        View Post
      </Button>

      <Modal
        scrollBehavior="outside"
        radius="md"
        size="5xl"
        isOpen={isOpen}
        closeButton={false}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="p-5 bg-white">
                <div className="max-w-5xl max-auto space-y-5">
                  <div className="text-left flex items-center justify-start">
                    {isLoading && <Skeleton className="rounded-md h-[4rem]" />}
                    {!isLoading && (
                      <h1 className="text-3xl max-w-[40ch] font-bold">
                        {postDetail?.blog_title}
                      </h1>
                    )}
                  </div>

                  <div className="text-left flex items-center justify-start">
                    {isLoading && <Skeleton className="rounded-md h-[4rem]" />}
                    {!isLoading && (
                      <div className="space-x-1">
                        {postDetail?.categories.map((c) => (
                          <Chip size="sm" color="primary" key={c.id}>
                            {c.category_name}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-start">
                    {isLoading && <Skeleton className="rounded-md h-[4rem]" />}
                    {!isLoading && (
                      <p className="text-sm flex gap-1 items-start justify-center">
                        <FaUser />
                        <span>{postDetail?.blog_author}</span>
                      </p>
                    )}
                  </div>

                  <figure className="overflow-hidden block w-full">
                    {isLoading && <Skeleton className="rounded-md h-[15rem]" />}
                    {!isLoading && (
                      <img
                        className="w-full h-full object-cover rounded-md"
                        src={postDetail?.blog_image}
                        alt=""
                      />
                    )}
                  </figure>

                  <div className="">
                    {isLoading && <Skeleton className="rounded-md h-[10rem]" />}
                    {!isLoading && (
                      <p className="text-sm max-w-[80ch] flex flex-col gap-1 justify-start ">
                        <span className="text-gray-400">Description</span>
                        <span>{postDetail?.blog_short_description}</span>
                      </p>
                    )}
                  </div>

                  <div className="border-y pt-3 flex flex-col justify-start items-start gap-3 mt-8">
                    <article>
                      <h3 className="font-bold space-x-1">
                        <span>Related Posts</span>
                      </h3>
                    </article>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center items-center">
                      <Post
                        titleOnly={true}
                        variant={true}
                        data={{
                          id: '2',
                          blog_title:
                            'The Evolution of the Unknown: How the Mystery Fuels Our Progress New',
                          blog_image:
                            'https://res.cloudinary.com/dwhk1vo1k/image/upload/v1711414040/uqqcsyyvmbgr9ct0norm.jpg',
                          blog_feature_image:
                            'https://res.cloudinary.com/dwhk1vo1k/image/upload/v1711412135/frckycjzuljwv8x8039h.jpg',
                          blog_short_description:
                            "The unknown. It's a vast, ever-shifting landscape that has both terrified and tantalized humanity since the dawn of time. But here's the interesting thing: the unknown itself evolves.",
                          blog_content:
                            "\"<h1>Introduction</h1><p><br>Think about it. For our early ancestors, the fear of the unknown might have been a shadowy forest or a rumbling volcano. Today, it's the composition of dark matter, the potential for life on distant planets, or the intricacies of the human brain.</p><p style=\\\"text-align: start\\\">Here's how the evolution of the unknown fuels our progress:</p><ol><li><p><strong>Curiosity's Catalyst:</strong> The unknown beckons like a siren song. It sparks an insatiable curiosity that drives us to explore, experiment, and push the boundaries of knowledge. Without the unknown, there would be no reason to invent the telescope, delve into the mysteries of the atom, or map the human genome.</p></li><li><p><strong>Innovation's Playground:</strong> The unknown provides a fertile ground for innovation. As we confront the limitations of our current understanding, we're forced to develop new tools, technologies, and frameworks for thinking. This is how scientific breakthroughs happen, often by accident while we're chasing something else entirely.</p></li><li><p><strong>Progress's Engine:</strong> The unknown is the engine that keeps progress chugging along. Once a mystery is solved, a new one takes its place. This constant cycle of exploration and discovery is what propels us forward as a species.</p></li></ol><p style=\\\"text-align: start\\\">But the evolution of the unknown isn't just about scientific advancement. It also shapes our:</p><ol><li><p><strong>Philosophy:</strong> The unknown forces us to grapple with big questions about existence, consciousness, and our place in the universe. It's the unknown that gives rise to philosophical and religious thought.</p></li><li><p><strong>Art and Literature:</strong> The unknown fuels our creativity. It inspires artists and writers to explore the depths of the human experience, to imagine new worlds, and to confront the vastness of what we don't know.</p></li></ol><p style=\\\"text-align: start\\\">So, the next time you feel a shiver of fear at the edge of the unknown, remember: it's not just something to be dreaded. It's an invitation to explore, to create, and to push the boundaries of human potential. It's the very essence of what makes us progress.</p><p style=\\\"text-align: start\\\"><strong>What are your thoughts? What mysteries of the unknown excite you the most? Share your thoughts in the comments below!</strong></p>\"",
                          blog_view_count: '15',
                          blog_author: 'Godsend Joseph',
                          admins_id: '1',
                          categories_id: null,
                          categories: [
                            {
                              id: 4,
                              category_name: 'nature',
                              blog_posts_id: '2',
                              created_at: '2024-03-25T15:57:54.000000Z',
                              updated_at: '2024-03-25T15:57:54.000000Z',
                              pivot: {
                                blog_posts_id: '6',
                                categories_id: '4',
                                created_at: '2024-04-05T19:04:59.000000Z',
                                updated_at: '2024-04-05T19:04:59.000000Z',
                              },
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    {isLoading && <Skeleton className="rounded-md h-[20rem]" />}
                    {!isLoading && postDetail?.blog_content && (
                      <div
                        className="ProseMirror"
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(postDetail?.blog_content),
                        }}
                      ></div>
                    )}
                  </div>

                  <form
                    className="mt-5 space-y-4"
                    onSubmit={formik.handleSubmit}
                  >
                    <Textarea
                      isRequired
                      fullWidth
                      labelPlacement="outside"
                      label="Drop a comment"
                      name="comment"
                      radius="sm"
                      placeholder="Enter a comment"
                      isInvalid={
                        Boolean(formik.touched.comment) &&
                        Boolean(formik.errors.comment)
                      }
                      errorMessage={
                        formik.touched.comment && formik.errors.comment
                      }
                      value={formik.values.comment}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <div>
                      <Button
                        type="submit"
                        size="sm"
                        isLoading={commentMutation.isPending}
                        color="primary"
                        radius="sm"
                      >
                        Publish comment
                      </Button>
                    </div>
                  </form>
                  <div className="flex flex-col mt-8 gap-3 bg-gray-100 p-5 rounded-md">
                    <article>
                      <h3 className="font-bold space-x-1">
                        <span>Comments</span>
                        <Chip size="sm" color="primary">
                          {comments.length}
                        </Chip>{' '}
                      </h3>
                    </article>

                    {commentList.map((comment) => (
                      <div
                        key={comment.id}
                        className="block space-y-2 bg-white rounded-lg px-5 py-3 gap-3"
                      >
                        <div className="flex justify-between">
                          <div className="flex gap-2 items-center justify-center opacity-55">
                            <Avatar size="sm" />
                            <p className="text-xs">Anonymous</p>
                          </div>

                          <div className="flex items-center justify-start gap-1 text-gray-400">
                            <FaClock className="text-xs" />
                            <p className="text-xs">
                              {moment(comment.created_at).fromNow()}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}

                    <div className="mt-5">
                      <Pagination
                        currentPage={pageNumber}
                        postsPerPage={postsPerPage}
                        posts={comments}
                        onPageNumberChange={setPageNumber}
                      />
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                {getEditButton(postDetail?.admins_id)}

                {role === 'Admin' && <DeletePost id={id} />}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostDetail;
