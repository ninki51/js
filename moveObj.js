// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 3,
            displayName: '速度'
        },
        status:1,
        MAX_WIDTH:700,
        MIN_WIDTH:-700,
        MAX_HEIGHT:210,
        MIN_HEIGHT:-180
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       
        //右移状态，status=1，静止状态,status=0,下落,status=2
        
    },

    start() {

    },

    /**
     * 生成n-m随机数
     */
    createRandm(n, m) {
        m += 1;
        let a = m - n;
        let num = Math.random() * a + n;
        return parseInt(num);
    },

    update(dt) {
        this.toRight()
    },
    //右移
    toRight() {
        if (this.node.x > this.MAX_WIDTH) {
            this.node.setPosition(this.randomPos())
        } else {
            this.node.x += this.speed
        }
    },
   
    randomPos() {
        let rx = this.createRandm(this.MIN_WIDTH * 2, this.MIN_WIDTH)
        let ry = this.createRandm(this.MIN_HEIGHT, this.MAX_HEIGHT)
        return cc.v2(rx, ry)
    }
});
