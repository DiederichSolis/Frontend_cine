import React from "react";
import './ExperienceCard.css';

const ExperienceCard = ({ detalles }) => {
    const handleViewClick = () => {
        // Aquí puedes definir la acción a realizar cuando se haga clic en el botón
        alert(`Detalles de ${detalles.title}`);
    };

    return (
        <div className="experience-card">
            <h6>{detalles.title}</h6>
            <div className="lugartrabajos">{detalles.date}</div>
            
            {/* Asegúrate de que `responsabilidades` sea un arreglo y mapea sobre él */}
            <div className="responsabilidades">
                {detalles.responsabilidades && detalles.responsabilidades.length > 0 ? (
                    detalles.responsabilidades.map((resp, index) => (
                        <p key={index}>{resp}</p>
                    ))
                ) : (
                    <p>No hay responsabilidades disponibles</p>
                )}
            </div>

            {/* Asegúrate de que `imagenes` sea un arreglo y mapea sobre él */}
            <div className="images">
                {detalles.imagenes && detalles.imagenes.length > 0 ? (
                    detalles.imagenes.map((img, index) => (
                        <img key={index} src={img} alt={`Imagen ${index}`} />
                    ))
                ) : (
                    <p>No hay imágenes disponibles</p>
                )}
            </div>

            {/* Botón "Ver" */}
            <button className="view-button" onClick={handleViewClick}>
                Ver
            </button>
        </div>
    );
}

export default ExperienceCard;
