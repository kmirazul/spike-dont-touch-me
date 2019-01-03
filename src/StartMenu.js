// cc.audioEngine.stopAllEffects();

var jumpyUtil = {
    coin : 0,
    meter : 0,
    recentmeter : 0,
    character : 0,
    unlockCharacter : []
}

var StartMenuLayer = cc.Layer.extend({
    _listenerFlag : true,
    ctor:function () {
        this._super();
        cc.director.setDisplayStats(false);
        var defaultBg = this.createSprite("background",startScene.defaultBg,cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(defaultBg);
        cc.audioEngine.pauseAllEffects();
        var soundId = cc.audioEngine.playEffect(startScene.soundBg,true);
        
        var gameTitle = this.createSprite("title",startScene.gameTitle,cc.winSize.width/2,cc.winSize.height * 0.75);
        this.addChild(gameTitle);

        var gameOptionBoard = this.createSprite("gameOptionBoard",startScene.gameOptionBoard,cc.winSize.width/2,cc.winSize.height * 0.45);
        this.addChild(gameOptionBoard);

        var gameOptionNewGame = this.createSprite("newgame",startScene.gameOptionNewGame1,gameOptionBoard.width/2,gameOptionBoard.height*0.8);
        gameOptionBoard.addChild(gameOptionNewGame);
        this.gameMenuListner(gameOptionNewGame);

        var gameOptionShop = this.createSprite("shop",startScene.gameOptionShop1,gameOptionBoard.width/2,gameOptionBoard.height*0.55);
        gameOptionBoard.addChild(gameOptionShop);
        this.gameMenuListner(gameOptionShop);

        var gameOptionScore = this.createSprite("scores",startScene.gameOptionScore1,gameOptionBoard.width/2,gameOptionBoard.height*0.30);
        gameOptionBoard.addChild(gameOptionScore);
        this.gameMenuListner(gameOptionScore);

        var soundMuteBtn = this.createSprite("soundButton",startScene.soundBtn1,cc.winSize.width/2,cc.winSize.height * 0.05);
        this.addChild(soundMuteBtn);
        soundMuteBtn.setTag(0);
        this.gameMenuListner(soundMuteBtn);

        var arrow = this.createSprite("arrow",startScene.arrowSymbl,-500,-500);
        gameOptionBoard.addChild(arrow);

        this.setlocalDataStorage(0,0,0,0,new Array("0"));

    },
    
    gameMenuListner : function(objectName){
        var self = this;
        var buttonListner = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);                

                if (cc.rectContainsPoint(targetRectangle, location)) {
                   
                        if(target.getName() == "soundButton"){
                            if(target.getTag() == 0){
                               target.setTexture(startScene.soundBtn2);
                                cc.audioEngine.pauseAllEffects();
                                target.setTag(1);
                            }else{
                                target.setTexture(startScene.soundBtn1);
                                cc.audioEngine.resumeAllEffects();
                                target.setTag(0);
                            }
                        }
                }


                if (cc.rectContainsPoint(targetRectangle, location) && self.getListnerStatus()){                    
                    console.log(" button clicked "+ target.getName());
                    var buttonSound = cc.audioEngine.playEffect( startScene.buttonSound);
                    if(target.getName() == "newgame"){
                        target.setTexture(startScene.gameOptionNewGame2);
                        self.getChildByName("gameOptionBoard").getChildByName("arrow").setPosition(target.x - target.width * 0.7 , target.y);                
                        self.redirectScene(target.getName());

                    }else if(target.getName() == "shop"){
                        target.setTexture(startScene.gameOptionShop2);                        
                        self.getChildByName("gameOptionBoard").getChildByName("arrow").setPosition(target.x - target.width * 0.7 , target.y);                
                        self.redirectScene(target.getName());

                    }else if(target.getName() == "scores"){
                        target.setTexture(startScene.gameOptionScore2);
                        self.getChildByName("gameOptionBoard").getChildByName("arrow").setPosition(target.x - target.width * 0.7 , target.y);                
                        self.redirectScene(target.getName());
                    }
                }
                
                return false;
            }
        });
        cc.eventManager.addListener(buttonListner,objectName);
    },

    createSprite: function(spriteName,imageSource,positionX,positionY){
        var sprite = new cc.Sprite(imageSource);
        sprite.setPosition(-sprite.width/2,positionY);
        sprite.setName(spriteName);

        var actionTo = new cc.MoveTo(1,cc.p(positionX,positionY));
        var easeAction = new cc.EaseBackOut(actionTo);
        sprite.runAction(easeAction);
        return sprite;
    },
    redirectScene : function(buttonClicked){
        var sceneRedirect = null,self = this;

        if(buttonClicked == "newgame"){
            
            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_gameplay, function () {
                    cc.director.runScene(new JumpyScene());
                }, self);
            }

        }else if(buttonClicked == "shop"){

            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_shop, function () {
                    cc.director.runScene(new ShopeScene());
                }, self);            
            }

        }else if(buttonClicked == "scores"){

            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_showscore, function () {
                    cc.director.runScene(new ShowScoreScene());
                }, self);            
            }
        }
        this.setListnerStatus(false);
        this.runAction(new cc.Sequence(cc.delayTime(1),new cc.CallFunc(sceneRedirect, this)));
    },

    setListnerStatus: function(listnerFlag){
        this._listenerFlag = listnerFlag;
    },

    getListnerStatus: function(){
        return this._listenerFlag;
    },

    setlocalDataStorage : function(goldCoin,meterScore,recentmeter,character,unlockCharacter){

        var localData = this.getlocalDataStorage();
        if(localData){
            if(localData["unlockCharacter"] == undefined){
                 localStorage.setItem('JumpyObject', JSON.stringify(null));
            }
        }

        if(this.getlocalDataStorage()){
            console.log("The JSONIFY DATA IS ALREADY EXIST IN LOCAL STORAGE ");
            console.log(this.getlocalDataStorage());
        }else{
            jumpyUtil.unlockCharacter.push("0");
            localStorage.setItem('JumpyObject', JSON.stringify(null));
            var JumpyObject = { goldCoin: 0 || goldCoin, meterScore: 0 || meterScore, recentmeter: 0 || recentmeter , character: 0 || character , unlockCharacter : jumpyUtil.unlockCharacter };
            localStorage.setItem('JumpyObject', JSON.stringify(JumpyObject));
        }
    },

    getlocalDataStorage: function(){
        var retrievedObject = JSON.parse(localStorage.getItem('JumpyObject'));
        return retrievedObject;
    }

});

var StartMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartMenuLayer();
        this.addChild(layer);
    }
});