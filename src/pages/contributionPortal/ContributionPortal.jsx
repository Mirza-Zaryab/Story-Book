import { Fragment, useEffect, useState, useCallback } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import {
  AcademicCapIcon,
  BadgeCheckIcon,
  BellIcon,
  CashIcon,
  ClockIcon,
  MenuIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';
import { useParams } from 'react-router-dom';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import steveImage from '../../assets/img/steve.jpg';
import api from '../../utils/api';
import Footer from '../../components/Footer';
import AppTextArea from '../../components/AppTextArea';
import { useSelector, useDispatch } from 'react-redux';
import Drafts from '../../components/Drafts';
import logo from '../../assets/MSV logo balck_teal-2.svg';
import AppButton from '../../components/AppButton';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { v4 as uuidV4 } from 'uuid';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import AppInput from '../../components/AppInput';
import ErrorMessage from '../../components/ErrorMessage';

import './style.css';
const user = {
  name: 'Chelsea Hagon',
  email: 'chelsea.hagon@example.com',
  role: 'Human Resources Manager',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Profile', href: '#', current: false },
  { name: 'Resources', href: '#', current: false },
  { name: 'Company Directory', href: '#', current: false },
  { name: 'Openings', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];
const stats = [
  { label: 'Contributions', value: 12 },
  { label: 'Deadline', value: '2/8/2023' },
];

const actions = [
  {
    icon: ClockIcon,
    name: 'Drafts',
    href: '#',
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
  },
  {
    icon: AcademicCapIcon,
    name: 'Tips',
    href: '#',
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  }

];
const recentHires = [
  {
    name: 'Leonard Krasner',
    handle: 'leonardkrasner',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Floyd Miles',
    handle: 'floydmiles',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Emily Selman',
    handle: 'emilyselman',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Kristin Watson',
    handle: 'kristinwatson',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
];
const announcements = [
  {
    id: 1,
    title: 'New chapter added',
    href: '#',
    preview:
      'Qui rem deleniti. Suscipit in dolor veritatis sequi aut. Vero ut earum quis deleniti. Ut a sunt eum cum ut repudiandae possimus. Nihil ex tempora neque cum consectetur dolores.',
  },
  {
    id: 2,
    title: 'Did you know',
    href: '#',
    preview:
      'Alias inventore ut autem optio voluptas et repellendus. Facere totam quaerat quam quo laudantium cumque eaque excepturi vel. Accusamus maxime ipsam reprehenderit rerum id repellendus rerum. Culpa cum vel natus. Est sit autem mollitia.',
  },
  {
    id: 3,
    title: 'Book Deadline',
    href: '#',
    preview:
      'Tenetur libero voluptatem rerum occaecati qui est molestiae exercitationem. Voluptate quisquam iure assumenda consequatur ex et recusandae. Alias consectetur voluptatibus. Accusamus a ab dicta et. Consequatur quis dignissimos voluptatem nisi.',
  },
];

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2).label('Name'),
});

export default function ContributionPortal() {
  const { bookId } = useParams();
  console.log(bookId);
  const [quill, setQuill] = useState();

  const [id, setId] = useState(uuidV4());

  const [contributor, setContributor] = useState({ name: '', email: '' });
  const [text, setText] = useState('');
  const [title, setTitle] = useState({
    content: '',
    display: false,
  });

  const [username, setUsername] = useState('');
  const [error, setError] = useState({
    message: '',
    visibility: false,
  });

  const [visibility, setVisibility] = useState(false);
  const [addStory, setAddStory] = useState({
    show: false,
    page: -1,
  });
  const [drafts, setDrafts] = useState([]);
  const [draftId, setDraftId] = useState(null);
  const [action, showAction] = useState({
    Drafts: false,
    Tips: false,
  });

  const bookState = useSelector((state) => state.book.value);

  const alert = () => {
    if (text) {
      setVisibility(true);
    }
  };

  

  

  const handleActionCall = (value) => {
    showAction({ ...action, Drafts: false, Tips: false, [value]: true });
  };

  useEffect(() => {
    if (quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerText = '';

    const editor = document.createElement('div');
    // Add the current page stories to the page editor
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  // when save button is pressed save the current contents of the text editor
  const saveEditor = async () => {
    console.log('Entering save func');
    if (username === '') {
      setError({ ...error, message: 'Name is required', visibility: true });
      return;
    } else {
      setError({ ...error, message: '', visibility: false });
    }

    console.log(username);

    await api.saveContribution(id, bookId, quill.getContents(), username).then((res) => {
      console.log('res => ', res);
    });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setUsername(e.target.value);
  };
  return (
    <>
      <div className="min-h-full">
        <Popover as="header" className="pb-24 bg-gradient-to-r from-sky-800 to-cyan-600">
          {({ open }) => (
            <>
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative flex flex-wrap items-center justify-center lg:justify-between">
                  {/* Logo */}
                  <div className="absolute left-0 py-5 flex-shrink-0 lg:static">
                    <a href="#">
                      <img
                        className="hidden lg:block h-8 w-auto pr-2 "
                        src={MSVLogo}
                        alt="My Story Vault"
                      />
                    </a>
                  </div>

                  {/* Right section on desktop */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center lg:py-5 lg:pr-0.5">
                  </div>

                  <div className="w-full py-5 lg:border-t lg:border-white lg:border-opacity-20">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
                      {/* Left nav */}
                      <div className="hidden lg:block lg:col-span-2">
                        <nav className="flex space-x-4">
                         
                        </nav>
                      </div>
                      <div className="px-12 lg:px-0">
                        
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="z-30 absolute top-0 inset-x-0 max-w-3xl mx-auto w-full p-2 transition transform origin-top"
                    >
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
                        <div className="pt-3 pb-2">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark-cyan-600.svg"
                                alt="Workflow"
                              />
                            </div>
                            <div className="-mr-2">
                              <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
                                <span className="sr-only">Close menu</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                              </Popover.Button>
                            </div>
                          </div>
                          <div className="mt-3 px-2 space-y-1">
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 pb-2">
                          <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                              <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                            </div>
                            <div className="ml-3 min-w-0 flex-1">
                              <div className="text-base font-medium text-gray-800 truncate">
                                {contributor.name}
                              </div>
                              <div className="text-sm font-medium text-gray-500 truncate">
                                {contributor.email}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                              <span className="sr-only">View notifications</span>
                              <BellIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="mt-3 px-2 space-y-1">
                            {userNavigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </>
          )}
        </Popover>
        <main className="-mt-24 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Profile</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="rounded-lg bg-white overflow-hidden shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      Profile Overview
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="flex-shrink-0 h-60 w-40 mx-auto">
                            <img
                              className="mx-auto  userImage rounded"
                              src={steveImage}
                              alt="My Story Vault Logo"
                            />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-xl font-bold text-gray-600">Welcome!</p>
                            <p className="text-md  text-gray-900 sm:text-2xl">
                              We invite you to share any personal memories and stories you have of
                              Steve. These stories will create a book to be given to Steve's wife
                              and family.
                            </p>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                      {stats.map((stat) => (
                        <div key={stat.label} className="px-6 py-5 text-sm font-medium text-center">
                          <span className="text-gray-900">{stat.label}</span>
                          {': '}
                          <span className="text-gray-600">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section aria-labelledby="quick-links-title">
                  <form className="mb-2">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      className="border-gray-300 mt-1 appearance-none block w-full px-3 py-2 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleChange}
                    />
                    <ErrorMessage error={error.message} visible={error.visibility} />
                  </form>
                  <div className="editor-container" ref={wrapperRef}></div>
                  <div className="flex justify-end">
                    <div className="w-full mt-6  mb-4 border border-white rounded-md">
                      <AppButton title="Submit" onClick={saveEditor} />
                    </div>
                  </div>

                  <>

                    <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                      <h2 className="sr-only" id="quick-links-title">
                        Quick links
                      </h2>
                    </div>
                  </>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
