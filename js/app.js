// Generates a random integet between a and b, inclusive
var getRandomInteger = function(a,b){
    return a + Math.floor((b-a)*Math.random());
}

// Detects the collision
// (X, Y) is the top left corner of a enemy/player and H, W is the height and width of the bug/player
var collision = function(x1,y1,h1,w1,x2,y2,h2,w2){
    if (x1+w1<x2 || x2+w2<x1 || y1+h1<y2 || y2+h2<y1)
        return false;
    else
        return true;
}

var inherit = function(subClass,superClass) {
   subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
   subClass.prototype.constructor = subClass; // set constructor on prototype
}

// Enemies our player must avoid
// minStartX: minimum starting x cordinate of an enemy
// maxStartx: maximum starting x cordinate of an enemy
// minSpeed: minimum speed of an enemy
// maxSpeed: maximum speed of an enemy
var Enemy = function(row,  minStartX, maxStartX, minSpeed, maxSpeed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.minStartX = minStartX || -300;
    this.maxStartX = maxStartX || -100;
    this.minSpeed = minSpeed || 100;
    this.maxSpeed = maxSpeed || 300;

    this.y = (row-1)*83 + 145;
    this.x = getRandomInteger(this.minStartX || -300, maxStartX || -100);
    this.speed =  getRandomInteger(minSpeed || 100, maxSpeed || 300);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   this.x = (this.x + this.speed*dt) > 605 ? getRandomInteger(this.minStartX, this.maxStartX) : this.x + this.speed*dt;
    var isCollided = collision(this.x,this.y,83,101,player.x,player.y,70,101);
    if (isCollided==true){
        player.score -= (player.score<=0)? 0: 5;
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.reset();
    this.score = 0;
    this.sprite = 'images/char-boy.png';
}

inherit(Player,Enemy);

// Reset the player location after collision or after wining
// state: denotes the state of the player; state = 0: non-winning state state > 0 winning state
// when at winning state the player waits on the state variable
Player.prototype.reset = function(){
    this.x = Math.floor(2*83)+35;;
    this.y = Math.floor(4*83)+70;
    this.state = 0;
}

Player.prototype.update = function(){
    if (this.state>0){
        this.state--;
        if (this.state==0)
            this.reset();
    }
    else if (this.y<0){
        this.score += 10;
        this.state = 100;
    }
};

Player.prototype.handleInput = function(key) {
    if (this.state==0){
        switch(key){
            case 'left':
                this.x -= (this.x > 100)? 100 : 0;
                break;
            case 'up':
                this.y -= (this.y >= 70 )? 83 : 0;
                break;
            case 'right':
                this.x += (this.x <= 301)? 100 : 0;
                break;
            case 'down':
                this.y += (this.y <= 319)? 83 : 0;
                break;
    }
}
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var noOfBugs = 5;
var allEnemies = [];
 for(var i=0; i<noOfBugs; i++){
    ene = new Enemy(i%3);
    allEnemies.push(ene);
 }
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
