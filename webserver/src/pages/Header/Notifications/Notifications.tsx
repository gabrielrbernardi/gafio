import React, { useEffect } from 'react';

const Notifications = () => {
    useEffect(() => {
        document.title = 'GAFio | Notificações';
    }, []);
    
    return (
        <div className="row m-5">
            <div className="card shadow-lg mx-auto p-3 col-sm-8 offset-md-3 border">
                <p className="text-center h3">Notificações</p>
            </div>
        </div>
    )
}

export default Notifications;