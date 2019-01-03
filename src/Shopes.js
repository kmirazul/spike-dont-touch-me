
var ShopesLayer = cc.Layer.extend({
  _listenerFlag : true,
  _goldValue : 0,
  _unlockCharacter : "0" ,
  _chooseCharacter : null,

  ctor:function () {
        this._super();
        cc.director.setDisplayStats(false);
        var backGround = new cc.Sprite(shopesCard.background);
        backGround.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(backGround);

        var topTitle = this.createSprite("shopBg", shopesCard.titleBackground , cc.winSize.width/2,cc.winSize.height * 0.95);
        this.addChild(topTitle);

        var shopTitle = this.createSprite("shopTitle",shopesCard.shopText , cc.winSize.width/2,cc.winSize.height * 0.95);
        this.addChild(shopTitle,2);

        var closeButton = this.createSprite("close", shopesCard.exitButton1 , topTitle.width * 0.9,topTitle.height /2);
        topTitle.addChild(closeButton);
        this.gameShopListner(closeButton);

        var bottomTitle = this.createSprite("buyBg", shopesCard.titleBackground , cc.winSize.width/2,cc.winSize.height * 0.05);
        this.addChild(bottomTitle);

        var bottomTitlelabel = this.createSprite("buyTitle", shopesCard.buy1 , bottomTitle.width/2,bottomTitle.height/2);
        bottomTitle.addChild(bottomTitlelabel);
        this.gameShopListner(bottomTitlelabel);

        var localData = this.getlocalDataStorage();
        if(localData){
            jumpyUtil.coin = localData["goldCoin"];
            jumpyUtil.meter = localData["meterScore"];
            jumpyUtil.recentmeter = localData["recentmeter"];
            jumpyUtil.character = localData["character"];
            jumpyUtil.unlockCharacter = localData["unlockCharacter"];
        }

        _unlockCharacter = jumpyUtil.character+"";

        this.characterAddInMenu("1" , shopesCard.buyp1 , cc.winSize.height * 0.83 , 500);
        this.characterAddInMenu("2" , shopesCard.buyp2 , cc.winSize.height * 0.72 , 1000);
        this.characterAddInMenu("3" , shopesCard.buyp3 , cc.winSize.height * 0.61 , 2000);
        this.characterAddInMenu("4" , shopesCard.buyp4 , cc.winSize.height * 0.50 , 3000);
        this.characterAddInMenu("5" , shopesCard.buyp5 , cc.winSize.height * 0.39 , 4000);
        this.characterAddInMenu("6" , shopesCard.buyp6 , cc.winSize.height * 0.28 , 5000);

        var buyCharacter = this.createSprite("0", shopesCard.buyp , cc.winSize.width*0.16 , cc.winSize.height * 0.17 );
        this.addChild(buyCharacter);
        this.characterListner(buyCharacter);

        var goldenCoin = this.crateText( "TOTAL GOLD : "+jumpyUtil.coin , "goldCoin" , 50 , cc.winSize.width*0.6 , cc.winSize.height * 0.17);
        this.addChild(goldenCoin);
        goldenCoin.setColor(new cc.color(255,215,0,255));
  },

  characterListner : function(objectName){
        var self = this;
        var buttonListner = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);                
                
                if (cc.rectContainsPoint(targetRectangle, location)){                    
                    var buttonSound = cc.audioEngine.playEffect( shopesCard.buttonSound);
                    target.runAction(new cc.Sequence(new cc.scaleTo(0.1,1.2),new cc.scaleTo(0.3,1)));

                    var targetText = self.getChildByName(target.getName()+"Price");
                    if(targetText){

                        targetText.runAction(new cc.Sequence(new cc.scaleTo(0.1,1.2),new cc.scaleTo(0.3,1)));
                        self._goldValue = jumpyUtil.coin - targetText.getString();
                        self.getChildByName("goldCoin").setString("TOTAL GOLD : "+self._goldValue);
                        
                    }else{

                        self._goldValue = jumpyUtil.coin;
                        self.getChildByName("goldCoin").setString("TOTAL GOLD : "+self._goldValue);
                        
                    }
                    self._unlockCharacter = target.getName();
                }
                return false;
            }
        });
        cc.eventManager.addListener(buttonListner,objectName);
  },

  gameShopListner : function(objectName){
        var self = this;
        var buttonListner = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true,
            onTouchBegan :function(touch, event){
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetRectangle = cc.rect(0,0, target.width, target.height);                
                
                if (cc.rectContainsPoint(targetRectangle, location) && self.getListnerStatus()){         
                     var buttonSound = cc.audioEngine.playEffect( shopesCard.buttonSound);
                    var localData = self.getlocalDataStorage();
                    if(localData){
                       
                        var flag = true;
                        for(var i = 0 ; i < jumpyUtil.unlockCharacter.length ; i++){
                            var characterUnlock = parseInt(jumpyUtil.unlockCharacter[i]);
                            var selectedCharacter = parseInt(self._unlockCharacter);
                            if(characterUnlock == selectedCharacter){
                                flag = false;
                            }
                        }

                        if(flag && target.getName() != "close"){
                            jumpyUtil.unlockCharacter.push(self._unlockCharacter);
                            jumpyUtil.character = parseInt(self._unlockCharacter);
                            var JumpyObject = { goldCoin: self._goldValue, meterScore: jumpyUtil.meter, recentmeter: jumpyUtil.recentmeter , character: jumpyUtil.character , unlockCharacter : jumpyUtil.unlockCharacter };
                            localStorage.setItem('JumpyObject', JSON.stringify(JumpyObject));
                        }
                        else if(target.getName() != "close"){
                            jumpyUtil.character = parseInt(self._unlockCharacter);
                            var JumpyObject = { goldCoin: self._goldValue, meterScore: jumpyUtil.meter, recentmeter: jumpyUtil.recentmeter , character: jumpyUtil.character , unlockCharacter : jumpyUtil.unlockCharacter };
                            localStorage.setItem('JumpyObject', JSON.stringify(JumpyObject));
                        }
                    }                  
                    console.log(jumpyUtil.unlockCharacter.length + " unlock number of character ");
                    self.redirectScene(target.getName(),target);
                }
                return false;
            }
        });
        cc.eventManager.addListener(buttonListner,objectName);
  },

  characterAddInMenu : function(characterName , characterAssetsSource , yPosition , pointValue){

    var buyCharacter = this.createSprite(characterName, characterAssetsSource , cc.winSize.width*0.2 , yPosition );
    this.addChild(buyCharacter);

    var localData = this.getlocalDataStorage();
    if(localData){
        var unlockCharacterData = localData["unlockCharacter"];
        for(var i = 0 ; i < unlockCharacterData.length ; i++ ){

            if(unlockCharacterData[i] == characterName){
                pointValue = 0;
            }
        }
    }


    var buyText = this.crateText( pointValue+"" , characterName+"Price" , 80 , cc.winSize.width*0.7 , yPosition);
    this.addChild(buyText);
    buyText.setColor(new cc.color(255,215,0,255));

    if(jumpyUtil.coin >= pointValue){
        this.characterListner(buyCharacter);
    }else{
        buyCharacter.setColor(new cc.color(128,128,128,255));
        buyText.setColor(new cc.color(128,128,128,255));
    }
  },


  redirectScene: function(btnName,target){

        var sceneRedirect = null,self = this;
        this.setListnerStatus(false);
        if(btnName == "close"){
            target.setTexture(shopesCard.exitButton2);
            sceneRedirect = function(){
                cc.LoaderScene.preload(jumpy_startscene, function () {
                    cc.director.runScene(new StartMenuScene());
                }, self);
            }
        }else{
            target.setTexture(shopesCard.buy2);
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

var ShopeScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ShopesLayer();
        this.addChild(layer);
    }
});