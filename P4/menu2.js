let usersData = []; // Array para almacenar los datos de los usuarios

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const content = reader.result;
        processData(content);
    };

    // Leer el contenido del archivo como texto
    reader.readAsText(file);
});

function processData(content) {
    // Dividir el contenido del archivo por líneas
    const lines = content.split('\n');
    
    // Procesar cada línea
    lines.forEach(line => {
        // Dividir cada línea en los datos relevantes
        const userData = {};
        const data = line.split('-');
        data.forEach(item => {
            const [key, value] = item.split(':');
            userData[key.trim()] = value.trim();
        });
        
        // Agregar los datos del usuario al array
        usersData.push(userData);
    });

    console.log(usersData); // Mostrar los datos de los usuarios en la consola (solo para verificar)
}

// Función para buscar un usuario por nombre
function findUserByName(name) {
    return usersData.find(user => user.Name === name);
}

// Función para agregar un nuevo usuario
function addUser(name, game, movements, time) {
    const newUser = {
        Name: name,
        Game: game,
        Movements: movements,
        Time: time
    };
    usersData.push(newUser);
    console.log('Usuario añadido:', newUser); // Mostrar el usuario añadido en la consola (solo para verificar)
}



document.addEventListener('DOMContentLoaded', function () {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const usernameInput = document.getElementById('username-input');
    const usernameField = document.getElementById('username');
    const submitUsernameBtn = document.getElementById('submit-username');
    const boardSize = document.getElementById('board-size');
    const userList = document.getElementById('user-list');

 /*   // Función para cargar los nombres de usuario desde el JSON
    function loadUsernames() {
        const users = JSON.parse(dataBase.json)
    }

    // Función para guardar los nombres de usuario en el JSON
    function saveUsernames(usernames) {
        const data = { usuarios: usernames };
        return fetch('dataBase.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    // Función para buscar un nombre de usuario en el JSON
    function searchUsername(username) {
        return loadUsernames()
            .then(usernames => usernames.includes(username));
    }

    // Función para añadir un nuevo usuario al JSON
    function addNewUser(username) {
        return loadUsernames()
            .then(usernames => {
                if (usernames.includes(username)) {
                    throw new Error('El usuario ya existe.');
                } else {
                    usernames.push(username);
                    return saveUsernames(usernames);
                }
            });
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
        var username = usernameField.value;
        // Aquí se verifica si el nombre de usuario existe en la base de datos
        if (searchUsername(username) & yesBtn.textContent == 'Si') {
            boardSize.style.display = 'block';
        } else {
            console.log("Usuario no encontrado");
        }

        if (!searchUsername(username) & noBtn.textContent == 'No') {
            searchUsername(username)
                .then(exists => {
                    if (!exists) {
                        return loadUsernames()
                            .then(usernames => {
                                usernames.push(username);
                                return saveUsernames(usernames);
                            })
                            .then(() => {
                                boardSize.style.display = 'block';
                            });
                    } else {
                        console.log("Usuario en uso");
                    }
                });
        }
        updateUserList()
    });

    // Lógica para elegir el tamaño del tablero
    boardSize.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON') {
            const boardSize = event.target.id.split('-')[1];
            // Aquí puedes llamar a la función para comenzar el juego con el tamaño del tablero seleccionado
            startGame(boardSize);
        }
    });

    // Función para comenzar el juego con el tamaño del tablero seleccionado
    function startGame(boardSize) {
        // Aquí podrías redirigir al usuario al juego principal, pasando el tamaño del tablero como parámetro.
        // Por ejemplo, podrías redirigir a "memory.html?size=4" para un tablero de 4x4.
        // window.location.href = `memory.html?size=${boardSize}`;
        console.log(`Comenzar juego con tamaño del tablero ${boardSize}x${boardSize}`);
    }
});

