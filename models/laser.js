new Model({
    name : "laser",
    texture : "laser.png",
    vertices : [
		-.005, -.005,   0., //Top
		-.005, -.005, 500.,
		 .005, -.005,   0.,
		 .005, -.005, 500.



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
