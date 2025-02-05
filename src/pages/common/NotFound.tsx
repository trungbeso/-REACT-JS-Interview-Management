import { Link } from 'react-router-dom';
import image from '../../assets/Scarecrow.png';
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-whitesmoke dark:bg-gray-900 font-space-mono text-gray-800 dark:text-gray-200 min-h-screen">
      <h2 className="font-inconsolata font-bold uppercase text-xl py-5 ml-6">
        404 Not Found
      </h2>
      <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:mt-20 justify-between">
        <img
          className="w-11/12 lg:w-2/5 h-auto mx-auto lg:mx-0 lg:mr-12 mb-12 lg:mb-0"
          src={image}
          alt="Just a scarecrow"
        />
        <section className="max-w-2xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            I have bad news for you
          </h1>
          <p className="text-lg lg:text-2xl text-gray-600 dark:text-gray-400 mb-10">
            The page you are looking for might be removed or temporarily
            unavailable.
          </p>
          <button
            className="uppercase w-54 h-16 bg-gray-800 dark:bg-gray-700 text-white text-sm font-bold tracking-wide py-3 px-6"
            type="button"
          >
            <Link to="/">Back to home page</Link>
          </button>
        </section>
      </div>
    </div>
  );
};

export default NotFoundPage;
