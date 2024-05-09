// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");
const nodoDisplay = document.getElementById("nodos");
const timeDisplay = document.getElementById("time");
const msgDisplay = document.getElementById("message");
const initialDiv = document.getElementById("initial");
const finalDiv = document.getElementById("final");
const router = document.getElementById("router");
const computer = document.getElementById("computer");
var numNodesInput = document.getElementById("num_nodos");

// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let generated = false;

const nodeRadius = 40;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100; // No hay retardo entre nodos 100

var numNodes = numNodesInput.value;
var initialNode;
var finalNode;

// Clase para representar un nodo en el grafo
class Nodo {

    constructor(id, x, y, delay) {
        this.id = id; // Identificador del nodo
        this.x = x; // Coordenada X del nodo
        this.y = y; // Coordenada Y del nodo
        this.delay = delay; // Retardo del nodo en milisegundos
        this.conexiones = []; // Array de conexiones a otros nodos 
    }

    // Método para agregar una conexión desde este nodo a otro nodo con un peso dado
    conectar(nodo, peso) {
        this.conexiones.push({ nodo, peso });
    }

    // Método para saber si un nodo está en la lista de conexiones de otro
    isconnected(idn) {

        let isconnected = false;

        this.conexiones.forEach(({ nodo: conexion, peso }) => {
            if (idn == conexion.id) {
                //console.log("id nodo conectado:" + conexion.id);
                isconnected = true;
            }
        });

        return isconnected;
    }

    // Método para saber la distancia entre dos nodos
    node_distance(nx, ny) {

        var a = nx - this.x;
        var b = ny - this.y;

        return Math.floor(Math.sqrt(a * a + b * b));

    }

    // Método para encontrar el nodo más alejado
    far_node(nodos) {

        let distn = 0;
        let cnode = this.id;
        let distaux = 0;
        let pos = 0;
        let npos = 0;

        for (let nodo of nodos) {
            distaux = this.node_distance(nodo.x, nodo.y);

            if (distaux != 0 && distaux > distn) {
                distn = distaux;
                cnode = nodo.id;
                npos = pos;
            }

            pos += 1;
        }

        return { pos: npos, id: cnode, distance: distn, };

    }

    // Método para encontrar el nodo más cercano
    close_node(nodos) {

        let far_node = this.far_node(nodos);
        let cnode = far_node.id;
        let distn = far_node.distance;
        let distaux = 0;
        let pos = 0;
        let npos = 0;

        for (let nodo of nodos) {
            distaux = this.node_distance(nodo.x, nodo.y);

            if (distaux != 0 && distaux <= distn) {
                distn = distaux;
                cnode = nodo.id;
                npos = pos;
            }

            pos += 1;
        }

        return { pos: npos, id: cnode, distance: distn, }

    }

}

// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {

    const nodos = [];
    let x = 0, y = 0, delay = 0;
    let nodoActual = 0, nodoAleatorio = 0, pickNode = 0, peso = 0;
    let bSpace = false;

    const xs = Math.floor(canvas.width / numNodos);
    const ys = Math.floor(canvas.height / 2);
    const xr = canvas.width - nodeRadius;
    const yr = canvas.height - nodeRadius;
    let xp = nodeRadius;
    let yp = nodeRadius;
    let xsa = xs;
    let ysa = ys;

    // Generamos los nodos
    for (let i = 0; i < numNodos; i++) {

        //var random_boolean = Math.random() < 0.5;
        if (Math.random() < 0.5) {
            yp = nodeRadius;
            ysa = ys;
        }
        else {
            yp = ys;
            ysa = yr;
        }

        x = randomNumber(xp, xsa); // Generar coordenada x aleatoria
        y = randomNumber(yp, ysa); // Generar coordenada y aleatoria

        xp = xsa;
        xsa = xsa + xs;

        if (xsa > xr && xsa <= canvas.width) {
            xsa = xr;
        }

        if (xsa > xr && xsa < canvas.width) {
            xp = nodeRadius;
            xsa = xs;
        }

        delay = generarRetardo(); // Retardo aleatorio para simular congestión
        nodos.push(new Nodo(i, x, y, delay)); // Generar un nuevo nodo y añadirlo a la lista de nodos de la red
    }

    // Conectamos los nodos
    // Seleccionamos los nodos más cercanos teniendo en cuenta la distancia
    // Seleccionamos tantos nodos como indica la variable numConexiones
    // El nodo será candidato siempre que no estén ya conectados
    for (let nodo of nodos) {

        const clonedArray = [...nodos];

        for (let j = 0; j < numConexiones; j++) {
            let close_node = nodo.close_node(clonedArray);
            //console.log(close_node);

            if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
                // Añadimos una nueva conexión
                // Con el nodo más cercano y la distancia a ese nodo como el peso de la conexión
                nodo.conectar(clonedArray[close_node.pos], close_node.distance);
            }

            // Eliminamos el nodo seleccionado del array clonado para evitar que 
            // vuelva a salir elegido con splice.
            // 0 - Inserta en la posición que le indicamos.
            // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.      
            clonedArray.splice(close_node.pos, 1);
        }

    }

    return nodos;
}

// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
    return Math.random() * nodeRandomDelay;
}

// Generar un número aleatorio dentro de un rango
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Dibujar la red en el canvas
function drawNet(nnodes) {
    // Dibujamos las conexiones entre nodos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nnodes.forEach(nodo => {
        nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
            ctx.beginPath();
            ctx.moveTo(nodo.x, nodo.y);
            ctx.lineTo(conexion.x, conexion.y);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            var pw = "N" + nodo.id + " pw " + peso;
            const midX = Math.floor((nodo.x + conexion.x) / 2);
            const midY = Math.floor((nodo.y + conexion.y) / 2);
            ctx.fillText(pw, midX, midY);

        });
    });

    let nodoDesc; // Descripción del nodo

    // Dibujamos los nodos
    nnodes.forEach(nodo => {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
        ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
    });
}

function drawNetImages(nnodes, rutaMinima) {
    // Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Creamos un conjunto de conexiones en la ruta mínima
    const conexionesRutaMinima = new Set();
    for (let i = 0; i < rutaMinima.length - 1; i++) {
        const nodoActual = rutaMinima[i];
        const nodoSiguiente = rutaMinima[i + 1];
        conexionesRutaMinima.add(`${nodoActual.id}-${nodoSiguiente.id}`);
        conexionesRutaMinima.add(`${nodoSiguiente.id}-${nodoActual.id}`);
    }

    // Dibujamos las conexiones entre nodos
    nnodes.forEach(nodo => {
        nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
            ctx.beginPath();
            ctx.moveTo(nodo.x, nodo.y);
            ctx.lineTo(conexion.x, conexion.y);

            // Verificar si la conexión pertenece a la ruta mínima 
            const estaEnRutaMinima = conexionesRutaMinima.has(`${nodo.id}-${conexion.id}`) || conexionesRutaMinima.has(`${conexion.id}-${nodo.id}`);
            if (estaEnRutaMinima) {
                ctx.strokeStyle = 'green'; // Línea verde para conexiones en la ruta mínima
                ctx.lineWidth = 3;
                ctx.font = 'bold 13px Arial';
                ctx.fillStyle = 'blue';
            } else {
                ctx.strokeStyle = 'black'; // Línea negra para conexiones fuera de la ruta mínima
                ctx.lineWidth = 1;
                ctx.font = '10px Arial';
                ctx.fillStyle = 'black';
            }
            ctx.stroke();


            ctx.textAlign = 'center';
            var pw = "N" + nodo.id + " pw " + peso;
            const midX = Math.floor((nodo.x + conexion.x) / 2);
            const midY = Math.floor((nodo.y + conexion.y) / 2);
            ctx.fillText(pw, midX, midY);
        });
    });

    let nodoDesc; // Descripción del nodo

    // Dibujamos los nodos
    nnodes.forEach(nodo => {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
        const esRutaMinima = rutaMinima.includes(nodo);

        if (esRutaMinima) {
            if (nodo === nodoOrigen || nodo === nodoDestino) {
                ctx.drawImage(computer, nodo.x - 35, nodo.y - 64, 75, 75);
            } else {
                ctx.drawImage(router, nodo.x - 35, nodo.y - 60, 75, 75);
            }
            ctx.textAlign = 'center';
            ctx.fillStyle = 'blue';
            ctx.font = 'bold 15px Arial';
            nodoDesc = "N" + nodo.id + " - Delay: " + Math.floor(nodo.delay);
            ctx.fillText(nodoDesc, nodo.x, nodo.y + 14);
            ctx.closePath();
            
        } else {
            ctx.fillStyle = 'purple';
            ctx.fill();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
            ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);;
            ctx.closePath();
        }

        

    });
}

// Función para encontrar nodos conectados directa o indirectamente
function findConnectedNodes(red, origen, destino) {
    const visited = new Set();
    const origin = [origen.id];
    while (origin.length > 0) {
        const nodeId = origin.shift();
        const node = red[nodeId];
        if (node === destino) {
            return [node];
        }
        visited.add(nodeId);
        for (const { nodo } of node.conexiones) {
            if (!visited.has(nodo.id) && !origin.includes(nodo.id)) {
                origin.push(nodo.id);
            }
        }
    }
    return [];
}

numNodesInput.addEventListener('input', function () {
    numNodes = this.value;
    document.getElementById("num_nodos_value").textContent = numNodes;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generated = false;
});

// Event listener para los nodos iniciales
initialDiv.addEventListener('change', function () {
    const initialNodeInputs = document.querySelectorAll('.initial_node');
    initialNodeInputs.forEach(input => {
        if (input.checked) {
            initialNode = input.value;
        }
    });
});

finalDiv.addEventListener('change', function () {
    const finalNodeInputs = document.querySelectorAll('.final_node');
    finalNodeInputs.forEach(input => {
        if (input.checked) {
            finalNode = input.value;
        }
    });
});

// Función de calback para generar la red de manera aleatoria
btnCNet.onclick = () => {
    if (numNodes >= 1 & numNodes <= 5) {
        // Generar red de nodos con congestión creada de manera aleatoria redAleatoria
        // Cada nodo tendrá un delay aleatorio para simular el envío de paquetes de datos
        redAleatoria = crearRedAleatoriaConCongestion(numNodes, nodeConnect);
        generated = true;
        initialNode = null;
        finalNode = null;

        // Limpiamos el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar la red que hemos generado
        drawNet(redAleatoria);
        nodoDisplay.innerHTML = 'Nodos: ' + numNodes;
        timeDisplay.innerHTML = 'Tiempo total: ' + 0 + ' sec';
        msgDisplay.innerHTML = 'Red generada.';
        msgDisplay.style.color = 'green';

        initialDiv.style.display = 'block';
        finalDiv.style.display = 'block';

        // Actualizar los radios de entrada para el nodo inicial
        initialDiv.innerHTML = '<h3>Nodo inicial</h3>';
        for (let i = 0; i <= numNodes - 1; i++) {
            initialDiv.innerHTML += '<input type="radio" name="initial_node" class="initial_node" value="' + i + '"> ' + i;
        }

        // Actualizar los radios de entrada para el nodo final
        finalDiv.innerHTML = '<h3>Nodo final</h3>';
        for (let i = 0; i <= numNodes - 1; i++) {
            finalDiv.innerHTML += '<input type="radio" name="final_node" class="final_node" value="' + i + '"> ' + i;
        }

        // Llenar la tabla con la información de los nodos
        const tablaInfo = document.querySelector('.info');
        tablaInfo.style.display = 'block';
        tablaInfo.innerHTML = ''; // Limpiar la tabla

        // Agregar fila de encabezado
        const headerRow = tablaInfo.insertRow();
        const headerCell1 = headerRow.insertCell(0);
        const headerCell2 = headerRow.insertCell(1);
        const headerCell3 = headerRow.insertCell(2);
        headerCell1.textContent = 'Nodo';
        headerCell2.textContent = 'Delay (ms)';
        headerCell3.textContent = 'Conexiones';

        headerCell1.style.fontWeight = 'bold';
        headerCell2.style.fontWeight = 'bold';
        headerCell3.style.fontWeight = 'bold';

        // Agregar filas a la tabla para cada nodo
        redAleatoria.forEach(nodo => {
            const row = tablaInfo.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.textContent = 'N' + nodo.id;
            cell2.textContent = nodo.delay.toFixed(0);
            let conexiones = nodo.conexiones.map(conexion => 'N' + conexion.nodo.id).join(', ');
            cell3.textContent = conexiones;
        })
    }
    else {
        generated = false;
    }

}

btnMinPath.onclick = () => {

    if (generated == false) {
        msgDisplay.innerHTML = 'La red no está generada. Cree primero la red.';
        msgDisplay.style.color = 'red';
    }
    else if (generated == true) {
        if (initialNode == null || finalNode == null) {
            msgDisplay.innerHTML = 'Nodo inicial y final no elegios. Escoja el nodo inicial y final.';
            msgDisplay.style.color = 'red';
        } else {
            // Supongamos que tienes una red de nodos llamada redAleatoria y tienes nodos origen y destino
            nodoOrigen = redAleatoria[parseInt(initialNode)]; // Nodo de origen
            nodoDestino = redAleatoria[parseInt(finalNode)]; // Nodo de destino

            const connectedNodes = findConnectedNodes(redAleatoria, nodoOrigen, nodoDestino);

            if (connectedNodes.length > 0) {
                // Calcular la ruta mínima entre el nodo origen y el nodo destino utilizando Dijkstra con retrasos
                const { ruta, totalDelay } = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
                console.log("Ruta mínima con retrasos:", ruta);
                console.log("Tiempo total:", totalDelay);
                msgDisplay.innerHTML = 'Ruta mínima calculada. Ruta: ' + ruta.map(node => 'N' + node.id).join(' ➟ ');
                timeDisplay.innerHTML = 'Tiempo total: ' + totalDelay + ' sec';
                drawNetImages(redAleatoria, ruta);
            } else {
                msgDisplay.innerHTML = 'No existe conexión entre el nodo origen y el destino. Pruebe con otros nodos.';
                msgDisplay.style.color = 'red';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

        }

    }
}
