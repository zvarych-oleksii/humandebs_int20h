import { Outlet } from 'react-router-dom';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

export const MainLayout = () => {
    return (
        <>
            {/* Default Header */}
            <Header />

            <main>
                <Outlet />
            </main>

            {/* Default Footer */}
            <Footer />
        </>
    );
};

