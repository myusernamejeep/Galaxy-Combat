/**
 * Created with JetBrains WebStorm.
 * User: jakechampion
 * Date: 08/03/2013
 * Time: 15:50
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: jakechampion
 * Date: 07/03/2013
 * Time: 21:47
 * To change this template use File | Settings | File Templates.
 */
(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Triangle(name, stage) {
        this.initialize(name, stage);
    }

    //Inheritance from Bitmap
    Triangle.prototype = new window.createjs.Bitmap();
    Triangle.prototype.Bitmap_initialize = Triangle.prototype.initialize;
    Triangle.prototype.Bitmap_tick = Triangle.prototype._tick;

    // The initalize method register the class variables with the passed params
    Triangle.prototype.initialize = function (name, stage) {
        //call to initialize() method from parent class
        this.Bitmap_initialize("Assets/Enemies/Triangles/1.png");
        this.name = name;
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this.stage = stage;
        this.radius = Math.sqrt((this.height / 2)*(this.height / 2) + (this.width / 2) * (this.width / 2));
        this._health = 100;
        this._speed = 20;
        this._rotationSpeed = 3;
        this.accX = 0;
        this.accY = 0;
        this._alive = true;
        this.rotation = 0;

        Triangle.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Triangle.prototype.setRotation = function(degree) {
            var x;
            var y;

            if (this.rotation - 180 < 0) { // if rotation between 0 - 179
                if (degree < this.rotation || degree > this.rotation + 180) {
                    this.rotation -= this._rotationSpeed;
                } else {
                    this.rotation += this._rotationSpeed;
                }
            } else if (this.rotation - 180 < 180) { // else rotation is between 180 - 360
                if (degree < this.rotation && degree > this.rotation - 180) {
                    this.rotation -= this._rotationSpeed;
                }
                else {
                    this.rotation += this._rotationSpeed;
                }
            }
        };

        Triangle.prototype.facePlayer = function() {
            var x1 = window.ship.x;
            var y1 = window.ship.y;
            var x2 = this.x;
            var y2 = this.y;

            var deltaY = y2 - y1;
            var deltaX = x2 - x1;
            var angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            this.rotation = angleInDegrees;
//            this.setRotation(angleInDegrees);
        };

        Triangle.prototype.moveForward = function() {
            var radians = this.rotation * (Math.PI / 180.0);
            this.accX = Math.cos(radians) * this._speed;
            this.accY = Math.sin(radians) * this._speed;

            // Update the horizontal position (x)
            this.x += (this.accY) / 2;

            // Update the vertical position (y)
            // Subtracted because coordinate system starts in upper right
            // and has positive y going downwards.
            this.y -= (this.accX) / 2;
        };
//        this.rotation = (Math.floor(Math.random() * 360));

        Triangle.prototype.die = function() {
            stage.removeChild(this);
            var i = window.enemies.indexOf(this);
            window.enemies.splice(i,1);
            stage.update();
        };

        Triangle.prototype.inBounds = function() {
            if (this.y < 0) {
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            } else if (this.y > this.stage.canvas.height) {
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            }

            if (this.x < 0) {
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            } else if (this.x > this.stage.canvas.width) {
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            }
            // making the rotation always stay within 0 - 360
            if (this.rotation >= 360) { this.rotation -= 360;}
            if (this.rotation < 0) { this.rotation += 360;}
        };

    };

    Triangle.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
        this.facePlayer();
        this.inBounds();
        this.moveForward();
    };

    window.Triangle = Triangle;
} (window));