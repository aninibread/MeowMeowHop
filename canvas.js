var kitty;
var cucumber = [];
var myScore;
var highScore;
localStorage.setItem("highscore",0);
var gameOver;
var restartBtn;
var storedHighScore;
var meow;
var bigStars =[];
var watermelon = [];

function startGame() 
{
    kitty = new component(52,42,"cat.png", 70, 300-30,"image");
    myScore = new component("16px", "Monospace", "black", 800, 40, "text");
    bigStars.push (new component (900,150,"bigStars.png",-100,0,"image"));
    highScore = new component("16px", "Monospace", "black", 700, 40, "text");
    meow = new sound("meow.mp3");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 900;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.frameNo2 = 0;
        this.scoreNum = 0;
        this.interval = setInterval(updateGameArea, 3.7);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear: function() {
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        if(myGameArea.key && myGameArea.key == 32){
            location = location;
            clearInterval(this.interval);
        }
    }
}

// kitty, score, cucumber
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
//big star, watermelon
function everyinterval2(n) {
    if ((myGameArea.frameNo2 / n) % 1 == 0) {return true;}
    return false;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

function component(width, height, color, x, y, type){
    this.type = type;
    if(type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (type == "image"){
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.y += this.gravitySpeed;
        this.topBottom();
    }
    this.topBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
            this.ableJump = false;
        }
        if (this.y < 150) {
            this.y = 150;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width - 3);
        var mytop = this.y;
        var mybottom = this.y + (this.height - 3);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
        }
        return crash;
    }
}

function jumping () {
    kitty.gravitySpeed = -3.3;
}

//cucumber
min = 125;
max = 500;
gap = ranGap();
function ranGap() {
    return Math.floor( min + Math.random() * ( max - min + 1 ));
}

function isEven(n) {
    return n % 2 == 0;
}

function checkHighScore (n) {
    if (n > window.localStorage.getItem("highscore")) {
        window.localStorage.setItem("highscore", JSON.stringify(n));
      }
}

function updateGameArea() {
    var x, y;

    // cumcumber
    for (i = 0; i < cucumber.length; i += 1) {
        if (kitty.crashWith(cucumber[i])) {
            
            checkHighScore(myGameArea.scoreNum);
            highScore.text = "HI: " + parseInt(window.localStorage.getItem("highscore"));
            highScore.update();

            meow.play();
            gameOver = new component("35px", "Monospace", "black", 358, 120, "text");
            restartBtn = new component(70,70,"button.png", 408, 140,"image");
            gameOver.text = "GAME OVER";
            kitty.image.src = "catDead.png";
            kitty.update();
            gameOver.update();
            restartBtn.update();
            myGameArea.stop();
            return;
            
        }
    }
    
    myGameArea.frameNo2 += 1;
    myGameArea.frameNo += 1;
    myGameArea.scoreNum += 0.03;
    myGameArea.clear();

    if (isEven(myGameArea.frameNo)){
        kitty.image.src = "cat2.png";
    } else {
        kitty.image.src = "cat.png";
    }

    //cucumber
    if (everyinterval(gap)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 50;
        cucumber.push(new component(20, 50, "banana.png", x, y,"image"));
        gap = ranGap();
        myGameArea.frameNo = 0;
        
    }
    for (i = 0; i < cucumber.length; i += 1) {
        cucumber[i].x += -1;
        cucumber[i].update();
    }
    
    //bigStars
    if (myGameArea.frameNo2 == 1 || everyinterval2(900)) {
        x = 900;
        y = 0;
        bigStars.push (new component (900,150,"bigStars.png",x,y,"image"));
    }
    for (j = 0; j < bigStars.length; j += 1) {
        bigStars[j].x += -1;
        bigStars[j].update();
    }

    //watermelon
    if (everyinterval(3)) {
        x = 3;
        y = kitty.y;
        watermelon.push (new component (3,15, "watermelon.png", kitty.x +20, kitty.y + 13, "image"));
    }
    for (g = 0; g < watermelon.length; g += 1) {
        watermelon[g].x += -1;
        watermelon[g].update();
    }

    //score
    myScore.text = "SCORE: " + myGameArea.scoreNum.toFixed(0);
    myScore.update();

    //highscore
    highScore.text = "HI: " + parseInt(window.localStorage.getItem("highscore"));
    highScore.update();

    //space upwards
    if (kitty.ableJump == false && myGameArea.key && myGameArea.key == 32) { 
        jumping();
        kitty.ableJump = true;
    }
    //upkey upwards
    if (kitty.ableJump == false && myGameArea.key && myGameArea.key == 38) { 
        jumping();
        kitty.ableJump = true;
    }
   //downkey downwards
    if (myGameArea.key && myGameArea.key == 40) { 
        kitty.gravitySpeed = 2.8;
    }

    //cat tail down
    if(myGameArea.key) {
        kitty.image.src = "catUp.png";
    }

    kitty.newPos();
    kitty.update();
}