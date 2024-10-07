document.addEventListener('DOMContentLoaded', () => {
    const reel = document.getElementById('cardContainer');

    const fetchPosts = async () => {
        console.log("Cargando posts...");
        reel.innerHTML = '';

        try {
            const response = await fetch('https://66fee6502b9aac9c997dc311.mockapi.io/posts');
            console.log("Respuesta recibida:", response);
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }

            const posts = await response.json();
            console.log("Posts recibidos:", posts);

            if (!Array.isArray(posts)) {
                throw new Error("La respuesta no es un array");
            }

            // Ordenar los posts de más reciente a más antigua
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (posts.length === 0) {
                showModelCard();
                return;
            }

            // Crear cards para cada post
            posts.forEach(post => {
                // Verificar si el post tiene los datos necesarios
                if (post.image && post.title && post.date) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${post.image}" alt="Imagen" style="max-height: 300px; object-fit: cover;">
                        <div class="card-body">
                            <h2 class="card-title">${post.title}</h2>
                            <p class="date">${new Date(post.date).toLocaleString()}</p>
                        </div>
                    `;
                    reel.appendChild(card);
                } else {
                    console.warn("Post vacío o incompleto:", post); // Mensaje de advertencia para post incompleto
                }
            });

        } catch (error) {
            console.error("Error al cargar los posts:", error);
            showModelCard(); // Mostrar card modelo en caso de error
        }
    };

    fetchPosts();

    const captureBtn = document.querySelector('.btn-float');
    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            window.location.href = 'camara.html';
        });
    } else {
        console.error('El botón de captura no se encontró.');
    }
});

function showModelCard() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = `
        <div class="card" style="width: 400px; margin: 20px;">
            <img src="images/photo.png" class="card-img-top" alt="Imagen predeterminada">
            <div class="card-body">
                <h2 class="card-title"></h2>
                <p class="card-text">Realiza tu primera publicación</p>
            </div>
        </div>
    `;
}
