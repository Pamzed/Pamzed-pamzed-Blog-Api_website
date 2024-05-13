'use client';

import { httpService } from '@/app/utils/httpService';
import { Button, Divider, Input } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const Reset = () => {
  const navigate = useRouter();

  const initialValues = {
    new_password: '',
    otp_code: '',
  };

  const validationSchema = Yup.object({
    new_password: Yup.string().min(3).max(100).required(),
    otp_code: Yup.string().min(3).max(100).required(),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => httpService.post(`/admin/auth/reset_password`, data),

    onSuccess: () => {
      toast.success('Password changed!');
      navigate.replace('/admin/sign-in');
    },

    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const onSubmit = (values: { new_password: string }) => {
    //@ts-ignore
    changePasswordMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="grid place-content-center min-h-screen gap-10">
      <article className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Change Password</h1>
        <p className="text-xs text-gray-500">
          Alright you&apos;re almost there, fill in the details to continue.
        </p>
      </article>

      <form onSubmit={formik.handleSubmit} className="grid gap-5">
        <Input
          type="number"
          radius="sm"
          fullWidth
          isRequired
          id="otp_code"
          name="otp_code"
          label="OTP Code"
          placeholder="eg. 1111"
          errorMessage={formik.touched.otp_code && formik.errors.otp_code}
          isInvalid={
            Boolean(formik.touched.otp_code) && Boolean(formik.errors.otp_code)
          }
          value={formik.values.otp_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Input
          type="text"
          radius="sm"
          fullWidth
          isRequired
          id="new_password"
          name="new_password"
          label="New Password"
          placeholder="Your new password here"
          errorMessage={
            formik.touched.new_password && formik.errors.new_password
          }
          isInvalid={
            Boolean(formik.touched.new_password) &&
            Boolean(formik.errors.new_password)
          }
          value={formik.values.new_password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Button
          isLoading={changePasswordMutation.isPending}
          type="submit"
          size="md"
          color="primary"
          radius="sm"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default Reset;
