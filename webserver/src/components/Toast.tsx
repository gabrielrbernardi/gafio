import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';

const ToastComponent = (props: any) => {

    const myToast: any = useRef(null);
    useEffect(() => {
            showToast(props.messageType, props.messageTitle, props.messageContent);
    },[])

    function showToast (messageType: string, messageTitle: string, messageContent: string)  {
            myToast.current.show({severity: messageType, summary: messageTitle, detail: messageContent, life: 4000});   
    }   
    
    return (
        <>
            <Toast ref={myToast} position="bottom-right"/>
        </>
    )
}

export default ToastComponent;