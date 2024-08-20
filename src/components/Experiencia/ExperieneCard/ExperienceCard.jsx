import React from "react";
import './ExperienceCard.css'

const ExperienceCard = ({detalles}) =>{
    return(
       <div className="experience-card">
        <h6>{detalles.title}</h6>

        <div className="lugartrabajos">{detalles.date}</div>
        
        <ul>
            {detalles.resposabilidades.map((item)=>(
                <li key={item}>{item}</li>
            ))}
        </ul>

        <div className='images'>
                <img src={detalles.Imagenes} alt={detalles.title} />
            </div>

       </div>
    )
}

export default ExperienceCard;