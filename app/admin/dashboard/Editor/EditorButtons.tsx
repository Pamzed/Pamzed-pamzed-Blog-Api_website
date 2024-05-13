'use client';

import { ReactNode, MouseEventHandler } from 'react';
import { Editor } from '@tiptap/core';

interface Props {
  children: ReactNode;
  editor: Editor;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  toggleName: string | any;
  level?: number;
  title: string;
  className?: string;
}

export default function EditorButtons({
  editor,
  children,
  handleClick,
  toggleName,
  className,
  level,
  title,
}: Props) {
  return (
    <button
      type="button"
      title={title}
      onClick={handleClick}
      disabled={!handleClick}
      className={`${className} rounded-lg grid place-items-center ${
        editor.isActive(toggleName, level && { level: level })
          ? 'text-primary'
          : 'text-black'
      }`}
    >
      {children}
    </button>
  );
}
