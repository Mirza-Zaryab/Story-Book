import React, { useState } from 'react';
import AppButton from './AppButton';
import { useNavigate } from 'react-router-dom';
import missionStory from '../assets/Works.png';
import Couple from '../assets/Couple.png';
import DesignBook from '../assets/DesignBook.png';
import TellStory from '../assets/AddStory.png';
import AddPhotos from '../assets/AddPhotos.png';
import PrintBook from '../assets/PrintImg.png';
import './style.css';
import HowToUse from './howToUse';

const metrics = [
  {
    id: 1,
    color: '#dad9d5',
    stat: 'Design your book',
    image: DesignBook,
  },
  {
    id: 2,
    color: '#9FC8B8',
    stat: 'Tell your Story',
    image: TellStory,
  },
  {
    id: 3,
    color: '#7A9C9D',
    stat: 'Add Photos',
    image: AddPhotos,
  },
  {
    id: 4,
    color: '#DDC8C3',
    stat: 'Print your Book',
    image: PrintBook,
  }
];
export default function LandingHowItWorks() {
  let navigate = useNavigate();
  const [popup, setPopup] = useState(false)

  const handleLearnmore = () => {
    setPopup(true)
  }


  const handleStop = () => {
    setPopup(false)
  }

  return (
    <>
      <div className="how-bg grid grid-cols-1 lg:grid-cols-2 relative">
        <div className="w-full px-7 md:px-20">
          <div className="lg:pb-40 pt-12 sm:pt-24">
            <p className="mt-3 text-3xl font-extrabold ">HOW IT WORKS</p>
            <p className="mt-5 text-2xl font-normal tracking-wide text-black">
              My Story Vault provides a custom design<br />
              process tailored to your needs, your timeline<br />
              and your storytelling style. In four easy steps...<br />
            </p>
            <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-6">
              {metrics.map((item) => (
                <div key={item.id} className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-4 border border-black w-96'>
                    <div style={{ backgroundColor: item.color }} className='colorBadge flex justify-center items-center text-2xl font-medium mr-2 w-16 h-14'>{item.id}</div>

                    <div className="text-gray-800 text-2xl font-semibold uppercase">{item.stat}</div>
                  </div>

                  <img className='w-16 h-16' src={item.image} alt="logo" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute lg:flex lg:items-center lg:justify-center lg:inset-x-0 top-2 md:top-8 right-8">
          <button
            onClick={handleLearnmore}
            className=" bg-[#9FC8B8] text-black font-semibold px-4 w-28 h-28 rounded-full flex items-center justify-center cursor-pointer"
          >
            CLICK TO LEARN MORE
          </button>
        </div>
        <div className='w-full px-10 md:px-5 pb-3 md:pb-10'>
          <img
            className="h-full w-full object-fill"
            src={missionStory}
            alt="People working on laptops"
          />
        </div>
      </div>

      {popup &&
        <div onClick={handleStop} id="defaultModal" aria-hidden="true" className="fixed bg-black bg-opacity-50 backdrop-blur-xs top-0 left-0 right-0  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-2xl max-h-full mx-auto mt-20">
            <div className="relative bg-white rounded-lg shadow">
              <HowToUse />
            </div>
          </div>
        </div>
      }
    </>
  );
}
