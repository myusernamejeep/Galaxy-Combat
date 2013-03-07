/**
 * Created with JetBrains WebStorm.
 * User: jakechampion
 * Date: 06/03/2013
 * Time: 20:36
 * To change this template use File | Settings | File Templates.
 */
(function(window){
    var stage;
    var ship;
    var myCanvas;
    var TitleView;
    // menu
    var title;
    var controlB;
    var optionB;
    var controls;
    var returnB;
    var playGameB;

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
        document.body.appendChild(myCanvas);

        stage = new createjs.Stage(myCanvas);
//        stage.enableMouseOver();
        stage.mouseEventsEnabled = true;
        createjs.Ticker.setFPS(30);

        preloadAssets();
    };

    this.preloadAssets = function() {
        var totalLoaded = 0;
        var manifest = [
            {src:"Assets/title.png", id:"title"},
            {src:"Assets/controls.png", id:"controlB"},
            {src:"Assets/options.png", id:"optionB"},
            {src:"Assets/controlMenu.png", id:"controls"},
            {src:"Assets/return.png", id:"returnB"},
            {src:"Assets/playGame.png", id:"playGameB"}
        ];

        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("fileload", handleFileLoad);
//        queue.addEventListener("complete", handleComplete);
//        queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
        queue.loadManifest(manifest);

//        function handleComplete() {
//        }

        function handleLoadComplete() {
            totalLoaded++;
            if (totalLoaded === manifest.length) {
                showTitleScreen();
            }
        }

        function handleFileLoad(event) {
            var item = event.item; // A reference to the item that was passed in
            var type = item.type;

            //triggered when an individual file completes loading

            switch(type)
            {
                case createjs.LoadQueue.IMAGE:
                    //image loaded
                    window[item.id] = new createjs.Bitmap(item.src);
                    break;

                case createjs.LoadQueue.SOUND:
                    //sound loaded
                    handleLoadComplete();
                    break;
            }
        }

    };

    this.showTitleScreen = function() {
        TitleView = new createjs.Container();

        //var title = new createjs.Bitmap("Assets/title.png");
        title.x = (myCanvas.width / 2) - (title.image.width / 2);
        title.y = 160;
        title.name = 'title';

        TitleView.addChild(title);
        addMenu();
        stage.addChild(TitleView);
        stage.update();

    };

    this.addMenu = function() {
        //var playGame = new createjs.Bitmap("Assets/playGame.png");
        playGame.x = (myCanvas.width / 2) - (playGame.image.width / 2);
        playGame.y = 320;
        playGame.name = "playGame";

        //var controls = new createjs.Bitmap("Assets/controls.png");
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = playGame.y + 30;
        controls.name = "controls";

        //var options = new createjs.Bitmap("Assets/options.png");
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
        console.log("Showed controls");
        var controls = new createjs.Bitmap("Assets/controlMenu.png");
        controls.x = (myCanvas.width / 2) - (controls.image.width / 2);
        controls.y = 320;
        controls.name = "controls";

        var returnb = new createjs.Bitmap("Assets/return.png");
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
        console.log("Showed options");
    };

    this.newGame = function () {
        ship = new Ship("Assets/ship2.png", 100, 25, 5, "spread", 7, 2, 8, stage);
        ship.setPosition(myCanvas.width/2, myCanvas.height/2);
        stage.addChild(ship);
        stage.update();

        createjs.Ticker.addListener(this);
        document.onkeydown = function(e) {
            ship.onKeyDown(ship, e);
        };

        document.onkeyup = function(e) {
            ship.onKeyUp(ship, e);
        };

        var gamepadSupportAvailable = Modernizr.gamepads;
        if (gamepadSupportAvailable) {
            console.log("Your browser supports a gamepad, why not connect one up?");
            // inform user they can connect a gamepad up and use it to play
            var gamepad = new Gamepad();
            var previousLeftAnalogDegrees = null;
            var AXIS_THRESHOLD = 0.75;

            if (gamepad.init()) {
                gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
                    console.log("connected a gamepad!", device);
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
                    if (e.control === "RB1") {
                        ship.fire(ship.rotation);
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

    };

    this.tick = function(){
        stage.tick();
        if (ship !== undefined) {
            ship.checkMovement(ship);
        }
        stage.update();
    };

    window.myCanvas = myCanvas;
})(window);
