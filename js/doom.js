// // =========================================
// // EASTER EGG: MINI-DOOM RAYCASTER EN CANVAS
// // =========================================
// (function () {
//     let modalEl = null;
//     let typedBuffer = '';
//     let cleanupGame = null;

//     const MAP = [
//         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//         [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//         [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
//         [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
//         [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
//         [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
//         [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
//         [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//         [1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
//         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     ];

//     function startMiniDoom(stageEl) {
//         stageEl.innerHTML = `
//             <div class="doom-hud" id="doomHud">
//                 <span>SALUD: <strong id="doomHp">100</strong></span>
//                 <span>BAJAS: <strong id="doomKills">0</strong></span>
//             </div>
//             <div class="doom-crosshair" aria-hidden="true">+</div>
//             <canvas id="doomCanvas" width="640" height="400"></canvas>
//         `;

//         const canvas = stageEl.querySelector('#doomCanvas');
//         const ctx = canvas.getContext('2d');
//         const hpEl = stageEl.querySelector('#doomHp');
//         const killsEl = stageEl.querySelector('#doomKills');

//         const player = {
//             x: 1.5,
//             y: 1.5,
//             dir: 0.4,
//             hp: 100,
//             kills: 0,
//             shootCooldown: 0,
//             flashTimer: 0,
//         };

//         const initialEnemies = [
//             { x: 4.5, y: 2.5, alive: true },
//             { x: 7.5, y: 3.5, alive: true },
//             { x: 3.5, y: 6.5, alive: true },
//             { x: 8.2, y: 7.5, alive: true },
//             { x: 5.5, y: 5.0, alive: true },
//         ];
//         const enemies = initialEnemies.map((e) => ({ ...e }));

//         const keys = new Set();

//         function isWall(nx, ny) {
//             const mx = Math.floor(nx);
//             const my = Math.floor(ny);
//             if (my < 0 || my >= MAP.length || mx < 0 || mx >= MAP[0].length) return true;
//             return MAP[my][mx] === 1;
//         }

//         function shoot() {
//             if (player.shootCooldown > 0 || player.hp <= 0) return;
//             player.shootCooldown = 14;
//             player.flashTimer = 5;

//             // Comprueba si algún enemigo cae cerca del centro de visión
//             let hitEnemy = null;
//             let bestDist = Infinity;

//             enemies.forEach((en) => {
//                 if (!en.alive) return;
//                 const dx = en.x - player.x;
//                 const dy = en.y - player.y;
//                 const dist = Math.hypot(dx, dy);
//                 let angleDiff = Math.atan2(dy, dx) - player.dir;
//                 while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
//                 while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

//                 if (Math.abs(angleDiff) < 0.16 && dist < bestDist) {
//                     bestDist = dist;
//                     hitEnemy = en;
//                 }
//             });

//             if (hitEnemy) {
//                 hitEnemy.alive = false;
//                 player.kills += 1;
//                 if (killsEl) killsEl.textContent = String(player.kills);

//                 // Si eliminan a todos, reaparecen tras un respiro
//                 if (enemies.every((e) => !e.alive)) {
//                     setTimeout(() => {
//                         enemies.forEach((e, idx) => {
//                             e.x = initialEnemies[idx].x;
//                             e.y = initialEnemies[idx].y;
//                             e.alive = true;
//                         });
//                     }, 900);
//                 }
//             }
//         }

//         function onKeyDown(e) {
//             if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
//                 e.preventDefault();
//             }
//             keys.add(e.key.toLowerCase());
//             if (e.code === 'Space') {
//                 shoot();
//             }
//         }

//         function onKeyUp(e) {
//             keys.delete(e.key.toLowerCase());
//         }

//         function onCanvasClick() {
//             shoot();
//         }

//         window.addEventListener('keydown', onKeyDown, { passive: false });
//         window.addEventListener('keyup', onKeyUp);
//         canvas.addEventListener('click', onCanvasClick);

//         let rafId = null;
//         let lastTime = performance.now();

//         function update(dt) {
//             if (player.shootCooldown > 0) player.shootCooldown -= 1;
//             if (player.flashTimer > 0) player.flashTimer -= 1;

//             if (player.hp <= 0) return;

//             const moveSpeed = 3.2 * dt;
//             const rotSpeed = 2.3 * dt;

//             if (keys.has('arrowleft') || keys.has('a')) player.dir -= rotSpeed;
//             if (keys.has('arrowright') || keys.has('d')) player.dir += rotSpeed;

//             let moveStep = 0;
//             if (keys.has('arrowup') || keys.has('w')) moveStep += moveSpeed;
//             if (keys.has('arrowdown') || keys.has('s')) moveStep -= moveSpeed;

//             if (moveStep !== 0) {
//                 const nextX = player.x + Math.cos(player.dir) * moveStep;
//                 const nextY = player.y + Math.sin(player.dir) * moveStep;
//                 if (!isWall(nextX, player.y)) player.x = nextX;
//                 if (!isWall(player.x, nextY)) player.y = nextY;
//             }

//             // Enemigos avanzan suavemente hacia el jugador
//             enemies.forEach((en) => {
//                 if (!en.alive) return;
//                 const dx = player.x - en.x;
//                 const dy = player.y - en.y;
//                 const dist = Math.hypot(dx, dy);

//                 if (dist > 0.75) {
//                     const step = 1.05 * dt;
//                     const nx = en.x + (dx / dist) * step;
//                     const ny = en.y + (dy / dist) * step;
//                     if (!isWall(nx, en.y)) en.x = nx;
//                     if (!isWall(en.x, ny)) en.y = ny;
//                 } else {
//                     player.hp = Math.max(0, player.hp - Math.round(14 * dt));
//                     if (hpEl) hpEl.textContent = String(player.hp);
//                 }
//             });
//         }

//         function render() {
//             const w = canvas.width;
//             const h = canvas.height;
//             const halfH = h / 2;

//             // Techo y suelo en clave oscura/sepia
//             ctx.fillStyle = '#181310';
//             ctx.fillRect(0, 0, w, halfH);

//             ctx.fillStyle = '#2a2019';
//             ctx.fillRect(0, halfH, w, halfH);

//             const fov = Math.PI / 3;
//             const zBuffer = new Array(w).fill(Infinity);

//             for (let col = 0; col < w; col++) {
//                 const rayAngle = player.dir - fov / 2 + (col / w) * fov;
//                 const eyeX = Math.cos(rayAngle);
//                 const eyeY = Math.sin(rayAngle);

//                 let dist = 0;
//                 const stepSize = 0.03;
//                 let hit = false;

//                 while (!hit && dist < 14) {
//                     dist += stepSize;
//                     const rx = player.x + eyeX * dist;
//                     const ry = player.y + eyeY * dist;
//                     if (isWall(rx, ry)) {
//                         hit = true;
//                     }
//                 }

//                 const perpDist = Math.max(0.1, dist * Math.cos(rayAngle - player.dir));
//                 zBuffer[col] = perpDist;

//                 const wallHeight = Math.min(h * 1.4, h / perpDist);
//                 const top = Math.floor(halfH - wallHeight / 2);

//                 const shade = Math.max(35, Math.min(210, Math.floor(215 / (1 + perpDist * 0.24))));
//                 ctx.fillStyle = `rgb(${shade}, ${Math.floor(shade * 0.78)}, ${Math.floor(shade * 0.48)})`;
//                 ctx.fillRect(col, top, 1, wallHeight);
//             }

//             // Dibujar enemigos ordenados por distancia (más lejanos primero)
//             const sortedEnemies = enemies
//                 .filter((e) => e.alive)
//                 .map((e) => ({
//                     ...e,
//                     dist: Math.hypot(e.x - player.x, e.y - player.y),
//                 }))
//                 .sort((a, b) => b.dist - a.dist);

//             sortedEnemies.forEach((en) => {
//                 const dx = en.x - player.x;
//                 const dy = en.y - player.y;
//                 let angleDiff = Math.atan2(dy, dx) - player.dir;
//                 while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
//                 while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

//                 if (Math.abs(angleDiff) < fov * 0.65 && en.dist > 0.25) {
//                     const screenX = Math.floor((0.5 + angleDiff / fov) * w);
//                     const size = Math.min(h * 0.9, h / en.dist);
//                     const top = Math.floor(halfH - size * 0.45);
//                     const left = Math.floor(screenX - size * 0.35);

//                     if (screenX >= 0 && screenX < w && en.dist < zBuffer[screenX]) {
//                         ctx.fillStyle = '#8f2424';
//                         ctx.fillRect(left, top, size * 0.7, size * 0.75);

//                         ctx.fillStyle = '#e8c476';
//                         ctx.fillRect(left + size * 0.16, top + size * 0.2, size * 0.12, size * 0.12);
//                         ctx.fillRect(left + size * 0.42, top + size * 0.2, size * 0.12, size * 0.12);
//                     }
//                 }
//             });

//             // Destello de disparo
//             if (player.flashTimer > 0) {
//                 ctx.fillStyle = 'rgba(255, 220, 140, 0.18)';
//                 ctx.fillRect(0, 0, w, h);
//             }

//             // Arma en primer plano abajo a la derecha
//             const gunW = 110;
//             const gunH = 86;
//             const recoilY = player.shootCooldown > 8 ? 10 : 0;
//             ctx.fillStyle = '#3b322c';
//             ctx.fillRect(w * 0.58, h - gunH + recoilY, gunW, gunH);
//             ctx.fillStyle = '#b89552';
//             ctx.fillRect(w * 0.58 + 38, h - gunH - 18 + recoilY, 34, 24);

//             if (player.hp <= 0) {
//                 ctx.fillStyle = 'rgba(15, 10, 8, 0.72)';
//                 ctx.fillRect(0, 0, w, h);
//                 ctx.fillStyle = '#fcfaf5';
//                 ctx.font = 'bold 26px monospace';
//                 ctx.textAlign = 'center';
//                 ctx.fillText('HAS CAÍDO EN LA ARENA', w / 2, halfH - 8);
//                 ctx.font = '14px monospace';
//                 ctx.fillStyle = '#b89552';
//                 ctx.fillText('Cierra y vuelve a escribir "doom" para reintentar', w / 2, halfH + 22);
//             }
//         }

//         function loop(now) {
//             const dt = Math.min(0.05, (now - lastTime) / 1000);
//             lastTime = now;
//             update(dt);
//             render();
//             rafId = requestAnimationFrame(loop);
//         }

//         rafId = requestAnimationFrame(loop);

//         return () => {
//             if (rafId) cancelAnimationFrame(rafId);
//             window.removeEventListener('keydown', onKeyDown);
//             window.removeEventListener('keyup', onKeyUp);
//             canvas.removeEventListener('click', onCanvasClick);
//         };
//     }

//     function ensureDoomModal() {
//         if (modalEl) return modalEl;

//         modalEl = document.createElement('div');
//         modalEl.id = 'doomEasterEggModal';
//         modalEl.className = 'doom-modal';
//         modalEl.setAttribute('role', 'dialog');
//         modalEl.setAttribute('aria-modal', 'true');
//         modalEl.setAttribute('aria-label', 'Easter egg DOOM');
//         modalEl.hidden = true;

//         modalEl.innerHTML = `
//             <div class="doom-window">
//                 <div class="doom-header">
//                     <span>E1M1 · MODO SECRETO ACTIVADO</span>
//                     <button type="button" class="doom-close-btn" id="closeDoomModalBtn">Cerrar (ESC)</button>
//                 </div>
//                 <div class="doom-stage" id="doomStage"></div>
//                 <div class="doom-footer">
//                     WASD / Flechas para moverte y girar · Espacio o clic para disparar · ESC para salir
//                 </div>
//             </div>
//         `;

//         document.body.appendChild(modalEl);

//         modalEl.addEventListener('click', (e) => {
//             if (e.target === modalEl || e.target.id === 'closeDoomModalBtn') {
//                 closeDoomModal();
//             }
//         });

//         return modalEl;
//     }

//     function openDoomModal() {
//         const modal = ensureDoomModal();
//         const stage = modal.querySelector('#doomStage');

//         if (typeof cleanupGame === 'function') {
//             cleanupGame();
//             cleanupGame = null;
//         }

//         if (stage) {
//             cleanupGame = startMiniDoom(stage);
//         }

//         modal.hidden = false;
//         requestAnimationFrame(() => {
//             modal.classList.add('is-open');
//         });
//     }

//     function closeDoomModal() {
//         if (!modalEl || modalEl.hidden) return;
//         const stage = modalEl.querySelector('#doomStage');
//         modalEl.classList.remove('is-open');

//         if (typeof cleanupGame === 'function') {
//             cleanupGame();
//             cleanupGame = null;
//         }

//         setTimeout(() => {
//             modalEl.hidden = true;
//             if (stage) stage.innerHTML = '';
//         }, 260);
//     }

//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape' && modalEl && !modalEl.hidden) {
//             closeDoomModal();
//             return;
//         }

//         if (e.altKey && e.key.toLowerCase() === 'd') {
//             e.preventDefault();
//             if (modalEl && !modalEl.hidden) {
//                 closeDoomModal();
//             } else {
//                 openDoomModal();
//             }
//             return;
//         }

//         const activeTag = document.activeElement?.tagName?.toLowerCase();
//         if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
//             return;
//         }

//         if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
//             typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-4);
//             if (typedBuffer === 'doom') {
//                 typedBuffer = '';
//                 openDoomModal();
//             }
//         }
//     });
// })();


// =========================================
// EASTER EGG: DOOM EXTERNO + DISPARADOR DISCRETO
// =========================================
(function () {
    // Pon aquí la URL o carpeta local de tu instancia (ej.: 'doom/index.html' o tu despliegue)
    const DOOM_EMBED_URL = 'doom/dist/index.html';
    // Selector discreto existente en tu web para activar con 5 clics/toques rápidos
    // Ajusta el selector a algún detalle o pie de tu invitación si quieres afinarlo
    const DOOM_SECRET_TRIGGER_SELECTOR = 'footer, .ornament-corner, .seal, body';
    const SECRET_TAPS_REQUIRED = 5;
    const SECRET_TAP_WINDOW_MS = 1500;

    let modalEl = null;
    let typedBuffer = '';
    let tapCount = 0;
    let firstTapTime = 0;

    function ensureDoomModal() {
        if (modalEl) return modalEl;

        modalEl = document.createElement('div');
        modalEl.id = 'doomEasterEggModal';
        modalEl.className = 'doom-modal';
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-label', 'Easter egg DOOM');
        modalEl.hidden = true;

        modalEl.innerHTML = `
            <div class="doom-window">
                <div class="doom-header">
                    <span>E1M1 · MODO SECRETO ACTIVADO</span>
                    <button type="button" class="doom-close-btn" id="closeDoomModalBtn">Cerrar (ESC)</button>
                </div>
                <div class="doom-stage" id="doomStage"></div>
                <div class="doom-footer">
                    Atajo: <strong>Alt + D</strong> · Escribe <strong>doom</strong> · 5 toques ocultos · <strong>ESC</strong> para salir
                </div>
            </div>
        `;

        document.body.appendChild(modalEl);

        modalEl.addEventListener('click', (e) => {
            if (e.target === modalEl || e.target.id === 'closeDoomModalBtn') {
                closeDoomModal();
            }
        });

        return modalEl;
    }

    function openDoomModal() {
        const modal = ensureDoomModal();
        const stage = modal.querySelector('#doomStage');

        if (stage) {
            if (DOOM_EMBED_URL) {
                stage.innerHTML = `<iframe src="${DOOM_EMBED_URL}" allow="autoplay; fullscreen; gamepad" allowfullscreen></iframe>`;
            } else {
                stage.innerHTML = `
                    <div style="padding: 24px; text-align: center; max-width: 440px;">
                        <p style="color: var(--accent-gold, #b89552); font-weight: 600; margin-bottom: 8px;">
                            CONSOLA DOOM LISTA
                        </p>
                        <p style="font-size: 0.88rem; line-height: 1.6; opacity: 0.85;">
                            Añade la ruta o URL de tu instancia en <code>DOOM_EMBED_URL</code> para cargarla al abrir el modal.
                        </p>
                    </div>
                `;
            }
        }

        modal.hidden = false;
        requestAnimationFrame(() => {
            modal.classList.add('is-open');
        });
    }

    function closeDoomModal() {
        if (!modalEl || modalEl.hidden) return;
        const stage = modalEl.querySelector('#doomStage');
        modalEl.classList.remove('is-open');

        setTimeout(() => {
            modalEl.hidden = true;
            if (stage) stage.innerHTML = '';
        }, 260);
    }

    // Disparador discreto por 5 clics/toques rápidos en el objetivo elegido
    document.addEventListener('pointerdown', (e) => {
        if (modalEl && !modalEl.hidden) return;
        if (e.target && e.target.closest('#doomEasterEggModal, #stardustToggleBtn, form, button, a, input, select, textarea')) {
            return;
        }

        const triggerTarget = e.target && e.target.closest(DOOM_SECRET_TRIGGER_SELECTOR);
        if (!triggerTarget) return;

        const now = performance.now();
        if (tapCount === 0 || now - firstTapTime > SECRET_TAP_WINDOW_MS) {
            tapCount = 1;
            firstTapTime = now;
            return;
        }

        tapCount += 1;
        if (tapCount >= SECRET_TAPS_REQUIRED) {
            tapCount = 0;
            firstTapTime = 0;
            openDoomModal();
        }
    });

    // Atajos de teclado: Alt + D o escribir "doom"
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEl && !modalEl.hidden) {
            closeDoomModal();
            return;
        }

        if (e.altKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            if (modalEl && !modalEl.hidden) {
                closeDoomModal();
            } else {
                openDoomModal();
            }
            return;
        }

        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
            return;
        }

        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-4);
            if (typedBuffer === 'doom') {
                typedBuffer = '';
                openDoomModal();
            }
        }
    });
})();