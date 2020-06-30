import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Root from './pages/Root/Root';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import MyProfile from './pages/Header/MyProfile/MyProfile';
import Notifications from './pages/Header/Notifications/Notifications';

import HeaderNotLogin from './pages/Header/HeaderNotLogin';
import Header from './pages/Header/Header';
import Footer from './pages/Footer/Footer';

import Dashboard from './pages/Dashboard/Dashboard';

import UnderDevelopment from './pages/UnderDevelopment/UnderDevelopment';
import NotFound from './pages/NotFound/NotFound';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route path="/" render={() => <div><HeaderNotLogin/><Root/><Footer/></div>} exact />
            <Route path="/login" render={() => <div><HeaderNotLogin/><Login/><Footer/></div>} exact />
            <Route path="/signup" render={() => <div><HeaderNotLogin/><SignUp/><Footer/></div>} exact />
            
            <Route path="/home" render={() => <div><Header/><Home/><Footer/></div>} exact />
            
            <Route path="/registrations" render={() => <div><Header/><UnderDevelopment/><Footer/></div>} exact />
            <Route path="/medicalRecords" render={() => <div><Header/><UnderDevelopment/><Footer/></div>} exact />
            <Route path="/dashboard" render={() => <div><Header/><Dashboard/><Footer/></div>} exact />

            <Route path="/myProfile" render={() => <div><Header/><MyProfile/><Footer/></div>} exact />
            <Route path="/notifications" render={() => <div><Header/><Notifications/><Footer/></div>} exact />
            <Route path="/notFound" render={() => <div><Header/><NotFound/><Footer/></div>} exact/>
        </BrowserRouter>
    )
}

export default Routes;