function angleTo(a,b){
    "use strict";
    var pi = Math.PI;
    return fixAngle((a.y>b.y?pi:0)+((a.y==b.y)?(b.x>a.x?pi/2:pi*3/2):Math.atan((a.x-b.x)/(a.y-b.y))));
}

function fixAngle(a){
    "use strict";
    var pi2 = Math.PI*2;
    while(a < 0) {
        a +=pi2;
    }
    while(a > pi2) {
        a-=pi2;
    }
    return a;
}
function now(){
    "use strict";
    return (new window.Date()).getTime();
}

function randomWhole(max) {
    "use strict";
    return Math.floor(Math.random() * max);
}