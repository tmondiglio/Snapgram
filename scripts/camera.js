document.addEventListener('DOMContentLoaded', () => {
    const cameraInput = document.getElementById('cameraInput');
    const preview = document.getElementById('preview');
    const titleInput = document.getElementById('imageTitle');
    const confirmBtn = document.getElementById('confirmBtn');

    let isSubmitted = false; // Inicializar el flag

    // Función para previsualizar y redimensionar la imagen
    cameraInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Redimensionar la imagen: Tamaño máximo de 300px por 300px
                    const MAX_WIDTH = 300;
                    const MAX_HEIGHT = 300;

                    let width = img.width;
                    let height = img.height;

                    // Mantener la proporción al redimensionar
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convertir la imagen redimensionada a base64
                    preview.src = canvas.toDataURL('image/jpeg', 0.5); // Reducir la calidad al 50%
                };
            };
            reader.readAsDataURL(file); // Leer la imagen como base64
        }
    });

    confirmBtn.addEventListener('click', async () => {
        if (isSubmitted) return; // Si ya se envió la imagen, salir de la función

        const imageData = preview.src;
        const title = titleInput.value.trim(); // Usar trim para evitar espacios en blanco

        if (!imageData || !title) {
            alert('Por favor, captura una imagen y agrega un título.');
            return;
        }

        // Crear un objeto con los datos a enviar
        const postData = {
            title: title,
            image: imageData,
            date: new Date().toISOString() // Fecha actual en formato ISO
        };

        console.log("Datos a enviar:", postData);

        try {
            const response = await fetch('https://66fee6502b9aac9c997dc311.mockapi.io/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorDetails = await response.text(); // Obtener el mensaje de error
                throw new Error(`Error ${response.status}: ${errorDetails}`);
            }

            isSubmitted = true; 
            preview.src = ""; 
            titleInput.value = ""; 
            cameraInput.value = ""; 

            // Desactivar el botón para evitar envíos múltiples
            confirmBtn.disabled = true;

            alert('Imagen publicada con éxito!'); 
            window.location.href = 'index.html'; 
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            alert(`Error al enviar la solicitud: ${error.message}`);
        }
    });
});
