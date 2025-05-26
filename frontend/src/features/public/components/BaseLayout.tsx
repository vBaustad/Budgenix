import { ReactNode } from 'react';
import ScrollToHash from './ScrolltoHash';
import Navbar from './Navbar';
import Footer from './Footer';
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