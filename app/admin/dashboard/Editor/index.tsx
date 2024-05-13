import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
//@ts-ignore
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import MenuBar from './MenuBar';

const Editor = ({ formik }: { formik: any }) => {
  const getContent = () => {
    if (
      typeof formik.values.blog_content === 'string' &&
      formik.values.blog_content.length >= 1
    )
      return JSON.parse(formik.values.blog_content);
    return formik.values.blog_content;
  };

  const editor = useEditor({
    extensions: [
      Underline.configure({}),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'mx-auto w-full object-cover max-h-[300px]',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      //@ts-ignore
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: getContent(),
  });

  editor?.on('update', (e) => {
    const value = e.editor.getHTML();
    formik.setFieldValue('blog_content', JSON.stringify(value));
  });

  return (
    <>
      <div
        className={`text-black rounded-xl overflow-hidden ${
          formik.errors.blog_content ? 'border border-red-400' : 'border'
        }`}
      >
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className={``} />
        {formik.errors.blog_content && (
          <p className="text-red-400 p-2 text-xs">
            {formik.errors.blog_content}
          </p>
        )}
      </div>
    </>
  );
};

export default Editor;
