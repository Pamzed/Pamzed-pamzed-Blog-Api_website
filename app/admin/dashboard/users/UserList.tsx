'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Skeleton,
  Button,
} from '@nextui-org/react';
import { FaTrash } from 'react-icons/fa6';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getToken } from '@/app/utils/token';
import { httpService } from '@/app/utils/httpService';
import EditUser from './EditUser';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import CreateUser from './CreateUser';

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'ROLE', uid: 'role' },
  { name: '', uid: 'edit' },
];

const UserList = () => {
  const [list, setList] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const adminListQuery = useQuery({
    enabled: false,
    queryKey: ['user-list-query'],
    queryFn: () =>
      httpService.get('/admin/fetch_admins', {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (data) =>
      httpService.post(`/admin/delete_moderator`, data, {
        headers: {
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),
    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: ['user-list-query'],
      });
      adminListQuery.refetch();
    },
  });

  useEffect(() => {
    adminListQuery.refetch();
  }, []);

  useEffect(() => {
    if (adminListQuery.isSuccess) setList(adminListQuery.data.data.data);
  }, [adminListQuery.isPending, adminListQuery.data]);

  useEffect(() => {
    if (adminListQuery.isError) {
      if (adminListQuery.error instanceof AxiosError)
        toast.error(adminListQuery.error.response?.data.message);
      if (adminListQuery.error instanceof Error)
        toast.error(adminListQuery.error.message);
      else toast.error('Something went wrong.');
    }
  }, [adminListQuery.isPending]);

  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full' }}
            description={user.email}
            name={user.full_name}
          >
            {user.email}
          </User>
        );
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case 'edit':
        return (
          <div className="relative flex items-center gap-5">
            <EditUser
              refetchUserList={adminListQuery.refetch}
              role={user.role}
              id={user.id}
            />

            <Button
              color="danger"
              onPress={() => {
                //@ts-ignore
                deleteUserMutation.mutate({ mod_id: user.id });
              }}
              isLoading={deleteUserMutation.isPending}
              startContent={<FaTrash />}
              size="sm"
            >
              Delete
            </Button>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  {
    if (adminListQuery.isLoading)
      return (
        <div>
          <Skeleton className="rounded-md h-[10rem]" />
        </div>
      );
  }

  return (
    <div className="space-y-5">
      <CreateUser refetch={adminListQuery.refetch} />

      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={list}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
