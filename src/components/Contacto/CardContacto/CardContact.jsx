import React from "react";
import './CardContacto.css'

const CardContacto = ({iconURL, text}) => {
    return (
        <div className="contact-card">
            <div className="icon">
                <img src={iconURL} alt={text} />
            </div>

            <p>{text}</p>
        </div>
    )
}

export default CardContacto