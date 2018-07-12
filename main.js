
cc.Class({
    extends: cc.Component,

    properties: {
        Prefabs: {
            default: [],
            type: cc.Prefab
        },
        hook1_speed: 1.5,
        hook2_speed: 2.5,
        hook3_speed: 3.5,
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.setDisplayStats(false)

        this.bg = cc.find('Canvas/bg')
        this.move_layer = cc.find('Canvas/bg/move_layer')
        this.hero = cc.find('Canvas/bg/hero')

        this.hero.x = 800
        //绳子
        this.rope = cc.find('Canvas/bg/hero/car/rope')
        //爪子等级
        let hookLevel = cc.sys.localStorage.getItem('hookLevel')
        //背包等级
        let bagLevel = cc.sys.localStorage.getItem('bagLevel')
        //矿车等级
        let minerLevel = cc.sys.localStorage.getItem('minerLevel')
        //放下钩子开关 0=停止,1=发射,2=继续移动,3=拉回
        this.HookStatus = 0
        this.HookSpeed = 3
        //记录绳子长度
        this.RopeHeight = 50
        this.rope.height = this.RopeHeight

        //重组prefab数组 方便查询
        this.Prefab = {};
        this.Prefabs.forEach(item => {
            this.Prefab[item._name] = item;
        });

       
        //开启碰撞
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.node.on('Collision', function (event) {
            cc.log('-----------------接收到碰撞消息------------------');
            cc.log(event.detail.catch)
            this.HookStatus = 2
            //this.PullBackHook();
        }.bind(this));

    },

    SetSpeed(otherSpeed) {
        this.HookSpeed = otherSpeed
        cc.log('HookSpeed ==== ' + this.HookSpeed)
        
    },

    start() {
        let action = cc.moveTo(1, cc.p(30, 300))
        this.hero.runAction(action)


        this.node.on('touchXY', function (event) {
            if (this.HookStatus === 0) {
                cc.log('-----------------接收到 touch坐标------------------');
                let touchX = parseFloat(event.detail.xy.x)
                let touchY = parseFloat(event.detail.xy.y)
                cc.log(touchX, touchY);
                this.calcAngle(touchX, touchY);
                this.HookStatus = 1
            }


        }.bind(this));
    },

    update(dt) {
        switch (this.HookStatus) {
            case 0:
                break
            case 1:
                //发射钩子
                this.rope.height += this.hook3_speed;
                break
            case 2:
                //收回钩子
                if (this.rope.height > this.RopeHeight) {
                    this.rope.height -= this.HookSpeed
                } else {
                    //拉回到位
                    this.HookStatus = 0
                    this.rope.height = this.RopeHeight
                    //把钩子上的金块删除
                    this.delGlod()
                }

                break
        }
    },
    //删除金块
    delGlod() {
        //挂金块的节点
        let nums = cc.find('Canvas/bg/hero/car/rope/temp').childrenCount
        if (nums) {
            let glod = cc.find('Canvas/bg/hero/car/rope/temp').children[0]
            let glod2 = glod.getComponent(glod.name)
            glod.parent = this.move_layer
            glod.setPosition(glod2.randomPos())
            glod2.status = 1
        }

    },


    /**
     * 随机坐标
     */
    randomXY() {
        //x = 屏幕宽度 / 2 * 随机数
        //y = 地平面位置 + 随机数cc.random0To1() +高度范围（可以说是Y的最小点）
        //地平面位置 = 地面y + 地面 高度 / 2
        // - 30是因为物品锚点在中间位置 设置坐标到范围定点的时候 会有部分超出
        let groundY = 400
        let randX = (this.itemArea.width - 30) / 2 * cc.randomMinus1To1();
        let randY = (this.itemArea.height - 30) / 2 * cc.randomMinus1To1();
        return cc.p(randX, randY);
    },
    createItem() {
        let node = cc.instantiate(this.Prefab[item._name]);
        let XY = this.randomXY();
        node.parent = this.move_layer;
        node.setPosition(XY);
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
    /**
     * @description 添加得分
     */
    addScore(items) {
        if (!items[0]) return;
        let scoreCon = ItemAttr[items[0].name] || {};
        this.Score.string = parseInt(this.Score.string) + (scoreCon.score || 0);
        //播放得分音效
        cc.audioEngine.play(this.AddScroeAudio);
    },
    /**
     * 退出游戏 返回上一个场景
     */
    exitGame() {
        cc.game.resume();
        cc.director.loadScene('home');
    },
    calcAngle(touchX, touchY) {
        //左侧+1，右侧-1
        touchX += this.move_layer.position.x + this.bg.position.x
        touchY += this.move_layer.position.y + this.bg.position.y
        let hookCenterX = this.rope.position.x + this.rope.parent.position.x + this.rope.parent.parent.position.x
        let hookCenterY = this.rope.position.y + this.rope.parent.position.y + this.rope.parent.parent.position.y
        //hookCenterX=13.91 hookCenterY=160.51999999999998
        let angle = 0.0
        cc.log('hookCenterX=' + hookCenterX, 'hookCenterY=' + hookCenterY)
        cc.log('touchX=' + touchX + ',touchY=' + touchY)
        let dx = Math.abs(touchX - hookCenterX)
        let dy = Math.abs(touchY - hookCenterY)
        cc.log('dx=' + dx + ',dy=' + dy)

        let symbol = -1;
        if (touchX < hookCenterX) {
            symbol = 1;
        }
        if (dx !== 0.0) {
            angle = Math.atan(dy / dx) / 3.14159 * 180.0 * symbol;
            if (angle < 90.0 && angle > 0.0) {
                angle = 90 - angle;
            } else if (angle < 0.0) {
                angle = -(90 + angle);
            }
            cc.log('angle=' + angle);
        }
        this.rope.rotation = angle;

    },
});
