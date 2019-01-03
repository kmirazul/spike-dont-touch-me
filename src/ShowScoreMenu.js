
//showScoreScene
var ShowScoreLayer = cc.Layer.extend({
    _listenerFlag : true,
    ctor: function(){
        this._super();
        cc.director.setDisplayStats(false);  
        var backGround = new cc.Sprite(showScoreScene.scoreBackground);
        backGround.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(backGround);

        var topTitle = this.createSprite("gameOverBg", showScoreScene.titleBackground , cc.winSize.width/2,cc.winSize.height * 0.95);
        this.addChild(topTitle);

        var labelGameOver = this.crateText(" GAME OVER ","gameover_label" , 80, cc.winSize.width/2,cc.winSize.height*0.95);
        this.addChild(labelGameOver,2);

        var closeButton = this.createSprite("gameOver", showScoreScene.exitButton1 , topTitle.width * 0.9,topTitle.height /2);
        topTitle.addChild(closeButton);
        this.gameMenuListner(closeButton);

        var bottomTitle = this.createSprite("tryAgainBg", showScoreScene.titleBackground , cc.winSize.width/2,cc.winSize.height * 0.05);
        this.addChild(bottomTitle);

        var bottomTitlelabel = this.createSprite("tryAgain", showScoreScene.tryAgain1 , bottomTitle.width/2,bottomTitle.height/2);
        bottomTitle.addChild(bottomTitlelabel);
        this.gameMenuListner(bottomTitlelabel);

        var localData = this.getlocalDataStorage();
        if(localData){
            jumpyUtil.coin = localData["goldCoin"];
            jumpyUtil.meter = localData["meterScore"];
            jumpyUtil.recentmeter = localData["recentmeter"];
        }

        var score =this.crateText(" SCORE ","score" , 80, cc.winSize.width/2,cc.winSize.height*0.75);
        this.addChild(score);

        var scoreValue =this.crateText(jumpyUtil.recentmeter+"M","scorevalue" , 80, cc.winSize.width/2,cc.winSize.height*0.65);
        this.addChild(scoreValue);
        scoreValue.setColor(new cc.color(255, 0, 0,255));

        var bestScore = this.crateText(" BEST ","bestscore" , 80, cc.winSize.width/2,cc.winSize.height*0.55);
        this.addChild(bestScore);
       
        var bestScoreValue =this.crateText(jumpyUtil.meter+" M","bestvalue" , 80, cc.winSize.width/2,cc.winSize.height*0.45);
        this.addChild(bestScoreValue);
        bestScoreValue.setColor(new cc.color(255, 0, 0,255));
        
        var coin = this.createSprite("coin", showScoreScene.smallCoin , cc.winSize.width/2+ 16,cc.winSize.height * 0.30);
        this.addChild(coin);

        var coinText = this.crateText(""+jumpyUtil.coin,"coinScore" , 80, cc.winSize.width/2,cc.winSize.height*0.20);
        this.addChild(coinText);

        if(jumpyUtil.recentmeter == jumpyUtil.meter){
            var newrecord = this.crateText(" NEW RECORD ","newrecord" , 30, cc.winSize.width/2,cc.winSize.height*0.15);
            newrecord.setColor(new cc.color(255,0,0,255));
            this.addChild(newrecord);
        }

    },

    gameMenuListner : function(objectName){
        var self = this;
        var buttonListner = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);                
                
                if (cc.rectContainsPoint(targetRectangle, location) && self.getListnerStatus()){
                    var buttonSound = cc.audioEngine.playEffect( showScoreScene.buttonSound);               
                    self.redirectScene(target.getName(),target);
                }
                return false;
            }
        });
        cc.eventManager.addListener(buttonListner,objectName);
    },

    redirectScene: function(btnName,target){

        var sceneRedirect = null,self = this;
        this.setListnerStatus(false);
        if(btnName == "gameOver"){
            target.setTexture(showScoreScene.exitButton2);
            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_startscene, function () {
                    cc.director.runScene(new StartMenuScene());
                }, self);
            }
        }else{
            target.setTexture(showScoreScene.tryAgain2);
            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_gameplay, function () {
                    cc.director.runScene(new JumpyScene());
                }, self);
            }
        }
        this.runAction(new cc.Sequence(cc.delayTime(1),new cc.CallFunc(sceneRedirect, this)));
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
    crateText : function(textString,name,size,positionX,positionY){
       var text = new cc.LabelTTF(textString,showScoreScene.textGameFont,size);
       text.setPosition(-text.width/2,positionY);
       text.setName(name);

       var actionTo = new cc.MoveTo(1,cc.p(positionX,positionY));
       var easeAction = new cc.EaseBackOut(actionTo);
       text.runAction(easeAction);
       return text;
    },
    
    setListnerStatus: function(listnerFlag){
        this._listenerFlag = listnerFlag;
    },

    getListnerStatus: function(){
        return this._listenerFlag;
    },

    getlocalDataStorage: function(){
        var retrievedObject = JSON.parse(localStorage.getItem('JumpyObject'));
        return retrievedObject;
    },


});


var ShowScoreScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ShowScoreLayer();
        this.addChild(layer);
    }
});