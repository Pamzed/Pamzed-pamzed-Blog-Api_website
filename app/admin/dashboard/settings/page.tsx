import React from 'react';
import ChangePassword from '../change-password/ChangePassword';
import EditDetails from '../edit-details/EditDetails';

const page = () => {
  return (
    <div className="grid gap-8">
      <article className="space-y-5">
        <div>
          <ChangePassword />
        </div>

        <div>
          <EditDetails />
        </div>
      </article>
    </div>
  );
};

export default page;
