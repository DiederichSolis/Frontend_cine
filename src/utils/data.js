 export const EXPERIENCIA_W = [
    {
        title: "",
        date: "",
        responsabilidades: [],
        imagenes: []
    }
];

async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:8000/movies');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);

        // Limpiamos el arreglo y guardamos los datos
        EXPERIENCIA_W.length = 0;
        data.forEach(item => {
            EXPERIENCIA_W.push({
                title: item.title,
                date: item.release_date,
                responsabilidades: [item.description],
                imagenes: [item.image_url]
            });
        });

        console.log('EXPERIENCIA_W:', EXPERIENCIA_W);
    } catch (error) {
        console.error('Error al recibir datos:', error);
    }
}

fetchData();


