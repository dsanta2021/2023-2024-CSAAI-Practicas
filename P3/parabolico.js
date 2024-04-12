// Instanciar el objeto cronómetro
var cronometroDisplay = document.getElementById("counter-display");
var crono = new Crono(cronometroDisplay);

// Audios
const boing_audio = new Audio('boing.mp3');
const win_audio = new Audio('win.mp3');
const lanzar_audio = new Audio('lanzar.mp3');
const coin_audio = new Audio('coin.mp3');

// Obtención del canvas y de los elementos HTML a usar
const canvas = document.getElementById("canvas");
const ball = document.getElementById("ball");
const basket = document.getElementById("basket");
const basketball = document.getElementById("basketball");
const btnLanzar = document.getElementById("btnLanzar");
const btnIniciar = document.getElementById("btnIniciar");
const angleSldr = document.getElementById("angleSlider");
const speedSldr = document.getElementById("speedSlider");
const angleVal = document.getElementById("angleValue");
const speedVal = document.getElementById("speedValue");
const timerDisplay = document.getElementById("timer");

const ctx = canvas.getContext("2d");

// Canvas dimensions
canvas.width = 850;
canvas.height = 450;

// Declaración de variables y objetos
let xop = 50;        // Coordenadas iniciales del proyectil
let yop = 35;
let xp = xop;
let yp = yop;
let objH, objW;      // Altura y anchura del proyectil

let xomin = 250;    // Coordenadas iniciales del objetivo
let xomax = 800;
let xo = getRandomXO(xomin, xomax); // Posición aleatoria del objetivo
let yo = 420;
let radius = 25;      // Radio del objetivo

let velp = speedSldr.value;      // Velocidad del proyectil
let ang = angleSldr.value;    // Ángulo de disparo en grados
const grav = 9.8;       // Aceleración de la gravedad
let time = 0;     // Tiempo de vuelo proyectil

let controlBtn = false; // Control de botón lanzar
let win = false;  // Control victoria
let colision = false; // Control  colisión
let colisionX, colisionY;   // Coordenadas de colisión


// Funciones auxiliares
function getRandomXO(min, max) {
    return Math.random() * (max - min) + min;
}

// Función para pintar el proyectil
function dibujarP(x, y, lx, ly) {
    objH = y;
    objW = x;
    ctx.beginPath();
    ctx.rect(x, y, lx, ly);
    ctx.drawImage(ball, x, y, 30, 30)
    ctx.closePath();
}

// Función para pintar el objetivo
function dibujarO(x, y, img) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.drawImage(img, x - 25, y - 50, 75, 75);
    ctx.closePath();
}

function dibujarTiroP() {
    if (angleSldr.value == 90) {
        ang = 89;   // Evita el bug del 90
    }

    xp = xop + velp * Math.cos(ang * Math.PI / 180) * time; // Posición x proyectil
    yp = yop + velp * Math.sin(ang * Math.PI / 180) * time - (0.5 * grav * time * time); // Posición y proyectil
    time += 0.1; 
}

// Función principal de actualización
function lanzar() {
    // Bloquear el botón de lanzar
    if (controlBtn == false) {
        controlBtn = true;
    }

    // Verificación de colisión con el canvas
    if (xp + 20 > canvas.width || xp < 0 || yp > canvas.height || yp - 20 < 0) {
        boing_audio.currentTime = 0;
        boing_audio.play();
        colision = true;
        win = false;
    }

    // Verificación colisión proyectil-objetivo
    colisionX = xp + 25;
    colisionY = (canvas.height - yp) + 25;
    distancia = Math.sqrt((xo - colisionX) * (xo - colisionX) + (yo - colisionY) * (yo - colisionY));
    if (distancia < radius) {
        win_audio.currentTime = 0;
        win_audio.play();
        colision = true;
        win = true;
    }

    dibujarTiroP();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarO(xo, yo, basket);
    dibujarP(xp, canvas.height - yp, 50, 50);

    // Verificación de si se debe seguir el bucle
    if (colision == false) {
        requestAnimationFrame(lanzar);
    }

    // Verificar perder
    if (colision == true && win == false) {
        crono.stop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "110px Times New Roman";
        ctx.fillStyle = 'red'
        ctx.fillText("Has Perdido", 170, 250);
    }

    // Verificar ganar
    if (colision == true && win == true) {
        crono.stop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarO(xo, yo, basketball)
        ctx.font = "110px Times New Roman";
        ctx.fillStyle = 'green'
        ctx.fillText("Has Ganado", 170, 250);
    }
}

// Eventos
document.onkeydown = function (ev) {
    switch (ev.key) {
        case " ":
            if (!controlBtn) {
                lanzar_audio.currentTime = 0;
                lanzar_audio.play();
                crono.start();
                lanzar();
                controlBtn = true;
            }
    }
};

btnLanzar.onclick = () => {
    if (!controlBtn) {
        lanzar_audio.currentTime = 0;
        lanzar_audio.play();
        crono.start();
        lanzar();
        controlBtn = true;
    }

};

btnIniciar.onclick = () => {
    coin_audio.currentTime = 0;
    coin_audio.play();
    location.reload();
};

angleSldr.oninput = () => {
    angulo = angleSldr.value * Math.PI / 180;
    angleVal.textContent = angleSldr.value + '°';
}

speedSldr.oninput = () => {
    velp = speedSldr.value;
    speedVal.textContent = velp + ' m/s';
}

ball.onload = () => {
    // Insertar imagen en el canvas cuando esté cargada
    const ballWidth = 30;
    const ballHeight = 30;
    ctx.drawImage(ball, xop, canvas.height - yop, ballWidth, ballHeight);
};

basket.onload = () => {
    // Insertar imagen en el canvas cuando esté cargada
    const basketWidth = 75;
    const basketHeight = 75;
    ctx.drawImage(basket, xo - 25, yo - 50, basketWidth, basketHeight);
};

// Inicialización
dibujarP(xop, canvas.height - yop, 50, 50); // Pintar el proyectil
dibujarO(xo, yo, basket); // Pintar el objetivo
