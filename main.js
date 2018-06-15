cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: '黄金矿工',
        sprite: {
            default: null,
            type: cc.SpriteFrame,
        },
        stars: {
            default: [],
            type: cc.SpriteFrame
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;

        for (let i = 0; i < 10; i++) {
            //this.addStar(i);
            this.spawnNewStar();
        }

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('touchend==============');
            console.log(event.touch.getLocation().x);
            console.log(event.touch.getLocation().y);
        }, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //this.drawLine(0,0,400,100);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.a:
                console.log('Press a key');
                break;
        }
    },

    spawnNewStar: function () {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
    },
    getNewStarPosition: function () {
        let winsize = cc.winSize;
        var randX = -480 - cc.random0To1() * 20;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = cc.random0To1() * 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        //randX = cc.random0To1() * 20;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    drawLine(x0, y0, x1, y1) {
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.lineCap = cc.Graphics.LineCap.ROUND;
        ctx.lineWidth = 10;
        ctx.strokeColor = cc.hexToColor('#0000ff');
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.close();
        ctx.stroke();
    },

    addStar(id) {
        // var node = new cc.Node('star');
        // node.name = 'star' + id.toString();
        // var sp = node.addComponent(cc.Sprite);
        // sp.spriteFrame = this.sprite;
        // let winsize = cc.winSize;
        // node.x = -winsize.width * 0.5 - i * 10;
        // node.y = cc.random0To1() * 100;
        // node.parent = this.node;
    },
    getPlayerDistance: function () {
        // 根据 player 节点位置判断距离
        // var playerPos = this.game.player.getPosition();
        // // 根据两点位置计算两点之间距离
        // var dist = cc.pDistance(this.node.position, playerPos);
        // return dist;
    },
    gameOver: function () {
        // this.player.stopAllActions(); //停止 player 节点的跳跃动作
        // cc.director.loadScene('game');
    },

    // called every frame
    update: function (dt) {
        // let winsize = cc.winSize;

        // for (let i = 0; i < 10; i++) {
        //     let starName = 'star' + i.toString();
        //     let speed = i + 1;
        //     if (this.node.getChildByName(starName).x < winsize.width * 0.5) {
        //         this.node.getChildByName(starName).x += speed;
        //     } else {
        //         this.node.getChildByName(starName).x = -winsize.width * 0.5 - i * 10;
        //         this.node.getChildByName(starName).y = Math.random() * 100;
        //     }
        // }


    },
});
