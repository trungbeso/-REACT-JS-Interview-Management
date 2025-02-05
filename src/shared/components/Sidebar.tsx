import {
  faBriefcase,
  faChartLine,
  faComment,
  faEnvelope,
  faUserLock,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full">
      <aside
        id="sidebar-multi-level-sidebar"
        className="h-full absolute top-18 left-0 w-48 h-100% transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faChartLine}
                />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/candidates"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/manager/candidates')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/manager/candidates')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faUsers}
                />
                <span className="ms-3">Candidate</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/jobs"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/manager/jobs')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/manager/jobs')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faBriefcase}
                />
                <span className="ms-3">Job</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/interviews"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/manager/interviews')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/manager/interviews')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faComment}
                />
                <span className="ms-3">Interview</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/offers"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/manager/offers')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/manager/offers')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faEnvelope}
                />
                <span className="ms-3">Offer</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/employee"
                className={`flex items-center p-2 rounded-lg group ${
                  isActive('/manager/employee')
                    ? 'text-white bg-blue-600 dark:bg-blue-700'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FontAwesomeIcon
                  className={`w-5 h-5 transition duration-75 ${
                    isActive('/manager/employee')
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  }`}
                  icon={faUserLock}
                />
                <span className="ms-3">User</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
