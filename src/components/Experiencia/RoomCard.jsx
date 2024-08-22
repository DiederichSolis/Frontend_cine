import './RoomCard.css'; // Importa los estilos para el componente
import React, { useState, useEffect } from 'react'; // Importa React y los hooks necesarios
import clsx from 'clsx'; // Importa clsx para manejar las clases condicionales

// Define una lista de 64 asientos, representados por números del 0 al 63
const seats = Array.from({ length: 64 }, (_, i) => i);

const RoomCard = ({ roomId, onBackClick }) => {
    // Estados del componente
    const [roomData, setRoomData] = useState(null); // Datos de la sala
    const [seatsData, setSeatsData] = useState([]); // Datos de los asientos
    const [selectedSeats, setSelectedSeats] = useState([]); // Asientos seleccionados
    const [noSeatsMessage, setNoSeatsMessage] = useState(''); // Mensaje si no hay asientos

    // Efecto para obtener los datos de la sala y los asientos cuando cambia roomId
    useEffect(() => {
        // Función para obtener los datos de la sala
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/rooms/${roomId}`);
                const data = await response.json();
                setRoomData(data);
                console.log('Room Data:', data); // Imprime los datos de la sala en la consola
            } catch (error) {
                console.error('Error fetching room data:', error); // Maneja errores en la obtención de datos
            }
        };

        // Función para obtener los datos de los asientos
        const fetchSeatsData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/seats/room/${roomId}`);
                const data = await response.json();
                
                // Maneja el caso en que no se encuentren asientos
                if (data.message === "No seats found for this room") {
                    setNoSeatsMessage('Aún no se han asignado asientos a esta sala');
                } else {
                    setSeatsData(data);
                    setNoSeatsMessage('');
                }

                console.log('Seats Data:', data); // Imprime los datos de los asientos en la consola
            } catch (error) {
                console.error('Error fetching seats data:', error); // Maneja errores en la obtención de datos
                setNoSeatsMessage('Error al obtener la información de los asientos');
            }
        };

        fetchRoomData(); // Obtiene los datos de la sala
        fetchSeatsData(); // Obtiene los datos de los asientos
    }, [roomId]);

    // Maneja el cambio de estado al seleccionar o deseleccionar un asiento
    const handleSelectedState = (seatId) => {
        const seat = seatsData.find(s => s.id === seatId);
        if (!seat.is_available) return; // No permite seleccionar asientos no disponibles

        const isSelected = selectedSeats.includes(seatId);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(selectedSeat => selectedSeat !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    // Maneja la confirmación de selección de asientos
    const handleConfirm = async () => {
        try {
            // Prepara las solicitudes de actualización para cada asiento seleccionado
            const updateRequests = selectedSeats.map(seatId => {
                const seat = seatsData.find(s => s.id === seatId);
                if (!seat) return null;
                
                return fetch(`http://127.0.0.1:8000/seats/${seatId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_available: false }), // Marca el asiento como ocupado
                });
            }).filter(request => request !== null);

            // Ejecuta todas las solicitudes de actualización
            const responses = await Promise.all(updateRequests);

            // Verifica si todas las solicitudes fueron exitosas
            const allSuccessful = responses.every(response => response.ok);

            if (allSuccessful) {
                // Actualiza el estado local de los asientos
                setSeatsData(prevSeatsData =>
                    prevSeatsData.map(seat =>
                        selectedSeats.includes(seat.id)
                            ? { ...seat, is_available: false }
                            : seat
                    )
                );
                setSelectedSeats([]);
                alert('Seats updated successfully'); // Mensaje de éxito
            } else {
                alert('Failed to update some seats'); // Mensaje de error
            }
        } catch (error) {
            console.error('Error updating seats:', error); // Maneja errores en la actualización
            alert('Error updating seats'); // Mensaje de error
        }
    };

    // Muestra un mensaje de carga mientras se obtienen los datos
    if (!roomData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="room-card">
            <h2>{roomData.name}</h2> {/* Nombre de la sala */}
            <p>{roomData.description}</p> {/* Descripción de la sala */}
            <p><strong>Capacity:</strong> {roomData.capacity}</p> {/* Capacidad de la sala */}

            {/* Muestra el mensaje si no hay asientos */}
            {noSeatsMessage && <p>{noSeatsMessage}</p>}

            <ShowCase /> {/* Muestra la leyenda de los asientos */}

            {/* Solo muestra la sección de asientos si hay datos de asientos disponibles */}
            {seatsData.length > 0 && (
                <div className="Cinema">
                    <div className="screen" /> {/* Representa la pantalla del cine */}

                    <div className="seats">
                        {/* Ordena los asientos por su ID para mantener la posición original */}
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
                                    {seat.id} {/* Muestra el ID del asiento */}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <button onClick={handleConfirm}>Confirm</button> {/* Botón para confirmar la selección */}
            <button onClick={onBackClick}>Volver</button> {/* Botón para volver a la pantalla anterior */}
        </div>
    );
};

// Componente para mostrar la leyenda de los asientos
function ShowCase() {
    return (
        <ul className="ShowCase">
            <li>
                <span className="seat" /> <small>N/A</small> {/* Asiento no disponible */}
            </li>
            <li>
                <span className="seat selected" /> <small>Selected</small> {/* Asiento seleccionado */}
            </li>
            <li>
                <span className="seat occupied" /> <small>Occupied</small> {/* Asiento ocupado */}
            </li>
        </ul>
    );
}

export default RoomCard;
