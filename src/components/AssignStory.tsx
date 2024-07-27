/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/outline';
import Menu from '../components/Menu';
import api from '../utils/api';
export default function AssignStory({ open, setOpen, chapters }: any) {
  const [pages, setPages] = useState([{ _id: '', title: '' }]);
  const cancelButtonRef = useRef(null);
  const [chapterSelected, setChapterSelected] = useState(chapters[1]);
  const [pageSelected, setPageSelected] = useState(chapters[1]);

  useEffect(() => {
    getChapterPages(chapterSelected.chapterId);
  }, [chapterSelected]);

  const getChapterPages = async (id: any) => {
    await api.getPages(id).then(async (res) => {
      setPages(res.data.pages);
      setPageSelected(res.data.pages[0]);
    });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Assign Story
                    </Dialog.Title>

                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>Select the Chapter and page.</p>
                    </div>
                    <form className="mt-5 flex flex-col sm:flex sm:items-center">
                      <div className="h-36 w-full sm:max-w-xs">
                        <label htmlFor="email" className="sr-only">
                          Email
                        </label>
                        <Menu
                          label="Chapter"
                          options={chapters}
                          selected={chapterSelected}
                          setSelected={setChapterSelected}
                        />
                        <Menu
                          label="Page"
                          options={pages}
                          selected={pageSelected}
                          setSelected={setPageSelected}
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Assign
                      </button>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
