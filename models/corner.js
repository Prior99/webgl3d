new Model({
	name : "corner",
	vertices : [
		//Top
		-.25,  1,  -.5, // 0  0 Long
		 .25,  1,  -.5, // 1  1
		-.25,  1,  .25, // 2  2
		 .25,  1,  .25, // 3  3
		 .25,  1,  .25, // 3  4 Short
		 .25,  1, -.25, // 4  5
		  .5,  1,  .25, // 5  6
		  .5,  1, -.25, // 6  7
		//Bottom
		-.25, -1,  -.5, // 7  8 Long
		 .25, -1,  -.5, // 8  9
		-.25, -1,  .25, // 9 10
		 .25, -1,  .25, //10 11
		 .25, -1,  .25, //11 12 Short
		 .25, -1, -.25, //12 13
		  .5, -1,  .25, //13 14
		  .5, -1, -.25, //14 15
		//Sides Long
		-.25,  1,  -.5, // 0 16 Front
		 .25,  1,  -.5, // 1 17
		-.25, -1,  -.5, // 7 18
		 .25, -1,  -.5, // 8 19
		-.25,  1,  -.5, // 0 20 Left
		-.25,  1,  .25, // 2 21
		-.25, -1,  -.5, // 7 22
		-.25, -1,  .25, // 9 23
		-.25,  1,  .25, // 2 24 Back
		  .5,  1,  .25, // 6 25
		-.25, -1,  .25, // 9 26
		  .5, -1,  .25, //13 27
		 .25,  1, -.25, // 4 28 Short Front
		  .5,  1, -.25, // 5 29
		 .25, -1, -.25, //11 30
		  .5, -1, -.25, //12 31
		  .5,  1, -.25, // 5 32 Short Right
		  .5,  1,  .25, // 6 33
		  .5, -1, -.25, //12 34
		  .5, -1,  .25, //13 35
		 .25,  1,  -.5, // 1 36 Long Right
		 .25,  1, -.25, // 4 37
		 .25, -1,  -.5, // 8 38
		 .25, -1, -.25  //11 39
	],
	normals : [
		//Top
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		 0, -1,  0,
		//Bottom
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		 0,  1,  0,
		//Sides
		 0,  0, -1, //Long Front
		 0,  0, -1,
		 0,  0, -1,
		 0,  0, -1,
		-1,  0,  0, //Long Left
		-1,  0,  0,
		-1,  0,  0,
		-1,  0,  0,
		 0,  0,  1, //Long Back
		 0,  0,  1,
		 0,  0,  1,
		 0,  0,  1,
		 0,  0, -1, //Short Front
		 0,  0, -1,
		 0,  0, -1,
		 0,  0, -1,
		 1,  0,  0, //Short Right
		 1,  0,  0,
		 1,  0,  0,
		 1,  0,  0,
		 1,  0,  0, //Long Right
		 1,  0,  0,
		 1,  0,  0,
		 1,  0,  0
	],
	textureMap : [
		//Top
		.25,   1, //Long
		.75,   1,
		.25, .25,
		.75, .25,
		.75, .25, //Short
		.75, .75,
		  1, .25,
		  1, .75,
		//Bottom
		.25,   1, //Long
		.75,   1,
		.25, .25,
		.75, .25,
		.75, .25, //Short
		.75, .75,
		  1, .25,
		  1, .75,
		//Sides
		.25,   0, //Long Front
		.75,   0,
		.25,   2,
		.75,   2,
		.75,   0, //Long Left
		  0,   0,
		.75,   2,
		  0,   2,
		.25,   0, //Back
		  1,   0,
		.25,   2,
		  1,   2,
		.75,   0, //Side Front
		  1,   0,
		.75,   2,
		  1,   2,
		 .5,   0, //Short Right
		  1,   0,
		 .5,   2,
		  1,   2,
		.75,   0, //Long Right
		  1,   0,
		.75,   2,
		  1,   2
	],
	faces : [
		//Top
		 0,  1,  2, //Long
		 1,  2,  3,
		 4,  5,  6, //Short
		 5,  6,  7,
		//Bottom
		 8,  9, 10, //Long
		 9, 10, 11,
		12, 13, 14, //Short
		13, 14, 15,
		//Sides
		16, 17, 18, //Long Front
		17, 18, 19,
		20, 21, 22, //Long Left
		21, 22, 23,
		24, 25, 26, //Back
		25, 26, 27,
		28, 29, 30, //Short Front
		29, 30, 31,
		32, 33, 34, //Short Right
		33, 34, 35,
		36, 37, 38, //Long Right
		37, 38, 39
	]
})
