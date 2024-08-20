// src/components/CelNav/CelNav.jsx
import React from "react";
import "./CelNav.css";

const CelNav = ({ isOpen, toggleMenu, language}) => {
  return (
    <>
      <div className={`menu ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div className="contenedor">
          <img
            className="logo"
            src="https://firebasestorage.googleapis.com/v0/b/imagenes-b9423.appspot.com/o/Blue%20Purple%20Futuristic%20Technology%20Presentation%20(3).png?alt=media&token=ba45b64c-aa00-4932-85ff-8b2f101a7b06"
            alt=""
          />
          <ul>
            <li>
              <a href="#home" className="catalogo">
                Home
              </a>
            </li>
            <li>
              <a href="#skills" className="catalogo">
                Skills
              </a>
            </li>
            <li>
              <a href="#experience" className="catalogo">
                Experience
              </a>
            </li>
            <li>
              <a href="#contact" className="catalogo">
                Contact Me
              </a>
            </li>
             <a href={language === 'es' ? '/CV.pdf' : '/CV_en.pdf'} download className="no-underline">
              <button className="contactarme">CV</button>
            </a>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CelNav;
