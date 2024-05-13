'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import EditPost from './EditPost';
import { PostType } from '@/app/types/post';

const EditPostTrigger = ({
  size,
  data,
}: {
  size?: 'sm' | 'md' | 'lg';
  data: any;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          radius="sm"
          color="secondary"
          size={size || 'sm'}
          onPress={onOpen}
        >
          Edit
        </Button>
      </div>

      <Modal
        radius="md"
        scrollBehavior="outside"
        size={'5xl'}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Post
              </ModalHeader>
              <ModalBody>
                <EditPost data={data} onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPostTrigger;
