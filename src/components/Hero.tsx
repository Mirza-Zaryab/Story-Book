import React, { useContext } from 'react';
import AppButton from './AppButton';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper";
import './style.css';
import { useSelector } from "react-redux"
import { AuthContext } from '../Auth';

export default function Hero(prop:any) {
  let navigate = useNavigate();
  const user = useSelector((state: any) => state.user.value);

  const { getPaymentStatus } = useContext(AuthContext);

  let url = "/checkout";

  const redirectPage = async () => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const paymentStatus = await getPaymentStatus();
      console.log(paymentStatus);
      if (paymentStatus.status === true) {
        navigate('/dashboard');
      } else {
        navigate(url);
      }
    } else {
      navigate('/login');
    }
  };

  function Text(props: any) {
    return (
      <div className='flex p-10 md:p-20 w-full lg:w-2/3 mt-40 sm:mt-0'>
        <div className='p-7 sm:w-4/5 h-4/5 textBox rounded-md'>
          <div style={{ color: props.textColor }} className='mb-4'>
            <h1 className='text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium md:mb-5'>Preserve treasured</h1>
            <h1 className='text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium md:mb-5'>memories,</h1>
            <h1 className='text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium md:mb-5'>before they fade.</h1>
          </div>

          <div style={{ color: props.textColor }}>
            <h1 className='sm:text-lg md:text-xl font-medium'>We each have a story, come discover yours!</h1>
            <h1 className='sm:text-lg md:text-xl font-medium'>The more you write about your story,</h1>
            <h1 className='sm:text-lg md:text-xl font-medium'>the more you will discover.</h1>
          </div>

          { prop.show && 
            <button
            onClick={redirectPage}
            className='ml-20 sm:ml-24 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg bg-[#ddc8c3] cursor-pointer rounded-full mt-4 sm:mt-10'>
            {prop.books > 0 ? "Return to book": "Let's get started"}
          </button>
          }
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='relative shadow-xl pt-28 z-0'>
        <Swiper navigation={true} loop={true} modules={[Autoplay, Navigation]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          className=""
        >
          <SwiperSlide>
            <div className=''>
              <div className="absolute inset-0">
                <img
                  className="h-full lg:h-auto w-full object-cover"
                  src={require('../assets/olia-gozha-J4kK8b9Fgj8-unsplash.jpg')}
                  alt="Books next to plant"
                />
              </div>
              <div className="relative">
                <Text textColor="black" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className=''>
              <div className="absolute inset-0 ">
                <img
                  className="h-full lg:h-auto w-full object-cover"
                  src={require('../assets/myStory.jpg')}
                  alt="Logo"
                />
              </div>
              <div className="relative">
                <Text textColor="#fef4e5" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className=''>
              <div className="absolute inset-0 ">
                <img
                  className="h-full lg:h-auto w-full object-cover"
                  src={require('../assets/carouselImg2.jpeg')}
                  alt="Logo"
                />
              </div>
              <div className="relative">
                <Text textColor="black" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
