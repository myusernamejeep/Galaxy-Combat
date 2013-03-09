(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Ship(image, health, speed, mass, bulletType, bulletSpeed, rateOfFire, rotationSpeed, stage) {
        this.initialize(image, health, speed, mass, bulletType, bulletSpeed, rateOfFire, rotationSpeed, stage);
    }

    //Inheritance from Bitmap
    Ship.prototype = new window.createjs.Bitmap();
    Ship.prototype.Bitmap_initialize = Ship.prototype.initialize;
    Ship.prototype.Bitmap_tick = Ship.prototype._tick;

    // The initalize method register the class variables with the passed params
    Ship.prototype.initialize = function (image, health, speed, mass, bulletType, bulletSpeed, rateOfFire, rotationSpeed, stage) {
        //call to initialize() method from parent class
        this.Bitmap_initialize(image);
        this.name = "Player";
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this.stage = stage;
        this.radius = Math.sqrt((this.height / 2)*(this.height / 2) + (this.width / 2) * (this.width / 2));

        this._health = health;
        this._speed = speed;
        this._mass = mass;
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
        this.x = this.width;
        this.y = this.height;
        this.timeLastBulletShot = new Date();
        this.timeLastBulletShot = this.timeLastBulletShot.getTime();


        window.console.log("Ship initialized : health: " + this._health + " speed: " + this._speed + " mass: " + this._mass + " bullet type: " + this._bulletType + " bullet speed: " + this._bulletSpeed + " rate of fire: " + this._rateOfFire + " rotation speed: " + this._rotationSpeed);

        Ship.prototype.onKeyDown = function(ship, e) {
            if(!e){ e = window.event; }

            switch(e.keyCode) {
                // left
                case 37:	ship._moveLeft = true; ship._moveRight = false;	break;
                // up
                case 38:    ship._moveUp = true; ship._moveDown = false;	break;
                // right
                case 39:	ship._moveRight = true; ship._moveLeft = false;	break;
                // down
                case 40:	ship._moveDown = true; ship._moveUp = false;	break;
            }
        };

        Ship.prototype.onKeyUp = function(ship, e) {
            if(!e){ e = window.event; }

            switch(e.keyCode) {
                // left
                case 37:    ship._moveLeft = false;	break;
                // up
                case 38:    ship._moveUp = false;		break;
                // right
                case 39:	ship._moveRight = false;	break;
                // down
                case 40:	ship._moveDown = false;	break;
                // Space
                case 32:    ship.fire(ship.rotation);   break;
                // B
                case 66:    ship.dropBomb(); break;
            }
        };

        Ship.prototype.dropBomb = function() {
            var length = window.enemies.length;
            for (var i = 0; i < length; i ++) {
                window.stage.removeChild(window.enemies[i]);
            }

            window.enemies.splice(0,length);
//            var length = window.enemies.length;
//            for (var i = 0; i < length; i ++) {
//                window.enemies[i].die();
//            }
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
                this.accX = Math.cos(radians) * this._speed;
                this.accY = Math.sin(radians) * this._speed;

                // Update the horisontal position (x)
                this.x -= (this.accY) / 2;

                // Update the vertical position (y)
                // Subtracted because coordinate system starts in upper right
                // and has positive y going downwards.
                this.y += (this.accX) / 2;
            }

//            if (this.y < 0) {
//                this.setPosition(this.x, this.stage.canvas.height);
//            } else if (this.y > this.stage.canvas.height) {
//                this.setPosition(this.x, 0);
//            }
//
//            if (this.x < 0) {
//                this.setPosition(this.stage.canvas.width, this.y);
//            } else if (this.x > this.stage.canvas.width) {
//                this.setPosition(0, this.y);
//            }
        };

        Ship.prototype.checkBounds = function() {
            if (this.y < 0) {
                this.setPosition(this.x, this.stage.canvas.height);
            } else if (this.y > this.stage.canvas.height) {
                this.setPosition(this.x, 0);
            }

            if (this.x < 0) {
                this.setPosition(this.stage.canvas.width, this.y);
            } else if (this.x > this.stage.canvas.width) {
                this.setPosition(0, this.y);
            }
        };

        Ship.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Ship.prototype.setRotation = function(degree) {


//            var x;
//            var y;
//
//            if (this.rotation - 180 < 0) { // if rotation between 0 - 179
//                if (degree < this.rotation || degree > this.rotation + 180) {
//                    this.rotation -= this._rotationSpeed;
//                } else {
//                    this.rotation += this._rotationSpeed;
//                }
//            } else if (this.rotation - 180 < 180) { // else rotation is between 180 - 360
//                if (degree < this.rotation && degree > this.rotation - 180) {
//                    this.rotation -= this._rotationSpeed;
//                }
//                else {
//                    this.rotation += this._rotationSpeed;
//                }
//            }

           this.rotation = degree;
        };

        Ship.prototype.moveForward = function() {
            var radians = this.rotation * (Math.PI / 180.0);
            this.accX = Math.cos(radians) * this._speed;
            this.accY = Math.sin(radians) * this._speed;

            // Update the horisontal position (x)
            this.x += (this.accY) / 2;

            // Update the vertical position (y)
            // Subtracted because coordinate system starts in upper left
            // and has positive y going downwards.
            this.y -= (this.accX) / 2;
        };

        Ship.prototype.fire = function(degree) {
//            var bullets = [];
            var d = new Date();
            var timeFired = d.getTime();
            if (timeFired > this.timeLastBulletShot + (1000 / this._rateOfFire)){
                this.bullets.push(new window.Bullet(this._bulletType, this._bulletSpeed, this.x, this.y, degree));
                for (var i = 0; i < this.bullets.length; i++) {
                    this.stage.addChild(this.bullets[i]);
                }
                this.timeLastBulletShot = timeFired;
            }

        };

        Ship.prototype.isHit = function() {
            for (var i = 0; i < window.enemies.length; i ++ ) {
                var collision = window.ndgmr.checkPixelCollision(this, window.enemies[i],0,true);
                // returns a rect with the global position of the colliding pixel(s)
                // alphaThreshold default is 0, set to higher value to ignore collisions with semi transparent pixels
                // the last parameter defines if all pixels should be checked, in this case it returns a
                // rect with the size of the full collision, if false a rect with the size 1x1 is returned

                if (collision) {
                    return true;
                }
            }
            return false;
        };
    };

    Ship.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
        if (this.isHit()) {
            window.console.log("Hit!");
            this._alive = false;
        }
        //console.log("Ship Ticked");
    };

    window.Ship= Ship;
} (window));