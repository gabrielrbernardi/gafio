import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';

const ToastComponent = (props: any) => {

    const myToast: any = useRef(null);
    useEffect(() => {
        showToast(props.messageType, props.messageTitle, props.messageContent, props.lifeTime);
    }, [])

    function showToast(messageType: string, messageTitle: string, messageContent: string, lifeTime?: number) {
        if (lifeTime) {
            myToast.current.show({ severity: messageType, summary: messageTitle, detail: messageContent, life: lifeTime });
        } else {
            myToast.current.show({ severity: messageType, summary: messageTitle, detail: messageContent, life: 4000 });
        }
    }

    return (
        <>
            <Toast ref={myToast} position="bottom-right" />
        </>
    )
}

export default ToastComponent;