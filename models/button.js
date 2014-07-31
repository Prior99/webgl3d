new Model({
    texture : "plastic.jpg",
    init : function() {
        var p0 = [-.1,  .1,  .5];
        var p1 = [ .1,  .1,  .5];
        var p2 = [-.1, -.1,  .5];
        var p3 = [ .1, -.1,  .5];
        var p4 = [-.1,  .1, .45];
        var p5 = [ .1,  .1, .45];
        var p6 = [-.1, -.1, .45];
        var p7 = [ .1, -.1, .45];
        this.quad(p0, p1, p2, p3, [0, 0,  1], [0, 0], [1., 1.]);
        this.quad(p4, p5, p6, p7, [0, 0, -1], [0, 0], [1., 1.]);
    }
})
