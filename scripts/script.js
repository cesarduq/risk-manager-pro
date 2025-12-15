// --- Elementos del DOM ---
const inputs = {
    capital: document.getElementById('capital'),
    stoploss: document.getElementById('stoploss'),
    porcentaje: document.getElementById('porcentaje')
};

const outputs = {
    apalancamiento: document.getElementById('apalancamiento'),
    capitalMeter: document.getElementById('capitalMeter'),
    perdida: document.getElementById('perdida'),
    ganancia: document.getElementById('ganancia'),
    livesContainer: document.getElementById('livesContainer'),
    livesText: document.getElementById('livesText')
};

const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const stratBtns = document.querySelectorAll('.strat-btn');

// --- Lógica de Negocio ---
function calcular() {
    const SL = parseFloat(inputs.stoploss.value);
    const CAPITAL = parseFloat(inputs.capital.value);
    const PORCENTAJE = parseFloat(inputs.porcentaje.value);

    if (isNaN(SL) || isNaN(CAPITAL) || isNaN(PORCENTAJE) || SL === 0) {
        outputs.apalancamiento.textContent = "X0";
        return;
    }

    // 1. Apalancamiento: R = 7.5 / SL
    let R = 7.5 / SL;
    outputs.apalancamiento.textContent = 'X' + Math.floor(R);

    // 2. Capital a Meter: Leverage * (%/100) * Capital
    let positionSize = R * (PORCENTAJE / 100) * CAPITAL;
    outputs.capitalMeter.textContent = positionSize.toFixed(2);

    // 3. Pérdida: SL * PositionSize / 100
    const perdida = SL * positionSize / 100;
    outputs.perdida.textContent = perdida.toFixed(2);

    // 4. Ganancia: Pérdida * 2
    const ganancia = perdida * 2;
    outputs.ganancia.textContent = ganancia.toFixed(2);
}

// --- Estrategias y Vidas ---
function setStrategy(percent, lives, element) {
    inputs.porcentaje.value = percent;
    
    // UI Botones (buscamos el botón padre si se hace click en el span interno)
    stratBtns.forEach(btn => btn.classList.remove('active'));
    
    // Aseguramos que 'element' sea el botón y no un hijo
    const targetBtn = element.closest('.strat-btn');
    if(targetBtn) targetBtn.classList.add('active');

    updateLives(lives);
    calcular();
}

function updateLives(count) {
    outputs.livesContainer.innerHTML = '';
    for(let i=0; i<4; i++) {
        const div = document.createElement('div');
        div.className = i < count ? 'life-pill active' : 'life-pill';
        outputs.livesContainer.appendChild(div);
    }
    outputs.livesText.textContent = `${count} Intento${count !== 1 ? 's' : ''}`;
}

// --- Tema Dark/Light ---
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    
    if(newTheme === 'dark'){
        themeIcon.className = 'ri-sun-line';
    } else {
        themeIcon.className = 'ri-moon-line';
    }
    localStorage.setItem('theme', newTheme);
}

// --- Inicialización ---

// Event Listeners
Object.values(inputs).forEach(input => input.addEventListener('input', calcular));
themeBtn.addEventListener('click', toggleTheme);

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'dark'; // Default Dark
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';

// Inicializar valores
updateLives(2);
calcular();

// FECHA AUTOMÁTICA FOOTER (Año actual y futuros)
document.getElementById('year').textContent = new Date().getFullYear();

// Exponer funcion global
window.setStrategy = setStrategy;