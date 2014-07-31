new Model({
    name : "floor",
    vertices : [
        -.5, 0, -.5,
         .5, 0, -.5,
        -.5, 0,  .5,
         .5, 0,  .5,
    ],
    normals : [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ],
    textureMap : [
        0, 0,
        1, 0,
        0, 1,
        1, 1
    ],
    faces : [
        0, 1, 2,
        1, 2, 3
    ]
})
