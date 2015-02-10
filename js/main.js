"use strict";

var spaceShip = document.getElementById("spaceShip"),
    bgOne = document.getElementById("bg_1"),
    bgTwo = document.getElementById("bg_2"),
    windowWith = window.innerWidth,
    windowHeight = window.innerHeight,
    press = false,
    up = false,
    down = false,
    left = false,
    right = false,
    shoot = false,
    speed = 13,
    i = 1,
    e = 1,
    c = 1,
    d = 1,
    shoots = [],
    asteroids = [],
    enemies = [],
    fireZone = document.getElementById("shootzone"),
    asteroidZone = document.getElementById("asteroidzone"),
    enemyZone = document.getElementById("enemyzone"),
    shootItem,
    asteroidItem,
    enemyItem,
    asteroidBox,
    spaceShipBox,
    shootBox,
    shootActivation = false,
    li = null,
    en = null,
    astPosition = 0,
    enemyPosition = 0,
    enemyDirection = 0,
    distance = 0,
    explosion = "url('img/explosion.gif') no-repeat";

function keyDownHandle() {
    document.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
            case 37: left = true; break;
            case 39: right = true; break;
            case 38: up = true; break;
            case 40: down = true; break;
            case 32: shoot = true; break;
        }

        press = true;
        event.preventDefault();
    });
}

function keyupHandle() {
    document.addEventListener("keyup", function(event) {
        switch (event.keyCode) {
            case 37: left = false; break;
            case 39: right = false; break;
            case 38: up = false; break;
            case 40: down = false; break;
            case 32: shoot = false; break;
        }
    });
}

function bgAnimation() {
    bgTwo.style.top = bgTwo.offsetTop + i + "px";
    bgOne.style.top = bgOne.offsetTop + i + "px";

    if (bgOne.offsetTop === 0) {
        bgTwo.style.top = -windowHeight;
    } else if (bgOne.offsetTop === windowHeight) {
        bgOne.style.top = -windowHeight;
    }
}

function spaceShipMove() {
    if (press) {
        if (left && spaceShip.offsetLeft - 15 > 0) {
            spaceShip.style.left = spaceShip.offsetLeft - speed;
        }

        if (right && spaceShip.offsetLeft + 143 < windowWith) {
            spaceShip.style.left = spaceShip.offsetLeft + speed;
        }

        if (up && spaceShip.offsetTop - 15 > 0) {
            spaceShip.style.top = spaceShip.offsetTop - speed;
        } 

        if (down && spaceShip.offsetTop + 151 < window.innerHeight) {
            spaceShip.style.top = spaceShip.offsetTop + speed;
        }
    }
}

function collisionHandle(box1, box2, itemToDestroy) {
    if (box1.x < box2.x + box2.width && box1.x + box1.width > box2.x && box1.y < box2.y + box2.height && box1.height + box1.y > box2.y) {
        itemToDestroy.style.background = explosion;
    }
}

function spaceShipShoot() {
    if (shoot) {
        li = document.createElement("li");
        li.setAttribute("class", "shoot");
        li.setAttribute("id", e);
        li.style.top = spaceShip.offsetTop;
        li.style.left = spaceShip.offsetLeft + 50;
        fireZone.appendChild(li);
        shoots.push(e);
        e++;
        shootActivation = true;
    }

    if (shootActivation) {
        for( var a = 0; a < shoots.length;a++ ) {
            shootItem = document.getElementById(shoots[a]);
            shootItem.style.top = shootItem.offsetTop - 30 + "px";

            if ( shootItem.offsetTop < -1) {
                fireZone.removeChild(shootItem);
                shoots.splice(a, 1);
            }

            for( var b = 0; b < asteroids.length; b++) {
                asteroidItem = document.getElementById(asteroids[b]);
                asteroidBox = {x: asteroidItem.offsetTop, y: asteroidItem.offsetLeft, width: 106, height: 106};
                shootBox = {x: shootItem.offsetTop, y: shootItem.offsetLeft, width: 5, height: 20};
                collisionHandle(shootBox, asteroidBox, asteroidItem);
                asteroidItem = null;
            }
        }
    }
}

function asteroidGeneration() {
    li = document.createElement("li");
    astPosition = Math.floor((Math.random() * windowWith) + 1);
    li.setAttribute("class", "asteroid");
    li.setAttribute("id", "asteroid_"+c);
    li.style.left = astPosition;
    asteroidZone.appendChild(li);
    asteroids.push("asteroid_"+c);
    c++;
}

function enemyGeneration() {
    en = document.createElement("li");
    enemyPosition = Math.floor((Math.random() * windowWith) + 1);
    en.setAttribute("class", "enemy");
    en.setAttribute("id", "enemy_"+d);
    en.style.left = enemyPosition;
    enemyZone.appendChild(en);
    enemies.push("enemy_"+d);
    d++; 
}


function enemyMove() {
    for(var e = 0; e < enemies.length; e++) {
        
        enemyItem = document.getElementById(enemies[e]);
        distance = spaceShip.offsetLeft - enemyItem.offsetLeft;
        
        if(distance > 0)
        {
            enemyItem.style.left = (enemyItem.offsetLeft + 2) + "px";
        }
        else
        {
            enemyItem.style.left = (enemyItem.offsetLeft - 2) + "px";
        }

        enemyItem.style.top = enemyItem.offsetTop + 2 + "px";

        if (enemyItem.offsetTop > windowHeight) {
            enemyZone.removeChild(enemyItem);
            enemies.splice(e, 1);
        }
    }
}

function asteroidMove() {
    for(var b = 0; b < asteroids.length; b++) {
        asteroidItem = document.getElementById(asteroids[b]);
        asteroidItem.style.top = asteroidItem.offsetTop + 5 + "px";

        if (asteroidItem.offsetTop > windowHeight) {
            asteroidZone.removeChild(asteroidItem);
            asteroids.splice(b, 1);
        }

        asteroidBox = {x: asteroidItem.offsetTop, y: asteroidItem.offsetLeft, width: 106, height: 169};
        spaceShipBox = {x: spaceShip.offsetTop, y: spaceShip.offsetLeft, width: 128, height: 128};
        collisionHandle(spaceShipBox, asteroidBox, asteroidItem);
    }
}

function mainLoop() {
    requestAnimationFrame(mainLoop);   
    spaceShipMove();
    enemyMove();
    spaceShipShoot();
    bgAnimation();
    asteroidMove();
}

setInterval(function() {
    asteroidGeneration();
}, 2000);


setInterval(function() {
    enemyGeneration();
}, 3000);

keyDownHandle();
keyupHandle();
requestAnimationFrame(mainLoop);
