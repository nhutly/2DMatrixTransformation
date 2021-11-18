//Nhut Ly - CS 559 - Fall 2021
My idea is about drawing three flies. The first fly will be the center for other
flies to move relatively to it. To meet the hierarchical requirement (have parts that move relative to each other), each flies will have 4 hands that will spin relatively to each other and to the bugs they belong to. 

I used fromTranslation(),rotate() from the glMatrix library to meet the requirements of the assignment.

I used scale() to make the third bug significantly, relatively bigger than the first to bugs.

I also added in parametric curves the represents the sun, wind, and bacteria, and combined them with the linear transformation functions form the glMatrix library.
