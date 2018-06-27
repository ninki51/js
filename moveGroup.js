cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        angle: 30.0,
        GameStatus:0,
        startX:0,
        startY:0,
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        this.wall = cc.find('Canvas/wall');
        this.cocos = cc.find('Canvas/cocos');
        this.cocos.rotation = this.angle;
        this.startX = this.cocos.x;
        this.startY = this.cocos.y;
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;
        
        this.node.on('Collision', function (event) {
            cc.log('-----------------接收到碰撞消息------------------');
            this.GameStatus = 1;
            this.back();
        }.bind(this));
    },

    

    start: function () {
        // let actionBy = cc.skewBy(2, 0, -90);
        // this.node.runAction(actionBy);
        // let followAction = cc.follow(targetNode, cc.rect(0, 0, 640 * 2 - 100, 480));
        // this.cocos.runAction(followAction);
    },

    move: function () {
        let speed = 2.0;
        let radian = this.angle * 3.14159 / 180.0
        // let dx = this.cocos.x - Math.sin(radian);
        // let dy = this.cocos.y - Math.cos(radian);
        // var action = cc.moveTo(3, cc.p(dx, dy));
        // this.cocos.runAction(action);
        this.cocos.x -= Math.sin(radian) * speed;
        this.cocos.y -= Math.cos(radian) * speed;
    },
    back: function (){
       
        var action = cc.moveTo(1, cc.p(this.startX, this.startY));
        this.cocos.runAction(action);
        
    },
    

    // called every frame
    update: function () {
        if(this.GameStatus == 0){
            this.move();
        }else{
            return;
        }
        
    },
});
