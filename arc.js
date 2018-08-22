cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        var g = this.getComponent(cc.Graphics);
        if (!g) g = this.addComponent(cc.Graphics);
        if (cc.director.setClearColor) {
            cc.director.setClearColor(cc.Color.GRAY);
        }

        this.drawArc(g)
        this.drawLine(g)
    },

    drawArc(g) {

        g.lineWidth = 5;
        g.fillColor = cc.Color.BLUE;

        g.arc(0, 0, 100, Math.PI / 2, Math.PI, false);
        g.lineTo(0, 0);
        g.close();

        g.stroke();
        g.fill();

        g.fillColor = cc.Color.RED;

        g.arc(-10, 10, 100, Math.PI / 2, Math.PI, true);
        g.lineTo(-10, 10);
        g.close();

        g.stroke();
        g.fill();
    },

    drawLine(g) {
        g.moveTo(100, 100)
        g.lineTo(0, 0)
        g.lineWidth = 10;
        g.lineCap = cc.Graphics.LineCap.ROUND
        g.strokeColor = cc.Color.YELLOW;
        g.stroke();

    },

    // called every frame
    update: function (dt) {

    },
});
