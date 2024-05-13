import React from 'react';
import Welcome from './Welcome';
import PostList from './PostList';

const page = () => {
  return (
    <main className="grid gap-5 p-5">
      <Welcome />
      <PostList />
    </main>
  );
};

export default page;
