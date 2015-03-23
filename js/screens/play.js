game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;


        me.levelDirector.loadLevel("level01");

        var player = me.pool.pull("player", 0, 420, {});
        me.game.world.addChild(player, 5);
        
        var GameTimerManager = me.pool.pull("GameTimerManager", 0, 0, {});
        me.game.world.addChild(GameTimerManager, 0);
        
        var HeroDeathManger = me.pool.pull("HeroDeathManger", 0, 0, {});
        me.game.world.addChild(HeroDeathManger, 0);
        
        var ExperienceManager  = me.pool.pull("ExperienceManager", 0, 0, {});
        me.game.world.addChild(ExperienceManager, 0);
        
         var SpendGold  = me.pool.pull("SpendGold", 0, 0, {});
         me.game.world.addChild(SpendGold, 0);

        me.input.bindKey(me.input.KEY.ENTER, "buy");
        me.input.bindKey(me.input.KEY.D, "skill1");
        me.input.bindKey(me.input.KEY.A, "skill2");
        me.input.bindKey(me.input.KEY.W, "skill3");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.A, "attack");

        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
