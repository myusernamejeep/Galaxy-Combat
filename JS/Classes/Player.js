/**
 * Created with JetBrains WebStorm.
 * User: jakechampion
 * Date: 20/02/2013
 * Time: 08:10
 * To change this template use File | Settings | File Templates.
 */
(function(window) {
    function Player() {
        this.initialize();
    }
    var MISSILES_TYPES = ["bolt", "laser", "emp", "gatling"];
    Player.prototype.initialize = function() {
        this.ready = false;
        this.destroyedInLastLevel = 0;
        this.shootsInLastLevel = 0;
        this.totalShootsFired = 0;
        this.hitsInLastLevel = 0;
        this.totalShootsFired = 0;
        this.moneyInLastLevel = 0;
        this.totalShipsInLastlevel = 0;
        this.totalShipsDestroyed = 0;
        this.actualLevel = 1;

        this.playerShipSpeed = 1;
        this.playerShipShield = 3;
        this.playerShipPower = 1;
        this.playerShipLaser = 1;
        this.playerShipEMP = 1;
        this.playerShipGatling = 1;
        this.playerShipBolt = 1;
        this.playerShipLaserAvailable = false;
        this.playerShipEMPAvailable = false;
        this.playerShipGatlingAvailable = false;
        this.playerShipBoltAvailable = true;
        this.playerShipMaxShoots = 1;
        this.playerShipSelectedMissile = MISSILES_TYPES[0];

        this.credits = 2000;
    };

    Player.prototype.getData = function(playerData) {
        console.log(playerData);
        this.ready = true;

        this.playerShipSpeed = playerData.playerShipSpeed;
        this.playerShipShield = playerData.playerShipShield;
        this.playerShipPower = playerData.playerShipPower;

        this.playerShipLaserAvailable = playerData.playerShipLaserAvailable;
        this.playerShipEMPAvailable = playerData.playerShipLaserAvailable;
        this.playerShipGatlingAvailable = playerData.playerShipLaserAvailable;
        this.playerShipBoltAvailable = playerData.playerShipLaserAvailable;

        this.playerShipLaser = playerData.playerShipLaser;
        this.playerShipEMP = playerData.playerShipEMP;
        this.playerShipGatling = playerData.playerShipGatling;
        this.playerShipBolt = playerData.playerShipBolt;

        this.playerShipSelectedMissile = playerData.playerShipSelectedMissile;

        this.totalShootsFired = playerData.totalShootsFired;
        this.totalShipsDestroyed = playerData.totalShipsDestroyed;
        this.totalShootsFired = playerData.totalShootsFired;
        this.destroyedInLastLevel = playerData.destroyedInLastLevel;
        this.shootsInLastLevel = playerData.shootsInLastLevel;
        this.hitsInLastLevel = playerData.hitsInLastLevel;
        this.moneyInLastLevel = playerData.moneyInLastLevel;
        this.totalShipsInLastlevel = playerData.totalShipsInLastlevel;
        this.actualLevel = playerData.actualLevel;
        this.credits = playerData.credits;
    };

    Player.prototype.saveData = function() {
        localStorage.setItem(window.game.gameName, JSON.stringify(this));
    };
    window.Player = Player;
}(window));