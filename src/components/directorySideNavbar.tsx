import { Fragment, useEffect, useState } from 'react';
import {
  CalendarIcon,
  CogIcon,
  HomeIcon,
  MapIcon,
  MenuIcon,
  SearchCircleIcon,
  SpeakerphoneIcon,
  UserGroupIcon,
  ViewGridAddIcon,
  XIcon,
  UploadIcon,
  SaveIcon,
  PrinterIcon
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import logo from '../assets/MSV logo balck_teal-2.svg';
import SavePrompt from './savePrompt';

const navigationData = [
  { name: 'New Project', href: '/book', icon: ViewGridAddIcon, current: false },
  { name: 'Profile Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
  { name: 'Printed Books', href: '/printjobs', icon: PrinterIcon, current: false },
];
const secondaryNavigation = [
  // { name: 'Apps', to: '#', icon: ViewGridAddIcon },
  { name: 'Settings', href: '#', icon: CogIcon },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function SideBarNav({ sidebarOpen, setSidebarOpen, bookId, setToggle, setToggleMsg, open, setOpen, isNavigate, setNavigate }: any) {
  const [current, setCurrent] = useState('');
  const [navigation, setNavigation] = useState(navigationData);

  const location = useLocation();
  let navigate = useNavigate();

  const [url, setUrl]=useState("/")

  const user = useSelector((state: any) => state.user.value);

  useEffect(() => {
    const currentNav = navigation.find((d) => d.href === location.pathname)
    setCurrent(currentNav?.name || "")
  }, [current])

  const handleLogo=()=>{
    let changeSeq= localStorage.getItem("changeSeq") == "true"
    let changeEditor= localStorage.getItem("changeEditor") == "true"
    setUrl("/")

    if(changeSeq || changeEditor){
      setOpen(true)
    }
    else{
      navigate('/')
    }
  }

  const handleNavigate=(item:any)=>{
    let changeSeq= localStorage.getItem("changeSeq") == "true"
    let changeEditor= localStorage.getItem("changeEditor") == "true"
    setUrl(item.href)

    setCurrent(item.name);
    
    if(changeSeq || changeEditor){
      setOpen(true)
    }
    else{
      navigate(item.href, { state: { name: user.name, email: user.email } });
    }
  }

  return (
    <>
      {open && <SavePrompt setOpen={setOpen} bookId={bookId} url={url} setToggle={setToggle} setToggleMsg={setToggleMsg} isNavigate={isNavigate} setNavigate={setNavigate}/> }
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div  className="flex-shrink-0 flex items-center px-4 ">
                    <img onClick={handleLogo} className="h-auto w-40 cursor-pointer" src={logo} alt="MSV" />
                  </div>
                  <nav aria-label="Sidebar" className="mt-5">
                    <div className="px-2 space-y-1">
                      {navigation.map((item) => (
                        <p
                          onClick={() =>handleNavigate(item)}
                          key={item.name}
                          className={classNames(
                            item.name === current
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              item.name === current
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </p>
                      ))}
                    </div>
                    <hr className="border-t border-gray-200 my-5" aria-hidden="true" />
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-gray-100">
            <div className="flex-1 flex flex-col   overflow-y-auto">
              <div onClick={handleLogo} className="flex items-center flex-shrink-0 px-4 cursor-pointer">
                <img className="" src={logo} alt="MSV" style={{ height: 280, width: 270 }} />
              </div>
              <nav className="mt-5 flex-1" aria-label="Sidebar">
                <div className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <p
                      onClick={() =>handleNavigate(item)}
                      key={item.name}
                      className={classNames(
                        item.name === current
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={classNames(
                          item.name === current
                            ? 'text-gray-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </p>
                  ))}
                </div>
                <hr className="border-t border-gray-200 my-5" aria-hidden="true" />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
