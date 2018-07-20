var glodNode = require("glod")
cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 10,
            displayName: '发射速度'
        },
        rate: {
            default: 0.3,
            displayName: '脱钩率'
        },
        id: {
            default: 0,
            displayName: 'ID'
        },
        status: {
            default: 0,
            displayName: '状态'
        },
        angle: 0

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //status 0=静止,1=发射,2=回收
        //空钩，catchStatus=0，抓住，catchStatus=1
        this.catchStatus = 0
        this.hookPos = cc.find('Canvas/bg/hero/car/hook_pos')
        this.move_layer = cc.find('Canvas/bg/move_layer')
       
        //拉回位置
        this.end = this.hookPos.getPosition()

    },

    onCollisionEnter: function (other, self) {
        if (this.status === 2) {
            return
        }
        cc.log('碰撞检测22222=========')
        this.isWall = this.Wall(other)
        this.isGlod = this.Glod(other)
        this.isStone = this.Stone(other)

        if (this.isGlod) {
            cc.log('碰撞金矿===============================')
            let glod = other.getComponent(glodNode)
            let rnd = Math.random() * 100
            if (rnd < this.rate * 100) {
                //金块脱落
                cc.log('金块脱落=============')
                glod.status = 2
                //一无所获
                cc.log('一无所获')
                this.pollEmpty()
                

            } else {
                this.catchStatus = 1
                glod.status = 0
                //根据物品设置拉回钩子速度
                //this.main.SetSpeed(glod.pollSpeed)
                other.node.parent = this.node
                other.node.anchorY = 1.0
                other.node.x = 0
                other.node.y = 10
                other.node.group = 'default'
                //拉回金块
                cc.log('拉回金块')
                this.poll()
                
            }
            //cc.find('Canvas').emit('Collision', { id: this.id, catch: 1 })
        } else {
            //一无所获
            cc.log('撞墙或石头')
            this.pollEmpty()
        }
        this.status = 2
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
    update(dt) {
        this.node.rotation = this.angle
        //cc.log(this.id,this.status)
        if (this.status === 1) {
            //cc.log('hook id=' + this.id + ',speed=' + this.speed + ',angle=' + this.angle)
            this.move(dt)
        }

    },

    move(dt) {
        let rt = 90 - this.angle
        let dx = this.speed * Math.cos(rt / 180.0 * 3.1415926) * dt
        let dy = this.speed * Math.sin(rt / 180.0 * 3.1415926) * dt
        this.node.setPosition(cc.v2(this.node.x - dx, this.node.y - dy))

    },
    pollEmpty() {
        // let backAction = cc.moveTo(1, cc.v2(this.hookPos.x, this.hookPos.y))
        let start = this.node.getPosition()

        let bezier = [start, this.getMiddlePos(start, this.end), this.end]
        let bezierTo = cc.bezierTo(1, bezier)

        let finished = cc.callFunc(function () {
            this.status = 0
        }.bind(this))
        let action = cc.sequence(bezierTo, finished)
        this.node.runAction(action)

    },
    poll() {
        //拉回，走弧线
        let start = this.node.getPosition()
        let bezier = [start, this.getMiddlePos(start, this.end), this.end]
        let bezierTo = cc.bezierTo(1, bezier)
        let finished = cc.callFunc(function () {

            this.status = 0
            if (this.node.childrenCount) {

                let glod = this.node.children[0]
                glod.parent = this.move_layer
                cc.log(glod.group)
                glod.group = 'glod'
                let glod2 = glod.getComponent(glodNode)
                let newPos = glod2.randomPos()
                glod.setPosition(newPos)
    
                glod2.status = 1
                //累加成绩
                cc.find('Canvas').emit('score', { score: glod2.score })
    
            }
        }.bind(this))

        let action = cc.sequence(bezierTo, finished)
        this.node.runAction(action)
        this.catchStatus = 0
        

    },

    //得到弧线中点
    getMiddlePos(p1, p2) {
        let dx = p1.x > p2.x ? -500 : 500
        let x = (p1.x + p2.x) * 0.5 + dx
        let y = (p1.y + p2.y) * 0.5
        return cc.v2(x, y)
    },
});
