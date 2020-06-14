import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={Login} path="/login" exact />
            <Route component={SignUp} path="/signup" exact />
        </BrowserRouter>
    )
}

export default Routes;