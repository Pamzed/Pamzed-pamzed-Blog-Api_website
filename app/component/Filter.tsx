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
        variant="bordered"
        name="search"
        radius="sm"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md"
        placeholder="Search by title"
        classNames={{
          input: ['text-black/90', 'placeholder:text-default-700/50'],
          inputWrapper: ['border border-black', 'shadow-none'],
        }}
      />
    </div>
  );
};

export default Filter;
