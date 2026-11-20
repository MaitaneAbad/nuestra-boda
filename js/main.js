
// =========================================
// 0. APERTURA 3D LENTA CON ZOOM HACIA LA WEB
// =========================================
(function () {
    const btn = document.getElementById('openGatefoldBtn');
    const scene = document.getElementById('gatefoldScene');
    const overlay = document.getElementById('gatefoldOverlay');
    const xwing = document.querySelector('.xwing-container');

    if (!btn || !scene || !overlay) return;

    let isOpening = false;

    btn.addEventListener('click', function () {
        if (isOpening) return;
        isOpening = true;
        btn.disabled = true;

        // 1. Abren las puertas laterales en 3D (6.5s en CSS)
        scene.classList.add('doors-open');

        // 2. A los 1.8s entra la tarjeta interior con zoom progresivo (4.4s en CSS)
        setTimeout(() => {
            scene.classList.add('zoom-in');
        }, 740);

        // 3. A los 6.6s (justo al terminar la apertura de 6.5s), fundido hacia la web (1.8s en CSS)
        setTimeout(() => {
            overlay.classList.add('is-done');
            document.body.classList.remove('gatefold-locked');
            if (xwing) {
                xwing.style.animationPlayState = 'running';
            }
        }, 3600);

        // 4. A los 8.6s (200ms tras acabar el fundido de 1.8s), ocultamos el overlay
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 8600);
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

// =========================================
// EASTER EGG (2 NIVELES - SOLO MÓVIL): "LA FUERZA NO ME ACOMPAÑA"
// =========================================

function isMobileOrTabletView() {
        const ua = navigator.userAgent || '';
        const platform = navigator.platform || '';
        const maxTouch = navigator.maxTouchPoints || 0;

        // Detecta iPhone, iPod, iPad (incluidos iPadOS modernos con MacIntel + touch) y Android/móviles/tablets
        const isAppleMobileOrTablet =
            /iPhone|iPod|iPad/i.test(ua) ||
            (platform === 'MacIntel' && maxTouch > 1);

        const isAndroidOrMobileUA =
            /Android|webOS|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua);

        const hasCoarsePointer =
            window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

        return (isAppleMobileOrTablet || isAndroidOrMobileUA) && (hasCoarsePointer || maxTouch > 0);
    }

(function () {
    const modal = document.getElementById('forceEasterEggModal');
    const badgeEl = modal?.querySelector('.easter-badge');
    const titleEl = document.getElementById('easterModalTitle');
    const textEl = modal?.querySelector('.easter-modal-text');
    const confirmDeclineBtn = document.getElementById('confirmDeclineBtn');
    const reconsiderBtn = document.getElementById('reconsiderBtn');

    if (!modal || !confirmDeclineBtn || !reconsiderBtn) return;

    let lastDeclineInput = null;
    let stage = 1; // 1 = primer aviso, 2 = segundo vacile al insistir
    let closeTimer = null;

    const stages = {
        1: {
            badge: 'TRANSMISIÓN INTERCEPTADA',
            title: '¿Seguro, padawan?',
            text: '¿De verdad vas a rechazar la invitación? El lado oscuro del sofá no compensa... ¿estás seguro de que no te vas a pasar aunque sea a brindar?',
            confirmLabel: 'Sí, lo tengo clarísimo',
            reconsiderLabel: 'Vale, me lo pienso mejor'
        },
        2: {
            badge: 'ALERTA DE NIVEL SITH',
            title: '¿En serio? ¿Última palabra?',
            text: 'Ojo, que esto queda registrado en los archivos del Consejo Jedi y en el Pensadero... ¿segurísimo de que no hay ninguna poción multijugos o salto hiperespacial que te salve?',
            confirmLabel: 'Acepto las consecuencias',
            reconsiderLabel: 'De acuerdo, me rindo, voy'
        }
    };

    function getOptionLabelText(el) {
        if (!el) return '';
        return (
            (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) ||
            el.closest('label')?.textContent ||
            ''
        )
            .trim()
            .toLowerCase();
    }

    function isDeclineOption(el) {
        if (!el) return false;
        const val = (el.value || '').toLowerCase();
        const labelText = getOptionLabelText(el);

        return (
            val.includes('fuerza') ||
            val.includes('lamentablemente') ||
            val.includes('no_asiste') ||
            val.includes('declinar') ||
            val === 'no' ||
            labelText.includes('fuerza no me acompaña') ||
            labelText.includes('lamentablemente') ||
            labelText.startsWith('no')
        );
    }

    function findYesOption(declineEl) {
        const container = declineEl?.closest('form, .rsvp-card, section') || document;
        const radios = Array.from(container.querySelectorAll('input[type="radio"]'));

        const group = declineEl?.name
            ? radios.filter((r) => r.name === declineEl.name)
            : radios;

        return (
            group.find((r) => r !== declineEl && !isDeclineOption(r)) || null
        );
    }

    function selectRadioOption(radioEl) {
        if (!radioEl) return;
        radioEl.checked = true;
        radioEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function applyStage(currentStage) {
        const data = stages[currentStage] || stages[1];
        if (badgeEl) badgeEl.textContent = data.badge;
        if (titleEl) titleEl.textContent = data.title;
        if (textEl) textEl.textContent = data.text;
        confirmDeclineBtn.textContent = data.confirmLabel;
        reconsiderBtn.textContent = data.reconsiderLabel;
    }

    function openModal(triggerInput) {
        if (!isMobileOrTabletView()) return;

        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }

        lastDeclineInput = triggerInput || null;
        stage = 1;
        applyStage(stage);
        modal.hidden = false;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('is-open');
            });
        });
    }

    function closeModal() {
        modal.classList.remove('is-open');

        if (closeTimer) {
            clearTimeout(closeTimer);
        }

        closeTimer = setTimeout(() => {
            modal.hidden = true;
            stage = 1;
            closeTimer = null;
        }, 280);
    }

    document.addEventListener('change', function (e) {
        if (!isMobileOrTabletView()) return;

        const target = e.target;
        if (!target || !target.matches('input[type="radio"]')) return;

        if (isDeclineOption(target)) {
            openModal(target);
        }
    });

    confirmDeclineBtn.addEventListener('click', function () {
        if (stage === 1) {
            stage = 2;
            applyStage(2);
            if (lastDeclineInput && lastDeclineInput.type === 'radio') {
                lastDeclineInput.checked = true;
            }
        } else {
            if (lastDeclineInput && lastDeclineInput.type === 'radio') {
                lastDeclineInput.checked = true;
            }
            closeModal();
        }
    });

    reconsiderBtn.addEventListener('click', function () {
        const yesInput = findYesOption(lastDeclineInput);
        if (yesInput) {
            selectRadioOption(yesInput);
        } else if (lastDeclineInput && lastDeclineInput.type === 'radio') {
            lastDeclineInput.checked = false;
            lastDeclineInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        closeModal();
    });

    modal.addEventListener('click', function (e) {
        if (e.target.dataset.closeModal === 'true') {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
})();