document.addEventListener("DOMContentLoaded", function() {
    // Instanciar el objeto cronómetro
    const cronometroDisplay = document.getElementById("counter-display");
    const crono = new Crono(cronometroDisplay);

    // Variables para la clave secreta y el estado del juego
    let secretKey = [];
    let gameStarted = false;
    let gameFinished = false;

    // Colores para los números de la clave secreta y los aciertos
    const secretColor = "#FF6347"; // Rojo
    const correctColor = "#00FF00"; // Verde

    // Obtener elementos del DOM
    const secretKeyDisplay = document.getElementById("secret-key-display");
    const numberButtons = document.querySelectorAll(".number-button");
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const resetButton = document.getElementById("reset-button");

    // Función para generar la clave secreta aleatoria
    function generateSecretKey() {
        secretKey = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
        secretKeyDisplay.textContent = secretKey.map(() => "*").join("");
        secretKeyDisplay.style.color = secretColor;
    }

    // Función para comprobar si el dígito pulsado está en la clave secreta
    function checkGuess(guess) {
        const index = secretKey.indexOf(guess);
        if (index !== -1) {
            secretKeyDisplay.textContent = secretKeyDisplay.textContent.substring(0, index) +
                                            secretKey[index] +
                                            secretKeyDisplay.textContent.substring(index + 1);
            secretKeyDisplay.children[index].style.color = correctColor;
            secretKey.splice(index, 1);
            if (secretKey.length === 0 && !gameFinished) {
                crono.stop();
                gameFinished = true;
            }
        }
    }

    // Event listener para los botones de números
    numberButtons.forEach(button => {
        button.addEventListener("click", function() {
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
    startButton.addEventListener("click", function() {
        if (!gameStarted) {
            crono.start();
            gameStarted = true;
        }
    });

    // Event listener para el botón Stop
    stopButton.addEventListener("click", function() {
        crono.stop();
        gameStarted = false;
    });

    // Event listener para el botón Reset
    resetButton.addEventListener("click", function() {
        crono.stop();
        crono.reset();
        gameStarted = false;
        gameFinished = false;
        generateSecretKey();
        console.log("Clave secreta nueva: " + secretKey);
    });

    // Generar la clave secreta al cargar la página
    generateSecretKey();
    console.log("Clave secreta: " + secretKey);
});
