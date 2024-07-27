import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import AppInput from './AppInput';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().min(2).label('First Name'),
  lastName: Yup.string().required().min(2).label('Last Name'),
  email: Yup.string().required().email().label('Email'),
});

export default function AddContributor({ open, setOpen }: any) {
  const cancelButtonRef = useRef(null);

  let { id } = useParams();

  const handleSubmit = (values: any) => {
    api.addContributor(id, values).then((res) => {
    });
  };

  const handleCancel = () => {
    setOpen(false);
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
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8  sm:p-6 sm:max-w-lg sm:w-full">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add Contributor
                    </Dialog.Title>
                    <Formik
                      initialValues={{ firstName: '', lastName: '', email: '', image: '' }}
                      onSubmit={(userValues) => handleSubmit(userValues)}
                      validationSchema={validationSchema}
                    >
                      {({ handleChange, values, setFieldValue }) => {
                        return (
                          <Form className="space-y-6 " action="#" method="POST">
                            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                              <div className="md:grid md:grid-cols-2 md:gap-6">
                                <div className="md:col-span-1">
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Personal Information
                                  </h3>
                                </div>
                                <div className="mt-5 md:mt-0 md:col-span-2">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Photo
                                    </label>
                                    <div className="mt-1 flex items-center space-x-5">
                                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        <svg
                                          className="h-full w-full text-gray-300"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                      </span>
                                      <button
                                        type="button"
                                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      >
                                        Change
                                      </button>
                                    </div>
                                  </div>
                                  <div className="grid  gap-6">
                                    <AppInput
                                      title="First name"
                                      id="firstName"
                                      name="firstName"
                                      type="text"
                                      autoComplete="name"
                                      value={values.firstName}
                                      onChange={handleChange}
                                    />

                                    <AppInput
                                      title="Last name"
                                      id="lastName"
                                      name="lastName"
                                      type="text"
                                      autoComplete="name"
                                      value={values.lastName}
                                      onChange={handleChange}
                                    />

                                    <AppInput
                                      title="Email address"
                                      id="email"
                                      name="email"
                                      type="text"
                                      autoComplete="email"
                                      value={values.email}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                              <div className="md:grid md:grid-cols-2 md:gap-6">
                                <div className="md:col-span-1">
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Notifications
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Decide which communications you'd like to receive and how.
                                  </p>
                                </div>
                                <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                                  <fieldset>
                                    <legend className="sr-only">By Email</legend>
                                    <div
                                      className="text-base font-medium text-gray-900"
                                      aria-hidden="true"
                                    >
                                      By Email
                                    </div>
                                    <div className="mt-4 space-y-4  ">
                                      <div className="flex items-start">
                                        <div className="h-5 flex items-center">
                                          <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label
                                            htmlFor="comments"
                                            className="items-start font-medium text-gray-700"
                                          >
                                            Comments
                                          </label>
                                          <p className="text-gray-500">
                                            Get notified when someones posts a comment on a posting.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="candidates"
                                            name="candidates"
                                            type="checkbox"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label
                                            htmlFor="candidates"
                                            className="font-medium text-gray-700"
                                          >
                                            Candidates
                                          </label>
                                          <p className="text-gray-500">
                                            Get notified when a contributor contributes.
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="offers"
                                            name="offers"
                                            type="checkbox"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                          />
                                        </div>
                                        <div className="ml-3 text-sm">
                                          <label
                                            htmlFor="offers"
                                            className="font-medium text-gray-700"
                                          >
                                            Offers
                                          </label>
                                          <p className="text-gray-500">
                                            Get notified when a contributor rejects a request.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </fieldset>
                                  <fieldset>
                                    <legend className="contents text-base font-medium text-gray-900">
                                      Push Notifications
                                    </legend>
                                    <p className="text-sm text-gray-500">
                                      These are delivered via SMS to your mobile phone.
                                    </p>
                                    <div className="mt-4 space-y-4">
                                      <div className="flex items-center">
                                        <input
                                          id="push-everything"
                                          name="push-notifications"
                                          type="radio"
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label
                                          htmlFor="push-everything"
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          Everything
                                        </label>
                                      </div>
                                      <div className="flex items-center">
                                        <input
                                          id="push-email"
                                          name="push-notifications"
                                          type="radio"
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label
                                          htmlFor="push-email"
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          Same as email
                                        </label>
                                      </div>
                                      <div className="flex items-center">
                                        <input
                                          id="push-nothing"
                                          name="push-notifications"
                                          type="radio"
                                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label
                                          htmlFor="push-nothing"
                                          className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                          No push notifications
                                        </label>
                                      </div>
                                    </div>
                                  </fieldset>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Save
                              </button>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
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
