import React from 'react';
import { Divider } from '@nextui-org/react';
import UserList from './UserList';
import Check from './Check';

const page = () => {
  return (
    <div className="grid gap-4 p-5">
      <article className="space-y-4">
        <h3 className="font-bold text-3xl">Manage Moderators</h3>
        <Divider />
      </article>

      <div className="grid gap-10">
        <Check />
        <UserList />
      </div>
    </div>
  );
};

export default page;
