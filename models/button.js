new Model({
    texture : "button.png",
    init : function() {
        var p0 = [-.1,  .1, 0];
        var p1 = [ .1,  .1, 0];
        var p2 = [-.1, -.1, 0];
        var p3 = [ .1, -.1, 0];
        var p4 = [-.1,  .1, -.025];
        var p5 = [ .1,  .1, -.025];
        var p6 = [-.1, -.1, -.025];
        var p7 = [ .1, -.1, -.025];

        var d0 = [-.05,  .05, -.025];
        var d1 = [ .05,  .05, -.025];
        var d2 = [-.05, -.05, -.025];
        var d3 = [ .05, -.05, -.025];
        var d4 = [-.05,  .05, -.05];
        var d5 = [ .05,  .05, -.05];
        var d6 = [-.05, -.05, -.05];
        var d7 = [ .05, -.05, -.05];
		//Front Back
        this.quad(p0, p1, p2, p3, [ 0,  0,  1], [0, 0], [ .5, .5]);
        this.quad(p4, p5, p6, p7, [ 0,  0, -1], [0, 0], [ .5, .5]);
		//Left and Right
        this.quad(p0, p2, p4, p6, [-1,  0,  0], [.5, 0], [1., .0625]);
        this.quad(p1, p3, p5, p7, [ 1,  0,  0], [.5, .0625], [1., .125]);
		//Top Bottom
        this.quad(p0, p1, p4, p5, [ 0,  1,  0], [.5, .125], [1., .1875]);
        this.quad(p2, p3, p6, p7, [ 0, -1,  0], [.5, .1875], [1., .25]);

		//Front Back
        this.quad(d0, d1, d2, d3, [ 0,  0,  1], [0, .5], [.3333, .6666]);
        this.quad(d4, d5, d6, d7, [ 0,  0, -1], [0, .5], [.3333, .6666]);
		//Left and Right
        this.quad(d0, d2, d4, d6, [-1,  0,  0], [.5, .25], [.875, .3125]);
        this.quad(d1, d3, d5, d7, [ 1,  0,  0], [.5, .3125], [.875, .375]);
		//Top Bottom
        this.quad(d0, d1, d4, d5, [ 0,  1,  0], [.5, .375], [.875, .4375]);
        this.quad(d2, d3, d6, d7, [ 0, -1,  0], [.5, .4375], [.875, .5]);


    }
})
