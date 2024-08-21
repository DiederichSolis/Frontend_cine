import React from "react";
import './ExperienceCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';

const ExperienceCard = ({ detalles }) => {
    const handleViewClick = () => {
        // Captura el ID de la película
        const movieId = detalles.id;

        // Construye la URL de la API con el ID de la película
        const apiUrl = `http://127.0.0.1:8000/showtimes/${movieId}`;

        // Realiza la petición a la API de showtimes
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Procesa la información de los showtimes obtenidos
                console.log('Showtimes:', data);

                // Aquí puedes decidir cómo mostrar la información, por ejemplo, abriendo un modal
                showShowtimesModal(data);
            })
            .catch(error => {
                console.error('Error fetching showtimes:', error);
            });
    };

    // Función para mostrar la información en un modal
    const showShowtimesModal = (showtimes) => {
        // Implementa la lógica para mostrar la información, por ejemplo usando un estado
        // para controlar la visibilidad de un modal
        alert(`Showtimes para ${detalles.title}: ${JSON.stringify(showtimes)}`);
    };

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

            <button className="view-button" onClick={handleViewClick}>
                <FontAwesomeIcon icon={faTicketAlt} />
            </button>
        </div>
    );
};

export default ExperienceCard;
