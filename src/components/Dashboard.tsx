import { Fragment, useEffect, useState, useContext } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  CogIcon,
  CollectionIcon,
  HomeIcon,
  MenuAlt2Icon,
  PhotographIcon,
  PlusSmIcon,
  UserGroupIcon,
  ViewGridIcon,
  BookOpenIcon,
  XIcon,
} from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/user.js';
import { useNavigate } from 'react-router-dom';
import { getSuggestedQuery } from '@testing-library/react';
import API from '../utils/api';
import BookList from '../components/BookList';
import Footer from '../components/Footer';
import BookDashboard from '../pages/bookDashboard/BookDashboard';
import SideBarNav from './SideBarNav';
import { AuthContext } from '../Auth.js';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const sidebarNavigation = [
  { name: 'New Project', href: '/book', icon: BookOpenIcon, current: false },
  { name: 'Profile Dashboard', href: '/', icon: HomeIcon, current: false },

  { name: 'All Story Vault', href: '#', icon: ViewGridIcon, current: false },
  { name: 'Collaboration Vault', href: '/collaborationVault', icon: PhotographIcon, current: true },
  //   { name: 'Shared', href: '#', icon: UserGroupIcon, current: false },
  //   { name: 'Albums', href: '#', icon: CollectionIcon, current: false },
  { name: 'Settings', href: '#', icon: CogIcon, current: false },
];
const userNavigation = [
  { name: 'Settings', href: '/' },
  { name: 'Sign out', href: '/login' },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const initialValues = { title: '', author: '', image: '' };

export default function ProfileDashboard({ children, aside = null }: any) {
  const imgUrl = useSelector((state:any) => state.profile.profileImg);
  const firstName = useSelector((state:any) => state.profile.firstN);
  const username = useSelector((state:any) => state.profile.username);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [books, setBooks] = useState([initialValues]);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { logout } = useContext(AuthContext);
  const user = localStorage.getItem('jwtToken');
  const getUser = async () => {
    await API.getUser().then((res) => {
      dispatch(login(res.data));
      setBooks(res.data.books);
    });
  };

  useEffect(() => {
  }, []);

  return (
    <>
      <div className="h-full flex">
        {/* Narrow sidebar */}
        <SideBarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                </div>
                <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative flex-shrink-0">
                    <div className='flex justify-center items-center'>
                    {user && <div className="mr-2 text-xl self-end">{firstName ? `Hi, ${firstName}!`: username ? `Hi, ${username}!`:""  }</div> }
                      <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        {(imgUrl && imgUrl!="NULL") ?
                          <img className="w-10 h-10 rounded-full" src={imgUrl} alt="Rounded avatar"/>
                          :
                          <FaUserCircle className='w-10 h-10 color-charcoal' />
                        }
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user && ( <Menu.Item>
                         {({ active }) => (
                          <Link to={"/dashboard"}>
                            <a
                              className={classNames(
                               active ? 'bg-gray-100' : '',
                               'block px-4 py-2 text-sm text-gray-700'
                               )}
                              >
                                 Return To Dashboard
                            </a>
                         </Link>
                        )}
                     </Menu.Item>
                     )}

                      {user && <Menu.Item key={"Settings"}>
                            {({ active }) => (
                              <Link to={"/settings"}> 
                                <a
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                Settings
                                </a>
                              </Link>
                            )}
                          </Menu.Item>}
                          <Menu.Item key={"Sign Out"}>
                            {({ active }) => (
                              <a
                                onClick={"Sign out" === 'Sign out' ? logout : null}
                                href={"/login"}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                {"Sign out"}
                              </a>
                            )}
                          </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {/* Primary column */}
              <section
                aria-labelledby="primary-heading"
                className="min-w-0 flex-1 h-full flex flex-col lg:order-last"
              >
                <h1 id="primary-heading" className="sr-only">
                  Photos
                </h1>
                {/* Your content */}
                {children}
              </section>
            </main>
            {aside}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
