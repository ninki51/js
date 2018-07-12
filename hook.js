
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //监听碰撞
        //this.onCollisionEnter = this.onCollisionEnterA
        //this.Canvas = cc.find('Canvas');
        this.main = cc.find('Canvas').getComponent('main')
        //挂载金块的节点
        this.temp = cc.find('Canvas/bg/hero/car/rope/temp')
        this.rope = cc.find('Canvas/bg/hero/car/rope')
        this.left = cc.find('Canvas/bg/hero/car/rope/left')
        // this.glod_1 = cc.find('Canvas/bg/move_layer/glod_1').getComponent(cc.Sprite)
        // this.glod_2 = cc.find('Canvas/bg/move_layer/glod_2').getComponent(cc.Sprite)
        // this.glod_3 = cc.find('Canvas/bg/move_layer/glod_3').getComponent(cc.Sprite)
        //cc.log(this.glod_1)
    },

    start() {

    },
    onCollisionEnter: function (other, self) {
        cc.log('碰撞检测22222=========')
        if (this.main.HookStatus > 1)
            return
        this.isWall = this.Wall(other)
        this.isGlod = this.Glod(other)
        this.isStone = this.Stone(other)

        if (this.isWall || this.isStone) {
            //碰到墙和石头弹回
            cc.find('Canvas').emit('Collision', { catch: 0 })
        } else if (this.isGlod) {
            cc.log('碰撞金矿===============================')
            let glod = other.getComponent(other.node.name)
            glod.status = 0
            //根据物品设置拉回钩子速度
            this.main.SetSpeed(glod.pollSpeed)
            // let xy = this.node.convertToNodeSpaceAR(this.temp)
            // cc.log(xy.x,xy.y)
            other.node.x = -this.rope.width * 0.5
            other.node.y = this.temp.y + this.rope.y + this.rope.parent.y + this.rope.parent.parent.y + this.rope.parent.parent.parent.y + other.node.height + 10

            other.node.parent = this.temp
            other.node.anchorY = 1.0
            cc.find('Canvas').emit('Collision', { catch: 1 })
        }


    },

    Wall(other) {
        return other.node.group == 'wall';
    },
    Glod(other) {
        return other.node.group == 'glod';
    },
    Stone(other) {
        return other.node.group == 'stone';
    },

    // update (dt) {},
});
