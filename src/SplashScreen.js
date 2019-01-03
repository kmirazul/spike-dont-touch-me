
var SplashScreenLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        cc.director.setDisplayStats(false);
        var bg = this.createSprite("splashBg",splashScreen.splashScreenBg,cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        var logo = this.createSprite("logo", splashScreen.splashLogo,cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(logo);

        var self = this;
        var redirectMenu = function(){
           cc.LoaderScene.preload(jumpy_startscene, function () {
                    cc.director.runScene(new StartMenuScene());
            }, self);
        }
        this.runAction(new cc.Sequence(cc.delayTime(1),new cc.CallFunc(redirectMenu, this)));

    },

    // Just Common lines to create Sprite ....
    createSprite: function(spriteName,imageSource,positionX,positionY){

        var sprite = new cc.Sprite(imageSource);
        sprite.setPosition(positionX,positionY);
        sprite.setName(spriteName);
        return sprite;
    },   
});

// Here define Scene to containe Layer ....
var SplashScreenScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SplashScreenLayer();
        this.addChild(layer);
    }
});