import React from 'react'
import Button from './Button'

const Card = ({imgSrc, title, para}) => {
    return (
        <>
            <div className="card5">
                <img src={imgSrc} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{para}</p>
                        <Button title="Add to cart" className="btn-primary" />
                    </div>
            </div>
        </>
    )
}

export default Card
