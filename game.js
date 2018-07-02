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
        HookStatus: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.point = cc.find('Canvas/bg/hook/point');
        this.hook = cc.find('Canvas/bg/hook');
        this.hook.rotation = 0.0;
        this.wall = cc.find('Canvas/wall');
        //记录钩子长度
        this.HookHeight = 100;
        this.hook.height = this.HookHeight;
        

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('=========clickBox touchend==============');
            if (this.HookStatus === 0) {
                let temp = event.getLocation();
                let that = this;
                let xy = that.node.convertToNodeSpaceAR(temp);
                that.node.emit('touchXY', {
                    xy: xy
                });
                that.HookStatus = 1;
            }
        }, this);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

        this.node.on('Collision', function (event) {
            cc.log('-----------------接收到碰撞消息------------------');
            this.HookStatus = 2;
            //this.PullBackHook();
        }.bind(this));

    },

    start() {

        this.node.on('touchXY', function (event) {
            cc.log('-----------------接收到 touch坐标------------------');
            let touchX = parseFloat(event.detail.xy.x);
            let touchY = parseFloat(event.detail.xy.y);
            cc.log(touchX, touchY);
            this.calcAngle(touchX, touchY);
            
            //event.stopPropagation();

        }.bind(this));
    },

    calcAngle(touchX, touchY) {
        //左侧+1，右侧-1
        let hookCenterX = this.hook.position.x + this.hook.parent.position.x ;
        let hookCenterY = this.hook.position.y + this.hook.parent.position.y ;
        //hookCenterX=13.91 hookCenterY=160.51999999999998
        let angle = 0.0;
        cc.log('hookCenterX=' + hookCenterX, 'hookCenterY=' + hookCenterY);
        cc.log('touchX=' + touchX + ',touchY=' + touchY);
        let dx = Math.abs(touchX - hookCenterX);
        let dy = Math.abs(touchY - hookCenterY);
        cc.log('dx=' + dx + ',dy=' + dy);

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
        this.hook.rotation = angle;
        
        this.moveHook(angle);
    },

    //以一个角度移动钩子
    moveHook(angle) {
        let step = 1.0;
        let speed = 1;
        //let angle = this.hook.rotation;
        let radian = angle * 3.14159 / 180.0;
        cc.log('angle=' + angle);
        // let dx = Math.sin(radian) * step;
        // let dy = Math.cos(radian) * step;
        // this.hook.height += 300;
        // cc.log('dx=' + dx + ',dy=' + dy);
        // let moveAction = cc.moveTo(speed, cc.p(dx, dy));
        // this.hook.runAction(moveAction);
        // this.hook.x -= Math.sin(radian) * speed;
        // this.hook.y -= Math.cos(radian) * speed;
        this.hook.height += speed;
    },

    PullBackHook() {
        //播放拉回钩子动画
        //this.MinerAnimation.play('PullRope');
        // let moveAction = cc.moveTo(1, cc.p(this.startX, this.startY));
        // this.hook.runAction(moveAction);
        //this.hook.height = this.HookHeight;
        //this.HookStatus = 2;
    },

    Handle(items) {
        this.AddScore(items);
        this.RemoveItem(items);
    },
    /**
     * @description 删除物品
     */
    RemoveItem(items) {
        items.forEach(item => {
            item.destroy();
        });
    },
    /**
     * @description 添加得分
     */
    AddScore(items) {
        if (!items[0]) return;
        // let scoreCon = ItemAttr[items[0].name] || {};
        // this.Score.string = parseInt(this.Score.string) + (scoreCon.score || 0);
        // //播放得分音效
        // cc.audioEngine.play(this.AddScroeAudio);
    },


    update(dt) {
        if (this.HookStatus === 0){
            return
        }else if(this.HookStatus === 1){
            //发射钩子
            this.hook.height += 1;
        }else if(this.HookStatus === 2){
            //收回钩子
            if(this.hook.height > this.HookHeight){
                this.hook.height -= 1;
            }else{
                //回收到位
                this.HookStatus = 0;
                //检测是否拉回物品
                cc.log('检测是否拉回物品=====')
                cc.log(this.hook.children[1].childrenCount)
                if (this.hook.children[1].childrenCount) {
                    this.Handle(this.hook.children[1].children);
                };
            }
            
        }

    },
});
