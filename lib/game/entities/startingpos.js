ig.module('game.entities.startingpos')
.requires('impact.entity',
'game.entities.mainBuilding',
'game.entities.resourceBuilding',
'game.entities.mainMenu',
'game.entities.cheapGuy')
.defines(function(){
    EntityStartingpos = ig.Entity.extend({
        size: {x: 10, y: 10},
		player: null,
		collides: ig.Entity.COLLIDES.NONE,
		aiStartingPos: false,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
		
        update: function() {
		//Spawning inside the init will give an error in the Weltmeister editor
          this.parent();
		  if (this.aiStartingPos == false){
			ig.game.spawnEntity(EntityMainBuilding,
				(this.pos.x - this.size.x), (this.pos.y - this.size.y),
				{owner: this.player, health: 500});
		  }else{
			ig.game.spawnEntity(EntityMainBuilding,
				(this.pos.x - this.size.x), (this.pos.y - this.size.y),
				{owner: this.player, health: 500, aiBuilding: true});
		  }
		  ig.game.spawnEntity(EntityCheapGuy,
			(this.pos.x - this.size.x + 32), (this.pos.y - this.size.y + 96),
			{owner: this.player});
		  this.kill();
		  //, owner.color: playerColors[this.player - 1]
        }
    });
});