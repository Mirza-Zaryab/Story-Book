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
                
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
