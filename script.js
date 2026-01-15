// Configuración principal
const CONFIG = {
    whatsappNumber: "5356168991",
    businessName: "TuLibroWatt",
    currency: "CUP"
};

// Datos de los libros con información real
const libros = [
    {
        id: 1,
        titulo: "El Perfume del Rey",
        autor: "Karine Bernal Lobo",
        sinopsis: "Narra la historia de Emily Malhore, hija de perfumistas del reino de Mishnock, cuya vida tranquila se ve alterada al captar la atención del príncipe Stefan, arrastrándola a intrigas políticas y conflictos con el reino enemigo de Lacrontte, donde el oscuro rey Magnus también juega un papel crucial en su destino, en una trama de romance, traición y poder entre dos reyes y un corazón, como una ficha en un juego de ajedrez. ",
        precio: "600 CUP",
        imagen: "assets/perfume-rey-1.jpg",
        archivo: "Perfume-del-Rey-1.pdf",
        destacado: true
    },
    {
        id: 2,
        titulo: "Las Cadenas del Rey",
        autor: "Karine Bernal Lobo",
        sinopsis: "Emily, tras ser traicionada y convertida en prisionera por quien creía su amor (el príncipe Stefan), se ve atrapada en territorio enemigo y se convierte en pieza clave para la paz entre dos reinos en guerra, debatiéndose entre un romance prohibido y sus ideales, enfrentando traiciones y poderosos sentimientos mientras busca su libertad y poder.",
        precio: "600 CUP",
        imagen: "assets/perfume-rey-2.jpg",
        archivo: "Perfume-del-Rey-2.pdf",
        destacado: false
    },
    {
        id: 3,
        titulo: "El Corazón del Rey",
        autor: "Karine Bernal Lobo",
        sinopsis: "Centrada en el rey Magnus Lacrontte, quien debe enfrentar un amor prohibido con Emily, una mujer que no encaja en la nobleza y cuyo romance amenaza la estabilidad de su reino, en medio de intrigas, secretos de su linaje y la lucha por resistir un destino que los empuja a amarse a pesar de todo y a todos, en un contexto de fantasía, poder y romance intenso.",
        precio: "700 CUP",
        imagen: "assets/perfume-rey-3.jpg",
        archivo: "Perfume-del-Rey-3.pdf",
        destacado: false
    },
    {
        id: 4,
        titulo: "Perfectos Mentirosos",
        autor: "Alex Mírez",
        sinopsis: "Sigue a Jude Derry al ingresar a la elitista Universidad de Tagus para infiltrarse en el círculo de los hermanos Cash (Aegan, Adrik y Alex) y vengar la muerte de su hermano, pero se ve envuelta en un peligroso triángulo de seducción, secretos y mentiras, descubriendo que nadie dice toda la verdad, especialmente los poderosos Cash, que guardan oscuros secretos tras fachadas perfectas, mientras una inminente verdad amenaza con destruirlo todo.",
        precio: "650 CUP",
        imagen: "assets/perfectos-mentirosos.jpg",
        archivo: "Perfectos-Mentirosos.pdf",
        destacado: true
    },
    {
        id: 5,
        titulo: "Sigue mi Voz",
        autor: "Ariana Godoy",
        sinopsis: "Klara, una joven que, tras una crisis de salud mental que la confina en casa, se refugia escuchando un programa de radio nocturno llamado 'Sigue mi voz'",
        precio: "500 CUP",
        imagen: "assets/sigue-mi-voz.jpg",
        archivo: "Sigue-mi-Voz.pdf",
        destacado: false
    }
];

// Generar mensaje optimizado para WhatsApp
function generarMensajeWhatsApp(libro) {
    const mensaje = `¡Hola! Me interesa comprar "${libro.titulo}" por ${libro.precio}.\n\nPor favor, indícame:\n1. Datos para pago (Transfermóvil/EnZona)\n2. Formato del libro\n3. Tiempo de entrega\n\nGracias.`;
    return encodeURIComponent(mensaje);
}

// Crear URL de WhatsApp
function crearURLWhatsApp(libro) {
    const mensaje = generarMensajeWhatsApp(libro);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${mensaje}`;
}

// Cargar libros en el catálogo
function cargarLibros() {
    const container = document.getElementById('books-container');
    if (!container) return;

    container.innerHTML = '';

    libros.forEach(libro => {
        const libroHTML = `
            <div class="book-card" data-id="${libro.id}">
                <div class="book-image loading" 
                     data-src="${libro.imagen}"
                     style="background-image: url('${libro.imagen}')">
                    ${libro.destacado ? '<div class="book-badge">Más Vendido</div>' : ''}
                </div>
                <div class="book-info">
                    <h3 class="book-title">${libro.titulo}</h3>
                    <p class="book-author">
                        <i class="fas fa-user-pen"></i> ${libro.autor}
                    </p>
                    <p class="book-synopsis">${libro.sinopsis}</p>
                    <div class="book-price">${libro.precio}</div>
                    <a href="${crearURLWhatsApp(libro)}" 
                       target="_blank" 
                       class="buy-button"
                       data-book="${libro.titulo}">
                        <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        container.innerHTML += libroHTML;
    });

    // Inicializar lazy loading de imágenes
    inicializarLazyLoading();
}

// Lazy loading para conexiones lentas
function inicializarLazyLoading() {
    const images = document.querySelectorAll('.book-image[data-src]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                // Cargar imagen
                const imageLoader = new Image();
                imageLoader.src = src;
                imageLoader.onload = () => {
                    img.style.backgroundImage = `url('${src}')`;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                };
                
                imageLoader.onerror = () => {
                    // Si falla la imagen local, usar placeholder
                    img.style.backgroundImage = "url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')";
                    img.classList.remove('loading');
                };
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.1
    });

    images.forEach(img => observer.observe(img));
}

// Registrar clics en botones de compra
function registrarEventosCompras() {
    document.addEventListener('click', function(e) {
        const buyButton = e.target.closest('.buy-button');
        if (buyButton) {
            const bookTitle = buyButton.getAttribute('data-book');
            
            // Registrar en localStorage para analytics simple
            try {
                let compras = JSON.parse(localStorage.getItem('tulibrowatt_compras')) || [];
                compras.push({
                    libro: bookTitle,
                    fecha: new Date().toISOString(),
                    dispositivo: navigator.userAgent
                });
                localStorage.setItem('tulibrowatt_compras', JSON.stringify(compras));
            } catch (error) {
                console.log('No se pudo guardar la interacción');
            }
        }
    });
}

// Mostrar notificación de carga
function mostrarCargando() {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-book"></i>
            <p>Cargando catálogo...</p>
        </div>
    `;
    document.body.appendChild(loading);
    
    setTimeout(() => {
        if (document.getElementById('loading-overlay')) {
            document.getElementById('loading-overlay').remove();
        }
    }, 1500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar estado de carga
    mostrarCargando();
    
    // Cargar libros después de un breve retraso para mejor UX
    setTimeout(() => {
        cargarLibros();
        registrarEventosCompras();
        
        // Mostrar mensaje de bienvenida
        if (!localStorage.getItem('tulibrowatt_bienvenida')) {
            console.log('¡Bienvenido a TuLibroWatt! Los libros digitales se envían por WhatsApp.');
            localStorage.setItem('tulibrowatt_bienvenida', 'true');
        }
    }, 500);
    
    // Mejorar la experiencia táctil
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Prevenir zoom doble-tap en elementos interactivos
    document.addEventListener('dblclick', function(e) {
        if (e.target.closest('.book-card') || e.target.closest('.buy-button')) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Detectar si es dispositivo móvil
function esMovil() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimizar para conexiones lentas
if (navigator.connection) {
    const connection = navigator.connection;
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Optimizaciones adicionales para conexiones lentas
        console.log('Conexión lenta detectada - Activando optimizaciones');
    }
}

// Manejar estado offline
window.addEventListener('offline', function() {
    const container = document.getElementById('books-container');
    if (container) {
        container.innerHTML = `
            <div class="offline-message">
                <i class="fas fa-wifi-slash"></i>
                <h3>Sin conexión a Internet</h3>
                <p>Los libros se cargarán cuando recuperes la conexión</p>
                <button onclick="location.reload()" class="btn-primary">
                    <i class="fas fa-redo"></i> Reintentar
                </button>
            </div>
        `;
    }
});

// Estilos adicionales para el mensaje offline
const offlineStyles = document.createElement('style');
offlineStyles.textContent = `
    .offline-message {
        text-align: center;
        padding: 40px 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        grid-column: 1 / -1;
    }
    
    .offline-message i {
        font-size: 3rem;
        color: #e53e3e;
        margin-bottom: 20px;
    }
    
    .offline-message h3 {
        color: #1a365d;
        margin-bottom: 10px;
    }
    
    .offline-message p {
        color: #718096;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(offlineStyles);