(function(window){

    var C=Cookies = {
        values:{},
        path:"\/",
        create:function (name,value,days,path) {
            var date= new Date();
            date.setTime(date.getTime()+(days||365)*24*60*60*1000);
            document.cookie = name+"="+escape (value )+"; expires="+date.toGMTString()+";path="+this.path;
        },
        init:function (path) {
            this.path = path || location.pathname.substr(0,location.pathname.lastIndexOf("\/")+1);
            var allCookies = document.cookie.split ('; ');
            for (var i=0;i<allCookies.length;i++) {
                var cookiesPair = allCookies[i].split('=');
                this.values[cookiesPair[0]] = unescape(cookiesPair[1]);
            }
        },
        read:function (name) {
            return this.values[name]||"";
        },
        erase:function (name) {
            this.create(name,"",-1);
            this.values[name]=null;
        }
    }
    C.init();


    var titleImage;
    var shipImage;
    var playGameImage;
    var controlsImage;
    var controlsMenuImage;
    var returnImage;

    var squareImage;
    var triangleImage;
    var mutatorImage;
    var starImage;
    var bulletImage;
    var xWingImage;

    this.loadAssets = function() {
        //preload all images
        var imagesLoaded = 0;
        var totalImages = 12;

        shipImage = new Image();
        shipImage.src = "Assets/ship.png";
        shipImage.onload = onImageLoaded;

        titleImage = new Image();
        titleImage.onload = onImageLoaded;
        titleImage.src = "Assets/title.png";

        playGameImage = new Image();
        playGameImage.onload = onImageLoaded;
        playGameImage.src = "Assets/playGame.png";

        controlsImage = new Image();
        controlsImage.onload = onImageLoaded;
        controlsImage.src = "Assets/controls.png";

        controlsMenuImage = new Image();
        controlsMenuImage.onload = onImageLoaded;
        controlsMenuImage.src = "Assets/controlMenu.png";

        returnImage = new Image();
        returnImage.onload = onImageLoaded;
        returnImage.src = "Assets/return.png";

        squareImage = new Image();
        squareImage.onload = onImageLoaded;
        squareImage.src = "Assets/Enemies/Squares/1.png";

        triangleImage = new Image();
        triangleImage.onload = onImageLoaded;
        triangleImage.src = "Assets/Enemies/Triangles/1.png";

        mutatorImage = new Image();
        mutatorImage.onload = onImageLoaded();
        mutatorImage.src = "Assets/Enemies/Mutators/1.png";

        starImage = new Image();
        starImage.onload = onImageLoaded;
        starImage.src = "Assets/Enemies/Stars/1.png";

        bulletImage = new Image();
        bulletImage.onload = onImageLoaded;
        bulletImage.src = "Assets/bullet.png";

        xWingImage = new Image();
        xWingImage.onload = onImageLoaded;
        xWingImage.src = "Assets/Enemies/XWings/1.png";

        function onImageLoaded() {
            imagesLoaded++;

            if (imagesLoaded === totalImages) {
                window.squareImage = squareImage;
                window.triangleImage = triangleImage;
                window.mutatorImage = mutatorImage;
                window.starImage = starImage;
                window.xWingImage = xWingImage;
                window.bulletImage = bulletImage;
                window.init();
            }
        }
    };

    var stage;
    var ship;
    var myCanvas;
    var TitleView;
    var level = 0;
    var enemies = [];
    window.enemies = enemies;
    var previousWaveStartTime = window.now();
    var score = 0;
    var highscore = parseInt(C.read("highscore"))||0;
    var gamepadSupportAvailable = window.Modernizr.gamepads;
    if (gamepadSupportAvailable) {
        var gamepad = new window.Gamepad();
        window.gamepad = gamepad;
        var previousLeftAnalogDegrees = null;
        var AXIS_THRESHOLD = 0.75;
        if (gamepad.init()) {
            gamepad.bind(window.Gamepad.Event.BUTTON_UP, function(e) {
                if (e.mapping === 16) {
                    if (ship !== undefined) {
                        if (ship._alive) {
                            ship._alive = false;
                        } else {
                            window.removeMenu();
                            window.removeTitleScreen();
                            window.newGame();
                        }

                    } else {
                        window.removeMenu();
                        window.removeTitleScreen();
                        window.newGame();
                    }
                }
            });

        }
    }

    this.init = function() {
        // Create the canvas-element
        myCanvas = document.createElement('canvas');
        myCanvas.id = "demoCanvas";
        myCanvas.width = window.innerWidth;
        myCanvas.height = window.innerHeight;
        window.myCanvas = myCanvas;
        document.body.appendChild(myCanvas);

        stage = new window.createjs.Stage(myCanvas);
        window.stage = stage;
        stage.mouseEventsEnabled = true;
        window.createjs.Ticker.addListener(window);
        window.createjs.Ticker.useRAF = true;
        window.createjs.Ticker.setFPS(30);

        this.showTitleScreen();
    };

    this.showTitleScreen = function() {
        TitleView = new window.createjs.Container();

        var title = new window.createjs.Bitmap(titleImage);
        title.x = (myCanvas.width / 2) - (title.image.width / 2);
        title.y = 160;
        title.name = 'title';

        TitleView.addChild(title);
        window.addMenu();
        stage.addChild(TitleView);
    };

    this.addMenu = function() {
        var playGame = new window.createjs.Bitmap(playGameImage);
        playGame.x = (myCanvas.width / 2) - (playGame.image.width / 2);
        playGame.y = 320;
        playGame.name = "playGame";

        playGame.onClick = function() {
            window.removeMenu();
            window.removeTitleScreen();
            window.newGame();
        };
        TitleView.addChild(playGame);

        var controls = new window.createjs.Bitmap(controlsImage);
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = 350;
        controls.name = "controls";

        controls.onClick = function() {
            window.removeMenu();
            window.showControls();
        };
        TitleView.addChild(controls);


//        var optionsImage = new Image();
//        optionsImage.onload = onOptionsImageLoaded;
//        optionsImage.src = "Assets/options.png";
//        function onOptionsImageLoaded(e) {
//            var options = new window.createjs.Bitmap(optionsImage);
//            options.x = (myCanvas.width / 2) - (options.image.width / 2);
//            options.y = 380;
//            options.name = "options";
//
//            options.onClick = function() {
//                window.removeMenu();
//                window.showOptions();
//            };
//            TitleView.addChild(options);
//        }
    };

    this.removeMenu = function() {
        TitleView.removeChildAt(1,2);
    };

    this.removeTitleScreen = function() {
        TitleView.removeChildAt(0);
    };

    this.showControls = function() {
        var controls = new window.createjs.Bitmap(controlsMenuImage);
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = 320;
        controls.name = "controlsMenu";

        TitleView.addChild(controls);

        var returnb = new window.createjs.Bitmap(returnImage);
        returnb.x = (myCanvas.width / 2) - (returnb.image.width / 2);
        returnb.y = 500;
        returnb.name = "returnb";

        returnb.onClick = function() {
            window.removeControls();
            window.addMenu();
        };

        TitleView.addChild(returnb);

    };

    this.removeControls = function() {
        TitleView.removeChildAt(1,2);
    };

    this.newGame = function () {
        playing = true;
        this.resetPoints();
        if (ship === undefined) {
            ship = new window.Ship(shipImage, 25, "normal", 7, 10, 10);

            document.onkeydown = function(e) {
                ship.onKeyDown(ship, e);
            };
            document.onkeyup = function(e) {
                ship.onKeyUp(ship, e);
            };

            if (gamepad.init()) {
                gamepad.bind(window.Gamepad.Event.CONNECTED, function(device) {
                    window.console.log("connected a gamepad!", device);
                });

                gamepad.bind(window.Gamepad.Event.DISCONNECTED, function(device) {
                    // pseudocode
//                if (game playing) {
//                    pause game;
//                }
//                alert user that gamepad disconnected
                });

                gamepad.bind(window.Gamepad.Event.UNSUPPORTED, function(device) {
                    // inform user that we don't have a mapping for their controller so it might not work as expected
                });

                gamepad.bind(window.Gamepad.Event.BUTTON_UP, function(e) {
                    if (e.mapping === 5) {
                        ship.dropBomb();
                    }
                });
            }
        }
        this.updateBombs();
        ship._alive = true;
        window.ship = ship;

        ship.setPosition(myCanvas.width/2, myCanvas.height/2);
        stage.addChild(ship);
        //1111111111stage.update();
    };

    this.gameOver = function() {
        stage.removeAllChildren();
        //1111111111stage.update();
        for (var i = enemies.length - 1; i >= 0; i--) {
            enemies[i].die();
        }
        for (var j = enemies.length - 1; j >= 0; j--) {
            enemies[j].die();
        }
//        enemies = [];
        level = 0;
        window.showTitleScreen();
        playing = false;
    };

    this.createTriangleEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Triangle("Triangle" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {
                x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            }

            var y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {
                y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            }

            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createSquareEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Square("Square" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {
                x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            }

            var y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {
                y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            }

            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createStarEnemies = function(amount, radiusFromShip, x, y) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Star("Star" + (i + 1) ,stage));
            if (x === undefined) {
                var x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
                while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {
                    x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
                }
            } else if (x < enemies[length + i].radius ||
                x > stage.canvas.width - enemies[length + i]) {

            }
            if (y === undefined) {
                var y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
                while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {
                    y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
                }
            }
            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createXWingEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.XWing("XWing" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {
                x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            }

            var y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {
                y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            }

            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createMutatorEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Mutator("Mutator" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {
                x = Math.floor(Math.random() * (myCanvas.width - enemies[length + i].radius));
            }

            var y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {
                y = Math.floor(Math.random() * (myCanvas.height - enemies[length + i].radius));
            }

            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.addPoints = function(amount) {
        score += amount;
        var scoreDiv = document.getElementById("score");
        scoreDiv.innerText = "Score: " + score + " Bombs: " + ship.bombs;

        if(score > highscore) {
            highscore = score;
            window.updateHighscore();
        }
    };

    this.updateHighscore = function() {
        document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
        C.create("highscore", highscore);
    };

    this.subtractPoints = function(amount) {
        score -= amount;
        var scoreDiv = document.getElementById("score");
        scoreDiv.innerText = "Score: " + score + " Bombs: " + ship.bombs;
    };

    this.updateLevel = function() {
        var levelDiv = document.getElementById("levels");
        levelDiv.innerText = "Level: " + level;
    };

    this.updateBombs = function() {
        var scoreDiv = document.getElementById("score");
        scoreDiv.innerText = "Score: " + score + " Bombs: " + ship.bombs;
    };

    this.resetPoints = function() {
        score = 0;
        var scoreDiv = document.getElementById("score");
        scoreDiv.innerText = "Score: " + score + " Bombs: ";
    };

    this.allEnemiesDead = function() {
        if (enemies.length === 0) {
            this.updateBombs();
            return true;
        } else {
            return false;
        }
    };

    this.createLevel = function(level) {
        switch(level) {
            case 1:
                this.createStarEnemies(1,100);
                break;
            case 2:
                this.createXWingEnemies(2,100);
                break;
            case 3:
                this.createSquareEnemies(3,100);
                break;
            case 4:
                this.createMutatorEnemies(4,100);
                break;
            case 5:
                this.createTriangleEnemies(5,100);
                break;
            case 6:
                this.createLevel(1);
                this.createLevel(1);
                break;
            case 7:
                this.createLevel(1);
                this.createLevel(2);
                break;
            case 8:
                this.createLevel(1);
                this.createLevel(3);
                break;
            case 9:
                this.createLevel(1);
                this.createLevel(4);
                break;
            case 10:
                this.createLevel(1);
                this.createLevel(5);
                break;
            case 11:
                this.createLevel(2);
                this.createLevel(2);
                break;
            case 12:
                this.createLevel(2);
                this.createLevel(3);
                break;
            case 13:
                this.createLevel(2);
                this.createLevel(4);
                break;
            case 14:
                this.createLevel(2);
                this.createLevel(5);
                break;
            case 15:
                this.createLevel(3);
                this.createLevel(3);
                break;
            case 16:
                this.createLevel(3);
                this.createLevel(4);
                break;
            case 17:
                this.createLevel(3);
                this.createLevel(5);
                break;
            case 18:
                this.createLevel(4);
                this.createLevel(4);
                break;
            case 19:
                this.createLevel(4);
                this.createLevel(5);
                break;
            case 20:
                this.createLevel(5);
                this.createLevel(5);
                break;
            case 21:
                this.createLevel(2);
                this.createLevel(5);
                break;
            case 22:
                this.createXWingEnemies(500,50);
                break;
        }
    };

    this.nextWave = function() {
        var now = window.now();
        if (now > previousWaveStartTime + 3000) {
            previousWaveStartTime = now;

            level++;
            this.updateLevel();
             this.createLevel(level);

//            var random = window.randomWhole(100);

//            if (random === 1) {
//                this.createXWingEnemies(500,50);
//            } else {
//                this.createStarEnemies(5, 50);
//                this.createXWingEnemies(5, 50);
//                this.createMutatorEnemies(5, 50);
//                this.createSquareEnemies(5, 150);
//                this.createTriangleEnemies(5, 100);
//            }

        }

    };

    this.tick = function(){
        stage.tick();
        if (ship !== undefined && playing) {
            if (ship._alive) {
                //////////
                if (gamepad.gamepads[0] !== undefined) {
                    var rightXDelta = gamepad.gamepads[0].state.RIGHT_STICK_X;
                    var rightYDelta = gamepad.gamepads[0].state.RIGHT_STICK_Y;
                    var rightArcTangentRadians = Math.atan2(rightXDelta, rightYDelta);

                    var rightArcTangentDegrees = Math.floor(180 / Math.PI * rightArcTangentRadians);
                    var rightAiming = (rightArcTangentDegrees * -1) + 180;

                    if (gamepad.gamepads[0].state.RIGHT_STICK_X > AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.RIGHT_STICK_X < -AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.RIGHT_STICK_Y > AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.RIGHT_STICK_Y < -AXIS_THRESHOLD) {
                        ship.fire(rightAiming);
                    }

                    var leftXDelta = gamepad.gamepads[0].state.LEFT_STICK_X;
                    var leftYDelta = gamepad.gamepads[0].state.LEFT_STICK_Y;
                    var leftArcTangentRadians = Math.atan2(leftXDelta, leftYDelta);

                    var leftArcTangentDegrees = Math.floor(180 / Math.PI * leftArcTangentRadians);
                    var leftAiming = (leftArcTangentDegrees * -1 ) + 180;

                    if (previousLeftAnalogDegrees !== leftAiming)
                    {
                        ship.setRotation(leftAiming);
                        previousLeftAnalogDegrees = leftAiming;
                    }

                    if (gamepad.gamepads[0].state.LEFT_STICK_X > AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.LEFT_STICK_X < -AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.LEFT_STICK_Y > AXIS_THRESHOLD ||
                        gamepad.gamepads[0].state.LEFT_STICK_Y < -AXIS_THRESHOLD) {
                        ship.moveForward();
                    }
                }
                //////////
                ship.checkMovement();
                ship.checkBounds();
                if (this.allEnemiesDead()) {
                    this.nextWave();
                }
            }
            else {
                this.gameOver();
            }
        }
        stage.update();
    };
})(window);

