(function(window){
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
//    var gamepadSupportAvailable = Modernizr.gamepads;
//    if (gamepadSupportAvailable) {
//        console.log("Your browser supports a gamepad, why not connect one up?");
//        var gamepad = new Gamepad();
//        if (gamepad.init()) {
//
//            gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
//                if (e.control === "HOME") {
//                    removeTitleScreen();
//                }
//            });
//        }
//    }

////////////////////////////////////////////////
    var preloader;
    var manifest;
    var ship2;
    var title;
    var playGameb;
    var controlb;
    var optionb;
    var controls;
    var returnb;
    var star1;
    var xWing1;
    var mutator1;
////////////////////////////////////////////////
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

/////////////////////////////////////////////////
        manifest = [
            {src:"Assets/ship2.png", id:"ship2"},
            {src:"Assets/title.png", id:"title"},
            {src:"Assets/playGame.png", id:"playGameb"},
            {src:"Assets/controls.png", id:"controlb"},
            {src:"Assets/options.png", id:"optionb"},
            {src:"Assets/controlMenu.png", id:"controls"},
            {src:"Assets/return.png", id:"returnb"},
            {src:"Assets/Enemies/Stars/1.png", id:"star1"},
            {src:"Assets/Enemies/XWings/1.png", id:"xWing1"},
            {src:"Assets/Enemies/Mutators/1.png", id:"mutator1"}];
        var queue = new window.createjs.LoadQueue();
        window.queue = queue;

        queue.installPlugin(window.createjs.Sound);
        queue.addEventListener("fileload", handleFileLoad);
        queue.addEventListener("complete", handleComplete);
        queue.loadManifest(manifest);
        queue.load();

        function handleFileLoad(event) {
            var item = event.item; // A reference to the item that was passed in
            var type = item.type;

            // Add any images to the page body.
            if (type === window.createjs.LoadQueue.IMAGE) {
                //document.body.appendChild(event.result);
            }
        }

        function handleComplete(event) {

        }
////////////////////////////////////////////////
//        stage.enableMouseOver();
        stage.mouseEventsEnabled = true;
        window.createjs.Ticker.setFPS(30);

        this.showTitleScreen();
    };

    this.showTitleScreen = function() {
        TitleView = new createjs.Container();

        var title = new createjs.Bitmap("Assets/title.png");
        title.x = (myCanvas.width / 2) - (title.image.width / 2);
        title.y = 160;
        title.name = 'title';

        TitleView.addChild(title);
        addMenu();
        stage.addChild(TitleView);
        stage.update();

    };

    this.addMenu = function() {
        var playGame = new window.createjs.Bitmap("Assets/playGame.png");
        playGame.x = (myCanvas.width / 2) - (playGame.image.width / 2);
        playGame.y = 320;
        playGame.name = "playGame";

        var controls = new window.createjs.Bitmap("Assets/controls.png");
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = playGame.y + 30;
        controls.name = "controls";

        var options = new window.createjs.Bitmap("Assets/options.png");
        options.x = (myCanvas.width / 2) - (options.image.width / 2);
        options.y = controls.y + 30;
        options.name = "options";
        TitleView.addChild(playGame, controls, options);
        stage.update();
        // Button Listeners

        playGame.onClick = function() {
            removeMenu();
            removeTitleScreen();
            newGame();
        };

        controls.onClick = function() {
//            removeTitleScreen();
            removeMenu();
            showControls();
        };

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
        var controls = new window.createjs.Bitmap("Assets/controlMenu.png");
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = 320;
        controls.name = "controls";

        var returnb = new window.createjs.Bitmap("Assets/return.png");
        returnb.x = (myCanvas.width / 2) - (returnb.image.width / 2);
        returnb.y = controls.y + controls.image.height + 30;
        returnb.name = "returnb";

        TitleView.addChild(controls, returnb);
        stage.update();

        // Button Listeners

        returnb.onClick = function() {
            removeControls();
            addMenu();
        };

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
            ship = new window.Ship("Assets/ship2.png", 100, 25, 5, "normal", 7, 5, 10, stage);

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
                    if (e.mapping === 5) {
//                        ship.fire(ship.rotation);
                        var rightXDelta = gamepad.gamepads[0].state.RIGHT_STICK_X;
                        var rightYDelta = gamepad.gamepads[0].state.RIGHT_STICK_Y;
                        var rightArcTangentRadians = Math.atan2(rightXDelta, rightYDelta);

                        var rightArcTangentDegrees = Math.floor(180 / Math.PI * rightArcTangentRadians);
                        var rightAiming = (rightArcTangentDegrees * -1) + 180;

                        if (gamepad.gamepads[0].state.RIGHT_STICK_X > AXIS_THRESHOLD ||
                            gamepad.gamepads[0].state.RIGHT_STICK_X < -AXIS_THRESHOLD ||
                            gamepad.gamepads[0].state.RIGHT_STICK_Y > AXIS_THRESHOLD ||
                            gamepad.gamepads[0].state.RIGHT_STICK_Y < -AXIS_THRESHOLD) {
                        }
                        ship.fire(rightAiming);
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
        window.ship = ship;

        ship.setPosition(myCanvas.width/2, myCanvas.height/2);
        this.createStarEnemies(5, 50);
        this.createXWingEnemies(5, 50);
        this.createMutatorEnemies(5, 50);
        this.createSquareEnemies(5, 50);
        this.createTriangleEnemies(5, 50);
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
                ship._alive = true;
                gameOver();
            }
        }
        stage.update();
    };
})(window);

