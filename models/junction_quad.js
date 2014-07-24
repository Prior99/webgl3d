{
    texture : "concrete.jpg",
    name : "junction_quad",
    vertices : [
    //  x,     y,  z
         -0.5,  1, -0.25, // 0 //Top
         -0.5,  1,  0.25, // 1
        -0.25,  1,  0.25, // 2
        -0.25,  1, -0.25, // 3
        -0.25,  1,   0.5, // 4
         0.25,  1,   0.5, // 5
        -0.25,  1,  -0.5, // 6
         0.25,  1,  -0.5, // 7
         0.25,  1,  0.25, // 8
          0.5,  1,  0.25, // 9
         0.25,  1, -0.25, //10
          0.5,  1, -0.25, //11
         -0.5, -1, -0.25, //12 //Bottom
         -0.5, -1,  0.25, //13
        -0.25, -1,  0.25, //14
        -0.25, -1, -0.25, //15
        -0.25, -1,   0.5, //16
         0.25, -1,   0.5, //17
        -0.25, -1,  -0.5, //18
         0.25, -1,  -0.5, //19
         0.25, -1,  0.25, //20
          0.5, -1,  0.25, //21
         0.25, -1, -0.25, //22
          0.5, -1, -0.25  //23
    ],
    textureCoordinates : [
        0, 0.75, // 0
        0, 0.25, // 1
        0, 0.75, // 2
        0, 0.25, // 3
        0, 0.75, // 4
        0, 0.25, // 5
        0, 0.75, // 6
        0, 0.25, // 7
        0, 0.75, // 8
        0, 0.25, // 9
        0, 0.75, //10
        0, 0.25, //11
        0, 0.75, //12
        0, 0.25, //13
        0, 0.75, //14
        0, 0.25, //15
        0, 0.75, //16
        0, 0.25, //17
        0, 0.75, //18
        0, 0.25, //19
        0, 0.75, //20
        0, 0.25, //21
        0, 0.75, //22
        0, 0.25  //23

    ],
    indices : [
        //Top
        0,  1,  2, //Left
        0,  3,  2,
        4,  5,  6, //Large middle
        6,  7,  5,
        8,  9, 10, //Right
       10,  9, 11,
       //Bottom
       12, 13, 14, //Left
       12, 15, 14,
       18, 16, 17, //Large middle
       18, 19, 17,
       22, 20, 21, //Right
       22, 23, 21,
       //Now for the side parts of left
        0,  3, 12, //Front
       12, 15,  3,
        0,  1, 12, //Left
       12, 13,  1,
        1,  2, 13, //Back
       13, 14,  2,
       //Side part of front
        6,  7, 18, //Front
       18, 19,  7,
        6,  3, 15, //Left
       18, 15,  6,
        7, 10, 19, //Right
       19, 20, 10,
       //Side part of right
       10, 11, 22, //Front
       22, 23, 11,
       11,  9, 23, //Right
       23, 21,  9,
        8,  9, 21, //Back
       20, 21,  8,
       //Side part of back
        4,  5, 16, //Back
       16, 17,  5,
        4,  2, 14, //Left
       14, 16,  4,
        5,  8, 20, //Right
       20, 17,  5
    ]
}
