cc.Class({
    extends: cc.Component,

    properties: {
        rope: {
            type : cc.Node,
            default : null,
        },
        hook: {
            type:cc.Node,
            default :null,
        }
    },

    // use this for initialization
    onLoad: function () {
        //记录绳子初始位置
        this.startPos = this.rope.position;
        //绳子摇摆动作
        this.shakeAction = cc.repeatForever(cc.sequence(cc.rotateTo(3,60),cc.rotateTo(3,-60)));
        //绳子收回动作，绳子收回后执行摇摆动作
        this.returnAction = cc.sequence(cc.moveTo(3,this.startPos),cc.callFunc(function() {
                this.rope.runAction(this.shakeAction);
        }, this));
        //绳子左右摇摆
        this.rope.runAction(this.shakeAction);

        var self = this;
        this.node.on('touchstart',function(){
            self.rope.stopAllActions();
            //绳子伸长动作，根据角度动态计算
            self.rope.runAction(cc.moveBy(3,-200*Math.tan(Math.PI/180*this.rope.rotation),-200));
        },this);
        this.node.on('touchend',function(){
            self.rope.runAction(self.returnAction);
        },this);
    },

    // called every frame
    update: function (dt) {

    },
});
