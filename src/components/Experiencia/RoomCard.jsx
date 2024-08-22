import './RoomCard.css';
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

// Array para representar los asientos
const seats = Array.from({ length: 64 }, (_, i) => i);

const RoomCard = ({ roomId, onBackClick, movieName, showtime }) => {
    // Estado para los datos de la sala
    const [roomData, setRoomData] = useState(null);
    // Estado para los datos de los asientos
    const [seatsData, setSeatsData] = useState([]);
    // Estado para los asientos seleccionados
    const [selectedSeats, setSelectedSeats] = useState([]);
    // Estado para el mensaje de "sin asientos"
    const [noSeatsMessage, setNoSeatsMessage] = useState('');
    // Estado para guardar la información de la compra
    const [purchaseData, setPurchaseData] = useState([]);

    // useEffect para obtener datos de la sala y asientos al montar el componente
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
                const response = await fetch(`http://127.0.0.1:8000/seats/room/${roomId}`);
                const data = await response.json();
                
                // Verifica si no hay asientos asignados a la sala
                if (data.message === "No seats found for this room") {
                    setNoSeatsMessage('Lo lamentamos!!, Aún no se han asignado asientos a esta sala');
                } else {
                    setSeatsData(data);
                    setNoSeatsMessage('');
                }

                console.log('Seats Data:', data);
            } catch (error) {
                console.error('Error fetching seats data:', error);
                setNoSeatsMessage('Error al obtener la información de los asientos');
            }
        };

        // Llamadas a las funciones para obtener los datos
        fetchRoomData();
        fetchSeatsData();
    }, [roomId]);

    // Función para manejar la selección de un asiento
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

    // Función para confirmar la selección de asientos
    const handleConfirm = async () => {
        try {
            const selectedSeatsData = selectedSeats.map(seatId => {
                return seatsData.find(s => s.id === seatId);
            });

            // Calcular el total de los precios de los asientos seleccionados
            const total = selectedSeatsData.reduce((acc, seat) => acc + seat.price, 0);

            // Crear el objeto de compra
            const newPurchase = {
                movieName: movieName, // Usa movieName recibido como prop
                showtime: showtime,   // Usa showtime recibido como prop
                room: roomData.room, // Suponiendo que la información de la sala se encuentra en roomData
                seats: selectedSeatsData.map(seat => ({
                    id: seat.id,
                    price: seat.price,
                })),
                total,
            };

            // Actualizar el estado con la nueva compra
            setPurchaseData([...purchaseData, newPurchase]);

            // Mostrar la compra en consola
            console.log('New Purchase:', newPurchase);

            // Aquí puedes continuar con el proceso de actualización de los asientos en el servidor si es necesario
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

            const responses = await Promise.all(updateRequests);

            const allSuccessful = responses.every(response => response.ok);

            if (allSuccessful) {
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

    // Muestra un mensaje de carga si no se han cargado los datos de la sala
    if (!roomData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="room-card">
            <h2>{roomData.name}</h2>
            <p>{roomData.description}</p>
            <p><strong>Capacity:</strong> {roomData.capacity}</p>
            <p><strong>Película:</strong> {movieName}</p> {/* Mostrar el nombre de la película */}
            <p><strong>Horario:</strong> {showtime}</p> {/* Mostrar el horario */}

            {noSeatsMessage && <p>{noSeatsMessage}</p>}

            <ShowCase />

            {seatsData.length > 0 && (
                <div className="Cinema">
                    <div className="screen" />

                    <div className="seats">
                        {seatsData.sort((a, b) => a.id - b.id).map(seat => {
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
            )}

            <button className="confirm" onClick={handleConfirm}>Confirmar</button> {/* Botón con clase confirm */}
            <button className="back" onClick={onBackClick}>Volver</button> {/* Botón con clase back */}
        </div>
    );
};

// Componente para mostrar la leyenda de asientos
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
