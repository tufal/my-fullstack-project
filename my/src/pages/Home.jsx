import React from 'react'
import Card from '../components/Card'
import axios from 'axios';
import Banner from '../components/Banner'

import { useEffect } from 'react'
import { useState } from 'react';
// import Lists from '../components/Lists'
const Home = () => {
 

  return (
    <>
      <div>

        <Banner />
       

        <section className="product-section">
          <div className="product-heading">
            <h2>Featured Products</h2>
            <p>Browse our most popular picks for comfort, style, and value.</p>
          </div>
          <div className="product-card">
            <Card imgSrc="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-1-variant.webp" title="Lorem ipsum dolor sit amet" para="$9.99" />
            <Card imgSrc="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-4-variant.webp" title="Consectetur adipiscing elit" para="$129.99" />
            <Card imgSrc="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-7-variant.webp" title="Sed do eiusmod tempor incididunt" para="$199.99" />
            <Card imgSrc="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-12.webp" title="Ut labore et dolore magna aliqua" para="$75.50" />
            <Card imgSrc="https://bootstrapmade.com/content/demo/eStore/assets/img/product/product-12.webp" title="Ut labore et dolore magna aliqua" para="$75.50" />
          </div>
        </section>

      
          {/* <Lists /> */}
       

      </div>
    </>
  )
}

export default Home
