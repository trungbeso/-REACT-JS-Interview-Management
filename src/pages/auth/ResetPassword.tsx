import React, { useEffect, useState } from 'react';
import axios from 'axios';
import image from '../../assets/forgot-password .png';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tokenFromUrl = pathParts[pathParts.length - 1];
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let toastId;
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password does not match');
      return;
    }
    try {
      toastId = toast.loading("Sending email . . . ")
      const response = await axios.post(`http://localhost:8080/forgotPassword/change-password`, {
        token: token,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      toast.dismiss(toastId)
      toast.success('Password changed successfully!');
      console.log(response.data);
      navigate('/auth/login');
    } catch (error) {
      toast.dismiss(toastId)
      toast.error('Failed to verify email');
      console.log('Error: Unable to reset password', error);
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
            <h2 className="font-semibold text-2xl text-center transform translate-y-14">
              Password Resetter
            </h2>
            <form id="resetPass" onSubmit={handleSubmit}>
              <div className="form-group p-1 w-3/4">
                <label htmlFor="token">Token:</label>
                <input
                  type="input"
                  name="token"
                  id="token"
                  value={token}
                  readOnly
                />
              </div>
              <div className="form-group p-1 w-3/4">
                <label htmlFor="password">Old Password:</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="form-group p-1 w-3/4">
                <label htmlFor="confirm-password">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group p-1 w-3/4">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-submit">
                Submit
              </button>
            </form>
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

export default ResetPassword;
