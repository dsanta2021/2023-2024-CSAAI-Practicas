document.addEventListener('DOMContentLoaded', function () {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const usernameInput = document.getElementById('username-input');
    const usernameField = document.getElementById('username');
    const submitUsernameBtn = document.getElementById('submit-username');
    const boardSize = document.getElementById('board-size');
    const userList = document.getElementById('user-list');
    const gameMode = document.getElementById('game-mode');
    const fruits = document.getElementById('fruits-btn');
    const zodiac = document.getElementById('zodiac-btn');

    var boardTam = 0;
    var mode = '';

    // Lógica para buscar un nombre de usuario
    function searchUsername(username) {
        const usernames = Array.from(userList.getElementsByTagName('li')).map(li => li.textContent.trim());
        return usernames.includes(username);
    }

    // Lógica para agregar un nuevo nombre de usuario
    function addUsername(username) {
        const li = document.createElement('li');
        li.textContent = username;
        userList.appendChild(li);
    }

    // Lógica cuando se hace clic en "Sí"
    yesBtn.addEventListener('click', function () {
        console.log(yesBtn.textContent);
        usernameInput.style.display = 'block';
    });

    // Lógica cuando se hace clic en "No"
    noBtn.addEventListener('click', function () {
        console.log(noBtn.textContent);
        usernameInput.style.display = 'block';
    });

    // Lógica para enviar el nombre de usuario
    submitUsernameBtn.addEventListener('click', function () {
        var username = usernameField.value;
        // Aquí se verifica si el nombre de usuario existe en la base de datos
        if (searchUsername(username) & yesBtn.textContent == 'Si') {
            boardSize.style.display = 'block';
        } else {
            console.log("Usuario no encontrado");
        }

        if (!searchUsername(username) & noBtn.textContent == 'No') {
            addUsername(username);
            boardSize.style.display = 'block';
        } else {
            console.log("Usuario no encontrado");
        }
    });

    // Lógica para elegir el tamaño del tablero
    boardSize.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            var boardSize = event.target.id.split('-')[1];
            boardTam = boardSize;
            console.log(boardSize);
            gameMode.style.display = 'block';
        }
    });

    fruits.addEventListener('click', function (event) {
        mode = 'f'; 
        startGame();

    });

    zodiac.addEventListener('click', function (event) {
        mode = 't';
        startGame();

    });

    // Función para comenzar el juego con el tamaño del tablero seleccionado
    function startGame() {
        // Muestra el botón "JUGAR"
        document.getElementById('play-btn').style.display = 'block';

        // Event listener del botón "JUGAR" para redirigir al juego principal
        document.getElementById('play-btn').addEventListener('click', function () {
            if (mode == 'f') {
                window.location.href = `memoryF.html?size=${boardTam}?mode=${mode}`; // Redirige al juego principal mediante url
                //window.location.href = `memory.html?size=${boardTam}?mode=${mode}`; // Redirige al juego principal mediante url
            } else if (mode == 't') {
                window.location.href = `memoryZ.html?size=${boardTam}?mode=${mode}`; // Redirige al juego principal mediante url
            }
           
        });

    }
});