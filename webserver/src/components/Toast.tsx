import React from 'react';

const Toast = (props: any) => {
    console.log(1)
    console.log(props.status)
    alert(props.message)
    return (
        <>
        <p>teste</p>
        </>
    )
}

export default Toast;