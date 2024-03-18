 # Práctica 2

 ## JavaScript
 #### Función 'checkGuess' --> Con dos números iguales me los pone a la vez.
 - 'const index' = secretKey.indexOf(guess);: Aquí se utiliza el método indexOf() para buscar la posición del valor guess dentro del array secretKey. Si el valor no se encuentra en el array indexOf() devolverá -1. El resultado se almacena en la variable index.

 - 'if (index !== -1) {': Esta línea verifica si guess se encontró en la clave secreta. Si indexOf() no devolvió -1, significa que el dígito está presente en la clave secreta y el código dentro de esta condición se ejecutará. Luego, se actualiza el contenido visual que representa la clave secreta:
    1. '.substring(0, index)': Este método substring se utiliza para obtener una parte del texto contenido en secretKeyDisplay.textContent. Toma dos argumentos: el índice de inicio y el índice de fin (no inclusivo). En este caso, estamos tomando la parte del texto desde el inicio hasta justo antes del índice index. Esto significa que estamos manteniendo el texto en secretKeyDisplay.textContent antes de la posición index.

    2. '+ secretKey[index] +': Aquí, se está concatenando el dígito adivinado (secretKey[index]) al texto que hemos obtenido en el paso anterior. Esto es lo que actualiza el dígito correcto en la posición correcta dentro de la clave secreta visualizada en la interfaz de usuario.

    3. '.substring(index + 1)': Este segundo uso del método substring toma el texto desde el índice index + 1 hasta el final. Esto significa que estamos manteniendo el texto en secretKeyDisplay.textContent después de la posición index, pero no incluyendo el dígito que ya hemos reemplazado.

 - 

 - 

 - 'if (secretKey.length === 0 && !gameFinished) {' :Esta parte del código verifica si todos los dígitos de la clave secreta han sido adivinados (`secretKey.length === 0`) y si el juego aún no ha terminado (`!gameFinished`). Si se cumplen ambas condiciones, se detiene el cronómetro (`crono.stop()`) y se marca el juego como terminado (`gameFinished = true;`).

 #### Función 'checkGuess' 2 --> Problema no me escribe dos números iguales
 - const index = secretKey.indexOf(guess);: Busca el índice del dígito adivinado (guess) dentro de la clave secreta (secretKey). Si el dígito no está en la clave secreta, indexOf devolverá -1.

 - if (index !== -1) {: Comprueba si el dígito adivinado está presente en la clave secreta.

 - if (!(guess in guessCounts)) { guessCounts[guess] = 0; }: Comprueba si el dígito adivinado ya ha sido adivinado suficientes veces para completar su ocurrencia en la clave secreta. Si no ha sido adivinado antes, se inicializa un contador para este dígito en el objeto guessCounts.

 - if (guessCounts[guess] < secretKey.filter(num => num === guess).length) {: Verifica si aún hay dígitos por adivinar de este tipo en la clave secreta. Compara el número de veces que el dígito adivinado aparece en la clave secreta (secretKey.filter(num => num === guess).length) con el número de veces que ya se ha adivinado (guessCounts[guess]).

 - secretKeyDisplay.textContent = ...: Actualiza el display de la clave secreta mostrando el dígito adivinado en la posición correspondiente. Para hacer esto, primero se obtiene la parte del texto antes del dígito adivinado (secretKeyDisplay.textContent.substring(0, index)), luego se añade el dígito adivinado, y finalmente se agrega la parte del texto después del dígito adivinado (secretKeyDisplay.textContent.substring(index + 1)).

 - guessCounts[guess]++;: Incrementa el contador para el dígito adivinado, indicando que se ha adivinado una vez más.

 - if (Object.values(guessCounts).reduce((acc, val) => acc + val, 0) === secretKey.length && !gameFinished) { crono.stop(); gameFinished = true; }: Verifica si todos los dígitos de la clave secreta han sido adivinados. Utiliza Object.values(guessCounts) para obtener los valores (contadores) de todos los dígitos adivinados, luego suma estos valores utilizando reduce. Si la suma es igual a la longitud de la clave secreta y el juego no ha terminado (!gameFinished), detiene el cronómetro y marca el juego como finalizado.