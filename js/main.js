
// =========================================
// 0. APERTURA 3D LENTA CON ZOOM HACIA LA WEB
// =========================================
(function () {
    const btn = document.getElementById('openGatefoldBtn');
    const scene = document.getElementById('gatefoldScene');
    const overlay = document.getElementById('gatefoldOverlay');
    const xwing = document.querySelector('.xwing-container');

    if (!btn || !scene || !overlay) return;

    btn.addEventListener('click', function () {
        scene.classList.add('doors-open');

        setTimeout(() => {
            scene.classList.add('zoom-in');
        }, 2000);

        setTimeout(() => {
            overlay.classList.add('is-done');
            document.body.classList.remove('gatefold-locked');
            if (xwing) {
                xwing.style.animationPlayState = 'running';
            }
        }, 8200);

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 10500);
    });
})();

// =========================================
// 1. CUENTA ATRÁS
// =========================================
const weddingDate = new Date('2027-04-03T12:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    if (diff <= 0) {
        countdownEl.innerHTML = "<p class='date-banner'>¡Hoy es el Gran Día!</p>";
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// =========================================
// 2. BUSCADOR DE MESAS
// =========================================
const tablesData = [
    { table: 'Capitolio', saga: 'Los Juegos del Hambre', guests: ['Javier', 'Mai'] },
    {
        table: 'Elfos Domésticos',
        saga: 'Harry Potter',
        guests: ['Aitana', 'Lara', 'Alejandro', 'Leire', 'Arya', 'Natalia', 'Dani', 'Pablo', 'Elea', 'Sandra', 'Emma', 'Sara'],
    },
    {
        table: 'Alianza Rebelde',
        saga: 'Star Wars',
        guests: ['Aitana', 'Mª Jesús', 'Antonio', 'Yaya', 'Ares', 'Yayo', 'El Pájaro', 'Juan Ignacio', 'Leyre'],
    },
    {
        table: 'La Orden del Fénix',
        saga: 'Harry Potter',
        guests: ['Adriana', 'Cris', 'Guille', 'Helena', 'Isa', 'Luis', 'Mari', 'Raúl', 'Virgilio'],
    },
    {
        table: 'Imperio Galáctico',
        saga: 'Star Wars',
        guests: ['Encar', 'Félix', 'Maite', 'Ana Tere', 'Nines', 'Manolín', 'Jose', 'El Mafias', 'Lolo', 'Tere', 'Uwe', 'Susana'],
    },
    {
        table: 'Hyrule',
        saga: 'The Legend of Zelda',
        guests: [
            'Andreita',
            'Nines',
            'Lorena',
            'Uwe',
            'Lucas',
            'Rubén',
            'Ainara',
            'Iker',
            'Itziar',
            'Ariadna',
            'Jose Manuel',
            'Javi',
            'Sandra',
            'Nacho',
            'Novia Javi',
            'Novio Itziar',
        ],
    },
    {
        table: 'The Big Bang Theory',
        saga: 'The Big Bang Theory',
        guests: ['Almu', 'Carlos', 'Bebé de Almu y Carlos', 'Elea', 'Irene', 'Liu', 'Patri', 'Nuri', 'Javi', 'Ewa', 'Marcos'],
    },
    {
        table: 'The Matrix',
        saga: 'Matrix',
        guests: ['Ana', 'Antonio', 'Carlos', 'Cris', 'Jorge', 'Luis', 'Marcos', 'Novia Yisus', 'Olga', 'Yisus'],
    },
    {
        table: 'Battlestar Galáctica',
        saga: 'BSG 75',
        guests: [
            'Carlos',
            'David',
            'Iván',
            'Marta',
            'Verónica',
            'Javi Joven',
            'Laura',
            'Álvaro',
            'Javi Viejo',
            'Miguel',
            'Carlos Ródenas',
            'Novia Carlos',
        ],
    },
    {
        table: 'Dune',
        saga: 'Arrakis',
        guests: ['Cris', 'Rubén', 'Óscar', 'Nacho', 'Cheli', 'Felixín', 'Nachete', 'Gema', 'Belén', 'Miriam', 'Jose', 'Maite'],
    },
    { table: 'Gondor', saga: 'El Señor de los Anillos', guests: ['Invitados de Gondor'] },
    { table: 'Los Mercenarios', saga: 'Expendables', guests: ['Pita', 'Novia Pita', 'Nacho', 'Ainhoa', 'Fátima', 'Jose'] },
];

const searchInput = document.getElementById('guestSearch');
const resultsContainer = document.getElementById('searchResults');

function normalizeText(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

if (searchInput && resultsContainer) {
    searchInput.addEventListener('input', (e) => {
        const query = normalizeText(e.target.value);
        if (query.length < 2) {
            resultsContainer.innerHTML = '<p class="empty-msg">Empieza a escribir tu nombre para revelar tu mesa...</p>';
            return;
        }

        const matches = [];
        tablesData.forEach((item) => {
            item.guests.forEach((guest) => {
                if (normalizeText(guest).includes(query)) {
                    matches.push({ guest, table: item.table, saga: item.saga });
                }
            });
        });

        if (matches.length === 0) {
            resultsContainer.innerHTML =
                '<p class="empty-msg">No hemos encontrado ese nombre. Prueba con otro apodo o nombre de pila.</p>';
            return;
        }

        resultsContainer.innerHTML = matches
            .map(
                (m) => `
                    <div class="result-card">
                        <p class="result-guest">${m.guest}</p>
                        <p class="result-table">Mesa: ${m.table}</p>
                        <p class="result-saga">Universo: ${m.saga}</p>
                    </div>
                `,
            )
            .join('');
    });
}

// =========================================
// 3. MOSTRAR/OCULTAR ACOMPAÑANTE + RSVP
// =========================================
const companionRadios = document.querySelectorAll('input[name="hasCompanion"]');
const companionSection = document.getElementById('companionSection');

companionRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
        if (companionSection) {
            companionSection.style.display = this.value === 'Sí' ? 'block' : 'none';
        }
    });
});

// const scriptURL = 'PEGAR_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT';
// const rsvpForm = document.getElementById('rsvpForm');

// if (rsvpForm) {
//     rsvpForm.addEventListener('submit', function (e) {
//         e.preventDefault();

//         const submitBtn = document.getElementById('submitBtn');
//         const feedback = document.getElementById('rsvpFeedback');
//         const attendanceChecked = document.querySelector('input[name="attendance"]:checked');
//         const hasCompanionChecked = document.querySelector('input[name="hasCompanion"]:checked');

//         submitBtn.disabled = true;
//         submitBtn.textContent = 'Enviando lechuza...';
//         feedback.style.display = 'block';
//         feedback.style.color = 'var(--ink-sepia)';
//         feedback.textContent = 'Transmitiendo datos a la Orden...';

//         const formData = {
//             nombre: document.getElementById('guestName').value.trim(),
//             apellidos: document.getElementById('guestLastName').value.trim(),
//             asistencia: attendanceChecked ? attendanceChecked.value : '',
//             alergias: document.getElementById('allergies').value || 'Ninguna',
//             cancion: document.getElementById('song').value.trim(),
//             conAcompanante: hasCompanionChecked ? hasCompanionChecked.value : 'No',
//             nombreAcompanante: document.getElementById('companionName').value.trim(),
//             apellidosAcompanante: document.getElementById('companionLastName').value.trim(),
//             alergiasAcompanante: document.getElementById('companionAllergies').value || 'Ninguna',
//         };

//         fetch(scriptURL, {
//             method: 'POST',
//             mode: 'no-cors',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData),
//         })
//             .then(() => {
//                 feedback.textContent = `¡Muchas gracias, ${formData.nombre}! Tu confirmación se ha registrado con éxito.`;
//                 this.reset();
//                 if (companionSection) companionSection.style.display = 'none';
//                 submitBtn.disabled = false;
//                 submitBtn.textContent = 'Enviar Confirmación';
//             })
//             .catch((error) => {
//                 console.error('Error!', error.message);
//                 feedback.style.color = '#a94442';
//                 feedback.textContent = 'Hubo un pequeño error en la red galáctica. Por favor, inténtalo de nuevo.';
//                 submitBtn.disabled = false;
//                 submitBtn.textContent = 'Enviar Confirmación';
//             });
//     });
// }