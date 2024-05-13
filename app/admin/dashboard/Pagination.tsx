import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const Pagination = ({
  onPageNumberChange,
  currentPage,
  posts,
  postsPerPage,
}: {
  currentPage: number;
  onPageNumberChange: any;
  posts: any[];
  postsPerPage: number;
}) => {
  const [pageNumber, setPageNumber] = useState(currentPage);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false);

  const handleNext = () => {
    onPageNumberChange(currentPage + 1);
  };

  const handlePrev = () => {
    onPageNumberChange(currentPage - 1);
  };

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (Number(pageNumber) <= 1) setPrevButtonDisabled(true);
    else setPrevButtonDisabled(false);

    if (Number(pageNumber) >= posts.length / postsPerPage)
      setNextButtonDisabled(true);
    else setNextButtonDisabled(false);
  }, [pageNumber, posts]);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (
        Number(event.currentTarget.textContent) <=
        posts.length / postsPerPage
      )
        onPageNumberChange(Number(event.currentTarget.textContent));
    }

    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
    ];

    if (!allowedKeys.includes(event.key)) return event.preventDefault();

    if (Number(event.key) <= posts.length / postsPerPage)
      setPageNumber(Number(event.currentTarget.textContent));
  };

  if (posts.length / postsPerPage > 1)
    return (
      <div className="inline-flex items-center justify-start gap-4 border p-2 rounded-lg bg-gray-50">
        <Button
          radius="sm"
          size="sm"
          onClick={handlePrev}
          isDisabled={prevButtonDisabled}
          color={prevButtonDisabled ? 'default' : 'primary'}
          startContent={<FaArrowLeft />}
        >
          Prev
        </Button>

        <article className="flex items-center justify-center gap-2">
          <span>Page</span>{' '}
          <div
            className="py-0 px-1 outline-none border-2 focus:border-black rounded-md"
            contentEditable
            suppressContentEditableWarning
            suppressHydrationWarning
            onKeyDown={handleKeyUp}
          >
            {currentPage}
          </div>
        </article>

        <Button
          radius="sm"
          size="sm"
          isDisabled={nextButtonDisabled}
          color={nextButtonDisabled ? 'default' : 'primary'}
          onClick={handleNext}
          endContent={<FaArrowRight />}
        >
          Next
        </Button>
      </div>
    );
};

export default Pagination;
