'use client';

import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import { Button } from '@nextui-org/react';
import { AxiosError } from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const DeletePost = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: () =>
      httpService.delete(`/admin/delete_blog_post/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),

    mutationKey: ['create-post-mutation'],

    onSuccess: async () => {
      toast.success('Post deleted');
      await queryClient.invalidateQueries({
        queryKey: ['post-list-query'],
      });
    },

    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  return (
    <Button
      isLoading={deletePostMutation.isPending}
      onPress={() => {
        // ts-ignore
        deletePostMutation.mutate();
      }}
      radius="sm"
      size="sm"
      color="danger"
    >
      {deletePostMutation.isPending ? 'Deleting' : 'Delete'}
    </Button>
  );
};

export default DeletePost;
