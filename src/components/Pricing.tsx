import { CheckIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import adoptionStory from '../assets/adoption book.png';
import FamilyTravel from '../assets/5.png';
import AppButton from './AppButton';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Auth';
import { BsDot } from 'react-icons/bs';

const tiers = [
  {
    name: 'Ebook',
    href: '#',
    price: 49,
    image: adoptionStory,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
    features: [
      'Pariatur quod similique',
      'Sapiente libero doloribus modi nostrum',
      'Vel ipsa esse repudiandae excepturi',
      'Itaque cupiditate adipisci quibusdam',
    ],
  },
  {
    name: 'Hard Cover',
    href: '#',
    price: 79,
    image: FamilyTravel,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
    features: [
      'Pariatur quod similique',
      'Sapiente libero doloribus modi nostrum',
      'Vel ipsa esse repudiandae excepturi',
      'Itaque cupiditate adipisci quibusdam',
    ],
  },
];

const features = [
  "",
  "",
  "",
  ""
];

type PriceProps = {
  priceVisible?: boolean;
};

export default function Pricing({ priceVisible = false }: PriceProps) {
  const navigate = useNavigate();
  const [showPrice] = useState(priceVisible);
  const { getPaymentStatus } = useContext(AuthContext);

  let url = "/checkout";

  const redirectPage = async () => {
    let token = localStorage.getItem("jwtToken");
    if (!token) { navigate("/login") }
    else {
      const paymentStatus = await getPaymentStatus();
      console.log(paymentStatus);

      if (paymentStatus.status === true) {
        navigate('/dashboard');
      } else {
        navigate(url);
      }
    }
  }

  return (
    <div id='price' className="">
      <div className="pt-12 sm:pt-16 lg:pt-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-2 lg:max-w-none">
            <p className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
              <span className='text-[#1B5360] italic'>My Story Vault</span> books are tailored to your needs,
            </p>
            <p className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
              your timeline and your storytelling style.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 pb-12 bg-gray-50 sm:mt-12 sm:pb-16 lg:mt-16 lg:pb-24">
        <div className="relative">
          <div className="absolute inset-0 h-3/4 " />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-4 lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                  <ul role="list" className="space-y-3 mt-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <BsDot className="h-8 w-8 text-black" aria-hidden="true" />
                      </div>
                      <p className="text-lg text-gray-700"><span className='text-lg font-bold italic'>Chronologically or thematically</span> driven -- or both! You decide the approach and we'll guide you every step of the way.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <BsDot className="h-8 w-8 text-black" aria-hidden="true" />
                      </div>
                      <p className="text-lg text-gray-700">Designed to emphasize & elevate your voice while showing off that <span className='text-lg font-bold italic'>timeless photo collection.</span></p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <BsDot className="h-8 w-8 text-black" aria-hidden="true" />
                      </div>
                      <p className="text-lg text-gray-700">Completely <span className='text-lg font-bold italic'>collaborative</span> every page offers options to seamlessly include others in the creative process.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <BsDot className="h-8 w-8 text-black" aria-hidden="true" />
                      </div>
                      <p className="text-lg text-gray-700">Accessible, professional, and elevated with the ability to <span className='text-lg font-bold italic'>customize</span> your product at every turn of the page.</p>
                    </li>
                  </ul>
                  <div className=''>
                    <div className="mt-10 flex items-baseline text-6xl font-bold">
                      $139.00
                      <span className="ml-1 text-2xl font-normal text-gray-500"> USD</span>
                    </div>
                  </div>
                  <div
                    onClick={redirectPage}
                    className="rounded-full shadow cursor-pointer"
                  >
                    <a
                      className="flex items-center justify-center px-5 py-3 border border-transparent text-lg font-semibold rounded-full text-white bg-[#1b5360] tracking-widest"
                      aria-describedby="tier-standard"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                  <div>
                    <h3
                      className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase seaweed-bg text-teal-100"
                      id="tier-standard"
                    >
                      Hard Cover
                    </h3>
                  </div>
                  <img className="mt-4" src={FamilyTravel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
