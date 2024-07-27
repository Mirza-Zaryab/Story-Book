import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PageNumbers({ pages, pageIndex, setPageIndex }: any) {
  const dispatch = useDispatch();
  const bookState = useSelector((state: any) => state.book.value);

  const [currentPage, setCurrentPage] = useState({ pageId: '0', page1: '0', page2: '0' });


  const handleNext = () => {
    setCurrentPage({
      ...currentPage,
      page1: pages[pageIndex + 2]?._id,
      page2: pages[pageIndex + 2]?._id,
    });
    setPageIndex(pageIndex + 2);
  };

  const handlePrevious = () => {
    setCurrentPage({
      ...currentPage,
      page1: pages[pageIndex - 2]?._id,
      page2: pages[pageIndex - 2]?._id,
    });
    setPageIndex(pageIndex - 2);
  };

  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <a
          onClick={!pages[pageIndex - 1] ? undefined : handlePrevious}
          className={classNames(
            !pages[pageIndex - 1]
              ? 'text-gray-200 hover:cursor-not-allowed'
              : 'text-gray-500 hover:text-gray-700  hover:border-gray-300  hover:cursor-pointer',
            'border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium '
          )}
        >
          <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 " aria-hidden="true" />
          Previous
        </a>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages?.map((page: any, index: any) => {
          return (
            <a
              key={page._id}
              onClick={() => console.log(currentPage)}
              className={classNames(
                page._id === currentPage.page1 || page._id === currentPage.page2
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
              )}
              aria-current="page"
            >
              {index + 1}
            </a>
          );
        })}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <a
          onClick={!pages[pageIndex] ? undefined : handleNext}
          className={classNames(
            !pages[pageIndex]
              ? 'text-gray-200 hover:cursor-not-allowed'
              : 'text-gray-500 hover:text-gray-700  hover:border-gray-300  hover:cursor-pointer',
            'border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium '
          )}
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </nav>
  );
}
