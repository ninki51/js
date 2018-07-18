var cocos = require("cocos")
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        this.cocos1 = cc.find('Canvas/cocos1').getComponent(cocos)
        this.cocos1.Angle = 0
        this.cocos1.Speed = 20
        
        this.cocos2 = cc.find('Canvas/cocos2').getComponent(cocos)
        this.cocos2.Angle = 90
        this.cocos2.Speed = 10
    },

    // called every frame
    update: function (dt) {

    },
});
