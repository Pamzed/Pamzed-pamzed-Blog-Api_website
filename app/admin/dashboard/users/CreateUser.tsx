'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { AxiosError } from 'axios';
import * as Yup from 'yup';
import { httpService } from '@/app/utils/httpService';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getToken } from '@/app/utils/token';

type createAdminValuesType = {
  full_name: string;
  email: string;
  password: string;
};

const CreateUser = ({ refetch }: { refetch: () => void }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const initialValues = {
    full_name: '',
    email: '',
    password: '',
  };
  const toggleVisibility = () => setIsVisible(!isVisible);

  const validationSchema = Yup.object({
    full_name: Yup.string().min(3).max(100).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(3).max(100).required(),
  });

  const createAdminMutation = useMutation({
    mutationFn: (data) =>
      httpService.post('/admin/create_moderator', data, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    onSuccess: async () => {
      toast.success('Moderator Created!');
      refetch();
      onOpenChange();
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const onSubmit = (values: createAdminValuesType) => {
    //@ts-ignore
    createAdminMutation.mutate(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div>
      <Button onPress={onOpen} size="md" color="primary" radius="sm">
        Create moderator
      </Button>

      <Modal
        size="3xl"
        className="py-2 pb-4"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create moderator
              </ModalHeader>
              <ModalBody>
                <form className="grid gap-5" onSubmit={formik.handleSubmit}>
                  <Input
                    size="md"
                    fullWidth
                    radius="sm"
                    isRequired
                    labelPlacement="outside"
                    type="text"
                    name="full_name"
                    label="Full Name"
                    placeholder="eg. John Doe"
                    isInvalid={
                      Boolean(formik.touched.full_name) &&
                      Boolean(formik.errors.full_name)
                    }
                    errorMessage={
                      formik.touched.full_name && formik.errors.full_name
                    }
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    size="md"
                    fullWidth
                    radius="sm"
                    isRequired
                    labelPlacement="outside"
                    type="email"
                    name="email"
                    label="Email Address"
                    placeholder="eg. Someone@somewhere.com"
                    isInvalid={
                      Boolean(formik.touched.email) &&
                      Boolean(formik.errors.email)
                    }
                    errorMessage={formik.touched.email && formik.errors.email}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  <Input
                    label="Password"
                    isRequired
                    fullWidth
                    radius="sm"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    isInvalid={
                      Boolean(formik.touched.password) &&
                      Boolean(formik.errors.password)
                    }
                    errorMessage={
                      formik.touched.password && formik.errors.password
                    }
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

                  <div>
                    <Button
                      isLoading={createAdminMutation.isPending}
                      radius="sm"
                      type="submit"
                      color="primary"
                    >
                      {createAdminMutation.isPending
                        ? 'Creating'
                        : 'Create moderator'}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreateUser;
