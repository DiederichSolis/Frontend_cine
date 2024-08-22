import './RoomCard.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const RoomCard = ({ roomId, onBackClick }) => {
    const [roomData, setRoomData] = useState(null);
    const [seatsData, setSeatsData] = useState([]);
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

        const fetchSeatsData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/seats');
                const data = await response.json();
                setSeatsData(data);
                console.log('Seats Data:', data);
            } catch (error) {
                console.error('Error fetching seats data:', error);
            }
        };

        fetchRoomData();
        fetchSeatsData();
    }, [roomId]);

    const handleSelectedState = (seatId) => {
        const seat = seatsData.find(s => s.id === seatId);
        if (!seat.is_available) return;

        const isSelected = selectedSeats.includes(seatId);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const handleConfirm = async () => {
        try {
            const updatedSeats = seatsData.map(seat => ({
                ...seat,
                is_available: selectedSeats.includes(seat.id) ? false : seat.is_available,
            }));

            await fetch('http://127.0.0.1:8000/seats', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSeats),
            });

            alert('Seats updated successfully');
            setSeatsData(updatedSeats);
            setSelectedSeats([]);
        } catch (error) {
            console.error('Error updating seats:', error);
        }
    };

    if (!roomData || !seatsData.length) {
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
                    {seatsData.map(seat => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isOccupied = !seat.is_available;
                        return (
                            <span
                                tabIndex="0"
                                key={seat.id}
                                className={clsx(
                                    'seat',
                                    isSelected && 'selected',
                                    isOccupied && 'occupied',
                                )}
                                onClick={isOccupied ? null : () => handleSelectedState(seat.id)}
                                onKeyPress={
                                    isOccupied
                                        ? null
                                        : e => {
                                            if (e.key === 'Enter') {
                                                handleSelectedState(seat.id);
                                            }
                                        }
                                }
                            />
                        );
                    })}
                </div>
            </div>

            <button onClick={handleConfirm}>Confirm</button>
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
