// JavaScript code (index.js)

// Create the canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Images
var bgReady = false;
var heroReady = false;
var monsterReady = false;
var enemyReady = false;
var bonusReady = false;

var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.gif";

var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

var enemyImage = new Image();
enemyImage.onload = function () {
    enemyReady = true;
};
enemyImage.src = "images/enemy.png";

var bonusImage = new Image();
bonusImage.onload = function () {
    bonusReady = true;
};
bonusImage.src = "images/bonus.png"; // Adjust the path and file name accordingly

// Sound
var collisionSound = new Audio("collision.mp3");

// Game objects
var hero = {
    speed: 256,
    x: 0,
    y: 0
};

var monster = {
    x: 0,
    y: 0
};

var enemy = {
    x: 0,
    y: 0
};

var bonus = {
    x: 0,
    y: 0
};

var monstersCaught = 0;
var bonusesCaught = 0;
var gameTime = 30; // Time limit in seconds
var timerInterval;

// Reset function
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
    enemy.x = 32 + (Math.random() * (canvas.width - 96));
    enemy.y = 32 + (Math.random() * (canvas.height - 96));
    bonus.x = 32 + (Math.random() * (canvas.width - 96));
    bonus.y = 32 + (Math.random() * (canvas.height - 96));
};

// Keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Update function
var update = function (modifier) {
    if (38 in keysDown && hero.y > 32 + 4) { // Up arrow
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { // Down arrow
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32 + 4)) { // Left arrow
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // Right arrow
        hero.x += hero.speed * modifier;
    }
    // Collision detection with monster
    if (
        hero.x <= (monster.x + 32) &&
        monster.x <= (hero.x + 32) &&
        hero.y <= (monster.y + 32) &&
        monster.y <= (hero.y + 32)
    ) {
        // Play collision sound
        collisionSound.play();
        ++monstersCaught;
        reset();
    }
    // Collision detection with enemy
    if (
        hero.x <= (enemy.x + 32) &&
        enemy.x <= (hero.x + 32) &&
        hero.y <= (enemy.y + 32) &&
        enemy.y <= (hero.y + 32)
    ) {
        // Game over
        endGame();
    }
    // Collision detection with bonus
    if (
        hero.x <= (bonus.x + 32) &&
        bonus.x <= (hero.x + 32) &&
        hero.y <= (bonus.y + 32) &&
        bonus.y <= (hero.y + 32)
    ) {
        ++bonusesCaught;
        resetBonus();
    }
};

// Render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y, 64, 64);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y, 64, 64);
    }
    if (enemyReady) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, 64, 64);
    }
    if (bonusReady) {
        ctx.drawImage(bonusImage, bonus.x, bonus.y, 64, 64);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
    ctx.fillText("Bonuses caught: " + bonusesCaught, 32, 64);
    ctx.fillText("Time: " + gameTime, 32, 96);
};

// Main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);
};

// End the game when time runs out
var endGame = function () {
    clearInterval(timerInterval);
    alert("Time's up! Game over. Goblins caught: " + monstersCaught + ", Bonuses caught: " + bonusesCaught);
    reset();
    monstersCaught = 0;
    bonusesCaught = 0;
    gameTime = 30;
    timerInterval = setInterval(updateTimer, 1000); // Restart the timer
};

// Timer update function
var updateTimer = function () {
    gameTime--;
    if (gameTime <= 0) {
        endGame();
    }
};

// Reset bonus position
var resetBonus = function () {
    bonus.x = 32 + (Math.random() * (canvas.width - 96));
    bonus.y = 32 + (Math.random() * (canvas.height - 96));
};

// Let's play!
var then = Date.now();
reset();
resetBonus();
timerInterval = setInterval(updateTimer, 1000); // Start the timer
main();
