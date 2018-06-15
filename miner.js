cc.Class({
    extends: cc.Component,

    properties: {
        //初始角度
        startAng: 0,
        //方向 0=从左到右，1=从右到左
        direction : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startAng = 90;
        this.direction = 0;
        this.node.rotation = this.startAng;
    },

    start () {

    },

    update (dt) {
        if (this.startAng < -90){
            this.direction = 0;
        }else if(this.startAng > 90){
            this.direction = 1;
        }

        if (this.direction){
            //从右到左
            this.startAng -= 1;
            this.node.rotation = this.startAng;
        }else{
            //从左到右
            this.startAng += 1;
            this.node.rotation = this.startAng;
        }
    },


});
