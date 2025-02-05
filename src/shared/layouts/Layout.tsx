import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="flex flex-wrap min-h-[calc(100vh-4.5rem)] dark:bg-gray-800 relative">
        <Sidebar />
        <div className="sm:pl-48 w-full">
          <Outlet />

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
