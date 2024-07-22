import React, { useEffect, useState } from 'react';
import Hero from '../../components/Hero';
import LandingHowItWorks from '../../components/LandingHowItWorks';
import NavBar from '../../components/NavBar';
import RegisterPrompt from '../../components/RegisterPrompt';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import './style.css';
import { OurBooks } from '../../components/OurBooks';
import { useLocation } from 'react-router-dom';
import LoginPrompt from '../../components/LoginPrompt';
import axios from 'axios';
import jwtDecode from "jwt-decode";


export default function LandingPage(props:any) {
  const { hash } = useLocation();
  const location=useLocation();
  const [books, setBooks] = useState(0);
  const [show, setShow]=useState(false)

  const getBooks = async () => {
    let jwt:any=localStorage.getItem("jwtToken")
    const  userId = localStorage.getItem("awsUserId")
    if(jwt){
      const tokenData:any = jwtDecode(jwt);

      props.setLoading(true)
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/book/getBookByUserId/${userId}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
        },
        // data: newBook
      })
        .then(response => {
          console.log("response?.data?.data?.data.length",response?.data?.data?.data.length)
          setBooks(response?.data?.data?.data.length);
          setShow(true)
          props.setLoading(false)
        })
        .catch(error => {
          console.error(error);
          setShow(true)
          props.setLoading(false)
        });
    }
    else{
      setShow(true)
    }
    
  };

  useEffect(() => {
    getBooks();
  }, []);

  useEffect(() => {
    if (hash === "#price") {
      const section = document.getElementById('price');

      setTimeout(() => {
        section?.scrollIntoView({
          behavior: 'smooth' // Optional, adds smooth scrolling effect   
        });
      }, 1000)

    }
  }, [location])

  return (
    <>
      <LoginPrompt />
      <div className="nav">
        <div className='h-10 w-full colorStrip'></div>
        <NavBar />
      </div>
      <Hero books={books} show={show}/>
      <RegisterPrompt books={books} show={show}/>
      <LandingHowItWorks />
      <OurBooks  books={books} show={show}/>
      <Pricing />
      <Footer />
    </>
  );
}
