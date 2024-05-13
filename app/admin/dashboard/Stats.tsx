import React from 'react';
import { FaBook } from 'react-icons/fa';
import { FaNewspaper, FaPerson } from 'react-icons/fa6';

const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <article className="border rounded-md bg-white flex items-start gap-5 justify-between p-5">
        <article className="">
          <h3 className="font-bold text-2xl">5</h3>
          <p className="text-gray-500">Total post</p>
        </article>
        <FaNewspaper className="text-xl" />
      </article>

      <article className="border rounded-md bg-white flex items-start gap-5 justify-between p-5">
        <article className="">
          <h3 className="font-bold text-2xl">5</h3>
          <p className="text-gray-500">Moderators</p>
        </article>
        <FaPerson className="text-3xl" />
      </article>
    </div>
  );
};

export default Stats;
