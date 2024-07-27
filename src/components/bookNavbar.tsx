import { Fragment, useContext, useState, useEffect } from 'react';
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

export default function NavBar({setSidebarOpen}:any) {
  const imgUrl = useSelector((state:any) => state.profile.profileImg);
  const firstName = useSelector((state:any) => state.profile.firstN);
  const username = useSelector((state:any) => state.profile.username);
  
  let navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

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
                      <MenuIcon onClick={()=>setSidebarOpen(true)} className="block h-6 w-6" aria-hidden="true" />
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex  justify-center  lg:items-stretch lg:justify-start">
                  <div
                    className="flex-shrink-0 flex items-center  cursor-pointer"
                    onClick={() => navigate('/')}
                  >
                    <img
                      className="block lg:hidden h-28 md:h-40 w-auto"
                      src={MSVLogo}
                      alt="My Story Vault"
                    />
                    
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
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
                          <Link to="/dashboard">
                            <a
                               className={classNames(
                                 active ? 'bg-gray-100' : '',
                                 'block px-4 py-2 text-sm text-gray-700 whitespace-normal'
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
                        </Menu.Item> 
                        }
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
          </>
        )}
      </Disclosure>
    </div>
  );
}
