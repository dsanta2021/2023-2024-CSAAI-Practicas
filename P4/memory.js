const selectors = {
    gridContainer: document.querySelector('.grid-container'),
    tablero: document.querySelector('.tablero'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('button'),
    win: document.querySelector('.win'),
    menu: document.getElementById('btnMenu'),
    volJugar: document.getElementById('btnVJugar'),
    start: document.getElementById('btnComenzar'),
    restart: document.getElementById('btnReiniciar'),
    dispMove: document.querySelector('.movimientos'),
    dispTime: document.querySelector('.timer')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

// Función para obtener tamaño y modo de la URL
function obtenerDataURL() {
    const url = window.location.href;
    const parametros = url.split('?'); // Divide la URL en partes y obtiene la parte después del signo de interrogación
    console.log(parametros);
    if (parametros) {
        let size = null;
        let mode = null;
        for (let i = 0; i < parametros.length; i++) {
            const parametro = parametros[i].split('=');
            if (parametro[0] === 'size') { // Verifica si el nombre del parámetro es 'size'
                size = parametro[1]; // Guarda el valor del parámetro de tamaño del tablero
            } else if (parametro[0] === 'mode') { // Verifica si el nombre del parámetro es 'mode'
                mode = parametro[1]; // Guarda el valor del parámetro de modo
            }
        }
        return [size, mode]; // Devuelve un objeto con los valores de size y mode
    }
    return null; // Devuelve null si no se encuentran los parámetros de tamaño del tablero y modo en la URL
}

// Obtener el tamaño del tablero de la URL
const data = obtenerDataURL();
console.log('Tamaño del tablero obtenido de la URL:', data);

const generateGame = () => {
    //-- Creamos un array con los emojis que vamos a utilizar en nuestro juego
    const emojis = [
        '🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍',
        '🍈', '🍊', '🍋', '🍎', '🍄', '🍐', '🍑', '🍓', '🫐', '🥝',
        '🍅', '🫒', '🥥', '🍆', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄',
        '🥜', '🫛']

    const tarot = [
        '0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
        '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', 
        '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg'
    ]

    var dimensions = 0;
    var gameMode = '';

    if (data[0] == 2 || data[0] == 4 || data[0] == 6) {
        dimensions = data[0];
    } else {
        dimensions = selectors.tablero.getAttribute('grid-dimension');
    }

    if (data[1] == 'f' || data[1] == 't') {
        gameMode = data[1];
        console.log(gameMode);
    } else {
        gameMode = selectors.tablero.getAttribute('game-mode');
    }

    //-- Nos aseguramos de que el número de dimensiones es par
    // y si es impar lanzamos un error
    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.")
    }

    if (gameMode == 'f') {
        const picks = pickRandom(emojis, (dimensions * dimensions) / 2)

        //-- Después descolocamos las posiciones para asegurarnos de que las parejas de cartas
        // están desordenadas.
        const items = shuffle([...picks, ...picks])

        //-- Vamos a utilizar una función de mapeo para generar 
        //  todas las cartas en función de las dimensiones
        var cards = `
            <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)">
                ${items.map(item => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back">${item}</div>
                    </div>
                `).join('')}
           </div>
        `
    } else if (gameMode == 't') {
        const picks = pickRandom(tarot, (dimensions * dimensions) / 2)

        //-- Después descolocamos las posiciones para asegurarnos de que las parejas de cartas
        // están desordenadas.
        const items = shuffle([...picks, ...picks])
        if (dimensions == 2) {
            var cards = `
            <div class="tablero" style="grid-template-columns: repeat(4, auto)">
                ${items.map(item => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back">${item}</div>
                        <div class="card-back"><img src="${item}" alt="zodiaco"></div>
                    </div>
                `).join('')}
           </div>
        `
        } else if (dimensions == 4) {
            var cards = `
            <div class="tablero" style="grid-template-columns: repeat(8, auto)">
                ${items.map(item => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back">${item}</div>
                        <div class="card-back"><img src="${item}" alt="zodiaco"></div>
                    </div>
                `).join('')}
           </div>
        `
        } else if (dimensions == 6) {
            var cards = `
            <div class="tablero">
                ${items.map(item => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back">${item}</div>
                        <div class="card-back"><img src="${item}" alt="zodiaco"></div>
                    </div>
                `).join('')}
           </div>
        `
        } 
        
    }

    //-- Vamos a utilizar un parser para transformar la cadena que hemos generado
    // en código html.
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    //-- Por último, vamos a inyectar el código html que hemos generado dentro de el contenedor
    // para el tablero de juego.
    selectors.tablero.replaceWith(parser.querySelector('.tablero'))
}

const pickRandom = (array, items) => {
    // La sintaxis de tres puntos nos sirve para hacer una copia del array
    const clonedArray = [...array]
    // Random picks va almacenar la selección al azar de emojis
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        // Utilizamos el índice generado al azar entre los elementos del array clonado
        // para seleccionar un emoji y añadirlo al array de randompicks.
        randomPicks.push(clonedArray[randomIndex])
        // Eliminamos el emoji seleccionado del array clonado para evitar que 
        // vuelva a salir elegido con splice.
        // 0 - Inserta en la posición que le indicamos.
        // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const shuffle = array => {
    const clonedArray = [...array]

    // Intercambiamos las posiciones de los emojis al azar para desorganizar el array
    // así nos aseguramos de que las parejas de emojis no están consecutivas.
    // Para conseguirlo utilizamos un algoritmo clásico de intercambio y nos apoyamos
    // en una variable auxiliar.
    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        // Del evento disparado vamos a obtener alguna información útil
        // Como el elemento que ha disparado el evento y el contenedor que lo contiene
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        // Cuando se trata de una carta que no está girada, le damos la vuelta para mostrarla
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
            // Pero si lo que ha pasado es un clic en el botón de comenzar lo que hacemos es
            // empezar el juego
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            if (eventTarget.id === 'btnComenzar') {
                startGame()
            } else if (eventTarget.id === 'btnReiniciar') {
                location.reload();
            }
        }
    })

    // Ajustar el tamaño de las imágenes dentro de las cartas
    const cardBackImages = document.querySelectorAll('.card-back img');
    cardBackImages.forEach(img => {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
    });
}

// Generamos el juego
generateGame()

// Asignamos las funciones de callback para determinados eventos
attachEventListeners()

const startGame = () => {
    // Iniciamos el estado de juego
    state.gameStarted = true
    // Desactivamos el botón de comenzar
    selectors.comenzar.classList.add('disabled')

    // Comenzamos el bucle de juego
    // Cada segundo vamos actualizando el display de tiempo transcurrido
    // y movimientos
    state.loop = setInterval(() => {
        state.totalTime++

        selectors.movimientos.innerText = `${state.totalFlips} movimientos`
        selectors.timer.innerText = `tiempo: ${state.totalTime} sec`
    }, 1000)
}

const flipCard = card => {
    // Sumamos uno al contador de cartas giradas
    state.flippedCards++
    // Sumamos uno al contador general de movimientos
    state.totalFlips++

    // Si el juego no estaba iniciado, lo iniciamos
    if (!state.gameStarted) {
        startGame()
    }

    // Si no tenemos la pareja de cartas girada
    // Giramos la carta añadiendo la clase correspondiente
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    // Si ya tenemos una pareja de cartas girada tenemos que comprobar
    if (state.flippedCards === 2) {
        // Seleccionamos las cartas que están giradas
        // y descartamos las que están emparejadas
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        // Si las cartas coinciden las marcamos como pareja 
        // añadiendo la clase correspondiente
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        // Arrancamos un temporizador que comprobará si tiene
        // que volver a girar las cartas porque no hemos acertado
        // o las deja giradas porque ha sido un match
        // y para eso llamamos a la función flipBackCards()
        setTimeout(() => {
            flipBackCards()
        }, 800)
    }

    // Antes de terminar, comprobamos si quedan cartas por girar
    // porque cuando no quedan cartas por girar hemos ganado
    // y se lo tenemos que mostrar al jugador
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            // Le damos la vuelta al tablero
            selectors.gridContainer.classList.add('flipped')

            // Se eliminan los elementos que no se quieren mostrar
            selectors.dispMove.style.display = 'none';
            selectors.dispTime.style.display = 'none';
            selectors.start.style.display = 'none';
            selectors.restart.style.display = 'none';

            // Le mostramos las estadísticas del juego
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>
            `
            // Paramos el loop porque el juego ha terminado
            clearInterval(state.loop)

            // Opciones para volver a jugar
            selectors.menu.style.display = 'block';
            selectors.volJugar.style.display = 'block';
        }, 1000)
    }
}

const flipBackCards = () => {
    // Seleccionamos las cartas que no han sido emparejadas
    // y quitamos la clase de giro
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })
    // Ponemos el contado de parejas de cartas a cero
    state.flippedCards = 0
}

// Finish Events
selectors.menu.addEventListener('click', function (event) {
    window.location.href = 'index.html';
});

selectors.restart.addEventListener('click', function (event) {
    location.reload();
});