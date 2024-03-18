// Instanciar el objeto cronómetro
const cronometroDisplay = document.getElementById("counter-display");
const crono = new Crono(cronometroDisplay);

// Variables para la clave secreta y el estado del juego
let secretKey = [];
let gameStarted = false;
let gameFinished = false;
let guessedState = [];      // almacenar el estado de cada dígito (adivinado o no)

// Obtener elementos del DOM
const secretKeyDisplay = document.getElementById("secret-key-display");
const numberButtons = document.querySelectorAll(".numberButton");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");


// Función para generar la clave secreta aleatoria y el arreglo de estado
function generateSecretKey() {
    secretKey = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    guessedState = Array(secretKey.length).fill(false); // Inicializar todos los dígitos como no adivinados
    updateSecretDisplay();
}

// Función para actualizar el display de la clave secreta
function updateSecretDisplay() {
    let displayHTML = "";
    for (let i = 0; i < secretKey.length; i++) {
        const digit = secretKey[i];
        if (guessedState[i]) {
            // Si el dígito está adivinado, mostrar en verde
            displayHTML += '<span style="color: #03c8a8;">' + secretKey[i] + '</span>';
        } else {
            // De lo contrario, mostrar en rojo
            displayHTML += '<span style="color: #FF6347;">*</span>';
        }
    }
    secretKeyDisplay.innerHTML = displayHTML;
}

// Función para comprobar si el dígito pulsado está en la clave secreta
function checkGuess(guess) {
    let found = false;
    for (let i = 0; i < secretKey.length; i++) {
        if (secretKey[i] === guess && !guessedState[i]) {
            guessedState[i] = true; // Marcar el dígito como adivinado
            found = true;
            break;
        }
    }
    if (found) {
        updateSecretDisplay(); // Actualizar el display solo si se encuentra el número
    }
    if (guessedState.every(state => state) && !gameFinished) {
        crono.stop();
        gameFinished = true;
    }
}


// Event listener para los botones de números
numberButtons.forEach(button => {
    button.addEventListener("click", function () {
        if (!gameStarted) {
            crono.start();
            gameStarted = true;
        }
        const guess = parseInt(button.textContent);
        checkGuess(guess);
        if (gameFinished) {
            crono.stop();
        }
    });
});

// Event listener para el botón Start
//startButton.addEventListener("click", function() {
//    if (!gameStarted) {
//        crono.start();
//        gameStarted = true;
//    }
//});

startButton.onclick = function () {
    if (!gameStarted) {
        crono.start();
        gameStarted = true;
    }
};

// Event listener para el botón Stop
//stopButton.addEventListener("click", function() {
//    crono.stop();
//    gameStarted = false;
//});

stopButton.onclick = () => {
    crono.stop();
    gameStarted = false;
};

// Event listener para el botón Reset
resetButton.addEventListener("click", function () {
    crono.stop();
    crono.reset();
    gameStarted = false;
    gameFinished = false;
    generateSecretKey();
    console.log("Clave secreta nueva: " + secretKey);
});

//resetButton.onclick = function() {
//    crono.stop();
//    crono.reset();
//    gameStarted = false;
//    gameFinished = false;
//    generateSecretKey();
//    console.log("Clave secreta nueva: " + secretKey);
//};

// Generar la clave secreta al cargar la página
generateSecretKey();
console.log("Clave secreta: " + secretKey);

