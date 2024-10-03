import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './component/sheard/navbar/Navbar';
import Footer from './component/sheard/footer/Footer';

const Main = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    );
}

export default Main;
