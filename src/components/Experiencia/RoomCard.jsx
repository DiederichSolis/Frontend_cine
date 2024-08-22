import './RoomCard.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const seats = Array.from({ length: 8 * 8 }, (_, i) => i); // Asientos en una matriz de 8x8

const RoomCard = ({ roomId, onBackClick }) => {
    const [roomData, setRoomData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

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

    const handleSelectedState = (seat) => {
        const isSelected = selectedSeats.includes(seat);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    if (!roomData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="room-card">
            <h2>{roomData.name}</h2>
            <p>{roomData.description}</p>
            <p><strong>Capacity:</strong> {roomData.capacity}</p>
            
            <ShowCase />

            <div className="Cinema">
                <div className="screen" />

                <div className="seats">
                    {seats.map(seat => {
                        const isSelected = selectedSeats.includes(seat);
                        const isOccupied = roomData.occupiedSeats && roomData.occupiedSeats.includes(seat);
                        return (
                            <span
                                tabIndex="0"
                                key={seat}
                                className={clsx(
                                    'seat',
                                    isSelected && 'selected',
                                    isOccupied && 'occupied',
                                )}
                                onClick={isOccupied ? null : () => handleSelectedState(seat)}
                                onKeyPress={
                                    isOccupied
                                        ? null
                                        : e => {
                                            if (e.key === 'Enter') {
                                                handleSelectedState(seat);
                                            }
                                        }
                                }
                            />
                        );
                    })}
                </div>
            </div>
            
            <button onClick={onBackClick}>Volver</button>
        </div>
    );
};

function ShowCase() {
    return (
        <ul className="ShowCase">
            <li>
                <span className="seat" /> <small>N/A</small>
            </li>
            <li>
                <span className="seat selected" /> <small>Selected</small>
            </li>
            <li>
                <span className="seat occupied" /> <small>Occupied</small>
            </li>
        </ul>
    );
}

export default RoomCard;
