import React, { useState } from 'react';
import './login/Login.css';
import image from '../../assets/forgot-password .png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let toastId;
    try {
      toastId = toast.loading("Sending email . . . ")
      await axios.post('http://localhost:8080/forgotPassword/request-reset-password', {email: email})
      toast.dismiss(toastId)
      toast.success('Email sent successfully!');
    } catch (error) {
      toast.dismiss(toastId)
      toast.error('Email not existed');
      console.log('Error: Unable to sent email', error);
    }
  };

  return (
    <section className="login-page *:font-sans">
      <div className="container">

        <div className="flex justify-between">
          <div className="left-side w-1/2 rounded-tr-xl rounded-br-xl">
            <img src={image} alt="forgot-password image" className="h-[60vh]" />
          </div>
          <div className="right-side">
            <h2 className="text-center text-2xl transform translate-y-28">
              Enter Your Email
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-submit">
                Submit
              </button>
            </form>
            <Link
              to="/api/auth/login"
              className="text-blue-700 hover:text-blue-800 active:text-blue-600 text-center"
            >
             <button> Did you forget your email? Let's get a new account</button>
            </Link>
          </div>
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

export default ForgotPasswordRequest;
