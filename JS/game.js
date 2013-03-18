(function(window){
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
    var enemies = [];
    var score = 0;
    var gamepadSupportAvailable = window.Modernizr.gamepads;
    if (gamepadSupportAvailable) {
        window.console.log("Your browser supports a gamepad, why not connect one up?");
        // inform user they can connect a gamepad up and use it to play
        var gamepad = new window.Gamepad();
        var previousLeftAnalogDegrees = null;
        var AXIS_THRESHOLD = 0.75;
        if (gamepad.init()) {
            gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
                if (e.mapping === 16) {
                    removeMenu();
                    removeTitleScreen();
                    newGame();
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
        window.createjs.Ticker.setFPS(30);

        this.showTitleScreen();
    };

    this.showTitleScreen = function() {
        TitleView = new createjs.Container();

        var title = new window.createjs.Bitmap(titleImage);
        title.x = (myCanvas.width / 2) - (title.image.width / 2);
        title.y = 160;
        title.name = 'title';

        TitleView.addChild(title);
        addMenu();
        stage.addChild(TitleView);
        stage.update();

    };

    this.addMenu = function() {
        var playGame = new window.createjs.Bitmap(playGameImage);
        playGame.x = (myCanvas.width / 2) - (playGame.image.width / 2);
        playGame.y = 320;
        playGame.name = "playGame";

        playGame.onClick = function() {
            removeMenu();
            removeTitleScreen();
            newGame();
        };
        TitleView.addChild(playGame);

        var controls = new window.createjs.Bitmap(controlsImage);
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = 350;
        controls.name = "controls";

        controls.onClick = function() {
//            removeTitleScreen();
            removeMenu();
            showControls();
        };
        TitleView.addChild(controls);

        options.onClick = function() {
//            removeTitleScreen();
            removeMenu();
            showOptions();
        };
    };

    this.removeMenu = function() {
        TitleView.removeChildAt(1,2,3);
        stage.update();
    };

    this.removeTitleScreen = function() {
        TitleView.removeChildAt(0);
        stage.update();
    };

    this.showControls = function() {
        window.console.log("Showed controls");
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
            removeControls();
            addMenu();
        };

        TitleView.addChild(returnb);

    };

    this.removeControls = function() {
        TitleView.removeChildAt(1,2);
        stage.update();
    };

    this.showOptions = function() {
        window.console.log("Showed options");
    };

    this.newGame = function () {
        if (ship === undefined) {
            ship = new window.Ship(shipImage, 25, "normal", 7, 10, 10);

            window.createjs.Ticker.addListener(this);
            document.onkeydown = function(e) {
                ship.onKeyDown(ship, e);
            };
            document.onkeyup = function(e) {
                ship.onKeyUp(ship, e);
            };

            if (gamepad.init()) {
                gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
                    window.console.log("connected a gamepad!", device);
                });

                gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
                    // pseudocode
//                if (game playing) {
//                    pause game;
//                }
//                alert user that gamepad disconnected
                });

                gamepad.bind(Gamepad.Event.UNSUPPORTED, function(device) {
                    // inform user that we don't have a mapping for their controller so it might not work as expected
                });

                gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
                    if (e.mapping === 7) {
                        ship.dropBomb();
                    }
                });

                gamepad.bind(Gamepad.Event.TICK, function(gamepads) {

//                    var rightXDelta = gamepad.gamepads[0].state.RIGHT_STICK_X;
//                    var rightYDelta = gamepad.gamepads[0].state.RIGHT_STICK_Y;
//                    var rightArcTangentRadians = Math.atan2(rightXDelta, rightYDelta);
//
//                    var rightArcTangentDegrees = Math.floor(180 / Math.PI * rightArcTangentRadians);
//                    var rightAiming = (rightArcTangentDegrees * -1) + 180;
//
//                    if (gamepad.gamepads[0].state.RIGHT_STICK_X > AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.RIGHT_STICK_X < -AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.RIGHT_STICK_Y > AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.RIGHT_STICK_Y < -AXIS_THRESHOLD) {
//                        ship.fire(rightAiming);
//                    }
//
//                    var leftXDelta = gamepad.gamepads[0].state.LEFT_STICK_X;
//                    var leftYDelta = gamepad.gamepads[0].state.LEFT_STICK_Y;
//                    var leftArcTangentRadians = Math.atan2(leftXDelta, leftYDelta);
//
//                    var leftArcTangentDegrees = Math.floor(180 / Math.PI * leftArcTangentRadians);
//                    var leftAiming = (leftArcTangentDegrees * -1 ) + 180;
//
//                    if (previousLeftAnalogDegrees !== leftAiming)
//                    {
//                        ship.setRotation(leftAiming);
//                        previousLeftAnalogDegrees = leftAiming;
//                    }
//
//                    if (gamepad.gamepads[0].state.LEFT_STICK_X > AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.LEFT_STICK_X < -AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.LEFT_STICK_Y > AXIS_THRESHOLD ||
//                        gamepad.gamepads[0].state.LEFT_STICK_Y < -AXIS_THRESHOLD) {
//                        ship.moveForward();
//                    }
                });
            }
        }
        ship._alive = true;
        window.ship = ship;

        ship.setPosition(myCanvas.width/2, myCanvas.height/2);
        this.createStarEnemies(5, 50);
        this.createXWingEnemies(5, 50);
        this.createMutatorEnemies(5, 50);
        this.createSquareEnemies(5, 50);
        this.createTriangleEnemies(5, 100);
        stage.addChild(ship);
        stage.update();
    };

    this.gameOver = function() {
        stage.removeAllChildren();
        stage.update();
        enemies = [];
        showTitleScreen();
    };

    this.createTriangleEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Triangle("Triangle" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
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
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
            }
            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createStarEnemies = function(amount, radiusFromShip) {
        var length = enemies.length;
        for (var i = 0; i < amount; i ++) {
            enemies.push(new window.Star("Star" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
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
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
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
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - radiusFromShip < x && x < ship.x + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - radiusFromShip < y && y < ship.y + radiusFromShip) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
            }
            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.addPoints = function() {
        score += 10;
        var scoreDiv = document.getElementById("score");
        scoreDiv.innerText = "Score: " + score;
    };

    this.tick = function(){
        stage.tick();
        if (ship !== undefined) {
            if (ship._alive) {
                //////////
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
                //////////
                ship.checkMovement();
                ship.checkBounds();
                if (window.enemies.length === 0) {
                    window.createStarEnemies(5, 50);
                }
            }
            else {
                gameOver();
            }
        }
        stage.update();
    };
})(window);

