import React from 'react';
import './Footer.css'; // Si quieres agregar estilos personalizados

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-social-media">
        <a href="https://www.facebook.com/CinepolisGuatemala/?brand_redir=212235555192" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" alt="Facebook" />
        </a>
        
        <a href="https://www.instagram.com/cinepolismx/" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1000px-Instagram_logo_2022.svg.png" alt="Instagram" />
        </a>
      </div>
      <div className="footer-terms">
        <a href="/terminos-y-condiciones">Términos y Condiciones</a>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Diederich solis. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
