(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Mutator(name, stage) {
        this.initialize(name, stage);
    }

    //Inheritance from Bitmap
    Mutator.prototype = new window.createjs.Bitmap();
    Mutator.prototype.Bitmap_initialize = Mutator.prototype.initialize;
    Mutator.prototype.Bitmap_tick = Mutator.prototype._tick;

    // The initalize method register the class variables with the passed params
    Mutator.prototype.initialize = function (name, stage) {
        //call to initialize() method from parent class
        this.Bitmap_initialize(window.mutatorImage);
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

        Mutator.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Mutator.prototype.setRotation = function(degree) {
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

        Mutator.prototype.moveForward = function() {
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
        };

        Mutator.prototype.die = function() {
            this.createSquareEnemies(2);
            stage.removeChild(this);
            var i = window.enemies.indexOf(this);
            window.enemies.splice(i,1);
            window.console.log(this.name + " Died, position in array: " + i);
        };

        Mutator.prototype.createSquareEnemies = function(amount) {
            var length = window.enemies.length;
            for (var i = 0; i < amount; i ++) {
                window.enemies.push(new window.Square("Square" + (i + 1) ,stage));
                var x = this.x - this.radius + Math.floor(Math.random()*this.radius*2);
                var y = this.y - this.radius + Math.floor(Math.random()*this.radius*2);
                window.enemies[length + i].setPosition(x, y);
                stage.addChild(window.enemies[length + i]);
            }
        };

        Mutator.prototype.inBounds = function() {
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

        Mutator.prototype.isOutOfBounds = function() {
            if (this.x < -20 || this.x > stage.canvas.width + 20 ||
                this.y < -20 || this.y > stage.canvas.height + 20) {
                return true;
            }
            return false;
        };

    };

    Mutator.prototype._tick = function () {
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

    window.Mutator = Mutator;
} (window));