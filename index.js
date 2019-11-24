var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = document.getElementById("img-id");
var GoJul = document.getElementById("img-jul");


var particlesOnScreen = 200;
var fallingSnow = [];
var NotFallingSnow = [];
var w,h;

w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

function clientResize(ev){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};

window.addEventListener("resize", clientResize);

// stuff for the snow
function random(min, max) {
    return min + Math.random() * (max - min + 1);
};



class Snowflake{
    constructor(y = true){
        if(y){
            this.y = Math.random() * h;  
        } else this.y = y
        
        this.x = Math.random() * w;
        this.dx = random(-11, 11);
        this.dy = random(5,10);
        this.radius = random(0.5, 4.2);
        this.opacity = Math.random();
        this.falling = true;
    }  
    NextPosY(){
        if(this.y + this.dy >= h-this.radius){
            return true;
        } else {
            return false;
        }
    };
    update(){
        // Check if hit the ground
        if (this.NextPosY() || !this.falling){
            this.falling = false;
            //this.y = h-2*this.radius;
            this.opacity -= 0.005;
        }
        // Only move falling snow
        if (this.falling){
            this.x += this.dx;
            this.y += this.dy;
            // Check if snowflake leaves the screen
            if (this.x > w){
                this.x = 0;
            } else if (this.x < 0){
                this.x = w;
            };
        };
    };
    draw(){
        var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);

        grad.addColorStop(0, "rgba(255, 255, 255," + this.opacity + ")");
        grad.addColorStop(.8, "rgba(210, 236, 242," + this.opacity + ")");
        grad.addColorStop(1,"rgba(237, 247, 249," + this.opacity + ")");

        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fillStyle = grad;   
        ctx.fill();
    };
};

function drawSnowFlakes(){
    for(var i = 0; i < fallingSnow.length; i++){    
        fallingSnow[i].draw();
    };
    for(var i = 0; i < NotFallingSnow.length; i++){    
        NotFallingSnow[i].draw();
    };
};

function UpdateSnowFlakes(){
    for (var i = fallingSnow.length-1; i >= 0; i--) {
        fallingSnow[i].update();
        // pop the sucker if not falling and add to not falling
        if (!fallingSnow[i].falling){
            NotFallingSnow.push(fallingSnow[i]);
            fallingSnow.splice(i,1);
            fallingSnow.push(new Snowflake(0))
        };
    };
    for (var i = 0; i < NotFallingSnow.length; i++){
        NotFallingSnow[i].update();
        // pop the sucker if not showing
        if (NotFallingSnow[i].opacity<0){
            NotFallingSnow.splice(i,1);
        };
    };  
};


function updateSnowFall  () {
    ctx.clearRect(0, 0, w, h); // Clear the screen
    ctx.drawImage(background,0,0);

    ctx.drawImage(GoJul,(w-GoJul.width)/2,h-GoJul.height);
    drawSnowFlakes();
    UpdateSnowFlakes();
};

// Initialize snow fall 
for(var i = 0; i < particlesOnScreen; i++){
    fallingSnow.push(new Snowflake)
};
setInterval(updateSnowFall,45);


