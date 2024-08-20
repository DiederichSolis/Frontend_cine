import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HomeContenedor from './components/HomeContenedor/HomeContenedor';
import Experiencia from './components/Experiencia/Experiencia';
import Contacto from './components/Contacto/Contacto';
import Footer from './components/Footer/Footer';

function App() {
  const [language, setLanguage] = useState('es');

  const handleLanguageChange = () => {
    setLanguage(prevLanguage => (prevLanguage === 'es' ? 'en' : 'es'));
  };

  return (
    <>
      <Navbar onLanguageChange={handleLanguageChange} language={language} />
      <div className="containerH">
        <section id="home">
          <HomeContenedor language={language} />
        </section>
        <section id="experience">
          <Experiencia language={language} />
        </section>
        <section id="contact">
          <Contacto language={language} />
        </section>
      </div>
      <Footer />
    </>
  );
}

export default App;
