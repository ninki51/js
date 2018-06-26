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
        //游戏状态：0=准备发射钩子,1=发射,2=回收钩子
        GameStatus: 0,
        hook: {
            default: null,
            type: cc.Node
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.GameStatus = 0;
        this.star = cc.find('Canvas/star');
        this.hook = cc.find('Canvas/miner/hook');
        this.hook.rotation = 0.0;
        this.hook.height = 10;
        cc.log('------------------------------------------------');
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('=========clickBox touchend==============');
            // console.log(event.touch.getLocation().x);
            // console.log(event.touch.getLocation().y);
            //this.emitClick();
            //this.node.dispatchEvent(new cc.Event.EventCustom('sayHello',true));
            if (this.GameStatus === 0) {
                let temp = event.getLocation();
                let that = this;
                let xy = that.node.convertToNodeSpaceAR(temp);
                this.node.emit('touchXY', {
                    // x: event.touch.getLocation().x, y: event.touch.getLocation().y
                    xy: xy
                });
                this.GameStatus = 1;
            }
        }, this);

    },

    start() {

        this.node.on('touchXY', function (event) {
            cc.log('-----------------接收到 touch坐标------------------');
            let touchX = parseFloat(event.detail.xy.x);
            let touchY = parseFloat(event.detail.xy.y);
            cc.log(touchX, touchY);
            this.calcAngle(touchX, touchY);
            //this.hook.height = 200;
            //event.stopPropagation();

        }.bind(this));
    },


    calcAngle(touchX, touchY) {
        //左侧+1，右侧-1
        let hookCenterX = this.hook.position.x + this.hook.parent.position.x - 5;
        let hookCenterY = this.hook.position.y + this.hook.parent.position.y - 10;
        //hookCenterX=13.91 hookCenterY=160.51999999999998
        this.star.x = hookCenterX;
        this.star.y = hookCenterY;
        let angle = 0.0;
        cc.log('hookCenterX=' + hookCenterX, 'hookCenterY=' + hookCenterY);
        cc.log('touchX=' + touchX + ',touchY=' + touchY);
        let dx = Math.abs(touchX - hookCenterX);
        // if (touchX > 0.0){
        //     dx = touchX - hookCenterX;
        // }else if(touchX === 0.0){
        //     angle = 0.0;
        // }
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

    },
    
    emitHook(){
        let self = this;
        if (self.GameStatus === 1){
            self.hook.height += 1;
            if (self.hook.height > 350){
                self.GameStatus = 2;
            }
        }else if (self.GameStatus === 2){
            self.hook.height -= 1;
            if (self.hook.height < 10){
                self.GameStatus = 0;
            }
        }
        
    },

    update(dt) {
        // if(this.GameStatus == 0){
        //     this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
        //         console.log('========touchend==============');
        //         console.log(event.touch.getLocation().x);
        //         console.log(event.touch.getLocation().y);
        //         this.calcAngle(event.touch.getLocation().x,event.touch.getLocation().y);
        //         this.GameStatus = 1;
        //     }, this);
        // }else if(this.GameStatus == 1 && this.hook.height < 300){
        //     this.hook.height += 1;
        // }else if(this.GameStatus == 1 && this.hook.height > 300){
        //     this.GameStatus = 2;
        // }else if(this.GameStatus == 2 && this.hook.height > 30){
        //     this.hook.height -= 1;
        // }else if (this.hook.height <= 30){
        //     this.GameStatus = 0;
        // }
        //this.hook.height = 350;
        this.emitHook();
    },
});
