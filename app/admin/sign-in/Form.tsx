'use client';

import useUserStore from '@/app/stores/user';
import { httpService } from '@/app/utils/httpService';
import { checkIfToken, setToken } from '@/app/utils/token';
import { Button, Input } from '@nextui-org/react';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import * as Yup from 'yup';

type signInValuesType = {
  email: string;
  password: string;
};

const Form = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigate = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    checkIfToken(localStorage, () => navigate.replace('/admin'));
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(3).max(100).required(),
  });

  const onSubmit = async (values: signInValuesType) => {
    setIsLoading(true);
    try {
      const response = await httpService.post('/admin/auth/authenticate', {
        email: values.email,
        password: values.password,
      });
      setUser(response.data.data.admin_details);
      setToken(localStorage, response.data.data.token);
      setIsLoading(false);
      navigate.replace('/admin/dashboard');
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
        <h1 className="text-4xl font-bold">Sign In</h1>
        <p className="text-xs text-gray-500">
          Welcome admin, provide your authentication details to continue.
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
          isInvalid={
            Boolean(formik.touched.email) && Boolean(formik.errors.email)
          }
          errorMessage={formik.touched.email && formik.errors.email}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Input
          label="Password"
          fullWidth
          radius="sm"
          name="password"
          placeholder="Enter your password"
          isInvalid={
            Boolean(formik.touched.password) && Boolean(formik.errors.password)
          }
          errorMessage={formik.touched.password && formik.errors.password}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
          type={isVisible ? 'text' : 'password'}
        />

        <Button
          size="md"
          radius="sm"
          type="submit"
          color="primary"
          isLoading={isLoading}
        >
          Continue
        </Button>

        <Link
          href="/admin/forgot-password"
          className="text-sm text-primary underline text-center"
        >
          Forgot password
        </Link>
      </div>
    </form>
  );
};

export default Form;
