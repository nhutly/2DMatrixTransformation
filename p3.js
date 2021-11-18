//Nhut Ly - CS 559 - Fall 2021

function setup() {

    var canvas = document.getElementById('myCanvas');

    var r1stFly = 100; //radius that the original fly will fly around
    var r2ndFly = 8; //radius that the second fly will fly around
    var r3rdFly = 60;
    var rWing = 8; //radius for the flys wing
    var rHand = 20;
    var angle = 0; //starting angle for the fly
    var x1 = 0;
    var y1 = 0;
    var scale = 1;
    var handAngle1 = Math.PI / 3;
    var handAngle2 = 2 * Math.PI / 3;
    var reachMin = true;
    var ang = .1;
    var size = 100;
    var yAir1 = 400;

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;

        function moveToTx(loc, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.moveTo(res[0], res[1]);
        }

        function lineToTx(loc, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);
            context.lineTo(res[0], res[1]);
        }

        function arcTx(loc, r, Tx) {
            var res = vec2.create();
            vec2.transformMat3(res, loc, Tx);

            context.arc(x = res[0], y = res[1], radius = r * scale, sAngle = 0, eAngle = 2 * Math.PI);
        }

        // draw axes to better understanding the current coordinates
        function drawAxes(color, Tx) {
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 3;
            // Axes
            moveToTx([120, 0], Tx);
            lineToTx([0, 0], Tx);
            lineToTx([0, 120], Tx);
            // Arrowheads
            moveToTx([110, 5], Tx);
            lineToTx([120, 0], Tx);
            lineToTx([110, -5], Tx);
            moveToTx([5, 110], Tx);
            lineToTx([0, 120], Tx);
            lineToTx([-5, 110], Tx);
            // X-label
            moveToTx([130, 0], Tx);
            lineToTx([140, 10], Tx);
            moveToTx([130, 10], Tx);
            lineToTx([140, 0], Tx);
            // Y-label
            moveToTx([0, 130], Tx);
            lineToTx([5, 135], Tx);
            lineToTx([10, 130], Tx);
            moveToTx([5, 135], Tx);
            lineToTx([5, 142], Tx);
            context.stroke();
            context.lineWidth = 1;
        }

        // draw a line with given parameters
        function drawLine(startX, startY, endX, endY, color, Tx) {
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.beginPath();
            moveToTx([startX, startY], Tx);
            lineToTx([endX, endY], Tx);
            context.closePath();
            context.stroke();
            context.lineWidth = 1;
        }

        // draw a circle with given parameters
        function drawCircle(colorFilled, colorStroke, r, Tx) {
            context.beginPath();
            context.fillStyle = colorFilled;
            context.strokeStyle = colorStroke;
            arcTx([x = 0, y = 0], radius = r, Tx);
            context.fill();
            context.stroke();
        }

        // draw a bug given its size (radius)
        function drawBug(radius, Tx) {
            //calculate the center of the bugs body
            x1 = radius * Math.cos(angle);
            y1 = radius * Math.sin(angle);
            angle = angle + .02;
            var TBug_to_Center = mat3.create();
            mat3.fromTranslation(TBug_to_Center, [x1, y1]);
            TBug_to_Canvas = mat3.create();
            mat3.multiply(TBug_to_Canvas, Tx, TBug_to_Center);

            drawCircle("black", "black", 10, TBug_to_Canvas);
            //translate to the center of the bugs body
            //this will make all the parts of the bug move relatively to
            //the body of the bug that we just draw

            //draw hand 1
            var xh11 = rHand * Math.cos(angle + handAngle1);
            var yh11 = rHand * Math.sin(angle + handAngle1);
            drawLine(0, 0, xh11, yh11, "red", TBug_to_Canvas);

            //draw hand 2 that is opposite from hand 1
            var xh12 = rHand * Math.cos(angle + handAngle1 + Math.PI);
            var yh12 = rHand * Math.sin(angle + handAngle1 + Math.PI);
            drawLine(0, 0, xh12, yh12, "green", TBug_to_Canvas);

            //draw hand 3
            var xh13 = rHand * Math.cos(angle + handAngle2);
            var yh13 = rHand * Math.sin(angle + handAngle2);
            drawLine(0, 0, xh13, yh13, "blue", TBug_to_Canvas);

            //draw hand 4 that is opposite from hand 3
            var xh14 = rHand * Math.cos(angle + handAngle2 + Math.PI);
            var yh14 = rHand * Math.sin(angle + handAngle2 + Math.PI);
            drawLine(0, 0, xh14, yh14, "orange", TBug_to_Canvas);

            //to make the bug moving hierarchically, its 4 hands (4 children)
            //keep rotating from 60 degrees to 120 degrees and back.
            //all 4 hands move relative to the bug
            //espcially hand 2 also moves relatively to hand 1
            //hand 4 also moves relatively to hand 3
            if (reachMin == true) {
                handAngle1 = handAngle1 + .05;
                handAngle2 = handAngle2 - .05;
            } else {
                handAngle1 = handAngle1 - .05;
                handAngle2 = handAngle2 + .05;
            }

            if (handAngle1 <= Math.PI / 3) {
                reachMin = true;
            } else if (handAngle1 >= 2 * Math.PI / 3) {
                reachMin = false;
            }

            //draw wing 1
            var xw11 = rWing * Math.cos(angle);
            var yw11 = rWing * Math.sin(angle);
            var T1stWing_to_Bug = mat3.create();
            mat3.fromTranslation(T1stWing_to_Bug, [xw11, yw11]);
            var T1stWing_to_Center = mat3.create();
            mat3.multiply(T1stWing_to_Center, TBug_to_Canvas, T1stWing_to_Bug);
            drawCircle("gray", "black", rWing, T1stWing_to_Center);

            //draw wing 2
            var xw12 = rWing * Math.cos(angle + Math.PI);
            var yw12 = rWing * Math.sin(angle + Math.PI);
            var T2ndWing_to_Bug = mat3.create();
            mat3.fromTranslation(T2ndWing_to_Bug, [xw12, yw12]);
            var T2ndWing_to_Center = mat3.create();
            mat3.multiply(T2ndWing_to_Center, TBug_to_Canvas, T2ndWing_to_Bug);
            drawCircle("gray", "black", rWing, T2ndWing_to_Center);
            //DrawAxes("red");
        }

        // constructing the line that changes its length based the variable time t
        var Rstart = 50.0;
        var Rslope = 30.0;
        var Rangle;
        var Cspiral = function(t) {
            Rangle = ang * Math.PI * t;
            var R = Rslope * t + Rstart;
            var x = R * Math.cos(Rangle);
            var y = R * Math.sin(Rangle);

            return [x, y];
        }


        function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {

            context.strokeStyle = color;
            context.beginPath();
            moveToTx(C(t_begin), Tx);
            for (var i = 1; i <= intervals; i++) {
                var t = ((intervals - i) / intervals) * t_begin + (i / intervals) * t_end;
                lineToTx(C(t), Tx);

            }

            context.stroke();
        }

        /********** Start drawing **************/

        // fill background
        context.fillStyle = "lightyellow";
        context.rect(0, 0, 500, 500);
        context.fill();

        // draw fan
        Rstart = 50.0;
        Rslope = 30.0;
        var Torange_to_canvas = mat3.create();
        mat3.fromTranslation(Torange_to_canvas, [250, 200]);
        mat3.rotate(Torange_to_canvas, Torange_to_canvas, Math.PI);
        //drawAxes("orange", Torange_to_canvas);
        drawTrajectory(0.0, 2.0, 1000, Cspiral, Torange_to_canvas, "lightblue");

        // drawing first layer of cake
        var T1stCircle_to_Canvas = mat3.create();
        mat3.fromTranslation(T1stCircle_to_Canvas, [250, 395]);
        drawCircle("brown", "black", radius = 20, T1stCircle_to_Canvas);

        // drawing second layer of cake that is relatively positioned to the first layer
        var T2ndCircle_to_1stCircle = mat3.create();
        mat3.fromTranslation(T2ndCircle_to_1stCircle, [0, 50]);
        var T2ndCircle_to_Canvas = mat3.create();
        mat3.multiply(T2ndCircle_to_Canvas, T1stCircle_to_Canvas, T2ndCircle_to_1stCircle);
        drawCircle("brown", "black", radius = 50, T2ndCircle_to_Canvas);

        // drawing third layer of cake that is relatively position to the first to layers
        var T3rdCircle_to_2ndCircle = mat3.create();
        mat3.fromTranslation(T3rdCircle_to_2ndCircle, [0, 80]);
        var T3rdCircle_to_Canvas = mat3.create();
        mat3.multiply(T3rdCircle_to_Canvas, T2ndCircle_to_Canvas, T3rdCircle_to_2ndCircle);
        drawCircle("brown", "black", radius = 100, T3rdCircle_to_Canvas);

        // draw bug
        var T1stFlyCenter_to_Canvas = mat3.create();
        mat3.fromTranslation(T1stFlyCenter_to_Canvas, [250, 250]);
        drawBug(r1stFly, T1stFlyCenter_to_Canvas);

        //making the second bug move relatively to the first bug
        var T2ndFlyCenter_to_1stFlyCenter = mat3.create();
        mat3.fromTranslation(T2ndFlyCenter_to_1stFlyCenter, [y1, x1]);
        mat3.rotate(T2ndFlyCenter_to_1stFlyCenter, T2ndFlyCenter_to_1stFlyCenter, Math.PI / 4);
        var T2ndFlyCenter_to_Canvas = mat3.create();
        mat3.multiply(T2ndFlyCenter_to_Canvas, TBug_to_Canvas, T2ndFlyCenter_to_1stFlyCenter);
        drawBug(r2ndFly, T2ndFlyCenter_to_Canvas);

        //making the third bug move relatively to the first two bugs
        var T3rdFlyCenter_to_2ndFlyCenter = mat3.create();
        mat3.rotate(T3rdFlyCenter_to_2ndFlyCenter, T3rdFlyCenter_to_2ndFlyCenter, Math.PI);
        scale = 1.5;
        mat3.scale(T3rdFlyCenter_to_2ndFlyCenter, T3rdFlyCenter_to_2ndFlyCenter, [scale, scale]);

        var T3rdFlyCenter_to_Canvas = mat3.create();
        mat3.multiply(T3rdFlyCenter_to_Canvas, T2ndFlyCenter_to_Canvas, T3rdFlyCenter_to_2ndFlyCenter);

        drawBug(r3rdFly, T3rdFlyCenter_to_Canvas);
        scale = 1;

        // drawAxes("black", mat3.create());

        ang = ang + .1;
        size = (size + 1) % 500;
        Rstart = 5.0;
        Rslope = 3.0;
        yAir1 = (yAir1 - 2);
        if (yAir1 == -60) {
            yAir1 = 600;
        }
        //draw first bacteria
        var Tblue_to_canvas = mat3.create();
        mat3.fromTranslation(Tblue_to_canvas, [100, yAir1]);
        mat3.rotate(Tblue_to_canvas, Tblue_to_canvas, Math.PI + ang); // Flip the Y-axis
        // drawAxes("blue", Tblue_to_canvas);
        drawTrajectory(0.0, 1.5, 100, Cspiral, Tblue_to_canvas, "maroon");

        //draw second bacteria
        var Tgreen_to_canvas = mat3.create();
        mat3.fromTranslation(Tgreen_to_canvas, [400, yAir1]);
        mat3.rotate(Tgreen_to_canvas, Tgreen_to_canvas, Math.PI + ang);
        // drawAxes("green", Tgreen_to_canvas);
        drawTrajectory(0.0, 1.5, 100, Cspiral, Tgreen_to_canvas, "maroon");

        //draw third bacteria
        var Tred_to_canvas = mat3.create();
        mat3.fromTranslation(Tred_to_canvas, [200, yAir1 - 50]);
        mat3.rotate(Tred_to_canvas, Tred_to_canvas, Math.PI + ang);
        // drawAxes("green", Tgreen_to_canvas);
        drawTrajectory(0.0, 1.5, 100, Cspiral, Tred_to_canvas, "maroon");

        //draw fourth bacteria
        var Tyellow_to_canvas = mat3.create();
        mat3.fromTranslation(Tyellow_to_canvas, [300, yAir1 - 50]);
        mat3.rotate(Tyellow_to_canvas, Tyellow_to_canvas, Math.PI + ang);
        // drawAxes("green", Tgreen_to_canvas);
        drawTrajectory(0.0, 1.5, 100, Cspiral, Tyellow_to_canvas, "maroon");

        //draw sun
        Rstart = 25.0;
        Rslope = 15.0;
        var Tsun_to_canvas = mat3.create();
        mat3.fromTranslation(Tsun_to_canvas, [430, 55]);
        drawCircle("yellow", "orange", radius = 30, Tsun_to_canvas);
        drawTrajectory(0.0, 1.5, 100, Cspiral, Tsun_to_canvas, "yellow");

        window.requestAnimationFrame(draw);
    }
    draw();
}
window.onload = setup;