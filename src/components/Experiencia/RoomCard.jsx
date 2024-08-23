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
    // Estado para mostrar la tarjeta de confirmación
    const [showConfirmation, setShowConfirmation] = useState(false);
    // Datos de la compra confirmada
    const [confirmationData, setConfirmationData] = useState(null);

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
    const handleSelectedState = (seatNumber) => {
        const seat = seatsData.find(s => s.seat_number === seatNumber);
        if (!seat.is_available) return;

        const isSelected = selectedSeats.includes(seatNumber);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    // Función para confirmar la selección de asientos
    const handleConfirm = async () => {
        try {
            const selectedSeatsData = selectedSeats.map(seatNumber => {
                const seat = seatsData.find(s => s.seat_number === seatNumber);
                return {
                    seat_number: seat.seat_number,
                    price: Number(seat.price), // Asegura que price sea un número
                };
            });

            // Calcular el total de los precios de los asientos seleccionados
            const total = selectedSeatsData.reduce((acc, seat) => acc + seat.price, 0);

            // Crear el objeto de compra
            const newPurchase = {
                movieName: movieName, // Usa movieName recibido como prop
                showtime: showtime,   // Usa showtime recibido como prop
                room: roomData.name,  // Usa el nombre de la sala desde roomData
                seats: selectedSeatsData,
                total,
            };

            // Actualizar el estado con la nueva compra
            setPurchaseData([...purchaseData, newPurchase]);
            setConfirmationData(newPurchase); // Establecer los datos de la confirmación
            setShowConfirmation(true); // Mostrar la tarjeta de confirmación

            // Mostrar la compra en consola
            console.log('New Purchase:', newPurchase);

            // Aquí puedes continuar con el proceso de actualización de los asientos en el servidor si es necesario
            const updateRequests = selectedSeats.map(seatNumber => {
                const seat = seatsData.find(s => s.seat_number === seatNumber);
                if (!seat) return null;
                
                return fetch(`http://127.0.0.1:8000/seats/${seat.id}`, {
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
                        selectedSeats.includes(seat.seat_number)
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

    // Función para manejar el clic en el botón "Listo"
    const handleDone = () => {
        setShowConfirmation(false);
        onBackClick(); // Redirige al componente ExperienciaCard
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
                        {seatsData.sort((a, b) => a.seat_number - b.seat_number).map(seat => {
                            const isSelected = selectedSeats.includes(seat.seat_number);
                            const isOccupied = !seat.is_available;
                            return (
                                <span
                                    tabIndex="0"
                                    key={seat.seat_number}
                                    className={clsx(
                                        'seat',
                                        isSelected && 'selected',
                                        isOccupied && 'occupied',
                                    )}
                                    onClick={isOccupied ? null : () => handleSelectedState(seat.seat_number)}
                                    onKeyPress={
                                        isOccupied
                                            ? null
                                            : e => {
                                                if (e.key === 'Enter') {
                                                    handleSelectedState(seat.seat_number);
                                                }
                                            }
                                    }
                                >
                                    {seat.seat_number}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <button className="confirm" onClick={handleConfirm}>Confirmar</button> {/* Botón con clase confirm */}
            <button className="back" onClick={onBackClick}>Volver</button> {/* Botón con clase back */}

            {/* Mostrar tarjeta de confirmación si showConfirmation es verdadero */}
            {showConfirmation && confirmationData && (
                <div className="confirmation-card">
                    <h3>Confirmación de Compra</h3>
                    <p><strong>Película:</strong> {confirmationData.movieName}</p>
                    <p><strong>Horario:</strong> {confirmationData.showtime}</p>
                    <p><strong>Sala:</strong> {confirmationData.room}</p>
                    <p><strong>Asientos:</strong></p>
                    <ul>
                        {confirmationData.seats.map(seat => (
                            <li key={seat.seat_number}>Asiento {seat.seat_number} - ${seat.price}</li>
                        ))}
                    </ul>
                    <p><strong>Total:</strong> ${confirmationData.total}</p>
                    <button className="done" onClick={handleDone}>Listo</button> {/* Botón para volver */}
                </div>
            )}
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
                <span className="seat selected" /> <small>Seleccionado</small>
            </li>
            <li>
                <span className="seat occupied" /> <small>Ocupado</small>
            </li>
        </ul>
    );
}

export default RoomCard;
