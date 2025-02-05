import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';



const VerifyToken: React.FC = () => {
  const [token, setToken] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tokenFromUrl = pathParts[pathParts.length - 1];
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/forgotPassword/validate-reset-password-token',
        { token: token },
      );
      toast.success('Email Verified!');
      navigate(`/auth/changePassword/${token}`);
      console.log(response.data);
    } catch (error) {
      toast.error('Failed to verify email');
      console.log('Error: Token expired', error);
    }
  };


  return (
    <section className="login-page *:font-sans">
      <div className="container">
        <div className="flex flex-col text-center justify-centerp w-full items-center transform translate-y-28 m-auto">
         <div><FontAwesomeIcon className="text-8xl text-green-500 p-5 bg-slate-100 rounded-full" icon={faCircleCheck} /></div>
          <h3 className="p-2 text-xl font-semibold">Email Verified</h3>
          <button onClick={handleVerify}
            type="submit"
            className="block text-blue-600 text-xl font-semibold"
          >Go to <br/>Reset Password Page </button>
        </div>
      </div>

      {/* wave */}
      <div>
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default VerifyToken;
