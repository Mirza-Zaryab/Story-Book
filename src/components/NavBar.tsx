import { Fragment, useContext, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { useNavigate, useLocation } from 'react-router-dom';

import MSVLogo from '../assets/MSV logo balck_teal-2.svg';
import { useSelector } from "react-redux";
import { AuthContext } from '../Auth';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AwsConfig from "../AwsConfig";


function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const imgUrl = useSelector((state:any) => state.profile.profileImg);
  const firstName = useSelector((state:any) => state.profile.firstN);
  const username = useSelector((state:any) => state.profile.username);

  let navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [profileImg, setProfileImg]=useState();
  const user = localStorage.getItem('jwtToken');

  const handleClick = () => {
    if (user !== "") {
      logout();
    }
  }

  return (
    <div>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ">
              <div className="relative flex justify-between  h-24">
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 items-centerhover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex ml-10 xs:ml-20 sm:ml-0 justify-start sm:justify-center  lg:items-stretch lg:justify-start">
                  <div
                    className="flex-shrink-0 flex items-center  cursor-pointer"
                    onClick={() => navigate('/')}
                  >
                    <img
                      className="block xl:hidden h-28 w-auto z-50"
                      src={MSVLogo}
                      alt="My Story Vault"
                    />
                    {location.pathname === "/book" ?
                      null :
                      <img
                        className="hidden xl:block h-8 w-auto pr-2 z-50"
                        src={MSVLogo}
                        style={{ height: 300, width: 350 }}
                        alt="My Story Vault"
                      />
                    }
                  </div>
                  {location.pathname === "/book" ?
                    null :
                    <div className="hidden sm:ml-6 lg:flex sm:space-x-8  mt-2">
                      <a
                        className={classNames(
                          location.pathname === '/' && location.hash !== '#price'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/"}> Home </Link>
                      </a>
                        <a
                        className={classNames(
                          location.pathname === '/why'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/why"}> About </Link>
                      </a>
                     
                      <a
                        className={classNames(
                          location.hash === '#price'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/#price"}> Price </Link>
                      </a>
                      <a
                        className={classNames(
                          location.pathname === '/gift'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/gift"}> Gift </Link>
                      </a>
                      <a
                        className={classNames(
                          location.pathname === '/FAQ'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/FAQ"}> FAQ </Link>
                      </a>
                      <a
                        className={classNames(
                          location.pathname === '/contact'
                            ? 'border-teal-500 text-gray-900 '
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-xl font-sans'
                        )}
                      >
                        <Link to={"/contact"}> Contact </Link>
                      </a>
                    </div>
                  }
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative z-50">
                    <div className="flex justify-center items-center">
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
                      enter="transition ease-out duration-200"
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

                        {user && <Menu.Item>
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
                        </Menu.Item> }
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href='/login'
                              onClick={handleClick}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                              )}
                            >
                              {user ? 'Sign out' : 'Sign in'}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="lg:hidden">
              <div className="pt-2 pb-4 space-y-1">
                <Link to="/" className="bg-teal-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Home
                </Link>
                <Link to="/why" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  About
                </Link>
                <Link to="/#price" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Price
                </Link>
                <Link to="/gift" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Gift
                </Link>
                <Link to="/FAQ" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  FAQ
                </Link>
                <Link to="/contact" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Contact
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
