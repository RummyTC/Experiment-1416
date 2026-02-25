let wordArray = ["","welcome to Experiment 2345","when questions appear, say the answer out loud","the test starts now",
                    "what is your name","where do you live","what is your age",
                    "<i>what is the best moment in your life</i>","do you have a wife at home","Are you very sensitive to your surroundings",
                    "are you alone","<i>do you think monsters exsist</i>","tell me about your surroundings",
                    "please don't turn around","Are you afraid of darkness?",
                    "do you believe that everything is going to be fine","who is behind you",
                    "<p style = 'font-size: 20px'>Pm fvb hyl ylhkpun aopz tlzzhnl, fvb zapss ohcl aptl av lzjhwl. Wslhzl zavw aol lewlyptlua ypnoa uvd. Wslhzl, vy pa dpss il av shal. Wslhzl, kvu'a thrl tf tpzahrl.</p>",
                    "Experiment 1416 finished"
];
let title = document.getElementById("title");
let greatOver = document.getElementById("over");
function handleLevelComplete(level) {
    console.log("Finished level", level.id);
    if(wordArray[level.id])title.innerHTML = `^${wordArray[level.id]}`;
    else title.innerHTML = `^${Math.floor(Math.random() * 9)}`;
    blocks = [];
    blocksInShadow = [];
    greatOver.animate([
        {  opacity: 1 }, // Start
        { opacity: 0.25 } // End
        ], {
        duration: 250,
        iterations: 1
        }
    );
    const nextId = level.id + 1;
    LevelLoader.loadLevelById("levels.json", nextId, {
        onShadowTouch: handleLevelComplete
    }).catch(function (err) {
        console.log("No more levels or load error:", err.message);
        console.log("your life is now no longer yours");
        //BEQlIsjXR5g
        title.innerHTML = `Experiment 1416 finished.`;
    });
}

// initial load
LevelLoader.loadLevelFromJson("levels.json", 0, {
  onShadowTouch: handleLevelComplete
});

let GameloopVars = {
    sinCount: 0,
    rayOsAmount: 50,
    raySize: 750,
    raySizeDefault: 400
}
let rayRange = document.getElementById("raysize");
rayRange.value = GameloopVars.raySize;

const canvas = document.getElementById("canva");

const ctx = canvas.getContext("2d");

var scal = 5;
let BackgroundColor = "black";
const borderBuffer = 0.1;
const blockImg = document.getElementById("bl");
ctx.lineWidth = 3;
let showLine = true;
let logCount = 0;
let ifShowPG = document.getElementById("ifShowPG");
let showPoly = true;

ctx.font = "50px Arial";

if(showPoly == false)ifShowPG.value = "show Raycasting polygon";
else ifShowPG.value = "unshow Raycasting polygon";


ifShowPG.addEventListener('click', function(){
    if(showPoly == true){
        showPoly = false;
        console.log(showPoly);
        ifShowPG.value = "show Raycasting polygon";
        return;
    }
    if(showPoly == false){
        showPoly = true;
        console.log(showPoly);
        ifShowPG.value = "unshow Raycasting polygon";
        return;
    }
});
function drawLineCTX(x1,y1,x2,y2,color){
    ctx.strokeStyle = color;
    ctx.beginPath();       // 1. Start path
    ctx.moveTo(x1, y1);      // 2. Start coordinate (x, y)
    ctx.lineTo(x2, y2);  // 3. End coordinate (x, y)
    ctx.stroke();          // 4. Render the line
}
class Ray{
    w = 0;
    h = 0;

    constructor(x, y, dirx, diry){
        this.x = x;
        this.y = y;
        this.dirx = dirx;
        this.diry = diry;
        this.x1 = x;
        this.y1 = y;
    }
    isOverlap(go){
        return (this.x1 < go.x + go.w && this.x1 + this.w > go.x && this.y1 < go.y + go.h && this.y1 + this.h > go.y);
    }
    isOverlapGroup(goGroup){
        for(let v in goGroup){
            if(this.isOverlap(goGroup[v]))return v;
        }

        return -1;
    }
    isHittingWall = 0;
    cast(goGroup){
        this.x1 = this.x;
        this.y1 = this.y;
        while(this.x1 > 0 && this.y1 > 0 && this.x1 < canvas.width && this.y1 < canvas.height){
            if(this.isOverlapGroup(goGroup) != -1){

                return;
            }
            this.x1 += this.dirx;
            this.y1 += this.diry;
        }
        //this.x1 = this.x;
        //this.y1 = this.y;
    }
    render(){
        drawLineCTX(this.x,this.y,this.x1,this.y1,"blue");
        if(showLine){
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x1 - 5, this.y1 - 5, 10, 10);

        }
    }
}
class UserControl{
    moveX = 0;
    moveY = 0;
    allowBlur = false;
    BlurAmount = 2;
    rayColor = "blue";
    l1 = 5;
    l2 = 60;
    tilt = true;
    constructor(name,x,y,w,h,image,speed){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = image;
        this.speed = speed;
        this.rays = [];

    }
    raycasting(goGroup){


        for(let v of goGroup){
            let x = this.x + this.w/2;
            let y = this.y + this.h/2;
            let centerX = x;
            let centerY = y;


            let c1 = Math.max(Math.abs(v.x+v.w-centerX),Math.abs(v.y-centerY));
            this.rays.push(new Ray(x,y,(v.x+v.w-centerX)/c1,(v.y-centerY)/c1));
            this.rays.push(new Ray(x,y,(v.x+v.w - 1 -centerX)/c1,(v.y + 1-centerY)/c1));

            let c2 = Math.max(Math.abs(v.x + v.w-centerX),Math.abs(v.y+v.h-centerY));
            this.rays.push(new Ray(x,y,(v.x+v.w-centerX)/c2,(v.y+v.h-centerY)/c2));
            this.rays.push(new Ray(x,y,(v.x+v.w - 1 -centerX)/c2,(v.y+v.h - 1-centerY)/c2));

            let c3 = Math.max(Math.abs(v.x-centerX),Math.abs(v.y+v.h-centerY));
            this.rays.push(new Ray(x,y,(v.x-centerX)/c3,(v.y+v.h-centerY)/c3));
            this.rays.push(new Ray(x,y,(v.x + 1-centerX)/c3,(v.y+v.h - 1 -centerY)/c3));

            let c4 = Math.max(Math.abs(v.x-centerX),Math.abs(v.y-centerY));
            this.rays.push(new Ray(x,y,(v.x-centerX)/c4,(v.y-centerY)/c4));
            this.rays.push(new Ray(x,y,(v.x + 1 -centerX)/c4,(v.y + 1-centerY)/c4));

        }
        let x = this.x + this.w/2;
        let y = this.y + this.h/2;
        let centerX = x;
        let centerY = y;
        let LeftTopX = 0-centerX, LeftTopY = 0-centerY, RightTopX = canvas.width-centerX, RightTopY = 0-centerY,
            RightDownX = canvas.width-centerX, RightDownY = canvas.height-centerY, LeftDownX = 0-centerX, LeftDownY = canvas.height-centerY;
        let c1 = Math.max(Math.abs(LeftTopX),Math.abs(LeftTopY));
        this.rays.push(new Ray(x,y,(LeftTopX)/c1,(LeftTopY)/c1));
        let c2 = Math.max(Math.abs(RightTopX),Math.abs(RightTopY));
        this.rays.push(new Ray(x,y,(RightTopX)/c2,(RightTopY)/c2));
        let c3 = Math.max(Math.abs(LeftDownX),Math.abs(LeftDownY));
        this.rays.push(new Ray(x,y,(LeftDownX)/c3,(LeftDownY)/c3));
        let c4 = Math.max(Math.abs(RightDownX),Math.abs(RightDownY));
        this.rays.push(new Ray(x,y,(RightDownX)/c4,(RightDownY)/c4));


    }
    raycastPolygonRender(color, visFunction){
        let raysCopy = this.rays;

        raysCopy.sort(function(a,b){
            let ax = Math.abs(a.dirx);
            let ay = Math.abs(a.diry);
            let bx = Math.abs(b.dirx);
            let by = Math.abs(b.diry);
            let aPlugIn, bPlugIn;
            if(ax == 0)aPlugIn = Infinity;
            else aPlugIn = ay / ax;
            if(bx == 0)bPlugIn = Infinity;
            else bPlugIn = by / bx;
            let aAngle, bAngle;
            if(a.dirx >= 0 && a.diry <= 0)aAngle = Math.atan(aPlugIn);
            if(a.dirx <= 0 && a.diry <= 0)aAngle = Math.PI - Math.atan(aPlugIn);
            if(a.dirx <= 0 && a.diry >= 0)aAngle = Math.atan(aPlugIn) + Math.PI;
            if(a.dirx >= 0 && a.diry >= 0)aAngle = 2 * Math.PI - Math.atan(aPlugIn);

            if(b.dirx >= 0 && b.diry <= 0)bAngle = Math.atan(bPlugIn);
            if(b.dirx <= 0 && b.diry <= 0)bAngle = Math.PI - Math.atan(bPlugIn);
            if(b.dirx <= 0 && b.diry >= 0)bAngle = Math.atan(bPlugIn) + Math.PI;
            if(b.dirx >= 0 && b.diry >= 0)bAngle = 2 * Math.PI - Math.atan(bPlugIn);

            if(aAngle > bAngle)return 1;
            else return -1;
        });
        ctx.fillStyle = color;
        ctx.strokeStyle = "black";
        let startL = 0;
        ctx.beginPath();
        for(let v of raysCopy){
            if(startL == 0)ctx.moveTo(v.x1, v.y1);
            else ctx.lineTo(v.x1, v.y1);

            startL++;

            //ctx.fillText(startL, v.x1 - 50, v.y1 - 50);
            //console.log(v.dirx + ":" + v.disry);

        }
        if(raysCopy.length > 0)ctx.lineTo(raysCopy[0].x1,raysCopy[0].y1);
        //console.log(startL);
        ctx.closePath();
        ctx.stroke();
        if(showPoly){
            ctx.save();
            ctx.clip();
            ctx.fillRect(0,0,canvas.width,canvas.height);
            visFunction(this);

            ctx.restore();
        }

    }
    calculatePos(){
        for(let v of this.rays){
            v.x = this.x + this.w/2;
            v.y = this.y + this.h/2 ;
        }
        this.x += this.moveX;
        this.y += this.moveY;
    }
    render() {
        if(this.allowBlur){
            ctx.filter = `blur(${this.BlurAmount}px)`;
        }
        ctx.fillStyle = this.image;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        //console.log("rendered");
        if(this.allowBlur){
            ctx.filter = 'blur(0px)';
        }
    }
    control = {
        move: (event) => {
            let key = event.which;
            if(key == 87 || key == 38){ //w
                this.moveY = -1 * scal;
                if(this.tilt){
                    canvas.style.transformOrigin = "center top";
                    canvas.style.transform = `perspective(1000px) rotateX(2deg)`;
                }
            }
            if(key == 83 || key == 40){ //s
                this.moveY = 1 * scal;
                if(this.tilt){
                    canvas.style.transformOrigin = "center bottom";
                    canvas.style.transform = `perspective(1000px) rotateX(-2deg)`;
                }
            }
            if(key == 65 || key == 37 ){ //a
                this.moveX = -1 * scal;
                if(this.tilt){
                    canvas.style.transformOrigin = "left center";
                    canvas.style.transform = `perspective(1000px) rotateY(-2deg)`;
                }
            }
            if(key == 68 || key == 39){ //d
                if(this.tilt){
                    canvas.style.transformOrigin = "right center";
                    canvas.style.transform = `perspective(1000px) rotateY(2deg)`;
                }
                this.moveX = 1 * scal;
            }
            //console.log(this.name);
        },
        stop: () => {
            this.moveX = 0;
            this.moveY = 0;
            //console.log(this.name);
            if(this.tilt){
                    canvas.style.transformOrigin = "center";
                    canvas.style.transform = `perspective(1000px) rotateY(0deg)`;
                }
        }

    }
    isTouch(go){
        return (this.x <= go.x + go.w && this.x + this.w >= go.x && this.y <= go.y + go.h && this.y + this.h >= go.y);
    }
    isOverlap(go){
        return (this.x < go.x + go.w && this.x + this.w > go.x && this.y < go.y + go.h && this.y + this.h > go.y);
    }
    isTouchGroup(goGroup){

        for(let v in goGroup){

            if(this.isTouch(goGroup[v]))return v;
        }
        return false;
    }
    isOverlapGroup(goGroup){
        for(let v in goGroup){
            if(this.isOverlap(goGroup[v]))return true;
        }
        return false;
    }
    calculateCollision(goGroup){

        if(this.isOverlapGroup(goGroup)){

            this.x -= this.moveX;
            this.y -= this.moveY;
        }
        if(this.x < 0 + borderBuffer || this.x + this.w > canvas.width - borderBuffer)this.x -= this.moveX;
        if(this.y < 0 + borderBuffer  || this.y + this.h> canvas.height - borderBuffer )this.y -= this.moveY;

    }
}
class Boundary{
    constructor(Ax,Ay,Bx,By,color){
        this.ax = Ax;
        this.ay = Ay;
        this.bx = Bx;
        this.by = By;
        this.color = color;
    }
}
class Object{
    function;
    moveX = 0;
    moveY = 0;
    l1 = 5;
    l2 = 100;
    showBorder = true;
    defaultBorderColor = "white";
    allowBlur = false;
    BlurAmount = 2;
    constructor(name,x,y,w,h,image,speed){
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.image = image;
        this.speed = speed;
        this.bounds = [new Boundary(x,y,x+w,y,this.defaultBorderColor), new Boundary(x+w,y,x+w,y+h,this.defaultBorderColor), new Boundary(x,y+h,x+w,y+h,this.defaultBorderColor), new Boundary(x,y,x,y+h,this.defaultBorderColor)];
        console.log(this.bounds);
    }
    changeBorderColor(color){
        this.defaultBorderColor = color;
        for(let v of this.bounds){
            v.color = color;
        }
    }
    render() {
        if(this.showBorder){
            for(let v in this.bounds){
                drawLineCTX(this.bounds[v].ax,this.bounds[v].ay,this.bounds[v].bx,this.bounds[v].by,this.bounds[v].color);
            }
        }
        if(this.allowBlur){
            ctx.filter = `blur(${this.BlurAmount}px)`;
        }
        ctx.fillStyle = this.image;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        if(this.allowBlur){
            ctx.filter = 'blur(0px)';
        }
    }
    isTouch(go){
        return (this.x <= go.x + go.w && this.x + this.w >= go.x && this.y <= go.y + go.h && this.y + this.h >= go.y);
    }
    isOverlap(go){
        return (this.x < go.x + go.w && this.x + this.w > go.x && this.y < go.y + go.h && this.y + this.h > go.y);
    }
    isTouchGroup(goGroup){
        for(let v in goGroup){

            if(this.isTouch(goGroup[v]))return true;
        }
        return false;
    }
    isOverlapGroup(goGroup){
        for(let v in goGroup){
            if(this.isOverlap(goGroup[v]))return true;
        }
        return false;
    }
}

let player = new UserControl("playerIsTheGod",20,20,20,20,"red",10);
player.allowBlur = true;
player.allowGlow = true;
player.rayColor = "blue";
let blocks = [];
let blocksInShadow = [];

function addBlock(name,x,y,w,h,color,speed){
    let a = new Object(name,x,y,w,h,color,speed);
    a.showBorder = true;
    a.allowBlur = true;
    a.changeBorderColor("white");
    blocks.push(a);
}
function addBlockS(name,x,y,w,h,color,speed, func){
    let a = new Object(name,x,y,w,h,color,speed);
    a.function = func;
    a.showBorder = false;
    a.allowBlur = true;
    blocksInShadow.push(a);
}
//addBlockS("block1",320,400,20,10,"rgba(239, 180, 5, 1)",0);
//addBlockS("block1",350,400,10,30,"rgba(239, 180, 5, 1)",0);
/*addBlock("block1",100,100,70,70,"rgb(0,0,0)",0);
addBlock("block1",700,300,60,300,"rgb(0,0,0)",0);
addBlock("block1",100,600,300,30,"rgb(0,0,0)",0);
addBlock("block1",40,300,180,150,"rgb(0,0,0)",0);
addBlock("block1",450,300,200,200,"rgb(0,0,0)",0);
addBlock("block1",400,100,240,40,"rgb(0,0,0)",0);
addBlock("block1",300,350,60,60,"rgb(0,0,0)",0);
addBlockS("blockS",750,750,20,20,"yellow",0, function(){
    console.log("yes");
}); */
function siteRender(go){
    //ctx.drawImage(blockImg, 0, 0);
    for(let v in blocksInShadow){
        //console.log(v);
        blocksInShadow[v].render();
    }

    let grd;
    grd = ctx.createRadialGradient(go.x + go.w/2, go.y + go.h/2, go.l1, go.x + go.w/2, go.y + go.h/2, go.l2);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(0.6, "rgba(0,0,0,1)");
    grd.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

function genColorForRealism(x,y,color, l1, l2, go){
    go.l1 = l1;
    go.l2 = l2;
    let grd;
    grd = ctx.createRadialGradient(x, y, l1, x, y, l2);
    grd.addColorStop(0, color);
    grd.addColorStop(1, "transparent");
    return grd;
}




function gameLoop(){
    //drawNoise(canvas2,ctx2);
    //resize(canvas2,ctx2);
    GameloopVars.raySize = rayRange.value;
    player.raycasting(blocks);
    //console.log(player.x + " : " + player.y)
    player.calculatePos();
    player.calculateCollision(blocks);
    let collider = player.isTouchGroup(blocksInShadow);
    if(collider){
        blocksInShadow[collider].function();
    }
    let raycastBackground = genColorForRealism(player.x + player.w/2,player.y + player.h/2,player.rayColor,5,GameloopVars.raySize,player);
    ctx.fillStyle = BackgroundColor; // Set your color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let v in player.rays){
        player.rays[v].cast(blocks);
        if(!showPoly)player.rays[v].render();
    }
    player.raycastPolygonRender(raycastBackground,siteRender);
    for(let v in blocks){
        //console.log(v);
        blocks[v].render();
    }
    player.render();
    player.rays = [];
    //GameloopVars.raySize = GameloopVars.raySizeDefault + Math.sin(GameloopVars.sinCount * (Math.PI/180)) * GameloopVars.rayOsAmount;
    //GameloopVars.sinCount += 1;
}
let inter = setInterval(gameLoop,1000/60);

