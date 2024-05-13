'use client';

import { Button, Chip, Input, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import Editor from './Editor';
import { httpService } from '@/app/utils/httpService';
import { getToken } from '@/app/utils/token';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { postType } from '../../types/post';
import { useQueryClient, useMutation } from '@tanstack/react-query';

const CreatePost = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();

  const initialValues = {
    blog_title: '',
    blog_image: null,
    blog_feature_image: null,
    blog_short_description: '',
    blog_content: '',
    blog_categories: '',
  };

  const validationSchema = Yup.object({
    blog_title: Yup.string().min(3).max(100).required(),
    blog_short_description: Yup.string().min(3).max(1000),
    blog_content: Yup.string().required(),
    blog_categories: Yup.string().min(3).max(1000),
    blog_image: Yup.mixed()
      .required('Main image is required')
      .test('fileType', 'Unsupported file type', (value: any) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        return (
          value &&
          allowedExtensions.includes(value.name.split('.').pop().toLowerCase())
        );
      })
      .test('fileSize', 'Image size exceeds 5MB limit', (value: any) => {
        return !value || value.size <= 5 * 1024 * 1024;
      }),
    blog_feature_image: Yup.mixed()
      .required('Featured image is required')
      .test('fileType', 'Unsupported file type', (value: any) => {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];
        return (
          value &&
          allowedExtensions.includes(value.name.split('.').pop().toLowerCase())
        );
      })
      .test('fileSize', 'Image size exceeds 5MB limit', (value: any) => {
        return !value || (value && value.size <= 5 * 1024 * 1024);
      }),
  });

  const onSubmit = (values: postType) => {
    const data = new FormData();
    data.append('blog_title', values.blog_title);
    data.append('blog_categories', values.blog_categories);
    data.append('blog_short_description', values.blog_short_description);
    data.append('blog_image', values.blog_image);
    data.append('blog_feature_image', values.blog_feature_image);
    data.append('blog_content', values.blog_content);

    //@ts-ignore
    createPostMutation.mutate(data);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const createPostMutation = useMutation({
    mutationFn: (data) =>
      httpService.post('/admin/create_blog_post', data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${getToken(localStorage)}`,
        },
      }),

    mutationKey: ['create-post-mutation'],

    onSuccess: async () => {
      toast.success(`Post created!`);
      await queryClient.invalidateQueries({
        queryKey: ['post-list-query'],
        refetchType: 'all',
        exact: true,
      });
      onClose();
    },

    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      if (error instanceof Error) return toast.error(error.message);
      else toast.error('Something went wrong.');
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="grid gap-5 w-full pb-5">
      <Input
        fullWidth
        isRequired
        radius="sm"
        type="text"
        label="Title"
        name="blog_title"
        placeholder="eg. Fox on a boat"
        isInvalid={Boolean(formik.errors.blog_title)}
        errorMessage={formik.errors.blog_title}
        value={formik.values.blog_title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <div className="space-y-3">
        <Input
          fullWidth
          isRequired
          radius="sm"
          type="text"
          label="Categories"
          name="blog_categories"
          placeholder="eg. Outdoor Nature"
          isInvalid={Boolean(formik.errors.blog_categories)}
          errorMessage={formik.errors.blog_categories}
          value={formik.values.blog_categories}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="flex gap-1">
          {!Boolean(formik.values.blog_categories) && (
            <div className="text-gray-400 flex flex-col">
              <span className="text-xs">
                Categories will be displayed here. Seperate with spaces for
                multiple category
              </span>
            </div>
          )}

          {Boolean(formik.values.blog_categories) &&
            formik.values.blog_categories.split(' ').map(
              (item) =>
                item && (
                  <Chip size="sm" key={item} color="primary">
                    {item.trim()}
                  </Chip>
                )
            )}
        </div>
      </div>

      <Textarea
        isRequired
        fullWidth
        label="Short Description"
        name="blog_short_description"
        placeholder="A short description of this post here"
        isInvalid={Boolean(formik.errors.blog_short_description)}
        errorMessage={formik.errors.blog_short_description}
        value={formik.values.blog_short_description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <Editor formik={formik} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
        <figure>
          <div className="flex flex-col gap-2 relative">
            <input
              type="file"
              id="blog_image"
              name="blog_image"
              onChange={(e: any) => {
                formik.setFieldValue('blog_image', e.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              className="form-input absolute h-full w-full opacity-0 cursor-pointer"
            />

            {!formik.values.blog_image && (
              <div
                className={`border-dashed border-2 ${
                  formik.errors.blog_image
                    ? 'border-red-500'
                    : 'border-gray-300'
                } bg-gray-100 h-[20rem] p-5 rounded-md text-center flex flex-col gap-2 items-center justify-center cursor-pointer overflow-hidden`}
              >
                <h6 className="text-sm font-bold">Main Image Here</h6>
                <p className="text-xs text-gray-500 w-[25ch]">
                  Click here to select a photo from your computer.
                </p>
              </div>
            )}

            {formik.values.blog_image && (
              <div
                className={`bg-gray-100 h-[20rem] rounded-md cursor-pointer overflow-hidden ${
                  formik.errors.blog_image
                    ? 'border-dashed border-2 border-red-500'
                    : 'border-dashed border-2 border-green-500'
                }`}
              >
                {
                  //@ts-ignore
                  Boolean(formik.values.blog_image.type) &&
                    formik.values.blog_image && (
                      <Image
                        src={URL.createObjectURL(formik.values.blog_image)}
                        width={100}
                        height={100}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )
                }

                {
                  //@ts-ignore
                  !Boolean(formik.values.blog_image.type) &&
                    //@ts-ignore
                    formik.values.blog_image.includes(
                      'https://res.cloudinary.com/'
                    ) && (
                      <Image
                        width={100}
                        height={100}
                        src={formik.values.blog_image}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    )
                }
              </div>
            )}

            {!formik.values.blog_image && !formik.errors.blog_image && (
              <div
                className={`border-dotted border-2 border-gray-300 bg-gray-100 p-5 rounded-md text-center flex gap-2 items-center justify-center`}
              >
                {!formik.errors.blog_image && (
                  <p className="text-xs text-blue-500">
                    Image size should not be above{' '}
                    <span className="font-[800]">5 MB</span>
                  </p>
                )}
              </div>
            )}

            {!formik.errors.blog_image && formik.values.blog_image && (
              <div className="border border-green-600 bg-green-100 p-5 rounded-md text-center flex gap-2 items-center justify-center">
                <p className="text-xs text-green-500">
                  Image uploaded successfully
                </p>
              </div>
            )}

            {formik.errors.blog_image && (
              <div className="border border-red-600 bg-red-50 p-5 rounded-md text-center flex gap-2 items-center justify-center">
                <p className="text-xs text-red-500">
                  {String(formik.errors.blog_image)}
                </p>
              </div>
            )}
          </div>
        </figure>

        <figure>
          <div className="flex flex-col gap-2 relative">
            <input
              type="file"
              id="blog_feature_image"
              name="blog_feature_image"
              onChange={(e: any) =>
                formik.setFieldValue(
                  'blog_feature_image',
                  e.currentTarget.files[0]
                )
              }
              onBlur={formik.handleBlur}
              className="form-input absolute h-full w-full opacity-0 cursor-pointer"
            />

            {!formik.values.blog_feature_image && (
              <div
                className={`border-dashed border-2 ${
                  formik.errors.blog_feature_image
                    ? 'border-red-500'
                    : 'border-gray-300'
                } bg-gray-100 h-[20rem] p-5 rounded-md text-center flex flex-col gap-2 items-center justify-center cursor-pointer overflow-hidden`}
              >
                <h6 className="text-sm font-bold">Featured Image Here</h6>
                <p className="text-xs text-gray-500 w-[25ch]">
                  Click here to select a photo from your computer.
                </p>
              </div>
            )}

            {formik.values.blog_feature_image && (
              <div
                className={`bg-gray-100 h-[20rem] rounded-md cursor-pointer overflow-hidden ${
                  formik.errors.blog_feature_image
                    ? 'border-dashed border-2 border-red-500'
                    : 'border-dashed border-2 border-green-500'
                }`}
              >
                {
                  //@ts-ignore
                  Boolean(formik.values.blog_feature_image.type) &&
                    formik.values.blog_feature_image && (
                      <Image
                        src={URL.createObjectURL(
                          formik.values.blog_feature_image
                        )}
                        width={100}
                        height={100}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )
                }

                {
                  //@ts-ignore
                  !Boolean(formik.values.blog_feature_image.type) &&
                    //@ts-ignore
                    formik.values.blog_feature_image.includes(
                      'https://res.cloudinary.com/'
                    ) && (
                      <Image
                        width={100}
                        height={100}
                        src={formik.values.blog_feature_image}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    )
                }
              </div>
            )}

            {!formik.values.blog_feature_image &&
              !formik.errors.blog_feature_image && (
                <div
                  className={`border-dotted border-3 border-gray-300 bg-slate-100 p-5 rounded-md text-center flex gap-2 items-center justify-center`}
                >
                  {!formik.errors.blog_feature_image && (
                    <p className="text-xs text-blue-500">
                      Image size should not be above{' '}
                      <span className="font-[800]">5 MB</span>
                    </p>
                  )}
                </div>
              )}

            {!formik.errors.blog_feature_image &&
              formik.values.blog_feature_image && (
                <div className="border border-green-600 bg-green-100 p-5 rounded-md text-center flex gap-2 items-center justify-center">
                  <p className="text-xs text-green-500">
                    Image uploaded successfully
                  </p>
                </div>
              )}

            {formik.errors.blog_feature_image && (
              <div className="border border-red-600 bg-red-50 p-5 rounded-md text-center flex gap-2 items-center justify-center">
                <p className="text-xs text-red-500">
                  {String(formik.errors.blog_feature_image)}
                </p>
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="flex gap-1 mt-4">
        <Button
          color="primary"
          radius="sm"
          type="submit"
          isLoading={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? 'Publishing' : 'Pushlish Content'}
        </Button>

        <Button color="danger" radius="sm" onPress={onClose} type="button">
          Close
        </Button>
      </div>
    </form>
  );
};

export default CreatePost;
