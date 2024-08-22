import React, { useRef, useState, useEffect } from "react";
import './Experiencia.css';
import ExperienceCard from "./ExperieneCard/ExperienceCard";
import RoomCard from "./RoomCard"; // Importa tu nuevo componente
import Slider from "react-slick";

const Experiencia = ({ language, onMovieSelect }) => { // Agregamos onMovieSelect como prop
    const [experienciaW, setExperienciaW] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [noShowtimesMessage, setNoShowtimesMessage] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState(null); 
    const [selectedShowtime, setSelectedShowtime] = useState(null); // Agrega estado para showtime seleccionado
    const sliderRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:8000/movies');
                const data = await response.json();
                const transformedData = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    date: item.release_date,
                    responsabilidades: [item.description],
                    imagenes: [item.image_url]
                }));

                setExperienciaW(transformedData);
            } catch (error) {
                console.error('Error al recibir datos:', error);
            }
        }

        fetchData();
    }, []);

    const handleViewClick = async (id) => {
        try {
            const movieResponse = await fetch(`http://127.0.0.1:8000/movies/${id}`);
            const movieData = await movieResponse.json();
            setSelectedMovie(movieData);

            const showtimeResponse = await fetch(`http://127.0.0.1:8000/showtimes/movie/${id}`);
            const showtimeData = await showtimeResponse.json();

            if (showtimeData.message && showtimeData.message.includes('No showtimes found')) {
                setNoShowtimesMessage('No hay funciones disponibles');
                setShowtimes([]);
            } else {
                if (Array.isArray(showtimeData)) {
                    setShowtimes(showtimeData);
                } else {
                    setShowtimes([showtimeData]);
                }
                setNoShowtimesMessage('');
            }
        } catch (error) {
            console.error('Error fetching movie or showtime data:', error);
        }
    };


    const handleShowtimeClick = (roomId, showtime) => {
        setSelectedRoomId(roomId);
        setSelectedShowtime(showtime);
        if (onMovieSelect && selectedMovie) {
            onMovieSelect({
                movieName: selectedMovie.title,
                showtime,
                roomId
            });
        }
    };

    const handleBackClick = () => {
        setSelectedRoomId(null);
        setSelectedShowtime(null);
        setSelectedMovie(null);
    };

    if (selectedRoomId && selectedMovie && selectedShowtime) {
        // Muestra el componente RoomCard si un room ha sido seleccionado
        return (
            <RoomCard 
                roomId={selectedRoomId} 
                onBackClick={handleBackClick}
                movieName={selectedMovie.title}  // Pasa movieName
                showtime={selectedShowtime}      // Pasa showtime
            />
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 769,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const derecha = () => {
        sliderRef.current.slickNext();
    };

    const izquierda = () => {
        sliderRef.current.slickPrev();
    };

    if (selectedRoomId) {
        // Muestra el componente RoomCard si un room ha sido seleccionado
        return <RoomCard roomId={selectedRoomId} onBackClick={handleBackClick} />;
    }

    if (selectedMovie) {
        return (
            <div className="movie-details-container">
                <h1>{selectedMovie.title}</h1>
                <p>{selectedMovie.description}</p>
                <img src={selectedMovie.image_url} alt={selectedMovie.title} />

                <div className="showtimes-buttons">
                    <h2>Showtimes-DOB</h2>
                    {noShowtimesMessage ? (
                        <p>{noShowtimesMessage}</p>
                    ) : (
                        showtimes.length > 0 ? (
                            showtimes.map((showtime, index) => (
                                <button
                                    key={index}
                                    className="showtime-button"
                                    onClick={() => handleShowtimeClick(showtime.room_id, showtime.showtime)} // Pasa el room_id y showtime
                                >
                                    {showtime.showtime}
                                </button>
                            ))
                        ) : (
                            <p>No showtimes available</p>
                        )
                    )}
                </div>
                <button className="back-button" onClick={() => setSelectedMovie(null)}>Volver</button>
            </div>
        );
    }

    return (
        <section className="exp-contenedor">
            <h5>{language === 'es' ? 'Peliculas' : 'Movies'}</h5>

            <div className="exp-cont">
                <div className="arrow-right" onClick={derecha}>
                    <span className="material-symbols-outlined">chevron_right</span>
                </div>

                <div className="arrow-left" onClick={izquierda}>
                    <span className="material-symbols-outlined">chevron_left</span>
                </div>
                <Slider ref={sliderRef} {...settings}>
                    {experienciaW.length > 0 ? (
                        experienciaW.map((item) => (
                            <ExperienceCard
                                key={item.id}
                                detalles={item}
                                onViewClick={() => handleViewClick(item.id)} // Pasa la función con el ID
                            />
                        ))
                    ) : (
                        <p>No hay datos disponibles</p>
                    )}
                </Slider>
            </div>
        </section>
    );
};

export default Experiencia;
