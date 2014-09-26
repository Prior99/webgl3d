new Model({
    texture : "metaldoor.jpg",
    init : function() {
        var p0 = [-.5,  1,  .05];
        var p1 = [ .5,  1,  .05];
        var p2 = [-.5, -1,  .05];
        var p3 = [ .5, -1,  .05];
        var p4 = [-.5,  1, -.05];
        var p5 = [ .5,  1, -.05];
        var p6 = [-.5, -1, -.05];
        var p7 = [ .5, -1, -.05];
		//Front Back
        this.quad(p0, p1, p2, p3, [ 0,  0,  1], [0, 0], [1, 1]);
        this.quad(p4, p5, p6, p7, [ 0,  0, -1], [0, 0], [1, 1]);
		//Left and Right
        this.quad(p0, p2, p4, p6, [-1,  0,  0], [0, 0], [.1, 1]);
        this.quad(p1, p3, p5, p7, [ 1,  0,  0], [0, 0], [.1, 1]);
		//Top Bottom
        this.quad(p0, p1, p4, p5, [ 0,  1,  0], [0, 0], [1, .1]);
        this.quad(p2, p3, p6, p7, [ 0, -1,  0], [0, .9], [1, 1]);


    }
})
