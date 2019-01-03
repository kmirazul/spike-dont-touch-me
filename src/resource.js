var jumpyGamePlay = {

    character : "res/Animations/Player/Default/000.png",
    background: "res/Animations/Game_background/Default/000.png",
    sideWallGameScreen : "res/Textures/Wall2.png",
    bigSpikeLeft : "res/Animations/Big_spike/Default/000.png",
    bigSpikeRight : "res/Animations/Big_spike_2/Default/000.png",
    smallSpikeLeft : "res/Animations/Medium_spike/Default/000.png",
    smallSpikeRight : "res/Animations/Small_spike_2/Default/000.png",
    smallCoin : "res/Animations/CoinScore/Default/000.png",
    textGameFont : "res/Font/OldGameFatty.ttf",
    previousLine : "res/Animations/Previous/Default/000.png",
    deadCharacter : "res/Animations/Dead/Default/000.png",
    tapToStart: "res/Animations/Tap_to_start/Default/000.png",
    titleBackground : "res/Animations/Title_background/Default/000.png",
    bottomFloor : "res/Animations/Ffloor/Default/000.png",
    sideTopWall : "res/Textures/Wall1.png",
    soundBg : "res/Files/music.ogg",
    jumpSound : "res/Files/jump1.ogg",
    deadSound: "res/Files/dead.ogg",
    coinSound: "res/Files/coin.ogg",
    wallStrikeSound: "res/Files/strike.ogg",
    gameoverSound: "res/Files/game_over.ogg",
    buttonSound: "res/Files/button.ogg",
    character1 : "res/Animations/Player/Default/001.png",
    character2 : "res/Animations/Player/Default/002.png",
    character3 : "res/Animations/Player/Default/003.png",
    character4 : "res/Animations/Player/Default/004.png",
    character5 : "res/Animations/Player/Default/005.png",
    character6 : "res/Animations/Player/Default/006.png"
};

var startScene = {

    defaultBg : "res/Animations/Background/Default/000.png",
    gameTitle: "res/Animations/Title/Default/000.png",
    gameOptionBoard: "res/Animations/Menu_background/Default/000.png",
    gameOptionNewGame1: "res/Animations/New_game/Default/000.png",
    gameOptionNewGame2: "res/Animations/New_game/Default/001.png",
    gameOptionShop1: "res/Animations/Shop/Default/000.png",
    gameOptionShop2: "res/Animations/Shop/Default/001.png",
    gameOptionScore1: "res/Animations/Scores/Default/000.png",
    gameOptionScore2: "res/Animations/Scores/Default/001.png",
    arrowSymbl : "res/Animations/Arrow/Default/000.png",
    soundBg : "res/Files/music.ogg",
    buttonSound: "res/Files/button.ogg",
    soundBtn1 : "res/Animations/buttons2/Default/000.png",
    soundBtn2 : "res/Animations/buttons2/Default/001.png"
};

var showScoreScene = {
    scoreBackground : "res/Animations/Score_background/Default/000.png",
    titleBackground : "res/Animations/Title_background/Default/000.png",
    textGameFont : "res/Font/OldGameFatty.ttf",
    buttonSound: "res/Files/button.ogg",
    exitButton1: "res/Animations/Exit/Default/000.png",
    exitButton2: "res/Animations/Exit/Default/001.png",
    tryAgain1: "res/Animations/Try_again/Default/000.png",
    tryAgain2: "res/Animations/Try_again/Default/001.png",
    smallCoin : "res/Animations/CoinScore/Default/000.png"
}

var shopesCard = {
    background : "res/Animations/Score_background/Default/000.png",
    titleBackground : "res/Animations/Title_background/Default/000.png",
    shopText: "res/Animations/Shop/Default/000.png",
    buy1 : "res/Animations/Buy/Default/000.png",
    buy2 : "res/Animations/Buy/Default/001.png",
    buyp : "res/Animations/Player/Default/000.png",
    buyp1 : "res/Animations/Buyp1/Default/000.png",
    buyp2 : "res/Animations/Buyp2/Default/000.png",
    buyp3 : "res/Animations/Buyp3/Default/000.png",
    buyp4 : "res/Animations/Buyp4/Default/000.png",
    buyp5 : "res/Animations/Buyp5/Default/000.png",
    buyp6 : "res/Animations/Buyp6/Default/000.png",
    exitButton1: "res/Animations/Exit/Default/000.png",
    exitButton2: "res/Animations/Exit/Default/001.png",
    buttonSound: "res/Files/button.ogg"

}

var splashScreen = {
    splashScreenBg : "res/Animations/LoaderBg/Default/000.png",
    splashLogo : "res/Files/icon.png"
}

var jumpy_gameplay = [];
for (var i in jumpyGamePlay) {
    jumpy_gameplay.push(jumpyGamePlay[i]);
}

var jumpy_startscene = [];
for (var i in startScene) {
    jumpy_startscene.push(startScene[i]);
}


var jumpy_showscore = [];
for (var i in showScoreScene) {
    jumpy_showscore.push(showScoreScene[i]);
}

var jumpy_shop = [];
for (var i in shopesCard) {
    jumpy_shop.push(shopesCard[i]);
}

var splash_screen = [];
for (var i in splashScreen) {
    splash_screen.push(splashScreen[i]);
}

