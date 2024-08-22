import './RoomCard.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const seats = Array.from({ length: 64 }, (_, i) => i); // Cantidad de asientos

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
            // Prepare the update requests for each selected seat
            const updateRequests = selectedSeats.map(seatId => {
                const seat = seatsData.find(s => s.id === seatId);
                if (!seat) return null;
                
                return fetch(`http://127.0.0.1:8000/seats/${seatId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_available: false }),
                });
            }).filter(request => request !== null);

            // Execute all the requests
            const responses = await Promise.all(updateRequests);

            // Check if all requests were successful
            const allSuccessful = responses.every(response => response.ok);

            if (allSuccessful) {
                // Update the local state
                setSeatsData(prevSeatsData =>
                    prevSeatsData.map(seat =>
                        selectedSeats.includes(seat.id)
                            ? { ...seat, is_available: false }
                            : seat
                    )
                );
                setSelectedSeats([]);
                alert('Seats updated successfully');
            } else {
                alert('Failed to update some seats');
            }
        } catch (error) {
            console.error('Error updating seats:', error);
            alert('Error updating seats');
        }
    };

    if (!roomData || !seatsData.length) {
        return <p>Loading...</p>;
    }

    // Order seats by their original position, ensuring occupied seats are not moved
    const orderedSeats = seatsData.sort((a, b) => a.id - b.id);

    return (
        <div className="room-card">
            <h2>{roomData.name}</h2>
            <p>{roomData.description}</p>
            <p><strong>Capacity:</strong> {roomData.capacity}</p>
            
            <ShowCase />

            <div className="Cinema">
                <div className="screen" />

                <div className="seats">
                    {orderedSeats.map(seat => {
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
                            >
                                {seat.id}
                            </span>
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
