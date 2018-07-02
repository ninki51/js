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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //监听碰撞
        this.onCollisionEnter = this.onCollisionEnterA;
        //this.Canvas = cc.find('Canvas');
        this.game = cc.find('Canvas').getComponent('game');

    },

    onCollisionEnterA(other, self) {
        console.log('碰撞检测=========');
        //if (self.game.GameStatus == 2) return;
        this.other = other;
        this.isWall = this.Wall(other);
        this.isGlod = this.Glod(other);
        this.isStone = this.Stone(other);
        //处理钩子撞墙
        if (this.isWall || this.isGlod || this.isStone) {
            if (this.isWall) {
                cc.log('碰撞墙===============================');
            } else if (this.isGlod) {
                cc.log('碰撞金矿===============================');
                //将物品放置钩子上
                cc.log('抓住===================');
                cc.log(this.other.node.x, this.other.node.y);
                other.node.parent = this.game.point;
                this.other.node.y = this.game.hook.y -130
                this.other.node.x = this.game.hook.x -30
                // this.other.node.y = -(this.game.hook.height + 2);
                // this.other.node.x = -(this.game.hook.width / 2);

                other.node.anchorY = 1.0;
                cc.log(this.other.node.x, this.other.node.y);
            } else if (this.isStone) {
                cc.log('碰撞石头===============================');

            }

            this.node.parent.parent.parent.emit('Collision', {});
            return;
        };


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
});
