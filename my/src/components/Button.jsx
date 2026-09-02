import React from 'react';

const Button = ({title, className, onClick}) => {
    return (
        <>
            <button className={`btn me-5 ${className}`} onClick={onClick}>
                {title}
            </button>
        </>
    )
}

export default Button;