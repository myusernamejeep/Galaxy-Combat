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
            ship = new window.Ship("Assets/ship2.png", 100, 25, 5, "normal", 7, 2, 10, stage);

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
                });
            }
        }
        window.ship = ship;


        ship.setPosition(myCanvas.width/2, myCanvas.height/2);
        this.createStarEnemies(5);
        this.createXWingEnemies(5);
        stage.addChild(ship);
        stage.update();


    };

    this.gameOver = function() {
        stage.removeAllChildren();
        stage.update();
        enemies = [];
        showTitleScreen();
    };

    this.createStarEnemies = function(amount) {
        var length = enemies.length;
        for (var i = 0; i <= amount; i ++) {
            enemies.push(new window.Star("Star" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - 20 < x && x < ship.x + 20) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - 20 < y && y < ship.y + 20) {                   //between ship.x - 10 & ship.x + 10
                y = Math.floor(Math.random() * myCanvas.width);
            }
            enemies[length + i].setPosition(x, y);
            stage.addChild(enemies[length + i]);
        }
        window.enemies = enemies;
    };

    this.createXWingEnemies = function(amount) {
        var length = enemies.length;
        for (var i = 0; i <= amount; i ++) {
            enemies.push(new window.XWing("XWing" + (i + 1) ,stage));
            var x = Math.floor(Math.random() * myCanvas.width);
            while (ship.x - 20 < x && x < ship.x + 20) {                   //between ship.x - 10 & ship.x + 10
                x = Math.floor(Math.random() * myCanvas.width);
            }

            var y = Math.floor(Math.random() * myCanvas.height);
            while (ship.y - 20 < y && y < ship.y + 20) {                   //between ship.x - 10 & ship.x + 10
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
        if (stage.tick % 1000 === 0) {
            console.log("1 second");
        }
        if (ship !== undefined) {
            if (ship._alive) {
                ship.checkMovement();
                ship.checkBounds();
                if (window.enemies.length === 0) {
                    window.createStarEnemies(5);
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

