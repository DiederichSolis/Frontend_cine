import React from "react";
import './Contacto.css'
import CardContacto from "./CardContacto/CardContact";
import ContactoForm from "./ContactoForm/ContactoForm";

const Contacto = ({ language }) =>{
    return (
        <section className="contacto-contenedor">
            <h5>{language === 'es' ? 'Contactanos' : 'Contact Us'}</h5>

            <div className="contacto-cont">
                <div style={{flex: 1}}>
               
                <CardContacto 
                iconURL="https://firebasestorage.googleapis.com/v0/b/imagenes-b9423.appspot.com/o/gmail.png?alt=media&token=fa3ad967-46db-4988-95a8-2de6c2beb1ac"
                text="sac_ca@cinepolis.com"
                />
                
                <CardContacto 
                iconURL="https://firebasestorage.googleapis.com/v0/b/cine-245c1.appspot.com/o/cine.png?alt=media&token=bc9f6b07-c445-437e-9150-20f678b3a8a3"
                text="https://cinepolis.com.gt/cartelera/guatemala-guatemala"
                />

            </div>
            <div style={{flex: 1}}>
                <ContactoForm />
            </div>
            </div>
        </section>
    )
}

export default Contacto;