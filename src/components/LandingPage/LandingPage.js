// src/components/LandingPage.js
import React from 'react';
import Header from './Header';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import Footer from './Footer';

function LandingPage({ openLoginModal }) {
  return (
    <div className="container">
      <Header openLoginModal={openLoginModal} />
      <HowItWorks openLoginModal={openLoginModal} />
      <WhyChooseUs />
      <Footer openLoginModal={openLoginModal} />
    </div>
  );
}

export default LandingPage;
