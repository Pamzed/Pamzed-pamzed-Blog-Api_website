'use client';

import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import { Button, Divider, Input } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const EditDetails = () => {
  const queryClient = useQueryClient();

  const initialValues = {
    full_name: '',
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().min(3).max(100).required(),
  });

  const editUserDetailsMutation = useMutation({
    mutationFn: (data) =>
      httpService.post('/admin/edit_profile', data, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    onSuccess: async () => {
      toast.success('Details Updated!');
      formik.setFieldValue('full_name', '');
      formik.setFieldTouched('full_name', false);
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const onSubmit = (values: { full_name: string }) => {
    //@ts-ignore
    editUserDetailsMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="space-y-[3rem] p-5">
      <article className="gap-2 items-center justify-start">
        <h3 className="font-bold text-xl capitalize">Edit Details</h3>
      </article>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          size="md"
          radius="sm"
          isRequired
          type="text"
          labelPlacement="outside"
          name="full_name"
          label="Full Name"
          placeholder="eg. John Doe"
          isInvalid={
            Boolean(formik.touched.full_name) &&
            Boolean(formik.errors.full_name)
          }
          errorMessage={formik.touched.full_name && formik.errors.full_name}
          value={formik.values.full_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="max-w-md"
          classNames={{
            input: [
              'bg-white',
              'text-black/90',
              'placeholder:text-default-700/50',
            ],
            inputWrapper: ['bg-white', 'border', 'shadow-none'],
            innerWrapper: ['bg-white'],
          }}
        />
        <Button
          isLoading={editUserDetailsMutation.isPending}
          type="submit"
          radius="sm"
          color="primary"
          size="sm"
        >
          Edit details
        </Button>
      </form>
    </div>
  );
};

export default EditDetails;
