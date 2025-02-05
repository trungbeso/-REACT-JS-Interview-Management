import { Link } from 'react-router-dom';

const NoPermission = () => {
  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg mb-8">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NoPermission;
