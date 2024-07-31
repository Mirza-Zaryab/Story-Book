import React from 'react';
import DetailedHowItWorks from '../../components/DetailedHowItWorks';
import Heading from '../../components/Heading';
import NavBar from '../../components/NavBar';
import Options from '../../components/Options';
import Footer from '../../components/Footer';

import './style.css';

export default function WhyPage() {
  return (
    <>
      <div className="nav">
        <NavBar />
      </div>
      <Heading />
      <Footer />
    </>
  );
}
