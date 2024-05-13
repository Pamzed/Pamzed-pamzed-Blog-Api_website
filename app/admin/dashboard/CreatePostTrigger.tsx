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
import CreatePost from './CreatePost';

const CreatePostTrigger = ({ size }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          radius="sm"
          color="primary"
          size={size || 'md'}
          onPress={onOpen}
        >
          Create Post
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
                Create Post
              </ModalHeader>
              <ModalBody>
                <CreatePost onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePostTrigger;
