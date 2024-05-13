'use client';

import { httpService } from '@/app/utils/httpService';
import { checkIfToken } from '@/app/utils/token';
import { Button, Input } from '@nextui-org/react';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

type signInValuesType = {
  email: string;
};

const Form = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useRouter();

  useEffect(() => {
    checkIfToken(localStorage, () => navigate.replace('/admin'));
  }, []);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
  });

  const onSubmit = async (values: signInValuesType) => {
    setIsLoading(true);
    try {
      await httpService.post('/admin/auth/forgot_password', {
        email: values.email,
      });
      setIsLoading(false);
      toast.success('OTP Sent!');
      navigate.replace(`/admin/reset-password`);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form
      className="grid place-content-center min-h-screen gap-10"
      onSubmit={formik.handleSubmit}
    >
      <article className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Forgot Password</h1>
        <p className="text-xs text-gray-500">
          To continue, provide your email that is registered to your account.
        </p>
      </article>

      <div className="grid gap-4">
        <Input
          size="md"
          fullWidth
          radius="sm"
          type="email"
          name="email"
          label="Email Address"
          placeholder="eg. Someone@somewhere.com"
          isInvalid={Boolean(formik.errors.email)}
          errorMessage={formik.errors.email}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Button
          size="md"
          radius="sm"
          type="submit"
          isLoading={isLoading}
          color="primary"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Form;
