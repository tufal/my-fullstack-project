import React from 'react'
import Button from './Button'
import "./Banner.css"
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate = useNavigate();
    return (
        <div className="banner">
            <div className="banner-background">
                <div className="animated-circle circle-1"></div>
                <div className="animated-circle circle-2"></div>
            </div>
            <div className="banner-content">
                <span className="promo-pill">
                    <span className="pill-icon">✨</span> New Collection 2025
                </span>
                <h1 className="banner-title">Discover Stylish <span className="textm">Fashion</span> For Every Season</h1>
                <p className="banner-copy">
                    Refresh your wardrobe with modern essentials, curated looks, and fast delivery straight to your door.
                </p>
                <div className="banner-actions">
                    <Button title="Shop Now" className="btn-primary btn-large" onClick={() => navigate("/shop")} />
                    <Button title="View Collection" className="btn-outline-success btn-secondary" onClick={() => navigate("/collection")} />
                </div>
            </div>
            <div className="banner-media">
                <div className="image">
                    <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-f-9.webp" alt="Banner Image" />
                </div>
                <div className="banner-card card1">
                    <div className="card-inner">
                        <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-4.webp" alt="Collection preview" />
                        <div>
                            <h5>Collection</h5>
                            <strong>$89.99</strong>
                        </div>
                    </div>
                </div>
                <div className="banner-card card2">
                    <div className="card-inner">
                        <img src="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-3.webp" alt="Casual wear preview" />
                        <div>
                            <h5>Casual Wear</h5>
                            <strong>$59.99</strong>
                        </div>
                    </div>
                </div>
                <div className="percent">
                    <p>20% OFF</p>
                </div>
            </div>
        </div>
    )
}

export default Banner
