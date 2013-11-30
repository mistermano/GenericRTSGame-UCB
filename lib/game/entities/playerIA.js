ig.module('game.entities.playerIA')
.requires('impact.entity',
'game.entities.player',
'game.entities.building',
'game.entities.startingpos',
'game.entities.mainBuilding',
'game.entities.resourceBuilding',
'game.entities.trainingBuilding',
'game.entities.finalBuilding',
'game.entities.ghostBuilding',
'game.entities.SuperUnit',
'game.entities.cheapGuy',
'game.entities.fastGuy',
'game.entities.sniperGuy',
'game.entities.healerGuy',
'game.entities.heavyGuy')
.defines(function(){
	var imagem = new ig.Image('media/charset/buildings.png');
    EntityPlayerIA = ig.Entity.extend({
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
		mainBuildings: 0,
		resourceBuildings: 0,
		trainBuildings: 0,
		finalBuildings: 0,
		cheapGuys: 0,
		fastGuys: 0,
		sniperGuys: 0,
		healerGuys: 0,
		heavyGuys: 0,
		currTotalUnits: 0,
		currTotalBuildings: 0,
		constructingBuilding: false,
		constructingBuildingType: '',
		constrBuildingPosX: 0,
		constrBuildingPosY: 0,
		currBuildings: [],
		currUnits: [],
		selectedUnits: [],
		selectedBuildings: [],
		unitsTrained: 0,
		unitsKilled: 0,
		unitsLost: 0,
		owner: 1,
		startingPos: {x: 0,y: 0},
		corner: 0,
		attackTarget: 0,
		attackTargetPosX: 0,
		attackTargetPosY: 0,
		attackingEnemy: false,
		attackDefendTimer: new ig.Timer(0),
		cycleTimer: new ig.Timer(0),
		cycleRunning: null,
		cycleSequence: 1,
		resourceBuildingSeq: 0,
		productionBuildingsSeq: 0,
		attackingEnemy: false,
		keepAttackingTimer: new ig.Timer(0),
		unitsReturnedToDefend: false,
		isUnderAttack: false,
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
		
		openingCycle: function(){
			this.cycleRunning = 'openingCycle';
			console.log('Current Resources: ' + (this.currentResources));
			if (this.resourceBuildings < 1 && this.currentResources > 500 && 
			    this.getBuildingsUnderConstruction() <= 3) {
				this.constructBuilding('ResourceBuilding');
			}
				
			if (this.cheapGuys <= 2){
				this.selectBuildings('MainBuilding');
				this.trainUnit('CheapGuy');
			}		
			
			if (this.cheapGuys >= 2 && this.resourceBuildings < 3 && 
			    this.getBuildingsUnderConstruction() <= 4){
				this.constructBuilding('ResourceBuilding');
			}
			
			if (this.resourceBuildings >= 3 && this.cheapGuys <= 4){
				this.selectBuildings('MainBuilding');
				this.trainUnit('CheapGuy');
			}
			
			if (this.cheapGuys >= 4 && this.resourceBuildings < 4 && 
			    this.getBuildingsUnderConstruction() <= 5){
				this.constructBuilding('ResourceBuilding');
			}
			
			if (this.trainBuildings == 0 && this.resourceBuildings >= 4 && 
			    this.getBuildingsUnderConstruction() <= 2){
				var constructionStarted = this.constructBuilding('TrainingBuilding');
				if (constructionStarted == true){
					this.cycleSequence++;
					this.cycleRunning = null;
				    console.log('Cycle Ended');
				}
			}
		},
		
		earlyAttackCycle: function(){
			this.cycleRunning = 'earlyAttackCycle';
			var curCyc = this.cycleSequence - 1;
			if (curCyc > 5){
				curCyc = 5;
			}
			if (this.cheapGuys <= 3 + curCyc){
				this.selectBuildings('MainBuilding');
				this.trainUnit('CheapGuy');
			}
			
			if (this.cheapGuys >= 3 + curCyc && this.fastGuys <= 2 + curCyc){
				this.selectBuildings('TrainingBuilding');
				this.trainUnit('FastGuy');
			}
			
			if (this.fastGuys >= 2 + curCyc && this.healerGuys <= 2){
				this.selectBuildings('TrainingBuilding');
				this.trainUnit('HealerGuy');
			}
			
			if (this.healerGuys >= 2){
				this.selectUnits(50,100,0,100,0);
				this.pickAttackTarget();
				//this.moveUnits(this.attackTargetPosX ,this.attackTargetPosY);
				this.attackingEnemy = true;
				this.cycleSequence++;
				this.cycleRunning = null;
				console.log('Cycle Ended');
			}
		},
		
		defendToFinalBuildingCycle: function(){
			this.cycleRunning = 'defendToFinalBuildingCycle';
			if (this.resourceBuildings <= 4 && 
			    this.getBuildingsUnderConstruction() <= 5) {
				this.constructBuilding('ResourceBuilding');
			}
			
			if (this.resourceBuildings >= 4 && this.cheapGuys <= 6){
				this.selectBuildings('MainBuilding');
				this.trainUnit('CheapGuy');
			}
			
			if (this.cheapGuys >= 6 && this.fastGuys <= 4){
				this.selectBuildings('TrainingBuilding');
				this.trainUnit('FastGuy');
			}
			
			if (this.fastGuys >= 4 && this.healerGuys <= 3){
				this.selectBuildings('TrainingBuilding');
				this.trainUnit('HealerGuy');
			}
			
			if (this.currentResources >= 1200 && 
			    this.getBuildingsUnderConstruction() <= 2){
				var constructionStarted = this.constructBuilding('FinalBuilding');
			}
			if (this.finalBuildings >= 1){
				this.cycleSequence++;
				this.cycleRunning = null;
				console.log('Cycle Ended');
			}
		},
		
		heavyAttackCycle: function(){
			this.cycleRunning = 'heavyAttackCycle';
			var curCyc = this.cycleSequence - 4;
			console.log('Cycle Started (Heavy Attack) ' + this.cycleSequence);
			console.log('Current Resources: ' + (this.currentResources));
			if (curCyc > 5){
				curCyc = 5;
			}
			if (this.finalBuildings > 0){
				if (this.resourceBuildings <= 5 + curCyc && 
			    this.getBuildingsUnderConstruction() <= 5){
					this.constructBuilding('ResourceBuilding');
				}
				if(this.resourceBuildings >= 5 + curCyc && this.sniperGuys <= 4 + curCyc){
					this.selectBuildings('FinalBuilding');
					this.trainUnit('SniperGuy');
				}
				if(this.sniperGuys >= 4 + curCyc && this.heavyGuys <= 4 + curCyc){
					this.selectBuildings('FinalBuilding');
					this.trainUnit('HeavyGuy');
				}
				if(this.heavyGuys >= 4 + curCyc && this.healerGuys <= 1 + curCyc){
					this.selectBuildings('TrainingBuilding');
					this.trainUnit('HealerGuy');
				}
				if(this.healerGuys >= 1 + curCyc && this.heavyGuys >= 4 + curCyc ){
					this.selectUnits(20,20,100,100,100);
					this.pickAttackTarget();
					//this.moveUnits(this.attackTargetPosX ,this.attackTargetPosY);
					this.attackingEnemy = true;
					this.cycleSequence++;
					this.cycleRunning = null;
					console.log('Cycle Ended');
					this.cycleTimer = new ig.Timer(30);
				}
			
			}else{
				this.cycleSequence++;
				this.cycleRunning = null;
				console.log('Cycle Ended');
			}
		},
		
		fullScaleAttackCycle: function(){
			this.cycleRunning = 'fullScaleAttackCycle';
			var curCyc = this.cycleSequence - 4;
			console.log('Cycle Started (Full Scale Attack) ' + this.cycleSequence);
			console.log('Current Resources: ' + (this.currentResources));
			if (curCyc > 5){
				curCyc = 5;
			}
			if (this.finalBuildings > 0){
				if(this.cheapGuys <= 5 + curCyc){
					this.selectBuildings('MainBuilding');
					this.trainUnit('CheapGuy');
					console.log('Flag 1');
				}
				if(this.cheapGuys >= 5 + curCyc && this.sniperGuys <= 4 + curCyc){
					this.selectBuildings('FinalBuilding');
					this.trainUnit('SniperGuy');
					console.log('Flag 2');
				}
				if(this.sniperGuys >= 4 + curCyc && this.heavyGuys <= 5 + curCyc){
					this.selectBuildings('FinalBuilding');
					this.trainUnit('HeavyGuy');
					console.log('Flag 3');
				}
				if(this.heavyGuys >= 5 + curCyc && this.healerGuys <= 1 + curCyc){
					this.selectBuildings('TrainingBuilding');
					this.trainUnit('HealerGuy');
					console.log('Flag 4');
				}
				console.log('current units: Cheap Guys '+this.cheapGuys+' Sniper Guys '+this.heavyGuys+' Healer Guys '+this.healerGuys);
				if(this.healerGuys >= 1 + curCyc && this.heavyGuys >= 5 + curCyc){
					this.selectUnits(80,80,80,80,100);
					this.pickAttackTarget();
					//this.moveUnits(this.attackTargetPosX ,this.attackTargetPosY);
					this.attackingEnemy = true;
					this.cycleSequence++;
					this.cycleRunning = null;
					console.log('Cycle Ended');
					console.log('Flag 5');
					this.cycleTimer = new ig.Timer(30);
				}
			
			}else{
				this.cycleSequence++;
				this.cycleRunning = null;
				console.log('Cycle Ended');
			}
		},
		
		attackingEnemyCycle: function(){
			if (this.isUnderAttack == false){
				if (this.selectedUnits.length > 0){
					this.attackNearestSpecificEnemy();
				}else{
					this.attackingEnemy = false;
				}
			}
		},
		
		returnToDefendCycle: function(){
			if (this.cheapGuys <= 4){
				this.selectBuildings('MainBuilding');
				this.trainUnit('CheapGuy');
			}
			this.selectUnits(100,100,100,100,100);
			if (this.unitsReturnedToDefend == false){
				switch (this.corner){
					case 2:
						this.moveUnits(this.startingPos.x + 30,this.startingPos.y - 30);
					break;
					case 3:
						this.moveUnits(this.startingPos.x - 30,this.startingPos.y - 30);
					break;
					case 4:
						this.moveUnits(this.startingPos.x - 30,this.startingPos.y + 30);
					break;
				}
				var friendlyUnitsInPerimeter = 0;
				for (var i = 0;i < this.selectedUnits.length;i++){
					switch (this.corner){
					case 2:
						if (this.selectedUnits[i].pos.x < this.startingPos.x + 300 &&
							this.selectedUnits[i].pos.y > this.startingPos.y - 300){
							friendlyUnitsInPerimeter++;
						}
					break;
					case 3:
						if (this.selectedUnits[i].pos.x > this.startingPos.x - 300 &&
							this.selectedUnits[i].pos.y > this.startingPos.y - 300){
							friendlyUnitsInPerimeter++;
						}
					break;
					case 4:
						if (this.selectedUnits[i].pos.x > this.startingPos.x - 300 &&
							this.selectedUnits[i].pos.y < this.startingPos.y + 300){
							friendlyUnitsInPerimeter++;
						}
					break;
					}
				}
				if (friendlyUnitsInPerimeter > this.selectedUnits.length * 0.60){
					this.unitsReturnedToDefend = true;
				}
			}else{
				this.attackNearestUnit();
			}
		},
		
		runNextCycle: function(){
			if (this.attackDefendTimer.delta() > 0){
				this.checkIfUnderAttack();
				this.attackingEnemyCycle();
				this.attackDefendTimer = new ig.Timer(1);
			}
			if (this.cycleTimer.delta() > 0){
				if (this.cycleRunning == 'openingCycle'){
					this.openingCycle();
				}else if (this.cycleRunning == 'earlyAttackCycle'){
					this.earlyAttackCycle();
				}else if (this.cycleRunning == 'defendToFinalBuildingCycle'){
					this.defendToFinalBuildingCycle();
				}else if (this.cycleRunning == 'heavyAttackCycle'){
					this.heavyAttackCycle();
				}else if (this.cycleRunning == 'fullScaleAttackCycle'){
					this.fullScaleAttackCycle();
				}
			
				if (this.cycleSequence == 1 && this.cycleRunning == null && this.isUnderAttack == false){
					console.log('Entrou no primeiro ciclo');
					this.openingCycle();
				}
				if (this.cycleSequence == 2 && this.cycleRunning == null && this.isUnderAttack == false){
					console.log('Entrou no segundo ciclo');
					if (Math.random() < 0.40){
						this.defendToFinalBuildingCycle();
					}else{
						this.earlyAttackCycle();
					}
				}
				if (this.cycleSequence >= 3 && this.cycleRunning == null && this.isUnderAttack == false){
					console.log('Entrou no terceiro ciclo');
					if (this.finalBuildings == 0){
						this.defendToFinalBuildingCycle();
					}else if (Math.random() < 0.70){
						this.heavyAttackCycle();
					}else{
						this.fullScaleAttackCycle();
					}	
				}
				if (this.cycleTimer.delta() > 0){
					this.cycleTimer = new ig.Timer(2);
				}
			}
		
		},
		
		getBuildingsUnderConstruction: function(){
			var quantity = 0;
			for (var i = 0;i < ig.game.getEntitiesByType('EntityBuilding').length;i++){
				if (ig.game.getEntitiesByType('EntityBuilding')[i].owner == this){
					if(ig.game.getEntitiesByType('EntityBuilding')[i].constructing == true){
						quantity++;
					}
				}
			}
			return quantity;
		},
		
		checkIfUnderAttack: function(){
			var enemyUnitsInPerimeter = 0;
			for (var i = 0;i < ig.game.getEntitiesByType('EntitySuperUnit').length;i++){
				if (ig.game.getEntitiesByType('EntitySuperUnit')[i].owner != this){
					switch (this.corner){
						case 2:
							if (ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.x < this.startingPos.x + 500 &&
								ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.y > this.startingPos.y - 500){
								enemyUnitsInPerimeter++;
							}
					    break;
						case 3:
							if (ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.x > this.startingPos.x - 500 &&
								ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.y > this.startingPos.y - 500){
								enemyUnitsInPerimeter++;
							}
						break;
						case 4:
							if (ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.x > this.startingPos.x - 500 &&
								ig.game.getEntitiesByType('EntitySuperUnit')[i].pos.y < this.startingPos.y + 500){
								enemyUnitsInPerimeter++;
							}
						break;
					}
				}
			}
			if (enemyUnitsInPerimeter > 0){
				this.isUnderAttack = true;
				this.cycleRunning = null;
				this.returnToDefendCycle();
			}else{
				this.isUnderAttack = false;
				this.unitsReturnedToDefend = false;
			}
		},
		
		attackNearestUnit: function(){
			var nearestEnemyUnit;
			var nearestDistance = 9999999;
			for (var i = 0;i < ig.game.getEntitiesByType('EntitySuperUnit').length;i++){
				if (ig.game.getEntitiesByType('EntitySuperUnit')[i].owner != this &&
				    typeof (ig.game.getEntitiesByType('EntitySuperUnit')[i]) != 'undefined' &&
					typeof (this.selectedUnits[0]) != 'undefined'){
					if (this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntitySuperUnit')[i]) < nearestDistance){
						nearestDistance = this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntitySuperUnit')[i]);
						nearestEnemyUnit = ig.game.getEntitiesByType('EntitySuperUnit')[i];
					}
				}
			}
			this.moveUnitsToAttackNearest(nearestEnemyUnit);
		},
		
		attackNearestBuilding: function(){
			var nearestEnemyUnit;
			var nearestDistance = 9999999;
			for (var i = 0;i < ig.game.getEntitiesByType('EntityBuilding').length;i++){
				if (ig.game.getEntitiesByType('EntityBuilding')[i].owner != this && 
				    typeof(ig.game.getEntitiesByType('EntityBuilding')[i]) != 'undefined'){
					if (this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntityBuilding')[i]) < nearestDistance){
						nearestDistance = this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntityBuilding')[i]);
						nearestEnemyUnit = ig.game.getEntitiesByType('EntityBuilding')[i];
					}
				}
			}
			this.moveUnitsToAttackNearest(nearestEnemyUnit);
		},
		
		attackNearestSpecificEnemy: function(){
			var nearestEnemyUnit;
			var nearestDistance = 9999999;
			console.log('Attack Specific');
			for (var i = 0;i < ig.game.getEntitiesByType('EntityBuilding').length;i++){
				if (ig.game.getEntitiesByType('EntityBuilding')[i].owner == this.attackTarget &&
				    typeof(ig.game.getEntitiesByType('EntityBuilding')[i]) != 'undefined'){
					if (this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntityBuilding')[i]) < nearestDistance){
						nearestDistance = this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntityBuilding')[i]);
						nearestEnemyUnit = ig.game.getEntitiesByType('EntityBuilding')[i];
					}
				}
			}
			for (var i = 0;i < ig.game.getEntitiesByType('EntitySuperUnit').length;i++){
				if (ig.game.getEntitiesByType('EntitySuperUnit')[i].owner == this.attackTarget &&
				    typeof(ig.game.getEntitiesByType('EntitySuperUnit')[i]) != 'undefined'){
					if (this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntitySuperUnit')[i]) < nearestDistance){
						nearestDistance = this.selectedUnits[0].distanceTo(ig.game.getEntitiesByType('EntitySuperUnit')[i]);
						nearestEnemyUnit = ig.game.getEntitiesByType('EntitySuperUnit')[i];
					}
				}
			}
			this.moveUnitsToAttackNearest(nearestEnemyUnit);			
		},
		
		trainUnit: function(unitType){
			if (this.currentResources - 300 >= 0){
				console.log('Has Enough Resources');
				for (var i = 0;i < this.selectedBuildings.length;i++){
				    console.log('Training Loop');
					if (this.selectedBuildings[i].training == 0){
						console.log('Training Unit :'+unitType);
						this.currentResources -= this.selectedBuildings[i].unitPrice[this.selectedBuildings[i].trains.indexOf(unitType)];
						this.spentResources += this.selectedBuildings[i].unitPrice[this.selectedBuildings[i].trains.indexOf(unitType)];
						this.selectedBuildings[i].trainingTimer = new ig.Timer(this.selectedBuildings[i].unitTrainTime[this.selectedBuildings[i].trains.indexOf(unitType)]);
						this.selectedBuildings[i].training = unitType;
						console.log('Resources after training: '+(this.currentResources));
					}
				}
				return true; // Return true if training has started
			}else{
				return false; // Return false if CPU don't have enough resources.
			}
		},
		
		constructBuilding: function(buildingType){
			if (this.currentResources - 500 >= 0){
				this.setBuildingConstrPosition(buildingType);
				ig.game.spawnEntity('Entity'+buildingType,
				this.constrBuildingPosX, this.constrBuildingPosY ,
				{owner: this,aiBuilding: true,constructing: true});
				return true; // Return true if construction started.
			}else{
				return false; // Return false if CPU don't have enough resources.
			}
		},
		
		setBuildingConstrPosition: function(buildingType){
			switch (this.corner){
				case 2:
					if(buildingType == 'ResourceBuilding'){
						this.constrBuildingPosX = this.startingPos.x + 156 + (96 * (Math.floor(this.resourceBuildingSeq / 2)));
						this.constrBuildingPosY = this.startingPos.y + 46 - (76 * (this.resourceBuildingSeq % 3));
						this.resourceBuildingSeq++;
					}else{
						this.constrBuildingPosX = this.startingPos.x + (106 * (this.productionBuildingsSeq % 2));
						this.constrBuildingPosY = this.startingPos.y - 176 - (106 * (Math.floor(this.productionBuildingsSeq/ 2)));
						this.productionBuildingsSeq++;
					}
				break;
				case 3:
					if(buildingType == 'ResourceBuilding'){
						this.constrBuildingPosX = this.startingPos.x - 156 - (96 * (Math.floor(this.resourceBuildingSeq / 2)));
						this.constrBuildingPosY = this.startingPos.y + 46 - (76 * (this.resourceBuildingSeq % 3));
						this.resourceBuildingSeq++;
					}else{
						this.constrBuildingPosX = this.startingPos.x - (106 * (this.productionBuildingsSeq % 2));
						this.constrBuildingPosY = this.startingPos.y - 176 - (106 * (Math.floor(this.productionBuildingsSeq/ 2)));
						this.productionBuildingsSeq++;
					}
				break;
				case 4:
					if(buildingType == 'ResourceBuilding'){
						this.constrBuildingPosX = this.startingPos.x - 156 - (96 * (Math.floor(this.resourceBuildingSeq / 2)));
						this.constrBuildingPosY = this.startingPos.y - 46 + (76 * (this.resourceBuildingSeq % 3));
						this.resourceBuildingSeq++;
					}else{
						this.constrBuildingPosX = this.startingPos.x - (106 * (this.productionBuildingsSeq % 2));
						this.constrBuildingPosY = this.startingPos.y + 176 + (106 * (Math.floor(this.productionBuildingsSeq/ 2)));
						this.productionBuildingsSeq++;
					}
				break;
			}
		},
		
		setUnitsQuantity: function(){
			var quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityCheapGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityCheapGuy')[i].owner){
					quantity++;
				}
			}
			this.cheapGuys = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityFastGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityFastGuy')[i].owner){
					quantity++;
				}
			}
			this.fastGuys = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntitySniperGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntitySniperGuy')[i].owner){
					quantity++;
				}
			}
			this.sniperGuys = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityHealerGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityHealerGuy')[i].owner){
					quantity++;
				}
			}
			this.healerGuys = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityHeavyGuy').length; i++){
				if (this == ig.game.getEntitiesByType('EntityHeavyGuy')[i].owner){
					quantity++;
				}
			}
			this.heavyGuys = quantity;
			this.currTotalUnits = this.cheapGuys + this.fastGuys + this.sniperGuys + this.healerGuys + this.heavyGuys;			
		},
		
		setBuildingsQuantity: function(){
			var quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityMainBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityMainBuilding')[i].owner &&
				    !ig.game.getEntitiesByType('EntityMainBuilding')[i].constructing){
					quantity++;
				}
			}
			this.mainBuildings = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityResourceBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityResourceBuilding')[i].owner &&
				    !ig.game.getEntitiesByType('EntityResourceBuilding')[i].constructing){
					quantity++;
				}
			}
			this.resourceBuildings = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityTrainingBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityTrainingBuilding')[i].owner &&
				    !ig.game.getEntitiesByType('EntityTrainingBuilding')[i].constructing){
					quantity++;
				}
			}
			this.trainBuildings = quantity;
			quantity = 0;
			for (var i = 0; i < ig.game.getEntitiesByType('EntityFinalBuilding').length; i++){
				if (this == ig.game.getEntitiesByType('EntityFinalBuilding')[i].owner &&
				    !ig.game.getEntitiesByType('EntityFinalBuilding')[i].constructing){
					quantity++;
				}
			}
			this.finalBuildings = quantity;
			this.currTotalBuildings = this.mainBuildings + this.resourceBuildings + this.trainBuildings + this.finalBuildings;				
		},
		
		selectUnits: function(percCheapGuy,percFastGuy,percSniperGuy,percHealerGuy,percHeavyGuy){
			this.selectedUnits = [];
			var seq = 0;
			var quantitySelected = 0;
			if (this.cheapGuys > 0){
				for (var i = 0; i < ig.game.getEntitiesByType('EntityCheapGuy').length; i++){
					if (this == ig.game.getEntitiesByType('EntityCheapGuy')[i].owner &&
						quantitySelected < parseInt((this.cheapGuys * percCheapGuy / 100).toFixed())){
						quantitySelected++;
						this.selectedUnits[seq] = ig.game.getEntitiesByType('EntityCheapGuy')[i];
						seq++;
					}
				}
			}
			quantitySelected = 0;
			if (this.fastGuys > 0){
				for (var i = 0; i < ig.game.getEntitiesByType('EntityFastGuy').length; i++){
					if (this == ig.game.getEntitiesByType('EntityFastGuy')[i].owner &&
						quantitySelected < parseInt((this.fastGuys * percFastGuy / 100).toFixed())){
						quantitySelected++;
						this.selectedUnits[seq] = ig.game.getEntitiesByType('EntityFastGuy')[i];
						seq++;
					}
				}
			}
			quantitySelected = 0;
			if (this.sniperGuys > 0){
				for (var i = 0; i < ig.game.getEntitiesByType('EntitySniperGuy').length; i++){
					if (this == ig.game.getEntitiesByType('EntitySniperGuy')[i].owner &&
						quantitySelected < parseInt((this.sniperGuys * percSniperGuy / 100).toFixed())){
						quantitySelected++;
						this.selectedUnits[seq] = ig.game.getEntitiesByType('EntitySniperGuy')[i];
						seq++;
					}
				}
			}
			quantitySelected = 0;
			if (this.healerGuys > 0){
				for (var i = 0; i < ig.game.getEntitiesByType('EntityHealerGuy').length; i++){
					if (this == ig.game.getEntitiesByType('EntityHealerGuy')[i].owner &&
						quantitySelected < parseInt((this.healerGuys * percHealerGuy / 100).toFixed())){
						quantitySelected++;
						this.selectedUnits[seq] = ig.game.getEntitiesByType('EntityHealerGuy')[i];
						seq++;
					}
				}
			}
			quantitySelected = 0;
			if (this.heavyGuys > 0){
				for (var i = 0; i < ig.game.getEntitiesByType('EntityHeavyGuy').length; i++){
					if (this == ig.game.getEntitiesByType('EntityHeavyGuy')[i].owner &&
						quantitySelected < parseInt((this.heavyGuys * percHeavyGuy / 100).toFixed())){
						quantitySelected++;
						this.selectedUnits[seq] = ig.game.getEntitiesByType('EntityHeavyGuy')[i];
						seq++;
					}
				}
			}	
		},
		
		selectBuildings: function(buildingType){
		    var cont = 0;
			this.selectedBuildings = [];
			for (var i = 0;i < ig.game.getEntitiesByType('Entity'+buildingType).length;i++){
				if (ig.game.getEntitiesByType('Entity'+buildingType)[i].owner == this){
				    console.log('Selecionou '+buildingType);
					this.selectedBuildings[cont] = ig.game.getEntitiesByType('Entity'+buildingType)[i];
					cont++;
				}
			}
		},
		
		moveUnits: function(posX,posY){
			for (var i = 0;i < this.selectedUnits.length;i++){
				this.selectedUnits[i].findTarget();
				this.selectedUnits[i].destinationx = posX;
				this.selectedUnits[i].destinationy = posY;
			}
		},
		
		moveUnitsToAttackNearest: function(nearestEnemy){
			if (typeof(nearestEnemy) != 'undefined'){
				for (var i = 0;i < this.selectedUnits.length;i++){
					if (this.selectedUnits[i].distanceTo(nearestEnemy) > this.selectedUnits[i].range - (nearestEnemy.size.x/2)){
						this.selectedUnits[i].findTarget();
						this.selectedUnits[i].destinationx = nearestEnemy.pos.x;
						this.selectedUnits[i].destinationy = nearestEnemy.pos.y;
					}else{
						//this.selectedUnits[i].findTarget();
						this.selectedUnits[i].vel.x = 0;
						this.selectedUnits[i].vel.y = 0;
					}
				}
			}
		},
		
		stackUnits: function(){
			if (this.currTotalUnits % 5 == 0){
				this.selectUnits(100,100,100,100,100);
				this.moveUnits(this.startingPos.x - 80,this.startingPos.y - 80);
			}
		},
				
		pickAttackTarget: function(){
			var numberOfAiPlayers = 0;
			var iaPlayers = new Array();
			var targetChance;
			
			if (this.attackTarget != 0){
				if (this.attackTarget.currTotalBuildings > 0 &&
				    typeof(this.attackTarget) != 'undefined'){
				}else{
					this.keepAttackingTimer.set(0);
				}
			}
			if (this.keepAttackingTimer.delta() >= 0){
				for (var i = 0;i < ig.game.getEntitiesByType('EntityPlayerIA').length;i++){
					if(ig.game.getEntitiesByType('EntityPlayerIA')[i] != this &&
					ig.game.getEntitiesByType('EntityPlayerIA')[i].currTotalBuildings > 0){
						iaPlayers[numberOfAiPlayers] = ig.game.getEntitiesByType('EntityPlayerIA')[i];
						numberOfAiPlayers++;
					}
				}
				if (numberOfAiPlayers == 0){
					this.attackTarget = ig.game.getEntitiesByType('EntityPlayer')[0];
					this.attackTargetPosX = this.attackTarget.startingPos.x + 20;
					this.attackTargetPosY = this.attackTarget.startingPos.y + 20;
				}else if (numberOfAiPlayers == 1){
					if (Math.random() < 0.35){
						this.attackTarget = ig.game.getEntitiesByType('EntityPlayer')[0];
						this.attackTargetPosX = this.attackTarget.startingPos.x + 20;
						this.attackTargetPosY = this.attackTarget.startingPos.y + 20;
					}else{
						this.attackTarget = iaPlayers[0];
						this.getEnemyAiPosition(iaPlayers[0]);
					}
				}else if (numberOfAiPlayers == 2){
					targetChance = Math.random();
					if (targetChance < 0.25){
						this.attackTarget = ig.game.getEntitiesByType('EntityPlayer')[0];
						this.attackTargetPosX = this.attackTarget.startingPos.x + 20;
						this.attackTargetPosY = this.attackTarget.startingPos.y + 20;
					}else if (targetChance > 0.25 && targetChance < 0.61){
						this.attackTarget = iaPlayers[0];
						this.getEnemyAiPosition(iaPlayers[0]);
					}else{
						this.attackTarget = iaPlayers[1];
						this.getEnemyAiPosition(iaPlayers[1]);
					}
				}
				this.keepAttackingTimer = new ig.Timer(90);
			}
		},
		
		getEnemyAiPosition: function(enemyIA){
			switch (enemyIA.corner){
			case 2:
				this.attackTargetPosX = enemyIA.startingPos.x + 20;
				this.attackTargetPosY = enemyIA.startingPos.y - 20;
			break;
			case 3:
				this.attackTargetPosX = enemyIA.startingPos.x - 20;
				this.attackTargetPosY = enemyIA.startingPos.y - 20;
			break;
			case 4:
				this.attackTargetPosX = enemyIA.startingPos.x - 20;
				this.attackTargetPosY = enemyIA.startingPos.y + 20;
			break;
			}			
		},
		
        update: function() {
            this.parent();
			this.setBuildingsQuantity();
			this.setUnitsQuantity();
			//this.stackUnits();
			this.runNextCycle();
			this.setResultPoints();
        },
		
		setResultPoints: function(){
			playersSelected[this.owner - 1] = ('CPU'+(this.owner - 1));
			playerTotalResources[this.owner - 1] = this.totalResources;
			playerSpentResources[this.owner - 1] = this.spentResources;
			playerUnitsTrained[this.owner - 1] = this.unitsTrained;
			playerUnitsLost[this.owner - 1] = this.unitsLost;
			playerBuildingsBuilt[this.owner - 1] = this.buildingsBuilt;
			playerBuildingsLost[this.owner - 1] = this.buildingsLost;
			this.calculatePoints();	
			playerFinalScore[this.owner - 1] = this.points;
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