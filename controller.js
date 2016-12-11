var KEYS = {
    UP: 38,
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var zombi = document.createElement('img');
zombi.onload = function () {
    startGame();
};
zombi.src = 'zombi.png';

var x = 0;
var y = 100;
var i = 0;
var dir = 1;
var moving = false;

var pressedKeys = {};
document.body.addEventListener('keydown', function (event) {
    var key = event.which;
    pressedKeys[key] = true;
});
document.body.addEventListener('keyup', function (event) {
    var key = event.which;
    delete pressedKeys[key];
});

function startGame() {
    setInterval(frame, 16);
}

function moveUp() {
    i += 0.25;
    if (i >= 8) {
        i = 0;
    }
    moving = true;
}

function moveUp() {
    i += 0.25;
    if (i >= 8) {
        i = 0;
    }
    moving = true;
}

function moveUp() {
    i += 0.25;
    if (i >= 8) {
        i = 0;
    }
    moving = true;
}

function moveUp() {
    i += 0.25;
    if (i >= 8) {
        i = 0;
    }
    moving = true;
}

function frame() {
    moving = false;
    if (pressedKeys[KEYS.A]) {
        x -= 10;
        dir = -1;
        move()
    }
    if (pressedKeys[KEYS.D]) {
        x += 10;
        dir = 1;
        move();
    }

    if (pressedKeys[KEYS.W]) {
        y -= 10;
        move();
    }
    if (pressedKeys[KEYS.S]) {
        setInterval(function() {
            y += 2;
            zombi.clearRect(0, 0, canvas.width, canvas.height);
            zombi.fillRect(0, y, 100, 100);
        }, 16)
    }
}