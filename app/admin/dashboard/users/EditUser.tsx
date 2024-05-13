'use client';

import { Button } from '@nextui-org/react';
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import { Select, SelectItem } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const EditUser = ({
  id,
  role,
  refetchUserList,
}: {
  id: string;
  role: string;
  refetchUserList: any;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const editUserRoleMutation = useMutation({
    mutationFn: (data) =>
      httpService.post('/admin/modify_moderator_role', data, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    onSuccess: async () => {
      toast.success('Role Updated!');
      await queryClient.removeQueries({
        queryKey: ['user-list-query'],
      });
      refetchUserList();
      // await queryClient.invalidateQueries({
      //   queryKey: ['user-list-query'],
      //   refetchType: 'all',
      //   exact: true,
      // });
      onOpenChange();
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  const roleFormik = useFormik({
    initialValues: {
      admin_id: id,
      admin_role: role,
    },
    validationSchema: Yup.object({
      admin_id: Yup.string().required(),
      admin_role: Yup.string().required().min(3).max(15),
    }),
    onSubmit: (values) => {
      //@ts-ignore
      editUserRoleMutation.mutate(values);
    },
  });

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        startContent={<FaPencilAlt />}
        size="sm"
      >
        Change Role
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
                Edit moderator role
              </ModalHeader>
              <ModalBody className="space-y-8">
                <form onSubmit={roleFormik.handleSubmit} className="space-y-4">
                  <Select
                    label="Select Role"
                    labelPlacement="outside"
                    radius="sm"
                    isRequired
                    name="admin_role"
                    isInvalid={
                      Boolean(roleFormik.touched.admin_role) &&
                      Boolean(roleFormik.errors.admin_role)
                    }
                    errorMessage={
                      roleFormik.touched.admin_role &&
                      roleFormik.errors.admin_role
                    }
                    value={roleFormik.values.admin_role}
                    onChange={roleFormik.handleChange}
                    onBlur={roleFormik.handleBlur}
                  >
                    <SelectItem value={'Admin'} key={'Admin'}>
                      Admin
                    </SelectItem>
                    <SelectItem value={'Moderator'} key={'Moderator'}>
                      Moderator
                    </SelectItem>
                    <SelectItem value={'Editor'} key={'Editor'}>
                      Editor
                    </SelectItem>
                  </Select>

                  <Button
                    isLoading={editUserRoleMutation.isPending}
                    type="submit"
                    radius="sm"
                    color="primary"
                    size="sm"
                  >
                    Change Role
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditUser;
