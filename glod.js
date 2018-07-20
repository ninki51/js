var moveObj = require("moveObj")

cc.Class({
    extends: moveObj,

    properties: {
        score: {
            default: 10,
            displayName: '含金量'
        },
    },

    // LIFE-CYCLE CALLBACKS:
    

    onLoad() {
        this._super()
        //拉回速度
        this.pollSpeed = 1
    },

    start() {

    },

    update(dt) {
        switch (this.status) {
            case 0:
                //静止
                cc.log('moveOjb =========== 0')
                break
            case 1:
                this.toRight()
                
                break
            case 2:
                this.drop()
                break
        }
    },
   //下落
   drop(dt) {
    if (this.node.y < this.MIN_HEIGHT - 30) {
        this.node.setPosition(this.randomPos())
        this.status = 1
    } else {
        this.node.x += dt * 1
        this.node.y -= 1.5
    }
},

});
