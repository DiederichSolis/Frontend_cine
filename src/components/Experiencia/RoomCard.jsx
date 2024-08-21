// RoomCard.js
import React, { useEffect, useState } from "react";
import './RoomCard.css'; // Puedes crear un archivo CSS para estilizar la tarjeta

const RoomCard = ({ roomId, onBackClick }) => {
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/rooms/${roomId}`);
                const data = await response.json();
                setRoomData(data);
                console.log('Room Data:', data);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRoomData();
    }, [roomId]);

    if (!roomData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="room-card">
            
            <h2>{roomData.name}</h2>
            <p>{roomData.description}</p>
            <p><strong>Capacity:</strong> {roomData.capacity}</p>
            <button onClick={onBackClick}>Volver</button>
        </div>
    );
};

export default RoomCard;
