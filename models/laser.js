new Model({
    name : "laser",
    texture : "laser.png",
    vertices : [
		-.002, -.002,   0., //Top
		-.002, -.002, 100.,
		 .002, -.002,   0.,
		 .002, -.002, 100.



    ],
    normals : [
         0, -1,  0, //Top
         0, -1,  0,
         0, -1,  0,
         0, -1,  0
    ],
    textureMap : [
		0, 0,
		0, 1,
		1, 0,
		1, 1
    ],
    faces : [
         0,  1,  2,
         1,  2,  3
    ]
})
