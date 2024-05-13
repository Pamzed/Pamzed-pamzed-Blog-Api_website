'use client';

import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import { Button, Divider, Input } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

const ChangePassword = () => {
  const initialValues = {
    currentPassword: '',
    newPassword: '',
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().min(3).max(100).required(),
    newPassword: Yup.string().min(3).max(100).required(),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) =>
      httpService.post('/admin/change_password', data, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),

    onSuccess: () => {
      toast.success('Password changed!');
      formik.setFieldValue('currentPassword', '');
      formik.setFieldValue('newPassword', '');
      formik.setFieldTouched('newPassword', false);
    },

    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const onSubmit = (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    //@ts-ignore
    changePasswordMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="space-y-[1.5rem] p-5">
      <article className="gap-2 items-center justify-start">
        <h3 className="font-bold text-xl capitalize">Change Password</h3>
      </article>

      <form onSubmit={formik.handleSubmit} className="grid gap-5">
        <Input
          type="text"
          radius="sm"
          isRequired
          id="currentPassword"
          name="currentPassword"
          labelPlacement="outside"
          label="Current Password"
          placeholder="Your current password here"
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
          errorMessage={
            formik.touched.currentPassword && formik.errors.currentPassword
          }
          isInvalid={
            Boolean(formik.touched.currentPassword) &&
            Boolean(formik.errors.currentPassword)
          }
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Input
          type="text"
          radius="sm"
          isRequired
          id="newPassword"
          name="newPassword"
          label="New Password"
          labelPlacement="outside"
          placeholder="Your new password here"
          isInvalid={
            Boolean(formik.touched.newPassword) &&
            Boolean(formik.errors.newPassword)
          }
          errorMessage={formik.touched.newPassword && formik.errors.newPassword}
          value={formik.values.newPassword}
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

        <div className="mt-2">
          <Button
            isLoading={changePasswordMutation.isPending}
            type="submit"
            size="sm"
            color="primary"
            radius="sm"
          >
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
