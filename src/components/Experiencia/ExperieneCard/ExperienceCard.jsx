import React from "react";
import './ExperienceCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const ExperienceCard = ({ detalles, onViewClick }) => {
    return (
        <div className="experience-card">
            <h6>{detalles.title}</h6>
            <div className="lugartrabajos">{detalles.date}</div>
            
            <div className="responsabilidades">
                {detalles.responsabilidades && detalles.responsabilidades.length > 0 ? (
                    detalles.responsabilidades.map((resp, index) => (
                        <p key={index}>{resp}</p>
                    ))
                ) : (
                    <p>No hay responsabilidades disponibles</p>
                )}
            </div>

            <div className="images">
                {detalles.imagenes && detalles.imagenes.length > 0 ? (
                    detalles.imagenes.map((img, index) => (
                        <img key={index} src={img} alt={`Imagen ${index}`} />
                    ))
                ) : (
                    <p>No hay imágenes disponibles</p>
                )}
            </div>

            <button className="view-button" onClick={onViewClick}>
                <FontAwesomeIcon icon={faTicketAlt} />
            </button>
        </div>
    );
};

export default ExperienceCard;
