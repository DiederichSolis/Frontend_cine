import React from 'react';
import './HomeContenedor.css';

const HomeContenedor = ({ language }) => {
  return (
    <header className="page-header home-header">
      <div className="social-icons">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
      </div>
      <div className="container">
        <div className="banner-content">
          <h4 className="sub-title">Cinepolis</h4>
          <h2 className="title">
            Unlimited <span>Movie</span>, TVs Shows, & More.
          </h2>
        </div>
      </div>
    </header>
  );
};

export default HomeContenedor;
