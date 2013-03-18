(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Ship(image, speed, bulletType, bulletSpeed, rateOfFire, rotationSpeed) {
        this.initialize(image, speed, bulletType, bulletSpeed, rateOfFire, rotationSpeed);
    }

    //Inheritance from Bitmap
    Ship.prototype = new window.createjs.Bitmap();
    Ship.prototype.Bitmap_initialize = Ship.prototype.initialize;
    Ship.prototype.Bitmap_tick = Ship.prototype._tick;

    // The initalize method register the class variables with the passed params
    Ship.prototype.initialize = function (image, speed, bulletType, bulletSpeed, rateOfFire, rotationSpeed) {
        //call to initialize() method from parent class
        this.Bitmap_initialize(image);
        this.name = "Player";
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this.radius = Math.sqrt((this.height / 2)*(this.height / 2) + (this.width / 2) * (this.width / 2));
        this._speed = speed;
        this._bulletType = bulletType;
        this._bulletSpeed = speed + bulletSpeed;
        this._rateOfFire = rateOfFire;
        this._rotationSpeed = rotationSpeed;
        this._moveUp = false;
        this._moveDown = false;
        this._moveLeft = false;
        this._moveRight = false;
        this.accX = 0;
        this.accY = 0;
        this._alive = true;
        this.bullets = [];
        this.bombs = 5;
        this.x = this.width;
        this.y = this.height;
        this.timeLastBulletShot = new Date();
        this.timeLastBulletShot = this.timeLastBulletShot.getTime();

        Ship.prototype.onKeyDown = function(ship, e) {
            if(!e){ e = window.event; }
            switch(e.keyCode) {
                // left
                case 37:    ship._moveLeft = true;  ship._moveRight = false;    break;
                // up
                case 38:    ship._moveUp = true;    ship._moveDown = false; break;
                // right
                case 39:    ship._moveRight = true; ship._moveLeft = false; break;
                // down
                case 40:    ship._moveDown = true;  ship._moveUp = false;   break;
            }
        };

        Ship.prototype.onKeyUp = function(ship, e) {
            if(!e){ e = window.event; }
            switch(e.keyCode) {
                // left
                case 37:    ship._moveLeft = false; break;
                // up
                case 38:    ship._moveUp = false;   break;
                // right
                case 39:    ship._moveRight = false;    break;
                // down
                case 40:    ship._moveDown = false; break;
                // Space
                case 32:    ship.fire(ship.rotation);   break;
                // B
                case 66:    ship.dropBomb();    break;
            }
        };

        Ship.prototype.dropBomb = function() {
            if (!window.allEnemiesDead()) {
                if (this.bombs > 0) {
                    this.bombs --;
                    var length = window.enemies.length;
                    for (var i = 0; i < length; i ++) {
                        window.stage.removeChild(window.enemies[i]);
                    }
                    window.enemies.splice(0,length);
                }
            }
        };

        Ship.prototype.checkMovement = function() {
            // making the rotation always stay within 0 - 360
            if (this.rotation >= 360) { this.rotation -= 360;}
            if (this.rotation < 0) { this.rotation += 360;}

            if(this._moveLeft)
            {
                this.rotation -= this._rotationSpeed;
            }
            else if(this._moveRight)
            {
                this.rotation += this._rotationSpeed;
            }

            if(this._moveUp)
            {
                this.moveForward();
            }
            else if(this._moveDown)
            {
                var radians = this.rotation * (Math.PI / 180.0);
                this.accX = Math.sin(radians) * this._speed;
                this.accY = Math.cos(radians) * this._speed;

                this.x -= (this.accX) / 2;
                this.y += (this.accY) / 2;
            }
        };

        Ship.prototype.checkBounds = function() {
            if (this.y < 0) {
                this.setPosition(this.x, window.stage.canvas.height);
            } else if (this.y > window.stage.canvas.height) {
                this.setPosition(this.x, 0);
            }

            if (this.x < 0) {
                this.setPosition(window.stage.canvas.width, this.y);
            } else if (this.x > window.stage.canvas.width) {
                this.setPosition(0, this.y);
            }
        };

        Ship.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Ship.prototype.setRotation = function(degree) {
           this.rotation = degree;
        };

        Ship.prototype.moveForward = function() {
            var radians = this.rotation * (Math.PI / 180.0);
            this.accX = Math.sin(radians) * this._speed;
            this.accY = Math.cos(radians) * this._speed;

            this.x += (this.accX) / 2;
            this.y -= (this.accY) / 2;
        };

        Ship.prototype.fire = function(degree) {
            var d = new Date();
            var timeFired = d.getTime();
            if (timeFired > this.timeLastBulletShot + (1000 / this._rateOfFire)){
                this.bullets.push(new window.Bullet(this._bulletType, this._bulletSpeed, this.x, this.y, degree));
                for (var i = 0; i < this.bullets.length; i++) {
                    window.stage.addChild(this.bullets[i]);
                }
                this.timeLastBulletShot = timeFired;
            }
        };

        Ship.prototype.isHit = function() {
            for (var i = 0; i < window.enemies.length; i ++ ) {
                var collision = window.ndgmr.checkPixelCollision(this, window.enemies[i],0,true);
                if (collision) {
                    return true;
                }
            }
            return false;
        };

        Ship.prototype.die = function() {
            this.bombs = 5;
            this._alive = false;
            window.gameOver();
        };
    };

    Ship.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
        if (this.isHit()) {
            this.die();
        }
    };

    window.Ship= Ship;
} (window));