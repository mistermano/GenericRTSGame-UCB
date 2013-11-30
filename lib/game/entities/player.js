ig.module('game.entities.player')
.requires('impact.entity',
'game.entities.building',
'game.entities.resourceBuilding',
'game.entities.trainingBuilding',
'game.entities.finalBuilding',
'game.entities.ghostBuilding')
.defines(function(){
	var imagem = new ig.Image('media/charset/buildings.png');
    EntityPlayer = ig.Entity.extend({
		collides: ig.Entity.COLLIDES.NONE,
		size: {x: 15, y:15},
		team: 0,
		number: 0,
		color: 0,
		name: '',
		currentResources: 0,
		totalResources: 0,
		spentResources: 0,
		points: 0,
		buildingsBuilt: 0,
		buildingsLost: 0,
		constructingBuilding: false,
		constructingBuildingType: '',
		currTotalUnits: 0,
		currTotalBuildings: 0,
		currBuildings: [],
		currUnits: [],
		unitsTrained: 0,
		unitsKilled: 0,
		unitsLost: 0,
		owner: 1,
		startingPos: {x: 0,y: 0},
		corner: 0,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
			this.number = 1;
			//this.currentResources = $("#startingres").val();
			this.currentResources = resources;
			this.startingPos.x = this.startPosX;
			this.startingPos.y = this.startPosY;
			
			//this.rightBorder = ig.game.backgroundMaps[0].pxWidth - ig.system.width;
			//this.bottomBorder = ig.game.backgroundMaps[0].pxHeight - ig.system.height;
        },
		setUnitsQuantity: function(){
			var quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityCheapGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityCheapGuy')[i].owner){
					quantity++;
				}
			}
			
			for (var i = 0; i < ig.game.getEntitiesByType('EntityFastGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityFastGuy')[i].owner){
					quantity++;
				}
			}
			
			for (var i = 0; i < ig.game.getEntitiesByType('EntitySniperGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntitySniperGuy')[i].owner){
					quantity++;
				}
			}
		
			for (var i = 0; i < ig.game.getEntitiesByType('EntityHealerGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityHealerGuy')[i].owner){
					quantity++;
				}
			}
			
			for (var i = 0; i < ig.game.getEntitiesByType('EntityHeavyGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityHeavyGuy')[i].owner){
					quantity++;
				}
			}
			this.currTotalUnits = quantity;			
		},
		
		setBuildingsQuantity: function(){
			var quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityMainBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityMainBuilding')[i].owner){
					quantity++;
				}
			}
			
			for (var i = 0; i < ig.game.getEntitiesByType('EntityResourceBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityResourceBuilding')[i].owner){
					quantity++;
				}
			}

			for (var i = 0; i < ig.game.getEntitiesByType('EntityTrainingBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityTrainingBuilding')[i].owner){
					quantity++;
				}
			}
			
			for (var i = 0; i < ig.game.getEntitiesByType('EntityFinalBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityFinalBuilding')[i].owner){
					quantity++;
				}
			}
			this.currTotalBuildings = quantity;				
		},
				
        update: function() {
			this.setBuildingsQuantity();
			this.setUnitsQuantity();
			var canWidth1 = 480;
			var ghostTouchesOtherEntity = false;
			var ghostEntities = new Array();
			for (var i = 0; i < ig.game.getEntitiesByType('EntityGhostBuilding').length ; i++){
				ghostEntities[i] = ig.game.getEntitiesByType('EntityGhostBuilding')[i];
			}
			if (ghostEntities.length > 0) {
			    var allBuildingEntities = new Array();
				var allUnitEntities = new Array();
				for (var i = 0; i < ig.game.getEntitiesByType('EntityBuilding').length; i++){
					allBuildingEntities[i] = ig.game.getEntitiesByType('EntityBuilding')[i]; 
				}
				for (var i = 0; i < ig.game.getEntitiesByType('EntitySuperUnit').length; i++){
					allUnitEntities[i] = ig.game.getEntitiesByType('EntitySuperUnit')[i]; 
				}
				for (var i = 0; i < allBuildingEntities.length; i++){
					if (allBuildingEntities[i] != ghostEntities[0]) {
					    if (ghostEntities[0].touches(allBuildingEntities[i]) == true){
							ghostTouchesOtherEntity = true;
							break;
						}
					}
				}
				for (var i = 0; i < allUnitEntities.length; i++){
					if (ghostEntities[0].touches(allUnitEntities[i]) == true){
						ghostTouchesOtherEntity = true;
						break;
					}
				}
			}
			
			if (ig.input.pressed('rclick')){
				this.constructingBuilding = false;
				
				for (var i = 0; i < ghostEntities.length ; i++){
					if (ghostEntities[i].owner == this) {
						ghostEntities[i].kill();
						break;
					}
				}
			}
		
			if (ig.input.pressed('lclick')){
				if(ig.input.mouse.x >= canWidth1 - 100){
					this.constructingBuilding = true;
					if (ghostEntities.length > 0) {
					    for (var i = 0; i < ghostEntities.length ; i++){
							if (ghostEntities[i].owner == this) {
								ghostEntities[i].kill();
								break;
							}
						}
					}
					
					if(ig.input.mouse.y < 109){
						this.constructingBuildingType = 'ResourceBuilding';
						this.currCost = 500;
					}else if (ig.input.mouse.y >= 109 && ig.input.mouse.y < 198){
						this.constructingBuildingType = 'TrainingBuilding';
						this.currCost = 600;
					}else if (ig.input.mouse.y >= 198){
						this.constructingBuildingType = 'FinalBuilding';
						this.currCost = 1200;
					}
					
					ig.game.spawnEntity(EntityGhostBuilding,
					ig.input.mouse.x + ig.game.screen.x - 40, ig.input.mouse.y + ig.game.screen.y - 43,
					{owner: this,buildingType: this.constructingBuildingType});
				}
			}
												
			if (ig.input.pressed('lclick')){
				if(ig.input.mouse.x < canWidth1 - 100 && this.constructingBuilding == true && ghostTouchesOtherEntity == false){
					var currBuilding;
					/*if (this.constructingBuildingType == 'ResourceBuilding'){
						currBuilding = new EntityResourceBuilding();
					}else if (this.constructingBuildingType == 'TrainingBuilding'){
						currBuilding = new EntityTrainingBuilding();
					}else if (this.constructingBuildingType == 'FinalBuilding'){
						currBuilding = new EntityFinalBuilding();
					}*/
					//checks if player has enough resources to construct the building
					//console.log(ig.game.getEntityByName(this.constructingBuildingType) + ' - ' + ig.game.getEntityByName(this.constructingBuildingType).cost);
					if ((this.currentResources - this.currCost) >= 0){
						ig.game.spawnEntity('Entity'+this.constructingBuildingType,
						ig.input.mouse.x + ig.game.screen.x - 40, ig.input.mouse.y + ig.game.screen.y - 43,
						{owner: this, constructing: 1});
						this.constructingBuilding = false;
						for (var i = 0; i < ghostEntities.length ; i++){
							if (ghostEntities[i].owner == this) {
								ghostEntities[i].kill();
								break;
							}
						}
					}
				}
			}
			this.setResultPoints();
            this.parent();
        },
		
		setResultPoints: function(){
			playersSelected[0] = 'Player1';
			playerTotalResources[0] = this.totalResources;
			playerSpentResources[0] = this.spentResources;
			playerUnitsTrained[0] = this.unitsTrained;
			playerUnitsLost[0] = this.unitsLost;
			playerBuildingsBuilt[0] = this.buildingsBuilt;
			playerBuildingsLost[0] = this.buildingsLost;
			this.calculatePoints();
			playerFinalScore[0] = this.points;
		},
		
		//
		calculatePoints: function() {
		    var uTrained = this.unitsTrained * 10;
			var bBuilt = this.buildingsBuilt * 15;
			var uLost = this.unitsLost * 15;
			var bLost = this.buildingsLost * 20;
			this.points = this.totalResources + uTrained + bBuilt - uLost - bLost;
			//this.points += this.unitsKilled * 20;
		}
    });
});