'use client';

import { Input } from '@nextui-org/react';
import React from 'react';

const Filter = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: any;
}) => {
  return (
    <div className="flex gap-5 items-center">
      <Input
        type="search"
        variant="flat"
        name="search"
        radius="sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md"
        className="max-w-sm"
        placeholder="Search by title"
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
    </div>
  );
};

export default Filter;
