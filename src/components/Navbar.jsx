import React, { useState } from 'react';
import { Link } from 'react-scroll';
import './Navbar.css';
import CelNav from './CelNav/CelNav';

const Navbar = ({ onLanguageChange, language }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <CelNav isOpen={openMenu} toggleMenu={toggleMenu} />
      <nav className='syle1'>
        <div className='content'>
          <img className='logo' src='https://firebasestorage.googleapis.com/v0/b/cine-245c1.appspot.com/o/LogoCine.png?alt=media&token=1961c035-3092-466e-8aff-17645c21dc25' alt="" style={{ width: '15%', height: 'auto' }} />
          <div className="languaje" onClick={onLanguageChange}>
            <img src='https://firebasestorage.googleapis.com/v0/b/imagenes-b9423.appspot.com/o/traducir.png?alt=media&token=65c00507-af0d-4324-9ff8-bca9a143db0f' alt="Description" className="imgtrans" />
            <span className="language-text">Translate</span>
          </div>
          <ul>
            <li>
              <Link to="home" smooth={true} duration={500} className="catalogo">{language === 'es' ? 'Home' : 'Home'}</Link>
            </li>
            <li>
              <Link to="experience" smooth={true} duration={500} className="catalogo">{language === 'es' ? 'Cartelera' : 'Movies'}</Link>
            </li>
            <li>
              <Link to="contact" smooth={true} duration={500} className="catalogo">{language === 'es' ? 'Contactanos' : 'Contact US'}</Link>
            </li>
            <a href={language === 'es' ? '/terminos.pdf' : '/terminos.pdf'} download className="no-underline">
              <button className="contactarme">{language === 'es' ? 'Terminos y condiciones' : 'terms and conditions'}</button>
            </a>
          </ul>
          <div className="contendor">
            <button className="opcionestyle" onClick={toggleMenu}>
              <span className={"material-symbols-outlined"} style={{ fontSize: "1.6rem" }}>
                {openMenu ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
