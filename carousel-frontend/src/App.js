import './App.css';
import Login from './Auth/Login';
import logo from './Images/logo.svg'
import { Routes, Route } from "react-router-dom";
import Sign from './Auth/Sign';
import Authlist from './Auth/Authlist';
import Verify from './Auth/Verify';
import VerifyEmail from './Auth/VerifyEmail';
import CreateAccount from './Auth/CreateAccount';
import Additional from './Auth/Additional';
import Invite from './Auth/Invite';
import SignAccout from './Auth/SignAccout';
import CreatePassword from './Auth/CreatePassword';
import ToastComponent, { showToast } from './Services/ToastComponent';
import ForgotPassword from './Auth/ForgotPassword'
// import Dashboard from './Auth/Dashboard';
import DashboardLawers from './Auth/Dashboard-lawers';
import DashboardLender from './Auth/Dashboard-lender';
import DashboardTitle from './Auth/Dashboard-title';
import DashboardReal from './Auth/Dashboard-realestageagent';
import DashboardBorrower from './Auth/Dashboard-borrowers';
import AdditionalInformation from './Auth/AdditionalInformation';
import VerifyIdentity from './Auth/VerifyIdentity';
import VerifyIdentityQuestions from './Auth/VerifyIdentityQuestions';
import BorrowerResources from './Auth/borrowerResources';



function App() {
    return (
        <>
        <Routes>
        <Route>
            <Route path="/" element={<Authlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:id/:token" element={<Verify />} />
            <Route path="/createaccount/:slug" element={<CreateAccount />} />
            <Route path="/additional/:slug" element={<Additional />} />
            <Route path="/invite/:slug" element={<Invite />} />
            <Route path="/signaccount" element={<SignAccout />} />
            <Route path="/reset-password/:token" element={<CreatePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/email-verification/:id/:slug" element={<VerifyEmail />} />
            <Route path="/dashboard-attorny" element={<DashboardLawers />} />
            <Route path="/dashboard-lender" element={<DashboardLender />} />
            <Route path="/dashboard-real" element={<DashboardReal />} />
            <Route path="/dashboard-escrow" element={<DashboardTitle />} />
            <Route path="/dashboard-borrower" element={<DashboardBorrower />} />
            <Route path="/additional-info/:slug" element={<AdditionalInformation />} />
            <Route path="/verify-identity/:slug" element={<VerifyIdentity />} />
            <Route path="/verify-questions/:slug" element={<VerifyIdentityQuestions />} />
            <Route path="/resources" element={<BorrowerResources />} />
            </Route>
        </Routes>
        <ToastComponent />
        </>
    );
}

export default App;
