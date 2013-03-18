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
        this.Bitmap_initialize(window.triangleImage);
        this.name = name;
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this.stage = stage;
        this.radius = this.regX;
        this._health = 100;
        this._speed = 10;
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

        Triangle.prototype.moveForward = function(){
//            this._speed+=0.002;
            var p = window.ship,
                a = this.rotation,
                s = this._speed,
                r = this.radius,
                x = this.x,
                y = this.y,
                pi = Math.PI,
                pi2 = pi* 2,
                random = Math.random();
            this.x+=(Math.sin(a)*s) / 2;
            x = this.x;
            this.y+=(Math.cos(a)*s) / 2;
            y = this.y;
            this.inBounds();
            a = this.rotation;

            var ang=fixAngle(angleTo(this,p));
            if ((a<ang && ang-a<pi) || (a>ang && ang-(a-pi2)<pi)){
                this.rotation+=0.16;
            }else {
                this.rotation-=0.16;
            }
            this.rotation=fixAngle(this.rotation);
            return true;
        };

        Triangle.prototype.die = function() {
            stage.removeChild(this);
            var i = window.enemies.indexOf(this);
            window.enemies.splice(i,1);
            stage.update();
        };

        Triangle.prototype.inBounds = function() {
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

        Triangle.prototype.isOutOfBounds = function() {
            if (this.x < -20 || this.x > stage.canvas.width + 20 ||
                this.y < -20 || this.y > stage.canvas.height + 20) {
                return true;
            }
            return false;
        };

    };

    Triangle.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
       // this.facePlayer();
        if (this.isOutOfBounds()) {
            this.die();
        }
        this.inBounds();
        this.moveForward();
    };

    window.Triangle = Triangle;
} (window));