import React from "react";
import './MovieCard.css'; // Puedes crear un archivo CSS para estilizar la card

const MovieCard = ({ movie, showtimes, onBackClick }) => {
    return (
        <div className="movie-card">
            <button className="back-button" onClick={onBackClick}>Volver</button>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <img src={movie.image_url} alt={movie.title} />

            <h2>Showtimes</h2>
            <ul>
                {showtimes && showtimes.length > 0 ? (
                    showtimes.map((showtime, index) => (
                        <li key={index}>
                            {showtime.time} - Sala: {showtime.sala}
                        </li>
                    ))
                ) : (
                    <li>No showtimes available</li>
                )}
            </ul>
        </div>
    );
};

export default MovieCard;
