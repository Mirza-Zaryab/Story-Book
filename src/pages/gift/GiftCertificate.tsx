import React from 'react';
import NavBar from '../../components/NavBar';
import GiftVoucher from '../../components/Gift';

import Footer from '../../components/Footer';

import './style.css';

export default function GiftCertificate() {
    return (
        <>
            <div className="nav">
                <NavBar />
            </div>
            <GiftVoucher />
            <Footer />
        </>
    );
}