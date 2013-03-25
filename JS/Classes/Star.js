(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Star(name, stage) {
        this.initialize(name, stage);
    }

    //Inheritance from Bitmap
    Star.prototype = new window.createjs.Bitmap();
    Star.prototype.Bitmap_initialize = Star.prototype.initialize;
    Star.prototype.Bitmap_tick = Star.prototype._tick;

    // The initalize method register the class variables with the passed params
    Star.prototype.initialize = function (name, stage) {
        //call to initialize() method from parent class
        this.Bitmap_initialize(window.starImage);
        this.name = name;
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this.stage = stage;
        this.radius = this.regX;
        this._health = 100;
        this._speed = 5;
        this._rotationSpeed = 7;
        this.accX = 0;
        this.accY = 0;
        this._alive = true;

        Star.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Star.prototype.setRotation = function(degree) {
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

        Star.prototype.moveForward = function() {
            var radians = this.rotation * (Math.PI / 180.0);
            this.accX = Math.cos(radians) * this._speed;
            this.accY = Math.sin(radians) * this._speed;

            this.x += (this.accY) / 2;
            this.y -= (this.accX) / 2;
        };
        this.rotation = (Math.floor(Math.random() * 360));

        Star.prototype.die = function() {
            stage.removeChild(this);
            var i = window.enemies.indexOf(this);
            window.enemies.splice(i,1);
            window.console.log(this.name + " Died, position in array: " + i);
        };

        Star.prototype.inBounds = function() {
            if (this.y < this.radius) {
                this.y = this.radius;
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            } else if (this.y > this.stage.canvas.height - this.radius) {
                this.y = stage.canvas.height - this.radius;
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            }

            if (this.x < this.radius) {
                this.x = this.radius;
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            } else if (this.x > this.stage.canvas.width - this.radius) {
                this.x = stage.canvas.width - this.radius;
                this.rotation -= 90;
//                this.accX *= -1;
//                this.accY *= -1;
            }
            // making the rotation always stay within 0 - 360
            if (this.rotation >= 360) { this.rotation -= 360;}
            if (this.rotation < 0) { this.rotation += 360;}
        };

        Star.prototype.isOutOfBounds = function() {
            if (this.x < -20 || this.x > stage.canvas.width + 20 ||
                this.y < -20 || this.y > stage.canvas.height + 20) {
                return true;
            }
            return false;
        };
    };

    Star.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
        //this.setRotation(Math.floor(Math.random() * 360));
        if (!this._alive) {
            this.die();
        }
        if (this.isOutOfBounds()) {
            this.die();
        }
        this.inBounds();
        this.moveForward();
    };

    window.Star = Star;
} (window));