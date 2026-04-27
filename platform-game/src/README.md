# Platform Game

# main.js
usa el script game.js, llamando a la funcion que declara la funcion runGame
# game.js
## runGame(GAME_LEVELS, CanvasDisplay)
GAME_LEVELS contiene los niveles en formato de grilla de texto donde cada caracter es un objeto
CanvasDisplay es una * referencia a una clase * y sirve para especificar dónde se va a dibujar el nivel (canvas o dom) esta clase contiene los métodos para dibujarla donde haga falta.

Dentro de la funcion runGame se declara la funcion startLevel(levelNumber, lives). Esta funcion ejecuta el nivel que se pase como parametro level (hay que crear un objeto del tipo Level utilizando el texto de GAME_LEVELS como entrada). Y cuando pasan cosas en el nivel, se vuelve a ejecutar a si misma utilizando el valor apropiado del nivel. El valor apropiado puede ser:ejecutar el primer nivel según si el jugador murio (status = "lost") o pasar al siguiente nivel (algunas mas cosas explicadas en comentarios en el script).


