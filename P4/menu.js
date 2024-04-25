document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('menu-options');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    const usernameInput = document.getElementById('username-input');
    const usernameField = document.getElementById('username');
    const submitUsernameBtn = document.getElementById('submit-username');

    const boardSize = document.getElementById('board-size');

    const gameMode = document.getElementById('game-mode');
    const normal = document.getElementById('normal-btn');
    const contrarreloj = document.getElementById('contrarreloj-btn');
    const limitMoves = document.getElementById('limitedMoves-btn');

    const timeInput = document.getElementById('seconds-input');
    const timeField = document.getElementById('seconds');
    const submitTimeBtn = document.getElementById('submit-seconds');

    const movesInput = document.getElementById('moves-input');
    const movesField = document.getElementById('moves');
    const submitMovesBtn = document.getElementById('submit-moves');

    const gameTheme = document.getElementById('game-theme');
    const fruits = document.getElementById('fruits-btn');
    const tarot = document.getElementById('tarot-btn');

    var boardTam = 0;
    var mode = '';
    var theme = '';
    var username;
    var time = 0;
    var moves = 0;
    var modeValue = 0;

    // Para base datos
    // Lógica para buscar un nombre de usuario
    /*function searchUsername(username) {
        const usernames = Array.from(userList.getElementsByTagName('li')).map(li => li.textContent.trim());
        return usernames.includes(username);
    }

    // Lógica para agregar un nuevo nombre de usuario
    function addUsername(username) {
        const li = document.createElement('li');
        li.textContent = username;
        userList.appendChild(li);
    }*/

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
        username = usernameField.value;
        if (username == '') {
            usernameInput.style.display = 'block';
        } else {
            boardSize.style.display = 'block';
            menu.style.display = 'none';
            usernameInput.style.display = 'none';
        }


        // Para base de datos
        // Aquí se verifica si el nombre de usuario existe en la base de datos
        //if (searchUsername(username) & yesBtn.textContent == 'Si') {
        //boardSize.style.display = 'block';
        //} else {
        // console.log("Usuario no encontrado");
        // }

        //if (!searchUsername(username) & noBtn.textContent == 'No') {
        //addUsername(username);
        //boardSize.style.display = 'block';
        //} else {
        //console.log("Usuario no encontrado");
        //}
    });

    submitTimeBtn.addEventListener('click', function () {
        time = timeField.value;
        if (time == '') {
            timeInput.style.display = 'block';
        } else {
            modeValue = parseInt(time);
            gameTheme.style.display = 'block';
            fruits.style.display = 'block';
            tarot.style.display = 'block';
        }

    });

    submitMovesBtn.addEventListener('click', function () {
        moves = movesField.value;
        if (moves == '') {
            movesInput.style.display = 'block';
        } else {
            modeValue = parseInt(moves);
            gameTheme.style.display = 'block';
            fruits.style.display = 'block';
            tarot.style.display = 'block';
        }

    });


    // Lógica para elegir el tamaño del tablero
    boardSize.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            var boardSize = event.target.id.split('-')[1];
            boardTam = boardSize;
            console.log(boardSize);
            gameMode.style.display = 'block';
            normal.style.display = 'block';
            contrarreloj.style.display = 'block';
            limitMoves.style.display = 'block';
        }
    });

    normal.addEventListener('click', function () {
        mode = 'n';
        gameTheme.style.display = 'block';
        fruits.style.display = 'block';
        tarot.style.display = 'block';
        timeInput.style.display = 'none';
        movesInput.style.display = 'none';
    });

    contrarreloj.addEventListener('click', function () {
        mode = 'c';
        timeInput.style.display = 'block';
        movesInput.style.display = 'none';
    });

    limitMoves.addEventListener('click', function () {
        mode = 'm';
        movesInput.style.display = 'block';
        timeInput.style.display = 'none';
    });

    fruits.addEventListener('click', function () {
        theme = 'f';
        startGame();
    });

    tarot.addEventListener('click', function () {
        theme = 't';
        startGame();
    });

    // Función para comenzar el juego con el tamaño del tablero seleccionado
    function startGame() {
        // Muestra el botón "JUGAR"
        document.getElementById('play-btn').style.display = 'block';

        //var modeValue = parseInt(time) + parseInt(moves);
        console.log(boardSize, theme, mode, time, moves, modeValue);

        // Event listener del botón "JUGAR" para redirigir al juego principal
        document.getElementById('play-btn').addEventListener('click', function () {
            if (theme == 'f') {
                window.location.href = `memoryF.html?size=${boardTam}?theme=${theme}?mode=${mode}:${modeValue}`; // Redirige al juego principal mediante url
                //window.location.href = `memory.html?size=${boardTam}?mode=${mode}`; // Redirige al juego principal mediante url
            } else if (theme == 't') {
                window.location.href = `memoryZ.html?size=${boardTam}?theme=${theme}?mode=${mode}:${modeValue}`; // Redirige al juego principal mediante url
            }

        });

    }
});