var hook = require('hook')

cc.Class({
    extends: cc.Component,

    properties: {
        total_time: {
            default: 120,
            displayName: '游戏总时间'
        },
        hookPrefab: {
            default: [],
            type: cc.Prefab
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //爪子数组
        //let hookArray = cc.sys.localStorage.getItem('hookArray')
        //背包等级
        let bagLevel = cc.sys.localStorage.getItem('bagLevel')
        //矿车等级
        let minerLevel = cc.sys.localStorage.getItem('minerLevel')


        this.hero = cc.find('Canvas/bg/hero')
        this.hero.x = 800
        this.bg = cc.find('Canvas/bg')
        this.move_layer = cc.find('Canvas/bg/move_layer')
        //放钩子得地方
        this.hookPos = cc.find('Canvas/bg/hero/car/hook_pos')
        this.hookData = [
            { id: 0, speed: 100, rate: 0.3, angle: 0, status: 0 },
            { id: 1, speed: 200, rate: 0.2, angle: 0, status: 0 },
            { id: 2, speed: 300, rate: 0.1, angle: 0, status: 0 },
        ]
        this.hookArray = []

        this.current_hook_id = 0
        this.createHook()

        
        //倒计时
        this.timeLabel = cc.find('Canvas/bg/label_bar/timer_label').getComponent(cc.Label)
        this.totalTime = 120
        this.timeLabel.string = parseInt(this.totalTime)
        this.schedule(function () {
            this.totalTime--
            this.timeLabel.string = parseInt(this.totalTime)
            if (this.totalTime === 0) {
                //cc.game.resume()
                cc.game.pause()
            }
        }, 1);
        //成绩
        this.scoreLabel = cc.find('Canvas/bg/label_bar/score_label').getComponent(cc.Label)
        this.score = 0
        this.scoreLabel.string = parseInt(this.score)
        this.node.on('score', function (event) {
            let score = parseInt(event.detail.score)
            this.setScore(score)
        }.bind(this))

        //开启碰撞
        let manager = cc.director.getCollisionManager()
        manager.enabled = true
        // manager.enabledDebugDraw = true
        // manager.enabledDrawBoundingBox = true

    },


    start() {
        let action = cc.moveTo(1, cc.p(0, 277))
        this.hero.runAction(action)
        this.node.on('touchXY', function (event) {
            let hNode = this.hookArray[this.current_hook_id]
            let theHook = hNode.getComponent(hook)
            let status = theHook.status
            cc.log('-----------------接收到 touch坐标------------------')
            if (status === 0) {
                let touchX = parseFloat(event.detail.xy.x)
                let touchY = parseFloat(event.detail.xy.y)
                //cc.log(touchX, touchY);
                theHook.angle = this.calcAngle(touchX, touchY)
                theHook.status = 1
            }
            //指向下一个钩子
            this.nextHookId()
            event.stopPropagation()

        }.bind(this));
    },

    //创建hook
    createHook() {
        for (let item of this.hookData) {
            // let speed = item.speed
            // let rate = item.rate
            let id = item.id
            if (id < 0 || id > 3) {
                continue
            }
            let hNode = cc.instantiate(this.hookPrefab[id])
            this.hookArray.push(hNode)
        }
        let angle = -45
        for (let i = 0; i < this.hookArray.length; i++) {
            let theHook = this.hookArray[i]
            theHook.parent = this.hookPos
            theHook.setPosition(this.hookPos.getPosition())
            theHook.anchorX = 0.5
            theHook.anchorY = 1.0
            theHook.rotation = angle
            let hookNode = theHook.getComponent(hook)
            hookNode.speed = this.hookData[i].speed
            hookNode.rate = this.hookData[i].rate
            hookNode.angle = angle
            angle += 45
        }

    },

    setScore(s){
        this.score += s
        this.scoreLabel.string =parseInt(this.score)
    },

    update(dt) {



    },

    backHome() {
        //返回首页
        cc.director.loadScene("home");
    },
    //删除金块
    delGlod() {
        //挂金块的节点
        let nums = cc.find('Canvas/bg/hero/car/hook_pos').childrenCount
        if (nums) {
            let glod = cc.find('Canvas/bg/hero/car/hook_pos').children[0]
            let glod2 = glod.getComponent(glod.name)
            glod.parent = this.move_layer
            glod.setPosition(glod2.randomPos())
            glod2.status = 1
            //累加成绩
            this.score += glod2.score
            this.scoreLabel.string = parseInt(this.score)
        }

    },

    calcAngle(touchX, touchY) {
        //左侧+1，右侧-1
        touchX += this.move_layer.x + this.bg.x
        touchY += this.move_layer.y + this.bg.y
        let hookCenterX = this.hookPos.x + this.hookPos.parent.x + this.hookPos.parent.parent.x
        let hookCenterY = this.hookPos.y + this.hookPos.parent.y + this.hookPos.parent.parent.y
        //hookCenterX=13.91 hookCenterY=160.51999999999998
        let angle = 0.0
        let dx = touchX - hookCenterX
        let dy = touchY - hookCenterY

        angle = Math.atan(dx / dy) / 3.14159 * 180.0
        //cc.log('calc , angle=' + angle)
        return angle

    },
    nextHookId() {
        this.current_hook_id++
        let nums = this.hookArray.length
        if (this.current_hook_id > nums - 1) {
            this.current_hook_id = 0
        }

        cc.log('下一个ID====' + this.current_hook_id)
    }

});
