import React from "react";
import './Contacto.css'
import CardContacto from "./CardContacto/CardContact";
import ContactoForm from "./ContactoForm/ContactoForm";

const Contacto = ({ language }) =>{
    return (
        <section className="contacto-contenedor">
            <h5>{language === 'es' ? 'Contacto' : 'Contact Me'}</h5>

            <div className="contacto-cont">
                <div style={{flex: 1}}>
               
                <CardContacto 
                iconURL="https://firebasestorage.googleapis.com/v0/b/imagenes-b9423.appspot.com/o/gmail.png?alt=media&token=fa3ad967-46db-4988-95a8-2de6c2beb1ac"
                text="Diederich.josue.emidio@gmail.com"
                />
                
                <CardContacto 
                iconURL="https://firebasestorage.googleapis.com/v0/b/imagenes-b9423.appspot.com/o/github%20(1).png?alt=media&token=4f760d80-9c08-42cd-9c76-de3212aa874c"
                text="https://github.com/DiederichSolis"
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