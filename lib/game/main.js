ig.module('game.main')
.requires(
	'impact.game',
	'impact.font',
	'game.imageblender',
	'plugins.map-size',
	'game.entities.player',
	'game.levels.mainmenu',
	'game.levels.test1',
	'game.levels.resultsMenu',
	'game.entities.mainMenu',
	'game.entities.arrowscroll',
	'game.levels.skirmishMenu',
	'game.entities.playerIA')
.defines(function(){

var scrollSpeed = 2;
var keyScroll = 20;

MyGame = ig.Game.extend({
	mouseStart: {x: 0, y: 0},
	maptile: new ig.Image('media/maptile/tileset32.png'),
	titlebg: new ig.Image('media/generictitle3.png'),
	sidemenu: new ig.Image('media/side.png'),
	resourceFrame: new ig.Image('media/charset/resourceFrame.png'),
	trainingFrame: new ig.Image('media/charset/trainingFrame.png'),
	finalFrame: new ig.Image('media/charset/finalFrame.png'),
	arrowScrollV: new ig.Image('media/arrow1.png'),
	arrowScrollH: new ig.Image('media/arrow2.png'),
	mapInitialized: false,
	currMenuOption: 0,
	player1Initialized: false,
	gameOver: false,
	minimap : {
        size : 90, //90x90px on the screen
        c : 16, // Compression factor, for a square map of 16x128pixel .
        //Absolute positions on the screen
        x: 0, 
        y: 480 - 128
    },
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.MOUSE1, 'lclick' );
		ig.input.bind( ig.KEY.MOUSE2, 'rclick' );
		this.currMenuOption = 0;
		ig.global.selected = [];
		this.loadLevel(LevelMainmenu);
		returnToMainMenu = 0;
		this.rightBorder = ig.game.backgroundMaps[0].pxWidth - ig.system.width + 220;
		this.bottomBorder = ig.game.backgroundMaps[0].pxHeight - ig.system.height + 20;
		ig.global.rightBorder = ig.game.backgroundMaps[0].pxWidth - ig.system.width + 60;
		//ig.global.bottomBorder doesn't seem to get the proper value, it's always 0
		ig.global.bottomBorder = ig.game.backgroundMaps[0].pxHeight - ig.system.height;
		ig.global.selectionRectangle = [0,0,0,0]; //x start, x end, y start, y end
		this.screen.x = 0;
		this.screen.y = 0;
		ig.system.context.strokeStyle="FFFFFF";
		console.log($("#pl2").val());
		//player1 = game.entities.player;
		//this.generateMap();
	},
	
	miniMap: function() {
		this.rightBorder;
		this.bottomBorder;
	},
	
	generateMap: function(rows, columns){
		var maparray = [];
		var rowarray = [];
		var colmaprow = [];
		var colmap = [];
		var tilesize = 32;
		var tilefactor = tileSetSelected;
		var collision = 0;
		this.mapheight = mapHeight; //parseInt(document.getElementById('mapheight').value);
		this.mapwidth = mapWidth; //parseInt(document.getElementById('mapwidth').value);
		
		for (var row = 0; row < this.mapheight; row++) {
			for (var x = 0; x < this.mapwidth; x++) {
				if ((row > 0 && row < this.mapheight - 1) && 
					rowarray.length > 0 && rowarray.length < this.mapwidth - 1) {
					var tile = Math.random();
					if (tile > 0.95) {
						//Collision background
						collision = 1;
						tile = 2+tilefactor;
					} else {
						//Not collision
						collision = 0;
						tile = 1+tilefactor;
					}
					rowarray.push(tile);
					colmaprow.push(collision);
				} else {
					//Borders are black with collisions
					rowarray.push(0);
					colmaprow.push(1);
				}
			}
			maparray.push(rowarray);
			colmap.push(colmaprow);
			var rowarray = [];
			var colmaprow = [];
		}
		this.collisionMap = new ig.CollisionMap( tilesize, colmap );
        var bgmap = new ig.BackgroundMap( tilesize, maparray, this.maptile );
		this.backgroundMaps.push(bgmap);
		this.rightBorder = ig.game.backgroundMaps[1].pxWidth - ig.system.width + 80;
		this.bottomBorder = ig.game.backgroundMaps[1].pxHeight - ig.system.height;
		ig.global.rightBorder = ig.game.backgroundMaps[1].pxWidth - ig.system.width;
		//ig.global.bottomBorder doesn't seem to get the proper value, it's always 0
		ig.global.bottomBorder = ig.game.backgroundMaps[1].pxHeight - ig.system.height;
		
		var numberOfPlayers = 1;
		ig.game.spawnEntity(EntityPlayer,
		                    424,72,
							{owner : 1, color : playerColors[0], startPosX: 76, startPosY: 76, corner: 1});
		ig.game.spawnEntity(EntityStartingpos,
					        76,76,
					        {player: ig.game.getEntitiesByType('EntityPlayer')[0]});	
		for (var i = 1;i <= cpuPlayers.length;i++){
			if (cpuPlayers[i - 1] == "cpu"){
				numberOfPlayers++;
				if (numberOfPlayers == 2){
					ig.game.spawnEntity(EntityPlayerIA,
		                                434 + i,72 + i,
					{owner : numberOfPlayers, color : playerColors[i], startPosX : (this.mapwidth - 6) * tilesize, startPosY : (this.mapheight - 6) * tilesize,corner: 3});
					
					ig.game.spawnEntity(EntityStartingpos,
					(this.mapwidth - 6) * tilesize,(this.mapheight - 6) * tilesize,
					{player: ig.game.getEntitiesByType('EntityPlayerIA')[numberOfPlayers - 2],aiStartingPos : true});
				}else if (numberOfPlayers == 3){
					ig.game.spawnEntity(EntityPlayerIA,
		                                444 + i,72 + i,
					{owner : numberOfPlayers, color : playerColors[i], startPosX : 76, startPosY : (this.mapheight - 6) * tilesize,corner: 2});
					
					ig.game.spawnEntity(EntityStartingpos,
					76,(this.mapheight - 6) * tilesize,
					{player: ig.game.getEntitiesByType('EntityPlayerIA')[numberOfPlayers - 2],aiStartingPos : true});	
				}else{
					ig.game.spawnEntity(EntityPlayerIA,
		                                454 + i,72 + i,
					{owner : numberOfPlayers, color : playerColors[i], startPosX : (this.mapwidth - 6) * tilesize, startPosY : 76, corner: 4});
					
					ig.game.spawnEntity(EntityStartingpos,
					(this.mapwidth - 6) * tilesize,76,
					{player: ig.game.getEntitiesByType('EntityPlayerIA')[numberOfPlayers - 2],aiStartingPos : true});
				}
			}
		}
	},
	
	skirmishPlay: function() {
		if(ig.input.state('left') && !this.screen.x<=0){
				if(this.screen.x > 30){
					this.screen.x -= keyScroll;
				}else{
					this.screen.x = 0;
				}
			}
			 
			if(ig.input.state('right')){
				if(this.screen.x < this.rightBorder - 30){
					this.screen.x += keyScroll;
				}else{
					this.screen.x = this.rightBorder;
				}
			}
			 
			if(ig.input.state('up') && !this.screen.y<=0){
				if(this.screen.y > 30){
					this.screen.y -= keyScroll;
				}else{
					this.screen.y = 0;
				}
			}
			 
			if(ig.input.state('down')){
				if(this.screen.y < this.bottomBorder - 30){
					this.screen.y += keyScroll;
				}
					else{
				this.screen.y = this.bottomBorder;
				}
			}
		//Moving camera end --------------		
		//Mouse commands ------------------
		if (ig.input.pressed('rclick')) {
			// set the starting point
			ig.global.selected = [];
			this.mouseStart.x = ig.input.mouse.x;
			this.mouseStart.y = ig.input.mouse.y;
		}
		
		//Hold right mouse button to drag the screen
		if (ig.input.state('rclick')) {
			nextPos = this.screen.y - (ig.input.mouse.y - this.mouseStart.y);
			if (nextPos < 0) {
			 this.screen.y = 0;
			 } else {
			   if (nextPos > this.bottomBorder) {
				 this.screen.y = this.bottomBorder;
			   } else{
				 this.screen.y += (this.mouseStart.y - ig.input.mouse.y)*(scrollSpeed);}
			 }
			
			nextPos = this.screen.x - (ig.input.mouse.x - this.mouseStart.x);
			if (nextPos < 0) {
			 this.screen.x = 0;
			 } else {
			   if (nextPos > this.rightBorder) {
				 this.screen.x = this.rightBorder;
			   } else{
				 this.screen.x += (this.mouseStart.x - ig.input.mouse.x)*(scrollSpeed);}
			}
			this.mouseStart.y = ig.input.mouse.y;
			this.mouseStart.x = ig.input.mouse.x;
		}
	},
	
	update: function() {
		if (menuOption == 1 && this.currMenuOption != menuOption){
			if (menuOption == 1){
				this.loadLevel(LevelSkirmishMenu);
				showSkirmish();
				returnToMainMenu = 0;
			}
			this.currMenuOption = menuOption;
		}

		if (game.value == 1 && this.mapInitialized == false){	
			this.loadLevel(LevelTest1);
			/*this.rightBorder = ig.game.backgroundMaps[0].pxWidth - ig.system.width + 100;
	    	this.bottomBorder = ig.game.backgroundMaps[0].pxHeight - ig.system.height;
			ig.global.rightBorder = ig.game.backgroundMaps[0].pxWidth - ig.system.width;
			//ig.global.bottomBorder doesn't seem to get the proper value, it's always 0
			ig.global.bottomBorder = ig.game.backgroundMaps[0].pxHeight - ig.system.height;
			ig.global.selectionRectangle = [0,0,0,0]; //x start, x end, y start, y end*/
			this.generateMap();
			this.mapInitialized = true;
			showPauseButton();
		}
		if (game.value == 1 && gamePaused == 0){	
			this.skirmishPlay();
		} else {
			//is in one of the menus
		}	
		if (returnToMainMenu == 1){
			returnToMainMenu = 0;
			hideResultsMenu();
			this.loadLevel(LevelMainmenu);
		}
		if (game.value == 1 && this.mapInitialized == true){
			if (this.player1Initialized == false && 
			    ig.game.getEntitiesByType('EntityPlayer')[0].currTotalBuildings > 0){
				this.player1Initialized = true;
			}
			if (ig.game.getEntitiesByType('EntityPlayer')[0].currTotalBuildings == 0 &&
				ig.game.getEntitiesByType('EntityPlayer')[0].currTotalUnits == 0 &&
			    this.player1Initialized == true){
				//ig.system.stopRunLoop();
				showDefeat();
				this.gameOver = true;
			}else{
				var iaPlayerQuantity = 0;
				var defeatedPlayers = 0;
				
				if (typeof(ig.game.getEntitiesByType('EntityPlayerIA')[0]) != 'undefined' && 
				    this.player1Initialized == true){
					iaPlayerQuantity = ig.game.getEntitiesByType('EntityPlayerIA').length;
					for (var i = 0;i < ig.game.getEntitiesByType('EntityPlayerIA').length;i++){
						if (ig.game.getEntitiesByType('EntityPlayerIA')[i].currTotalBuildings == 0 &&
						    ig.game.getEntitiesByType('EntityPlayerIA')[i].currTotalUnits == 0){
							defeatedPlayers++;
						}
					}
					if (defeatedPlayers == iaPlayerQuantity){
						showVictory();
					}
				}
			}
		}
		if (goToResults == 1){
			//ig.system.startRunLoop();
			goToResults = 0;
			this.currMenuOption = 0;
			this.mapInitialized = false;
			this.player1Initialized = false;
			this.gameOver = false;
			hideVictory();
			hideDefeat();
			this.loadLevel(LevelResultsMenu);
			for (var i = 1;i <= 4;i++){
				setResultPlayerSelected(i);
				setResultUnitsTrained(i);
				setResultUnitsLost(i);
				setResultTotalRes(i);
				setResultResSpent(i);
				setResultFinalScore(i);
			}
			showResultsMenu();
		}
		if (gamePaused == 0){
			this.parent();
		}
	},
	
scrollingMap: function(){	
	if (ig.input.mouse.x <= 20 ) {
		if(this.screen.x > 30){
			this.screen.x -= keyScroll;
		} else {
			this.screen.x = 0;
		}
	}
		 
	if (ig.input.mouse.x >= canWidth - 120 && ig.input.mouse.x < canWidth - 100) {
		if(this.screen.x < this.rightBorder - 30){
			this.screen.x += keyScroll;
		} else {
			this.screen.x = this.rightBorder;
		}
	}
		 
	if (ig.input.mouse.y <= canHeight - 20) {
		if(this.screen.y > 30){
			this.screen.y -= keyScroll;
		} else {
			this.screen.y = 0;
		}
	}
	 
	if (ig.input.mouse.y >= 20) {
		if(this.screen.y < this.bottomBorder - 30){
			this.screen.y += keyScroll;
		} else {
			this.screen.y = this.bottomBorder;
		}
	}
},
	
	rectangleSelection: function(){
		if (ig.input.pressed('lclick')) {
			this.mouseStart.x = ig.input.mouse.x;
			this.mouseStart.y = ig.input.mouse.y;
			ig.system.context.strokeStyle= '#FFFFFF';
		}
		//mouse click hold
		if (ig.input.state('lclick')) {
			this.scrollingMap();
			ig.system.context.strokeRect(this.mouseStart.x, this.mouseStart.y,
			(ig.input.mouse.x - this.mouseStart.x),(ig.input.mouse.y -this.mouseStart.y));
		}
		if (ig.input.released('lclick')) {
			var startx = this.mouseStart.x + ig.game.screen.x;
			var starty = this.mouseStart.y + ig.game.screen.y;
			var distx = ig.input.mouse.x + ig.game.screen.x;
			var disty = ig.input.mouse.y + ig.game.screen.y;
			ig.global.selectionRectangle = [startx, distx, starty, disty]; //x start, x end, y start, y end
			//ig.global.selectionRectangle = [distx, ig.input.mouse.x, disty, ig.input.mouse.y]; //x start, x end, y start, y end
			ig.system.context.strokeRect(this.mouseStart.x,this.mouseStart.y,
			(ig.input.mouse.x - this.mouseStart.x),(ig.input.mouse.y -this.mouseStart.y));
		} else { ig.global.selectionRectangle = [0,0,0,0];}
	},
	
	drawSideMenu: function(){
		if (ig.input.mouse.x >= canWidth - 100 && ig.input.mouse.y >= 20 && ig.input.mouse.y < 109){
			ig.system.context.fillStyle = '#111111';
			ig.system.context.fillRect(canWidth - 220, 54, 115, 16);
			ig.system.context.font = '18px';
			ig.system.context.fillStyle = '#FFFFFF';
			ig.system.context.fillText('Resource Building $500',canWidth - 220,64);
		}else if (ig.input.mouse.x >= canWidth - 100 && ig.input.mouse.y >= 109 && ig.input.mouse.y < 198){
			ig.system.context.fillStyle = '#111111';
			ig.system.context.fillRect(canWidth - 220, 143, 115, 16);
			ig.system.context.font = '18px';
			ig.system.context.fillStyle = '#FFFFFF';
			ig.system.context.fillText('Training Building $600',canWidth - 220,153);
		}else if (ig.input.mouse.x >= canWidth - 100 && ig.input.mouse.y >= 198 && ig.input.mouse.y < 287){
			ig.system.context.fillStyle = '#111111';
			ig.system.context.fillRect(canWidth - 220, 232, 115, 16);
			ig.system.context.font = '18px';
			ig.system.context.fillStyle = '#FFFFFF';
			ig.system.context.fillText('Final Building $1200',canWidth - 220,242);
		}
	},
	
	drawArrows: function(){
	//Right side
		this.arrowScrollH.draw(canWidth - 120, (canHeight/2) - 30);
	//Left Side
		this.arrowScrollH.drawTile(3, canHeight/2 - 30, 0 , 20, 80, true, false);
	//Up
		this.arrowScrollV.draw((canWidth/2) - 75, 3);
	//Down
		this.arrowScrollV.drawTile((canWidth/2) - 75, canHeight - 30, 0, 80, 20, false, true);
	},
	
	skirmishDraw: function() {
		this.rectangleSelection();
		this.drawSideMenu();
		this.drawArrows();
		ig.system.context.fillStyle = '#111111';
		ig.system.context.fillRect(ig.system.width - 100 , 5, -60, 20);
		ig.system.context.font = '20px';
		ig.system.context.fillStyle = '#FFF0DD';
		var money = ig.game.getEntitiesByType('EntityPlayer')[0].currentResources;
		ig.system.context.fillText('$'+money, 320 , 18);
		this.sidemenu.draw(canWidth - 100, 0);
		this.resourceFrame.draw(canWidth - 94, 20);
		this.trainingFrame.draw(canWidth - 94, 109);
		this.finalFrame.draw(canWidth - 94, 198);
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		if (game.value == 1 && this.gameOver == false){
			this.skirmishDraw();
		} else {
			this.titlebg.draw((canWidth/2) - 70,0);
		}
		/*ig.system.context.fillStyle = 'white';
        ig.system.context.font = 'italic 22px sans-serif';
        ig.system.context.textBaseline = 'top';
        ig.system.context.fillText ('Hello canvas!', 0, 0);
        ig.system.context.font = 'bold 30px sans-serif';
        ig.system.context.strokeText('Hello world!', 0, 50);*/
		//ig.system.context.strokeRect(100,100, -50, -50);
		// Add your own drawing code here
		//this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
	
});

//Variables defined here are global to all other ig.Class' es
var player1;
var player2;
var canHeight = 320;
var canWidth = 480;
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2

ig.main( '#canvas', MyGame, 60, canWidth, canHeight, 1);

});
