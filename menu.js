cc.Class({
    extends: cc.Component,

    properties: {
        button:{
            default:null,
            type:cc.Button,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.button.node.on('click', this.callback, this);
    },

    start () {

    },

    callback: function (event) {
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Button 组件
        var button = event.detail;
        cc.director.loadScene("main");
     }

    // update (dt) {},
});
