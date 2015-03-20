"use strict";

function Game() {

    var self = this,
        windowWith = window.innerWidth,
        windowHeight = window.innerHeight,
        requestId = 0;

    this.startGame = function() {
        self.keyboard.keyDownHandle();
        self.keyboard.keyupHandle();
        requestId = requestAnimationFrame(self.gameLoop);
    }
    
    this.stopGame = function() {
        window.cancelAnimationFrame(requestId);
    }

    this.gameLoop = function() {
        requestId = requestAnimationFrame(self.gameLoop);
        self.spaceShip.move();
        self.spaceShip.shoot();
        self.board.bgAnimation();
        self.asteroidsManager.move();
        self.enemyShootManager.move();
        self.enemiesManager.move();
    };

    this.keyboard = {
        press: false,
        up: false,
        down: false,
        left: false,
        right: false,
        keyDownHandle: function() {
            document.addEventListener("keydown", function(event) {
                switch (event.keyCode) {
                    case 37:
                        self.keyboard.left = true;
                        break;
                    case 39:
                        self.keyboard.right = true;
                        break;
                    case 38:
                        self.keyboard.up = true;
                        break;
                    case 40:
                        self.keyboard.down = true;
                        break;
                    case 32:
                        self.keyboard.isShooting = true;
                        break;
                }

                self.keyboard.press = true;
                event.preventDefault();
            });
        },
        keyupHandle: function() {
            document.addEventListener("keyup", function(event) {
                switch (event.keyCode) {
                    case 37:
                        self.keyboard.left = false;
                        break;
                    case 39:
                        self.keyboard.right = false;
                        break;
                    case 38:
                        self.keyboard.up = false;
                        break;
                    case 40:
                        self.keyboard.down = false;
                        break;
                    case 32:
                        self.keyboard.isShooting = false;
                        break;
                }
            });
        }
    };

    this.spaceShip = {
        htmlElement: document.getElementById("spaceShip"),
        shootZone: document.getElementById("shootzone"),
        speed: 13,
        shoots: [],
        shootIndex: 1,
        shootItem: null,
        shootStart: true,
        asteroidItem: null,
        asteroidBox: null,
        shootBox: null,
        move: function() {
            if (self.keyboard.press) {
                if (self.keyboard.left && this.htmlElement.offsetLeft - 15 > 0) {
                    this.htmlElement.style.left = this.htmlElement.offsetLeft - this.speed;
                }

                if (self.keyboard.right && this.htmlElement.offsetLeft + 143 < windowWith) {
                    this.htmlElement.style.left = spaceShip.offsetLeft + this.speed;
                }

                if (self.keyboard.up && this.htmlElement.offsetTop - 15 > 0) {
                    this.htmlElement.style.top = this.htmlElement.offsetTop - this.speed;
                }

                if (self.keyboard.down && this.htmlElement.offsetTop + 151 < windowHeight) {
                    this.htmlElement.style.top = this.htmlElement.offsetTop + this.speed;
                }
            }
        },
        shoot: function() {
            if (self.keyboard.isShooting) {
                var li = document.createElement("li");
                li.setAttribute("class", "shoot");
                li.setAttribute("id", this.shootIndex);
                li.style.top = this.htmlElement.offsetTop;
                li.style.left = this.htmlElement.offsetLeft + 50;
                this.shootZone.appendChild(li);
                this.shoots.push(this.shootIndex);
                this.shootIndex++;
                this.shootStart = true;
            }
            if (this.shootStart) {
                for (var a = 0; a < this.shoots.length; a++) {
                    this.shootItem = document.getElementById(this.shoots[a]);
                    this.shootItem.style.top = this.shootItem.offsetTop - 30 + "px";

                    if (this.shootItem.offsetTop < -1) {
                        this.shootZone.removeChild(this.shootItem);
                        this.shoots.splice(a, 1);
                    }

                    //A Revoir
                    for (var b = 0; b < self.factories.asteroids.length; b++) {
                        this.asteroidItem = document.getElementById(self.factories.asteroids[b]);
                        this.asteroidBox = {
                            x: this.asteroidItem.offsetTop,
                            y: this.asteroidItem.offsetLeft,
                            width: 106,
                            height: 106
                        };
                        this.shootBox = {
                            x: this.shootItem.offsetTop,
                            y: this.shootItem.offsetLeft,
                            width: 5,
                            height: 20
                        };
                        self.collisionHandle.collision(this.shootBox, this.asteroidBox, this.asteroidItem);
                        this.asteroidItem = null;
                    }
                }
            }

        }
    };

    this.board = {
        htmlElement_1: document.getElementById("bg_1"),
        htmlElement_2: document.getElementById("bg_2"),
        bgAnimation: function() {
            this.htmlElement_2.style.top = this.htmlElement_2.offsetTop + 1 + "px";
            this.htmlElement_1.style.top = this.htmlElement_1.offsetTop + 1 + "px";

            if (this.htmlElement_1.offsetTop === 0) {
                this.htmlElement_2.style.top = -windowHeight;
            } else if (this.htmlElement_1.offsetTop === windowHeight) {
                this.htmlElement_1.style.top = -windowHeight;
            }
        }
    };

    this.factories = {
        htmlElement_1: document.getElementById("enemyzone"),
        htmlElement_2: document.getElementById("enemies_shoot_zone"),
        htmlElement_3: document.getElementById("asteroidzone"),
        enemies: [],
        enemiesShoots: [],
        enemyIndex: 1,
        enemyShootIndex: 1,
        enemyHtmlElement: null,
        enemyShootHtmlElement: null,
        enemyPosition: null,
        enemyItem: null,
        asteroids: [],
        asteroidPosition: null,
        asteroidHtmlElement: null,
        asteroidIndex: 1,
        asteroidInterval: null,
        enemyInterval: null,
        enemyShootInterval:null,
        initFactories: function() {
            this.asteroidInterval = setInterval(function(){self.factories.asteroidGeneration()}, 2000);
            this.enemyInterval = setInterval(function(){self.factories.enemyGeneration()}, 3000);
            this.enemyShootInterval = setInterval(function(){self.factories.enemyShootGeneration()}, 1000);
        },
        enemyGeneration: function() {
            this.enemyHtmlElement = document.createElement("li");
            this.enemyPosition = Math.floor((Math.random() * windowWith) + 1);
            this.enemyHtmlElement.setAttribute("class", "enemy");
            this.enemyHtmlElement.setAttribute("id", "enemy_" + this.enemyIndex);
            this.enemyHtmlElement.style.left = this.enemyPosition;
            this.htmlElement_1.appendChild(this.enemyHtmlElement);
            this.enemies.push("enemy_" + this.enemyIndex);
            this.enemyIndex++;
        },
        enemyShootGeneration: function() {
            for (var w = 0; w < this.enemies.length; w++) {
                this.enemyItem = document.getElementById(this.enemies[w]);
                this.enemyShootHtmlElement = document.createElement("li");
                this.enemyShootHtmlElement.setAttribute("class", "enemy_shoot");
                this.enemyShootHtmlElement.setAttribute("id", "enemiesShoot_" + this.enemyShootIndex);
                this.enemyShootHtmlElement.style.top = this.enemyItem.offsetTop + 66;
                this.enemyShootHtmlElement.style.left = this.enemyItem.offsetLeft + 32;
                this.htmlElement_2.appendChild(this.enemyShootHtmlElement);
                this.enemiesShoots.push("enemiesShoot_" + this.enemyShootIndex);
                this.enemyShootIndex++;
            }
        },
        asteroidGeneration: function() {
            this.asteroidHtmlElement = document.createElement("li");
            this.asteroidPosition = Math.floor((Math.random() * windowWith) + 1);
            this.asteroidHtmlElement.setAttribute("class", "asteroid");
            this.asteroidHtmlElement.setAttribute("id", "asteroid_" + this.asteroidIndex);
            this.asteroidHtmlElement.style.left = this.asteroidPosition;
            this.htmlElement_3.appendChild(this.asteroidHtmlElement);
            this.asteroids.push("asteroid_" + this.asteroidIndex);
            this.asteroidIndex++;
        }
    };

    this.enemiesManager = {
        enemyItem: null,
        distance: null,
        move: function() {
            for (var e = 0; e < self.factories.enemies.length; e++) {
                this.enemyItem = document.getElementById(self.factories.enemies[e]);
                this.distance = self.spaceShip.htmlElement.offsetLeft - this.enemyItem.offsetLeft;

                if (this.distance > 0) {
                    this.enemyItem.style.left = (this.enemyItem.offsetLeft + 2) + "px";
                } else {
                    this.enemyItem.style.left = (this.enemyItem.offsetLeft - 2) + "px";
                }

                this.enemyItem.style.top = this.enemyItem.offsetTop + 2 + "px";

                if (this.enemyItem.offsetTop > windowHeight) {
                    self.factories.htmlElement_1.removeChild(this.enemyItem);
                    self.factories.enemies.splice(e, 1);
                }
            }
        }
    };

    this.asteroidsManager = {
        asteroidItem: null,
        asteroidBox: null,
        spaceShipBox: null,
        move: function() {
            for (var b = 0; b < self.factories.asteroids.length; b++) {
                this.asteroidItem = document.getElementById(self.factories.asteroids[b]);
                this.asteroidItem.style.top = this.asteroidItem.offsetTop + 5 + "px";

                if (this.asteroidItem.offsetTop > windowHeight) {
                    self.factories.htmlElement_3.removeChild(this.asteroidItem);
                    self.factories.asteroids.splice(b, 1);
                }

                this.asteroidBox = {
                    x: this.asteroidItem.offsetTop,
                    y: this.asteroidItem.offsetLeft,
                    width: 106,
                    height: 169
                };
                this.spaceShipBox = {
                    x: self.spaceShip.htmlElement.offsetTop,
                    y: self.spaceShip.htmlElement.offsetLeft,
                    width: 128,
                    height: 128
                };

                self.collisionHandle.collision(this.spaceShipBox, this.asteroidBox, this.asteroidItem);
            }
        }
    };

    this.enemyShootManager = {
        enemyShootItem: null,
        move: function() {
            for (var t = 0; t < self.factories.enemiesShoots.length; t++) {
                this.enemyShootItem = document.getElementById(self.factories.enemiesShoots[t]);
                this.enemyShootItem.style.top = this.enemyShootItem.offsetTop + 3 + "px";
                if (this.enemyShootItem.offsetTop > windowHeight) {
                    self.factories.htmlElement_2.removeChild(this.enemyShootItem);
                    self.factories.enemiesShoots.splice(t, 1);
                }
            }
        }
    };

    this.collisionHandle = {
        explosion: "url('img/explosion.gif') no-repeat",
        collision: function(box1, box2, itemToDestroy) {
            if (box1.x < box2.x + box2.width && box1.x + box1.width > box2.x && box1.y < box2.y + box2.height && box1.height + box1.y > box2.y) {
                itemToDestroy.style.background = this.explosion;
            }
        }
    };
    
    this.changingNavigatorTabHandle = function(){
        window.addEventListener('focus', function() {
           self.startGame();
           self.factories.initFactories();
            console.log('focus');
        },false);

        window.addEventListener('blur', function() {
           self.stopGame();
           window.clearInterval(self.factories.asteroidInterval);
           window.clearInterval(self.factories.enemyInterval);
           window.clearInterval(self.factories.enemyShootInterval);
            console.log('unfocus');
        },false);
    };
}

var game = new Game();
game.startGame();
game.factories.initFactories();
game.changingNavigatorTabHandle();
