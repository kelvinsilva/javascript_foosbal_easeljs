//
var globalWidth = 400;
var globalHeight = 600;
//
var keys = []; //Key handler
//
var stage;
var mainCanv; //canvas dom element
var image;
var fpstext;

//stage = document.getElementById("mainCanv");
var playerOne;
var playerTwo;
var gameStart = false;

//game assets list
var mainMenuAssets = [];
var mainGameAssets = [];
var mainCreditsAssets = [];

//mainmenu container and main game container
var mainMenuView = new createjs.Container();
var creditsView  = new createjs.Container();
var gameView = new createjs.Container();

//Team 1 and team 2 form DOMElement
var teamFormDOMElement;

//general button
var data = {
				
				animations:{
					"out"  : 0,
					"over" : 1,
					"down" : 2
				},

				frames: {width: 91, height: 41}
			};

//mainmenu start button Helper
var menuStartBtnHelper;
var menuCreditsBtnHelper;

//credits page buttons Helper
var _creditsMainMenuBtnHelper;

var manifest;
var loader;


//loading of assets


function loadAssets(){

	manifest = [
		{src: "assets/assets_mainmenu/mainMenu.png", id: "MenuBackground"},
		{src: "assets/assets_mainmenu/mainMenuStartBtn.png", id: "MenuStartBtn"},
		{src: "assets/assets_mainmenu/mainMenuCreditsBtn.png", id: "MenuCreditsBtn"},
		{src: "assets/assets_maincredits/credits.png", id: "CreditsBackground"},
		{src: "assets/assets_maincredits/creditsMainMenuBtn.png", id: "CreditsMainMenuBtn"},
		{src: "assets/assets_maingame/gameSoccerField.png", id: "GameSoccerField"},
		{src: "assets/assets_maingame/gameSoccerBall.png", id: "GameSoccerBall"},
		{src: "assets/assets_maingame/gamePlayers.png", id: "GamePlayer"}

	];

	loader = new createjs.LoadQueue(false);
	loader.on("fileload", handleFileLoad);
	loader.on("progress", handleFileProgress);
	loader.on("complete", handleComplete);
	//loader.on("error", loadError);

	loader.loadManifest(manifest);
}

function handleFileLoad(event){ 
		var strFilt = event.item.id;

		switch(strFilt[0]){

			case "M":

				mainMenuAssets.push(event.item);
			
			break;

			case "C":
				
				mainCreditsAssets.push(event.item);

			break;

			case "G":

				mainGameAssets.push(event.item);
			
			break;

		}
	
}

function handleFileProgress(event){

}


function handleComplete(){
	//after loading of assets is complete, then we load menu, display menu, load credits (display credits are called when button is pressed (line 126), and load game.
	loadMenu();
	displayMenu();
	loadCredits();
	//display credits is called when MenuCreditsBtnHelper is pressed
	loadGame(); //display game is called when startbtnhelper is pressed
}

//game shit

//game shit

var playerBitmap;
var playerBitmapHeight = 50
var playerBitmapWidth = 24

var playerDataRed	= {
						
						animations: {	

							kick: {
								frames: [3,4,5,5,4,3],
								next: null
							}
						},

						//images: [playerBitmap],

						frames: {

							height: playerBitmapHeight,
							width : playerBitmapWidth,
						}
					};

var playerDataBlue = {
						
						animations: {	

							kick: {

								frames: [0,1,2,2,1,0],
								next: null
							}

						},

						//images: [playerBitmap],

						frames: {

							height: playerBitmapHeight,
							width : playerBitmapWidth,
						}
					};

var playerDataArray = [];
	playerDataArray.push (playerDataRed);
	playerDataArray.push (playerDataBlue);

var playerSpriteSheet;

var playerRedSpriteSheet; 
var playerBlueSpriteSheet;

var playerRedSpriteArray  = [];
var playerBlueSpriteArray = [];

var gameSoccerField;
var gameSoccerBall;

function loadGame(){

	for (var j = 0; j < mainGameAssets.length; j++){

		var item = mainGameAssets[j];

		switch(item.id){

			case "GamePlayer" : {

				tempPlayerOne = new createjs.Container();
					tempPlayerOne.name = "playerOne";
				
				tempPlayerTwo = new createjs.Container();
					tempPlayerTwo.name = "playerTwo";

				var playerArray = [];
				playerArray.push(tempPlayerOne);
				playerArray.push(tempPlayerTwo);

					
				for (var i = 0; i < 2; i++){

					//playerBitmap = new createjs.Bitmap( loader.getResult(item.id) );
					//tempdat = playerDataArray[i];
					playerDataArray[i].images = [];
					playerDataArray[i].images.push ( loader.getResult (item.id) );
					//tempdat["images"] = [];
					//tempdat["images"].push (loader.getResult(item.id));
					//playerSpriteSheet = new createjs.SpriteSheet(playerDataArray[i]);


					//x, y positioning of red goalie.
					tempGoalieSprite = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
							tempGoalieSprite.regX = playerBitmapWidth/2;
							tempGoalieSprite.x = globalWidth/2;
							//tempGoalieSprite.y = globalHeight-85;

					var goalieRodContainer = new createjs.Container();
						goalieRodContainer.name = "goalieRodContainer";
						goalieRodContainer.y = (i == 0) ? globalHeight-85 : 85;
						goalieRodContainer.addChild (tempGoalieSprite)

					playerArray[i].addChild(goalieRodContainer);
					///////////////////////////////////////////
					//playerRedSpriteArray.push ( goalieRodContainer );
					///
					tempDefenderSpriteRight = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempDefenderSpriteRight.regX = playerBitmapWidth/2;
						tempDefenderSpriteRight.x = tempGoalieSprite.x + 40;

					tempDefenderSpriteLeft = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempDefenderSpriteLeft.regX = playerBitmapWidth/2;
						tempDefenderSpriteLeft.x = tempGoalieSprite.x - 40;
						//tempDefenderSpriteLeft.y = tempGoalieSprite.y + 70;

					var defenseRodContainer = new createjs.Container();
						defenseRodContainer.name = "defenseRodContainer";
						defenseRodContainer.y = (i == 0) ? 470 : 135

						defenseRodContainer.addChild (tempDefenderSpriteRight);
						defenseRodContainer.addChild (tempDefenderSpriteLeft);

					playerArray[i].addChild(defenseRodContainer);

					//gameView.addChild(goalieRodContainer);
					//gameView.addChild(defenseRodContainer);

					tempMidfieldSprite_one = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempMidfieldSprite_one.regX = playerBitmapWidth/2;
						tempMidfieldSprite_one.x = 50;

					tempMidfieldSprite_two = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempMidfieldSprite_two.regX = playerBitmapWidth/2;
						tempMidfieldSprite_two.x = 120;
					
					tempMidfieldSprite_three = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempMidfieldSprite_three.regX = playerBitmapWidth/2;
						tempMidfieldSprite_three.x = 190;

					tempMidfieldSprite_four = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempMidfieldSprite_four.regX = playerBitmapWidth/2;
						tempMidfieldSprite_four.x = 270;

					tempMidfieldSprite_five = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempMidfieldSprite_five.regX = playerBitmapWidth/2;
						tempMidfieldSprite_five.x = 340;


					var midfieldRodContainer = new createjs.Container();
						midfieldRodContainer.name = "midfieldRodContainer";
						midfieldRodContainer.y = (i == 0) ? 330 : 260;

						midfieldRodContainer.addChild(tempMidfieldSprite_one, tempMidfieldSprite_two, tempMidfieldSprite_three, tempMidfieldSprite_four, tempMidfieldSprite_five);

					playerArray[i].addChild(midfieldRodContainer);


					tempAttackSprite_one = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempAttackSprite_one.regX = playerBitmapWidth/2;
						tempAttackSprite_one.x = 50;

					tempAttackSprite_two = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempAttackSprite_two.regX = playerBitmapWidth/2;
						tempAttackSprite_two.x = 120;

					tempAttackSprite_three = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempAttackSprite_three.regX = playerBitmapWidth/2;
						tempAttackSprite_three.x = 190;

					tempAttackSprite_four = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempAttackSprite_four.regX = playerBitmapWidth/2;
						tempAttackSprite_four.x = 270;

					tempAttackSprite_five = new createjs.Sprite( new createjs.SpriteSheet(playerDataArray[i]) );
						tempAttackSprite_five.regX = playerBitmap/2;
						tempAttackSprite_five.x = 340;


					var attackRodContainer = new createjs.Container();
						attackRodContainer.name = "attackRodContainer";
						attackRodContainer.y = (i == 0) ? 190 : 390;
						attackRodContainer.addChild(tempAttackSprite_one, tempAttackSprite_two, tempAttackSprite_three, tempAttackSprite_four, tempAttackSprite_five);

					playerArray[i].addChild(attackRodContainer);

					//gameView.addChild(playerRedSpriteArray[0]);

				}

				gameView.addChild(playerArray[0], playerArray[1]);
					//player.x = 114;
					//player.y = 244;
					//gameView.addChild(player);
			}
			break;
			case "GameSoccerField" : {

				gameSoccerField = new createjs.Bitmap (loader.getResult(item.id));
				gameSoccerField.x = 0;
				gameSoccerField.y = 0;

				gameView.addChild(gameSoccerField);
			}
			break;
			case "GameSoccerBall" : {

				gameSoccerBall = new createjs.Bitmap (loader.getResult(item.id) );
				gameSoccerBall.x = 30;
				gameSoccerBall.y = 300;

				gameView.addChild(gameSoccerBall);


			}
			break;
		}

	}

}

var gameViewPlayerIndex = [];
	gameViewPlayerIndex.push("playerOne");
	gameViewPlayerIndex.push("playerTwo");

var gameViewRodIndex = []
gameViewRodIndex.push ("goalieRodContainer");
gameViewRodIndex.push ("defenseRodContainer");
gameViewRodIndex.push ("midfieldRodContainer");
gameViewRodIndex.push ("attackRodContainer");

function displayGame(){


	stage.removeChild(mainMenuView);
	teamFormDOMElement.htmlElement.style.visibility = "hidden";
	stage.removeChild(creditsView);

	stage.addChild(gameView);	

		for (var i = 0; i < gameViewPlayerIndex.length; i++){

			_tempVAR = gameView.getChildByName(gameViewPlayerIndex[i]);

			for (var j = 0; j < gameViewRodIndex.length ; j++){

				_tempVarTwo = _tempVAR.getChildByName(gameViewRodIndex[j]);
				
				for (var k = 0; k < _tempVarTwo.numChildren; k++){

					_tempVarTwo.getChildAt(k).gotoAndPlay("kick");
					
				}	

			}
		}
		playerOne = gameView.getChildByName("playerOne");
		playerTwo = gameView.getChildByName("playerTwo");
		gameStart = true;
}

//
function loadMenu(){

		//First handle the textboxes for team name
		teamForm = document.getElementById("teamsForm");
		teamFormDOMElement = new createjs.DOMElement(teamForm);
		teamFormDOMElement.x = 30;
		teamFormDOMElement.y = 50;

		mainMenuView.addChild(teamFormDOMElement);


		//Then handle game assets
		for (var i = 0; i < mainMenuAssets.length; i++){

			var item = mainMenuAssets[i];

			switch (item.id){

				case "MenuBackground":

					var im = new createjs.Bitmap( loader.getResult(item.id) );
					mainMenuView.addChild(im);				

				break;

				case "MenuStartBtn":

					data["images"] = [];
					data["images"].push(loader.getResult(item.id));
					var instancesheet = new createjs.SpriteSheet(data);

					var instance = new createjs.Sprite(instancesheet);
					instance.addEventListener("click", displayGame );
					instance.x = 114;
					instance.y = 244;
					
					mainMenuView.addChild(instance);

					menuStartBtnHelper = new createjs.ButtonHelper(instance);
					instance.gotoAndStop("out");
					 
					
					/*
					Commented code- deprecated way of makin buttons, buttonHelper and Sprite instances preferre method of making buttons
					menuStartBtn = new createjs.Bitmap( loader.getResult(item.id) );
					menuStartBtn.x = 114;
					menuStartBtn.y = 244;
					menuStartBtn.addEventListener("click",  function(event){ alert("clicked"); } );
					mainMenuView.addChild(menuStartBtn);*/


					

				break;

				case "MenuCreditsBtn":

					data["images"] = [];
					data["images"].push(loader.getResult(item.id));
					var instancesheet = new createjs.SpriteSheet(data);

					var instance = new createjs.Sprite(instancesheet);
					instance.addEventListener("click", displayCredits );
					instance.x = 114;
					instance.y = 300;
					mainMenuView.addChild(instance);

					menuCreditsBtnHelper = new createjs.ButtonHelper(instance);
					instance.gotoAndStop("out");

					/*
					Commented code- deprecated way of makin buttons, buttonHelper and Sprite instances preferre method of making buttons
					menuCreditsBtn = new createjs.Bitmap( loader.getResult(item.id) );
					menuCreditsBtn.x = 114;
					menuCreditsBtn.y = 300;
					menuCreditsBtn.addEventListener("click",  displayCredits );
					mainMenuView.addChild(menuCreditsBtn);*/

				break;
			}
		}
}



function loadCredits(){

	
	for (var i = 0; i < mainCreditsAssets.length; i++){

		var item = mainCreditsAssets[i];

		switch (item.id){

			case "CreditsBackground":

				var im = new createjs.Bitmap( loader.getResult(item.id) );
				creditsView.addChild(im);

			break;

			case "CreditsMainMenuBtn":

					data["images"] = [];
					data["images"].push(loader.getResult(item.id));
					var instancesheet = new createjs.SpriteSheet(data);

					var instance = new createjs.Sprite(instancesheet);
					instance.addEventListener("click", removeCredits );
					instance.x = 100;
					instance.y = 290;

					creditsView.addChild(instance);

					menuCreditsBtnHelper = new createjs.ButtonHelper(instance);
					instance.gotoAndStop("out");

				/*
				Commented code- deprecated way of makin buttons, buttonHelper and Sprite instances preferre method of making buttons
				_creditsMainMenuBtn = new createjs.Bitmap( loader.getResult(item.id) );
				_creditsMainMenuBtn.x = 100;
				_creditsMainMenuBtn.y = 290;
				_creditsMainMenuBtn.addEventListener("click",  removeCredits );				
				creditsView.addChild(_creditsMainMenuBtn);*/

			break;

		}

	}
	creditsView.y = -600;	//to load credit screen above main menu for tweening animation

}



function displayMenu(){
	//When displaying menu, need to enable teamForm visibility to  draw it on canvas/stage, because it is not part of easelJS canvas library
	teamFormDOMElement.visible = true;
	stage.addChild(mainMenuView);
}

function displayCredits(){
	
	
	
	
	stage.addChild(creditsView);
	createjs.Tween.get(creditsView).to({y:0}, 500, createjs.Ease.bounceOut);
	createjs.Tween.get(mainMenuView).to({y:600}, 500, createjs.Ease.bounceOut);
	//When displaying credits, need to disable teamForm visibility to stop drawing it outside of canvas/stage, because it is not part of easelJS canvas library
	teamFormDOMElement.visible = false;

}

function removeMenu(){

}

function removeCredits(){



	createjs.Tween.get(creditsView).to({y:-600}, 500, createjs.Ease.bounceOut);
	//When displaying menu or removing credits, need to enable teamForm visibility to  draw it on canvas/stage, because it is not part of easelJS canvas library
	teamFormDOMElement.visible = true;

	createjs.Tween.get(mainMenuView).to({y:0}, 500, createjs.Ease.bounceOut).call( 

			function () { 
				stage.removeChild(creditsView); 
			} 

		);
}

function removeGame(){

}
////

function addMainMenuView(){
	stage.addChild(mainMenuView);
}

function mainInit(){

	mainCanv = document.getElementById("mainCanv");

	stage = new createjs.Stage("mainCanv");
	stage.enableMouseOver(10);

	loadAssets();
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", tick);

	//can.onkeydown = keydown;
	mainCanv.addEventListener("keydown", keydown, false);
	mainCanv.addEventListener("keyup", keyup, false);
	mainCanv.addEventListener("mousedown", mousedwn, false);
	mainCanv.focus();
	//this.document.mainCanv.onkeyup = keyup;


}

function mousedwn(){
	mainCanv.focus();
}

function keydown(event){
/*
left arrow 	37
up arrow 	38
right arrow 	39
down arrow 	40 
a 	65 
d 	68 
s 	83 
w 	87 

*/

	keys[event.keyCode] = true;
}

function keyup(event){
	delete keys[event.keyCode];
}


function tick(){

	if (gameStart == true){
		
		if (keys[37]) {
			playerOne.x -= 10;
		}else if (keys[39]) {
			playerOne.x += 3;
		}
		if (keys[65]) {
			playerTwo.x -= 3;
		}else if (keys[68]) {
			playerTwo.x += 3;
		}
	}
	
	


	stage.update();
}