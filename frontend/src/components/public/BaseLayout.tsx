import React, { ReactNode } from 'react';
import ScrollToHash from '../public/ScrolltoHash'
import Navbar from '../public/Navbar'
import Footer from '../public/Footer'
import BackgroundWrapper from './BackgroundWrapper';

type BaseLayoutProps = {
    children: ReactNode;
};

export default function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <>
        <BackgroundWrapper>
            <Navbar />
            <ScrollToHash />
            {children}
        </BackgroundWrapper>
        <Footer />
        </>
    );
}