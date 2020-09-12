import React from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';
import './Loading.css'; 

const Loading = () => {
    
    return (
        <div className="loading">
            <h5>Indeterminate</h5>
            <ProgressSpinner style={{width: '100px', height: '100px'}} strokeWidth="8" animationDuration="1s"/>
        </div>
    )
}

export default Loading;