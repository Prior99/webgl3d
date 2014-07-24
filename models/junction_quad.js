{
    texture : "bricks.jpg",
    name : "junction_quad",
    vertices : [
        //Top
         -.5,  1, -.25, // 0  0 Left
         -.5,  1,  .25, // 1  1
        -.25,  1,  .25, // 2  2
        -.25,  1, -.25, // 3  3
        -.25,  1,   .5, // 4  4 Middle
         .25,  1,   .5, // 5  5
        -.25,  1,  -.5, // 6  6
         .25,  1,  -.5, // 7  7
         .25,  1,  .25, // 8  8 Right
          .5,  1,  .25, // 9  9
         .25,  1, -.25, //10 10
          .5,  1, -.25, //11 11
        //Bottom
         -.5, -1, -.25, //12 12 Left
         -.5, -1,  .25, //13 13
        -.25, -1,  .25, //14 14
        -.25, -1, -.25, //15 15
        -.25, -1,   .5, //16 16 Middle
         .25, -1,   .5, //17 17
        -.25, -1,  -.5, //18 18
         .25, -1,  -.5, //19 19
         .25, -1,  .25, //20 20 Right
          .5, -1,  .25, //21 21
         .25, -1, -.25, //22 22
          .5, -1, -.25, //23 23
        //Sides of Left
         -.5,  1, -.25, // 0 24 Front
         -.25, 1, -.25, // 3 25
         -.5, -1, -.25, //12 26
        -.25, -1, -.25, //15 27
         -.5,  1, -.25, // 0 28 Left
         -.5,  1,  .25, // 1 29
         -.5, -1, -.25, //12 30
         -.5, -1,  .25, //13 31
         -.5,  1,  .25, // 1 32 Back
        -.25,  1,  .25, // 2 33
         -.5, -1,  .25, //13 34
        -.25, -1,  .25, //14 35
        //Sides of Front
        -.25,  1,  -.5, // 6 36 Front
         .25,  1,  -.5, // 7 37
        -.25, -1,  -.5, //18 38
         .25, -1,  -.5, //19 39
        -.25,  1,  -.5, // 6 40 Left
         -.25, 1, -.25, // 3 41
        -.25, -1,  -.5, //18 42
        -.25, -1, -.25, //15 43
         .25,  1,  -.5, // 7 44 Right
         .25,  1, -.25, //10 45
         .25, -1,  -.5, //19 46
         .25, -1, -.25, //22 47
        //Sides of Right
         .25,  1, -.25, //10 48 Front
          .5,  1, -.25, //11 49
         .25, -1, -.25, //22 50
          .5, -1, -.25, //23 51
          .5,  1, -.25, //11 52 Right
          .5,  1,  .25, // 9 53
          .5, -1, -.25, //23 54
          .5, -1,  .25, //21 55
         .25,  1,  .25, // 8 56 Back
          .5,  1,  .25, // 9 57
         .25, -1,  .25, //20 58
          .5, -1,  .25, //21 59
         //Sides of Back
        -.25,  1,  .25, // 2 60 Left
        -.25,  1,   .5, // 4 61
        -.25, -1,  .25, //14 62
        -.25, -1,   .5, //16 63
        -.25,  1,   .5, // 4 64 Back
         .25,  1,   .5, // 5 65
        -.25, -1,   .5, //16 66
         .25, -1,   .5, //17 67
         .25,  1,  .25, // 8 68 Right
         .25,  1,   .5, // 5 69
         .25, -1,  .25, //20 70
         .25, -1,   .5, //17 71

    ],


    textureCoordinates : [
        //Top
          0, .75, //Left
          0, .25,
        .25, .25,
        .25, .75,
        .25,   0, //Middle
        .75,   0,
        .25,   1,
        .75,   1,
        .75, .25, //Right
          1, .25,
        .75, .75,
          1, .75,
        //Bottom
          0, .75, //Left
          0, .25,
        .25, .25,
        .25, .75,
        .25,   0, //Middle
        .75,   0,
        .25,   1,
        .75,   1,
        .75, .25, //Right
          1, .25,
        .75, .75,
          1, .75,
        //Sides Front
        .75,   0, //Front
          1,   0,
        .75,   1,
          1,   1,
        .75,   0, //Left
        .25,   0,
        .75,   1,
        .25,   1,
        .25,   0, //Back
          0,   0,
        .25,   1,
          0,   1,
        //Sides Front
        .75,   0, //Front
          1,   0,
        .75,   1,
          1,   1,
        .75,   0, //Left
        .25,   0,
        .75,   1,
        .25,   1,
        .25,   0, //Right
          0,   0,
        .25,   1,
          0,   1,
        //Sides Right
        .75,   0, //Front
          1,   0,
        .75,   1,
          1,   1,
        .75,   0, //Right
        .25,   0,
        .75,   1,
        .25,   1,
        .25,   0, //Back
          0,   0,
        .25,   1,
          0,   1,
        //Sides Right
        .75,   0, //Left
          1,   0,
        .75,   1,
          1,   1,
        .75,   0, //Back
        .25,   0,
        .75,   1,
        .25,   1,
        .25,   0, //Right
          0,   0,
        .25,   1,
          0,   1,
    ],
    indices : [
        //Top
        0,  1,  2, //Left
        0,  2,  3,
        4,  5,  6, //Middle
        6,  7,  5,
        8,  9, 10, //Right
       10, 11,  9,
       //Bottom
       12, 13, 14, //Left
       12, 14, 15,
       16, 17, 18, //Middle
       18, 19, 17,
       20, 21, 22, //Right
       22, 23, 21,
       //Sides Left
       24, 25, 26, //Front
       26, 27, 25,
       28, 29, 30, //Left
       30, 31, 29,
       32, 33, 34, //Back
       34, 35, 33,
       //Sides Front
       36, 37, 38, //Front
       38, 39, 37,
       40, 41, 42, //Left
       41, 42, 43,
       44, 45, 46, //Right
       45, 46, 47,
       //Sides Right
       48, 49, 50, //Front
       49, 50, 51,
       52, 53, 54, //Right
       53, 54, 55,
       56, 57, 58, //Back
       57, 58, 59,
       //Sides Back
       60, 61, 62, //Left
       62, 63, 64,
       64, 65, 66, //Back
       65, 66, 67,
       68, 69, 70, //Right
       69, 70, 71
    ]
}