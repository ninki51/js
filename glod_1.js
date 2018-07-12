var moveObj = require("moveObj")

cc.Class({
    extends: moveObj,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
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
    drop() {
        if (this.node.y > this.MAX_HEIGHT) {
            this.node.position(this.randomPos())
        } else {
            this.node.y += 1.5
        }
    },

});
