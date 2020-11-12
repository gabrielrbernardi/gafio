import React, { useEffect } from 'react';

import './global.css';
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Routes from './routes';

function App() {

    useEffect(() => {
        document.title = 'GAFio';
    }, []);

    return (
        <Routes />
    );
}

export default App;
