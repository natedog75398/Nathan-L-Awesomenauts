game.PlayerEntity = me.Entity.extend({
        init: function (x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
        },
        setSuper: function (x,  y) {
        this._super(me.Entity, 'init', [x, y, {
        image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function () {
                return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
        }]);
        },
        setPlayerTimers: function () {
        this.now = new Date().getTime();
                this.lastHit = this.now;
                this.lastAttack = new Date().getTime(); //Haven't used this
        },
        setAttributes: function () {
        this.health = game.data.playerHealth;
                this.body.setVelocity(game.data.playerMoveSpeed, 20);
                this.attack = game.data.playerAttack;
        },
        setFlags: function () {
        // keeps track of witch direction your character  is going
        this.facing = "right";
                this.dead = false;
                this.attacking = false;
        },
        addAnimation: function () {
        this.renderable.addAnimation("idle", [78]);
                this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
                this.renderable.addAnimation("Attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        },
        update: function (delta) {
        this.now = new Date().getTime();
                this.dead = this.checkIfDead();
                this.checkKeyPressesAndMove();
                this.setAnimation();
                me.collision.check(this, true, this.collideHandler.bind(this), true);
                this.body.update(delta);
                this._super(me.Entity, "update", [delta]);
                return true;
        },
        checkIfDead: function () {
        if (this.health <= 0) {
        return true;
        }
        return false;
        },
        checkKeyPressesAndMove: function () {
        if (me.input.isKeyPressed("right")) {
        this.moveRight();
        } else if (me.input.isKeyPressed("left")) {
        this.moveLeft();
        } else {
        this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("jump")) {
        this.jump();
        }

        this.attacking = me.input.isKeyPressed("Attack");
        },
        moveRight: function () {
        //sets the position of my x by adding the velocity defined above in 
        //setVelocity() and mutiplying it by me.timer.tick.
        //me.timer.tick makes the movement look smooth
        this.facing = "right";
                this.renderable.flipX(true);
                this.body.vel.x += this.body.accel.x * me.timer.tick;
        },
        moveLeft: function () {
        this.facing = "left";
                this.renderable.flipX(false);
                this.body.vel.x -= this.body.accel.x * me.timer.tick;
        },
        jump: function () {
        this.body.vel.y -= this.body.accel.y * me.timer.tick;
                me.audio.play("21");
        },
        setAnimation: function () {
        if (this.attacking) {
        if (!this.renderable.isCurrentAnimation("Attack")) {
        //Sets the current animation to attack and once that is over
        //goes back to the idle animation
        this.renderable.setCurrentAnimation("Attack", "idle");
                //Makes is so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animmation
                this.renderable.setAnimationFrame();
                me.audio.play("21");
        }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("Attack")) {
        if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
        }
        }
        else if (!this.renderable.isCurrentAnimation("Attack")) {
        this.renderable.setCurrentAnimation("idle");
        }
        },
        loseHealth: function (damage) {
        this.health = this.health - damage;
        },
        collideHandler: function (response) {
        if (response.b.type === "EnemybaseEntity") {
        this.collideWithEnemybase(response);
        
        } else if (response.b.type === "EnemyCreep") {
        this.collideWithEnemyCreep(response);
        }

        },
        collideWithEnemybase: function(response){

        var ydif = this.pos.y - response.b.pos.y;
                var xdif = this.pos.x - response.b.pos.x;
                console.log("xdif" + xdif + "ydif" + ydif);
                if (ydif < - 40 && xdif < 70 && xdif > - 35) {
        this.body.falling = false;
                this.body.vel.y = - 1;
        }
        if (xdif > - 35 && this.facing === "right" && (xdif < 0)) {
        this.body.vel.x = 0;
        } else if (xdif < 70 && this.facing === "left" && (xdif > 0)) {
        this.body.vel.x = 0;
        } else if (ydif < - 40) {
        this.body.falling = false;
                this.pos.y = this.pos.y - 1;
        }
        if (!this.renderable.isCurrentAnimation("Attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
        this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
        }
        },
        
        collideWithEnemyCreep: function(response){
                var xdif = this.pos.x - response.b.pos.x;
                var ydif = this.pos.y - response.b.pos.y;
                
                this.stopMovement(xdif);
           
                if(this.checkAttack(xdif, ydif)){
                    this.hitCreep(response);
                
                };
        
        },
        
    stopMovement: function(xdif){
         if (xdif > 0) {
        if (this.facing == "left") {
        this.body.vel.x = 0;
                }
        } else {
        if (this.facing == "right") {
        this.body.vel.x = 0;
                }
        }
    },
    
    checkAttack: function(xdif, ydif, response){
        if (this.renderable.isCurrentAnimation("Attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing == "right"))
                ) {
        this.lastHit = this.now;
                //if the creeps health is less than our attack, excute coddee in if statement
                return true;
            }
            return false;
    },
    
    hitCreep: function(response){
        if (response.b.health <= game.data.playerAttack) {
                 //adds one gold for a  creep kill
                 game.data.gold += 1;
                console.log("Current gold: " + game.data.gold);
              }

        response.b.loseHealth(game.data.playerAttack);
    }
});




    