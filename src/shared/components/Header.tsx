import { useState, useEffect } from 'react';
import { faBars, faMoon, faSun, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useAuth } from '../../pages/contexts/auth.context';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;

      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }

      return newTheme;
    });
  };

  return (
    <header className="z-50">
      <nav className="bg-gray-50 border-gray-200 px-6 py-2.5 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center w-full">
          <Link to="/" className="flex items-center">
            <img src="/logo.webp" className="mr-3 h-6 sm:h-9" alt="IMS logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              IMS
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              onClick={logout}
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-2 py-4 text-sm mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log out
            </button>
            <div>
              <button
                type="button"
                title="Toggle theme"
                onClick={toggleTheme}
                className="text-lg"
              >
                <FontAwesomeIcon
                  icon={isDarkMode ? faSun : faMoon}
                  className={isDarkMode ? 'text-yellow-500' : 'text-gray-500'}
                />
              </button>
            </div>
            <button
              data-collapse-toggle="mega-menu-dropdown"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mega-menu-dropdown"
              aria-expanded="false"
              onClick={() => setIsShowSidebar(!isShowSidebar)}
            >
              <span className="sr-only">Open main menu</span>
              {!isShowSidebar ? (
                <FontAwesomeIcon
                  icon={faBars}
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faX}
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link
                  to="/"
                  className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {isShowSidebar && <SidebarDetail />}
        </div>
      </nav>
    </header>
  );
};

export default Header;

function SidebarDetail() {
  return (
    <div
      id="mega-menu-dropdown"
      className="absolute right-0 top-16 z-10 grid w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-700 lg:hidden"
    >
      <div className="p-4 pb-4 text-gray-900 dark:text-white">
        <ul className="space-y-4">
          <li>
            <Link
              to="/manager/dashboard"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/manager/candidates"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Candidate
            </Link>
          </li>
          <li>
            <Link
              to="/manager/jobs"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Job
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
        <ul className="space-y-4">
          <li>
            <Link
              to="/manager/interviews"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Interview
            </Link>
          </li>
          <li>
            <Link
              to="/manager/offers"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              Offer
            </Link>
          </li>
          <li>
            <Link
              to="/manager/employee"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
            >
              User
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
