import React, { useState } from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGooglePlusG,
  faFacebookF,
  faGithub,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context.tsx';
import { AuthService } from '../../../services/auth.service';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [gender, setGender] = useState([
    { value: true, label: 'Male' },
    { value: false, label: 'Female' },
  ]);

  // valid dữ liệu cho form đăng ký
  const signUpValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .max(15, 'Phone number maximum have 15 digits'),
    gender: Yup.string().required('Gender is required'),
  });

  // valid dữ liệu cho form đăng nhập
  const signInValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  // đăng ký
  const handleSignUpSubmit = async (values: any) => {
    const data = { ...values, gender: values.gender === 'true' };
    try {
      const response = await AuthService.register(values);
      if (response) {
        navigate('/auth/login');
      } else {
        toast.error('Failed to sign up!');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // đăng nhập
  const handleSignInSubmit = async (values: any) => {
    try {
      const response = await AuthService.login(values);
      if (response) {
        login(response.data);
        navigate('/');
        toast.success('Welcome back ! Have a nicely day.');
      } else {
        toast.error('Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegisterClick = () => {
    const container = document.getElementById('container');
    if (container) {
      container.classList.add('active');
    }
  };

  const handleLoginClick = () => {
    const container = document.getElementById('container');
    if (container) {
      container.classList.remove('active');
    }
  };

  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <section className="login-page *:font-sans">
      <div className="container" id="container">
        <div className="form-container sign-up">
          <Formik
            initialValues={{
              fullName: '',
              email: '',
              phoneNumber: '',
              gender: true,
            }}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSignUpSubmit}
          >
            {() => (
              <Form>
                <hr />
                <h2 className="text-3xl font-bold p-3">Join With Us</h2>
                <span className="mb-2"></span>
                <span className="mb-1">
                  Fill Out The Following Info For Registration
                </span>
                <div className="input-login-group w-5/6">
                  <Field
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="error-message text-red-600 text-xs"
                  />
                </div>
                <div className="input-login-group w-5/6">
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring forcus:border-gray-400"
                    required
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error-message text-red-600 text-xs"
                  />
                </div>
                <div className="input-login-group w-5/6">
                  <Field
                    as="select"
                    name="gender"
                    required
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring forcus:border-gray-400"
                  >
                    <option value="">Choose Gender</option>
                    {gender.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="error-message text-red-600 text-xs"
                  />
                </div>
                <div className="input-login-group mb-4 w-5/6">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-600 text-xs"
                  />
                </div>
                <button type="submit">Sign Up </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="form-container sign-in">
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={signInValidationSchema}
            onSubmit={handleSignInSubmit}
          >
            {() => (
              <Form>
                <h1 className="text-3xl font-bold p-2">Login With</h1>
                <div className="social-icons hover:*:text-white">
                  <a href="#" className="icon">
                    <FontAwesomeIcon icon={faGooglePlusG} />
                  </a>
                  <a href="#" className="text-black">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </div>
                <hr />
                <p className="p-1">OR</p>
                <span>Login With Your Username & Password</span>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message text-red-600 text-xs"
                />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message text-red-600 text-xs"
                />
                <div className="util-group">
                  <div className="flex text-xs p-2 align-middle util-group__left">
                    <Field type="checkbox" name="remember" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                  <div className="util-group__right">
                    <Link to="/auth/forgotPassword">Forgot Password?</Link>
                  </div>
                </div>
                <button type="submit">Login</button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h5 className="text-3xl font-semibold">Welcome Back!</h5>
              <p>Good to see you again, have a nice day</p>
              <button className="hidden" id="login" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h6 className="text-2xl font-semibold">
                Don't have an account yet?
              </h6>
              <p>Register to become a real slave of capitalism</p>
              <button
                className="hidden"
                id="register"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </div>
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

export default Login;
