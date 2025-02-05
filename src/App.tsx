import { Route, Routes } from 'react-router-dom';
import Layout from './shared/layouts/Layout';
import EmployeeList from './pages/manager/employee/EmployeeList.tsx';
import { ToastContainer } from 'react-toastify';
import Login from './pages/auth/login/Login.tsx';
import JobList from './pages/manager/job/JobList.tsx';
import InterviewList from './pages/manager/interviews/InterviewList.tsx';
import CandidateList from './pages/manager/candidate/CandidateList.tsx';
import NotFound from './pages/common/NotFound.tsx';
import AnonymousLayout from './shared/layouts/AnonymousLayout.tsx';
import ResetPassword from './pages/auth/ResetPassword.tsx';
import OfferList from './pages/manager/offers/OfferList.tsx';
import PrivateRoute from './shared/components/PrivateRoute.tsx';
import NoPermission from './pages/common/NoPermission.tsx';
import Dashboard from './pages/manager/Dashboard.tsx';
import VerifyToken from './pages/auth/VerifyToken.tsx';
import ForgotPasswordRequest from './pages/auth/ForgotPasswordRequest.tsx';


export default function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <PrivateRoute
              requiredRoles={['ADMIN', 'MANAGER', 'RECRUITER', 'INTERVIEWER']}
            />
          }
        >
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/manager/interviews" element={<InterviewList />} />
            <Route path="/manager/jobs" element={<JobList />} />
            <Route path="/manager/offers" element={<OfferList />} />
            {/*  Employee Page*/}

            <Route path="/manager/candidates" element={<CandidateList />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute requiredRoles={['ADMIN']} />}>
          <Route path="/" element={<Layout />}>
            <Route path="/manager/employee" element={<EmployeeList />} />{' '}
          </Route>
        </Route>

        {/*  Auth Page*/}
        <Route path="/auth/" element={<AnonymousLayout />}>
          <Route path="login" index element={<Login />} />
          <Route path="forgotPassword" element={<ForgotPasswordRequest />} />
          <Route path="verifyToken/:token" element={<VerifyToken />} />
          <Route path="changePassword/:token" element={<ResetPassword />} />
        </Route>

        <Route path="/no-permission" element={<NoPermission />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
