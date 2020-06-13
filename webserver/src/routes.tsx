import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Login from './pages/Login/Login';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Login} path="/" exact />
        </BrowserRouter>
    )
}

export default Routes;