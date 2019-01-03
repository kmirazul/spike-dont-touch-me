//Jump Layer Define ...
var JumpyLayer = cc.Layer.extend({
    _character:null,
    _counter : 0,
    _direction : "left",
    _jumpCharacter: false,
    _obstacle : [],
    _gameComplete : false,
    _meter : 0,
    _highScoreFlag : true,
    _tapToStart : true,

    ctor:function () {
       
        this._super();
        cc.director.setDisplayStats(false);
        // Background image created ....
        var size = cc.winSize;
        var bg = this.createSprite("background",jumpyGamePlay.background,size.width/2,size.height/2);
        this.addChild(bg);

        var localData = this.getlocalDataStorage();
        if(localData)
            jumpyUtil.character = localData["character"];
        else
            jumpyUtil.character = 0;

        //Jumpy character created .... 
        var character = this.createSprite("character",this.getCharacterSource(jumpyUtil.character),size.width/2,size.height/2);
        this.addChild(character);

        var bottomFloor = this.createSprite("floor",jumpyGamePlay.bottomFloor,size.width/2,size.height*0.03);
        this.addChild(bottomFloor,3);

        // Tap to start implemented ....
        var tapToStartSpriteBg = this.createSprite("tapToStart",jumpyGamePlay.titleBackground,size.width/2,size.height/2);
        var tapToStartSprite = this.createSprite("text",jumpyGamePlay.tapToStart,tapToStartSpriteBg.width/2,tapToStartSpriteBg.height/2);
        this.addChild(tapToStartSpriteBg,1);
        tapToStartSpriteBg.addChild(tapToStartSprite);

        this.characterJumpListner(bg);

        // Some walls created on Background ....
        this.createSideWall(jumpyGamePlay.sideWallGameScreen,20,cc.winSize.height*0.95,18);
        this.createSideWall(jumpyGamePlay.sideWallGameScreen,cc.winSize.width-20,cc.winSize.height*0.95,18);
        this.createSideWall(jumpyGamePlay.sideTopWall,0,cc.winSize.height*0.95,20);
        this.createSideWall(jumpyGamePlay.sideTopWall,cc.winSize.width,cc.winSize.height*0.95,20);

        // Background upper Score Card define ...
        this.createUpperScoreBoard(9);
        
        return true;
    },

    update : function(dt){

        // The character x-y direction movement logic implement ....
        this.characterMovement(dt);
        
        // Check for the character intersect spikes or coins ....
        this.checkSpikeOutOfWorldOrNot();

        // Here game over and unschesule all updates implemented .....
        if(this.checkCharacterAccidentWithSpikeOrNot()){
            this.unscheduleAllUpdates();
            this.characterDie();
        }

    },

    // Character Jump Listner Event define ...
    characterJumpListner : function(objectName){
        // self variable holds the class reference ....
        var self = this;
        var listnerBg = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);                

                // check the mouse pointer co-ordinates is tapping on respective location or not ....                
                if (cc.rectContainsPoint(targetRectangle, location) && !self.getGameStatus() ){
                    self.setCharacterJumpStatus(true);
                    var character = self.getChildByName("character");
                    character.stopAllActions();
                    //Jump the character with some height ...
                    var actionTo = new cc.JumpTo(0.8,cc.p(character.getPositionX(),character.getPositionY()),150,1);

                    var CharacterJumpStatus = function(){
                        self.setCharacterJumpStatus(false);
                    }
                    var soundId = cc.audioEngine.playEffect(jumpyGamePlay.jumpSound);
                    character.runAction(new cc.Sequence(actionTo,new cc.CallFunc(CharacterJumpStatus, this)));
                }
                // Click for tapTo Start the game ...
                if(self._tapToStart){
                    self.removeChild(self.getChildByName("tapToStart"));
                    self._tapToStart = false;
                    self.tapToStart();
                }
                return false;
            }
        });
        // Here the listner is registered on background clicked .....
        cc.eventManager.addListener(listnerBg,objectName);
    },

    characterMovement : function(dt){
        
        if(this.getChildByName("character")){
           var character = this.getChildByName("character");

           if(this.getCharacterDirection(character)){
                character.scaleX = -1;
                character.x += (dt *500 );
           }else{
                character.scaleX = 1;
                character.x -= (dt *500);
           }

           if(!this.getCharacterJumpStatus() && character.y >= cc.winSize.height*0.07){
               character.y -= (dt *750);
           }

           if(character.y >= cc.winSize.height*0.90){
                character.y = cc.winSize.height*0.90;
           }
        }
    },

    // It take decision wheater the character move left side or right side ...
    getCharacterDirection : function(character){
        if(character.x <= cc.winSize.width * 0.15){
            this._direction = "right";
             var soundId = cc.audioEngine.playEffect(jumpyGamePlay.wallStrikeSound);
            return true;
        }else if(character.x >= cc.winSize.width * 0.85){
            this._direction = "left";
            var soundId = cc.audioEngine.playEffect(jumpyGamePlay.wallStrikeSound);
            return false;
        }else if(this._direction == "left"){
            return false;
        }else if(this._direction == "right"){
            return true;
        }
    },

    // Just Common lines to create Sprite ....
    createSprite: function(spriteName,imageSource,positionX,positionY){

        var sprite = new cc.Sprite(imageSource);
        sprite.setPosition(positionX,positionY);
        sprite.setName(spriteName);
        return sprite;
    },

    createSideWall: function(imageSource,positionX,positionY,rowNumber){

        var prePositionX = positionX;
        var prePositionY = positionY;

        for(var i =0 ; i < rowNumber ; i++){
            var wall = this.createSprite("wall",imageSource,prePositionX,prePositionY);
            wall.setPositionY(prePositionY);
            this.addChild(wall);
            prePositionY -= wall.height;            
        }
    },

    // CREATE SPIKES AND COINS .... 
    createObstacle: function(){

        var spike = null;
        var randNum = this.getRandomInt(0,1);

        if(randNum == 0){
            if(this.getRandomInt(0,1) == 0){
                spike = this.createSprite("smallSpikeLeft",jumpyGamePlay.smallSpikeLeft,cc.winSize.width*0.11,cc.winSize.height*1.05);
            }else{
                spike = this.createSprite("bigSpikeLeft",jumpyGamePlay.bigSpikeLeft,cc.winSize.width*0.10,cc.winSize.height*1.05);
            }
            if(this.getRandomInt(0,1) == 0)
                this.createCoins(1);
        }else{
            if(this.getRandomInt(0,1) == 0){
                spike = this.createSprite("smallSpikeRight",jumpyGamePlay.smallSpikeRight,cc.winSize.width*0.89,cc.winSize.height*1.05);
            }else{
                spike = this.createSprite("bigSpikeRight",jumpyGamePlay.bigSpikeRight,cc.winSize.width*0.90,cc.winSize.height*1.05);
            }

            if(this.getRandomInt(0,1) == 0)
                this.createCoins(0);
        }

        var actionDown = new cc.MoveTo(6,cc.p(spike.getPositionX(),-cc.winSize.height*0.2));
        spike.runAction(actionDown);
        this.addChild(spike);
        this._obstacle.push(spike);

    },

    // coin create with is behavour ....
    createCoins : function(sideFlag){

        var coin = null;
        if(sideFlag == 0){
            coin =  this.createSprite("coin",jumpyGamePlay.smallCoin,cc.winSize.width*0.15,cc.winSize.height*1.05);
            coin.setTag(0);
        }else{
            coin = this.createSprite("coin",jumpyGamePlay.smallCoin,cc.winSize.width*0.85,cc.winSize.height*1.05);
            coin.setTag(1);
        }
        var actionDown = new cc.MoveTo(6,cc.p(coin.getPositionX(),-cc.winSize.height*0.2));
        coin.runAction(actionDown);
        this.addChild(coin);
        this._obstacle.push(coin);
    },

    // Upper Score Board .....
    createUpperScoreBoard: function(columnNumber){

        var prePositionX = 0;
        var prePositionY = cc.winSize.height-10;

        for(var i =0 ; i < columnNumber ; i++){
            var wall = this.createSprite("upWall",jumpyGamePlay.sideWallGameScreen,prePositionX,prePositionY);
            wall.setPositionY(prePositionY);
            this.addChild(wall,2);
            prePositionX += wall.width;
            wall.setColor(new cc.color(0, 0, 0,255));     
        }

        coin =  this.createSprite("coin",jumpyGamePlay.smallCoin,cc.winSize.width*0.1,cc.winSize.height*0.97);
        this.addChild(coin);
        coin.setScale(0.7);
        this.reorderChild(coin,3);

        var localData = this.getlocalDataStorage();
        if(localData)
            jumpyUtil.coin = localData["goldCoin"];

        var coinText = this.crateText("  "+jumpyUtil.coin , "goldCoinScore" , 50 , coin.getPositionX() + coin.width + 20 , cc.winSize.height*0.97);
        this.reorderChild(coinText, 3);
        coinText.setColor(new cc.color(255, 255, 0,255));

        var meterText = this.crateText(""+this._meter+" M" , "meterScore" , 50 , cc.winSize.width*0.5 , cc.winSize.height*0.97);
        this.reorderChild(meterText, 3);
         meterText.setColor(new cc.color(255, 0, 0,255));
        
    },

    // Check the coin and spike intersect to character or not ....
    checkCharacterAccidentWithSpikeOrNot : function(){
        for(var i = 0 ; i < this._obstacle.length ; i++ ){
            var spikeBoundingBox = this._obstacle[i].getBoundingBox();

            var characterBoundingBox = this.getChildByName("character").getBoundingBox();
            characterBoundingBox.height -= 30;

            if(cc.rectIntersectsRect(spikeBoundingBox, characterBoundingBox)){
                console.log("intersect happend");

                if(this._obstacle[i].getName() == "coin"){
                    this.characterCaughtCoinAnimation(this._obstacle[i]);
                    this._obstacle.splice(i, 1);
                    return false;
                }else if(this._obstacle[i].getName() == "lineDraw"){
                    return false;
                }else{
                    return true;
                }
            }
        }
        return false;
    },

    // all Update methods and obstacle removed form Obstacle Object .....
    unscheduleAllUpdates : function(){

        for(var i = 0 ; i < this._obstacle.length ; i++){
            this._obstacle[i].stopAllActions();
        }

        this._obstacle.length = 0;
        this.getChildByName("character").stopAllActions();
        this.setGameStatus(true);
        this.unschedule(this.createObstacle);
        this.unschedule(this.UpdateTimer);
        this.unscheduleUpdate();

        var localData = this.getlocalDataStorage();
        if(localData){

            jumpyUtil.character = localData["character"];
            jumpyUtil.unlockCharacter = localData["unlockCharacter"];

            if(localData["meterScore"] < this._meter){
                console.log("Highest Meter "+ this._meter);

                var JumpyObject = { goldCoin: jumpyUtil.coin, meterScore:  this._meter, recentmeter: this._meter , character: jumpyUtil.character , unlockCharacter : jumpyUtil.unlockCharacter};
                localStorage.setItem('JumpyObject', JSON.stringify(JumpyObject));
            }else{
                var JumpyObject = { goldCoin: jumpyUtil.coin, meterScore: localData["meterScore"],recentmeter: this._meter , character: jumpyUtil.character , unlockCharacter : jumpyUtil.unlockCharacter};
                localStorage.setItem('JumpyObject', JSON.stringify(JumpyObject));    
            }
            console.log(this.getlocalDataStorage());
        }
    },

    // It use to remove object with going out of world ....
    checkSpikeOutOfWorldOrNot : function(){
        for(var i = 0 ; i < this._obstacle.length ; i++){
            
            if(this._obstacle[i].getPositionY() <= -cc.winSize.height*0.1){
                var outSiderSpike = this._obstacle[i];
                this.removeChild(outSiderSpike);
                this._obstacle.splice(i, 1);
                break;
            }
        }
    },

    // The Coins score poped up behaviour define .....
    characterCaughtCoinAnimation: function(coin){

        var self = this,scoreTextPoped = null;
        var additionValue = Math.floor(this._meter/10);
        if(additionValue == 0)
            additionValue = 1;
            
        if(coin.getTag() == 0){
            scoreTextPoped = this.crateText("+"+additionValue,"scorePoped",80,coin.x + coin.width/2, coin.y + coin.height/3);
        }else{
            scoreTextPoped = this.crateText("+"+additionValue,"scorePoped",80,coin.x - coin.width/2, coin.y + coin.height/3);
        }
        this.removeChild(coin);

        var removeCoinCallFunc = function(){
            self.removeChild(self.getChildByName("scorePoped"));
        }
        jumpyUtil.coin += additionValue;
        this.getChildByName("goldCoinScore").setString(""+jumpyUtil.coin);
        this.runAction(new cc.Sequence(cc.delayTime(1),new cc.CallFunc(removeCoinCallFunc, this)));
        var soundId = cc.audioEngine.playEffect(jumpyGamePlay.coinSound);
    },

    // The method to define the Text .....
    crateText : function(textString,name,size,positionX,positionY){
       var text = new cc.LabelTTF(textString,jumpyGamePlay.textGameFont,size);
       text.setPosition(positionX,positionY);
       text.setName(name);
       this.addChild(text);
       
       return text;
    },

    // It returns the random Value between Min - Max Range , It includes the min-max value .....
    getRandomInt: function(min, max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomValueFloat : function(min,max){
        return Math.random() * (max - min + 1) + min;
    },

    getCharacterJumpStatus : function(){
        return this._jumpCharacter;
    },

    setCharacterJumpStatus : function(jumpCharacter){
        this._jumpCharacter = jumpCharacter;
    },

    getGameStatus : function(){
        return this._gameComplete;
    },

    setGameStatus : function(gameComplete){
        this._gameComplete = gameComplete;
    },

    // It use to update the meter value after 1 seconds .....
    UpdateTimer : function(){
        this._meter++;
        this.getChildByName("meterScore").setString(""+this._meter+" M");

        var localData = this.getlocalDataStorage();
        if(localData && this._highScoreFlag){
            jumpyUtil.meter = localData["meterScore"];

            if(jumpyUtil.meter < this._meter){
                    this._highScoreFlag = false;
                    this.popupHighestMeterFlag(this._meter);
            }
        }
    },

    // It use to get the current localStorage Data ...
    getlocalDataStorage: function(){
        var retrievedObject = JSON.parse(localStorage.getItem('JumpyObject'));
        return retrievedObject;
    },

    // Its indicate the previous flag If new highScore happens ..... 
    popupHighestMeterFlag : function(meter){

        var flagLineText = this.crateText("PREVIOUS BEST DISTANCE : "+(meter-1)+" M" , "lastMeterScore" , 30 , cc.winSize.width*0.4 , 30);
        flagLineText.setColor(new cc.color(4, 124, 113,255));
        this.removeChild(flagLineText);

        var flagLine = this.createSprite("lineDraw",jumpyGamePlay.previousLine,cc.winSize.width/2,cc.winSize.height*1.05);
        var actionDown2 = new cc.MoveTo(4,cc.p(flagLine.getPositionX(),-cc.winSize.height*0.2));
        flagLine.runAction(actionDown2);
        flagLine.addChild(flagLineText);
        this.addChild(flagLine);
        this._obstacle.push(flagLine);
    },

    // The character die behaviour define ...
    characterDie : function(){
        var character = this.getChildByName("character");
        this.removeChild(character);
        jumpyUtil.recentmeter = this._meter;
        var soundId = cc.audioEngine.playEffect(jumpyGamePlay.deadSound);
        var ripCharacter = this.createSprite("rip",jumpyGamePlay.deadCharacter,character.getPositionX(),character.getPositionY());
        this.addChild(ripCharacter,4);

        var self = this;
        var moveJumpInBottom = function(){
            var actionTo = new cc.JumpTo(1,cc.p(ripCharacter.getPositionX(),-100),150,1);
            self.getChildByName("rip").runAction(actionTo);
        }
        var playerDieCallFunc = function () {
            self.removeChild(self.getChildByName("rip"));
            var soundId = cc.audioEngine.playEffect(jumpyGamePlay.gameoverSound);
            cc.LoaderScene.preload(jumpy_showscore, function () {
                    cc.director.runScene(new ShowScoreScene());
            }, self);  
        }
        
        this.runAction(new cc.Sequence(new cc.CallFunc(moveJumpInBottom, this),cc.delayTime(2),new cc.CallFunc(playerDieCallFunc, this)));

    },

    // Tap to start method ... to start all Scheduling method and update method ..
    tapToStart: function(){
        this.schedule(this.createObstacle,this.getRandomValueFloat(1,1.2));
        this.schedule(this.UpdateTimer,1);
        this.scheduleUpdate();
    },

    getCharacterSource : function(choice){

        switch(choice){
            case 0:
                return jumpyGamePlay.character;
            case 1:
                return jumpyGamePlay.character1;
            case 2:
                return jumpyGamePlay.character2;
            case 3:
                return jumpyGamePlay.character3;
            case 4:
                return jumpyGamePlay.character4;
            case 5:
                return jumpyGamePlay.character5;
            case 6:
                return jumpyGamePlay.character6;
            default:
                return jumpyGamePlay.character;
        }
    }

});

// Here define Scene to containe Layer ....
var JumpyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new JumpyLayer();
        this.addChild(layer);
    }
});