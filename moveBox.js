cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //监听碰撞
        this.onCollisionEnter = this.onCollisionEnterA;
    },

    onCollisionEnterA(other, self) {
        console.log('碰撞检测=========');
        this.other = other;
        this.isWall = this.Wall(other);
        //处理钩子撞墙
        if (this.isWall) {
            cc.log('碰撞===============================');
            this.node.parent.emit('Collision', {});
            return;
        };

      
    },
    Wall(other) {
        return other.node.group == 'wall';
    },
    start () {

    },

    // update (dt) {},
});
