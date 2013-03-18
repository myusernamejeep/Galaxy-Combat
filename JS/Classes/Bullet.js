/**
 * Created with JetBrains WebStorm.
 * User: jakechampion
 * Date: 20/02/2013
 * Time: 06:02
 */
(function (window) {
    // The class receives parameteres that are passed to the initialize method (constructor)
    function Bullet(type, speed, x, y, degree) {
        this.initialize(type, speed, x, y, degree);
    }

    //Inheritance from Bitmap
    Bullet.prototype = new window.createjs.Bitmap();
    Bullet.prototype.Bitmap_initialize = Bullet.prototype.initialize;
    Bullet.prototype.Bitmap_tick = Bullet.prototype._tick;

    // The initalize method register the class variables with the passed params
    Bullet.prototype.initialize = function (type, speed, x, y, degree) {
        //call to initialize() method from parent class
        this.Bitmap_initialize(window.bulletImage);
        this.name = "Bullet";
        this.snapToPixel = true;
        this.width = this.image.width;
        this.height = this.image.height;
        this.regX = this.height/2;
        this.regY = this.width/2;
        this._type = type;
        this._speed = speed;
        this.x = x;
        this.y = y;
        this.radians;

        this.accX = 0;
        this.accY = 0;
        this.degree = degree;

        Bullet.prototype.setPosition = function(x,y) {
            this.x = x;
            this.y = y;
        };

        Bullet.prototype.move = function() {
              if (this.radians === undefined) {
              this.radians = this.degree * (Math.PI / 180.0);
              }
              this.accX = Math.cos(this.radians) * this._speed;
              this.accY = Math.sin(this.radians) * this._speed;

              this.setPosition(this.x, this.y);

              // Update the horisontal position (x)
              this.x += (this.accY) / 2;

              // Update the vertical position (y)
              // Subtracted because coordinate system starts in upper right
              // and has positive y going downwards.
              this.y -= (this.accX) / 2;
        };

        Bullet.prototype.isHit = function() {
            for (var i = 0; i < window.enemies.length; i ++ ) {
                var collision = window.ndgmr.checkPixelCollision(this, window.enemies[i],0,true);
                // returns a rect with the global position of the colliding pixel(s)
                // alphaThreshold default is 0, set to higher value to ignore collisions with semi transparent pixels
                // the last parameter defines if all pixels should be checked, in this case it returns a
                // rect with the size of the full collision, if false a rect with the size 1x1 is returned

                if (collision) {
                    window.enemies[i].die();
                    this.die();
                    window.addPoints(11);

                    return true;
                }
            }
            return false;
        };

        Bullet.prototype.die = function() {
            window.stage.removeChild(this);
            var i = window.ship.bullets.indexOf(this);
            window.ship.bullets.splice(i,1);
        };

        Bullet.prototype.isOnStage = function() {
            if (this.y < 0 || this.y > window.stage.canvas.height || this.x > window.stage.canvas.width || this.x < 0) {
                return false;
            } else {
                return true;
            }
        };
    };



    Bullet.prototype._tick = function () {
        //call to _tick method from parent class
        this.Bitmap_tick();
        if (this.isOnStage()){
            this.move();
            this.isHit();
        } else {
            this.die();
            window.subtractPoints(1);
        }

        //console.log("Ship Ticked");
    };
    window.Bullet = Bullet;
} (window));