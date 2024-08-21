import React, { useRef, useState, useEffect } from "react";
import './Experiencia.css';
import ExperienceCard from "./ExperieneCard/ExperienceCard";
import Slider from "react-slick";

const Experiencia = ({ language }) => {
    const [experienciaW, setExperienciaW] = useState([]);
    const sliderRef = useRef();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://127.0.0.1:8000/movies');
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                console.log('Datos recibidos:', data);
    
                // Actualiza el estado con los datos
                const transformedData = data.map(item => ({
                    title: item.title,
                    date: item.release_date,
                    responsabilidades: [item.description],
                    imagenes: [item.image_url]
                }));
    
                setExperienciaW(transformedData);
                console.log('EXPERIENCIA_W:', transformedData);
            } catch (error) {
                console.error('Error al recibir datos:', error);
            }
        }

        fetchData();
    }, []); // Ejecuta el efecto solo una vez, cuando el componente se monta

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
                            <ExperienceCard key={item.title} detalles={item} />
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
