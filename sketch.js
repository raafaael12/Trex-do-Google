var jumpSound
var dieSound
var checkpointSound

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, groundImage, invisibleGround;
var cloud, cloudImage
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6
var score;
var obstacleGroup;
var cloudGroup;
var gameOver, restart, gameOverimg, restartimg;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage('cloud.png');
  obstacle1 = loadImage('obstacle1.png');
  obstacle2 = loadImage('obstacle2.png');
  obstacle3 = loadImage('obstacle3.png');
  obstacle4 = loadImage('obstacle4.png');
  obstacle5 = loadImage('obstacle5.png');
  obstacle6 = loadImage('obstacle6.png');
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  trex_collided = loadImage("trex_collided.png");
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
}
function setup() 
{
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50,height-50,20,50)
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  trex.x = 50;

  ground = createSprite(width/2,height - 20,width,125)
  ground.addImage("ground",groundImage)
  ground.x = ground.width/2;

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverimg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(width/2,height/2);
  restart.addImage(restartimg);
  restart.scale = 0.5;
  restart.visible = false;

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  var rand = Math.round(random(1,6));
  console.log(rand)

  obstacleGroup = new Group();
  cloudGroup = new Group();

  score = 0;
}

function draw() 
{
background(150);
if(gameState === PLAY){
  ground.velocityX = -(4 + score/100);
  if(score > 0 && score % 100 === 0){
    checkpointSound.play();
  }
  fill('white');
textSize(20)
text("Score :" + score, width-200,50)
score = score + Math.round(frameCount/60);
  if(touches.length > 0 || keyDown("space") && trex.y >=height - 60){
    jumpSound.play();
    trex.velocityY = -10;
    touches = [];
  }
    trex.velocityY = trex.velocityY + 0.8;
    
if(ground.x < 0){
  ground.x = ground.width/2;
}
spawnClouds();

spawnObstacles();
if(obstacleGroup.isTouching(trex)){
  gameState = END;
  dieSound.play();

}
}
else if(gameState === END){
  ground.velocityX = 0;
  obstacleGroup.setVelocityXEach(0);
  cloudGroup.setVelocityXEach(0);
  obstacleGroup.setLifetimeEach(-1);
  cloudGroup.setLifetimeEach(-1);
  trex.changeAnimation("collided",trex_collided);
  gameOver.visible = true;
  restart.visible = true;
  if(touches.length>0 || keyDown('SPACE')){
    reset();
    touches = [];
  }
}

trex.collide(ground)
drawSprites();
}
function spawnObstacles(){
if(frameCount % 60 == 0){
  var obstacle = createSprite(width-10,height-30,10,45)
  obstacle.velocityX = -(6 + 3*score/100);
  obstacle.scale = 0.7;
  var ran = Math.round(random(1,6));

  switch(ran){
    case 1:obstacle.addImage(obstacle1);
      break;
    case 2:obstacle.addImage(obstacle2);
      break;
    case 3:obstacle.addImage(obstacle3);
      break;
    case 4:obstacle.addImage(obstacle4);
      break;
    case 5:obstacle.addImage(obstacle5);
      break;
    case 6:obstacle.addImage(obstacle6);
      break;
    default:break;
  }
  obstacleGroup.add(obstacle);
  obstacle.lifetime = 300;
}
}
function spawnClouds(){
  if(frameCount % 50 == 0){
  cloud = createSprite(width+20,height-300,40,10);
  cloud.addImage(cloudImage);
  cloud.y = Math.round(random(20,300));
  cloud.velocityX = -3;

  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
  cloudGroup.add(cloud)
  cloud.lifetime = 300;
  cloud.scale = 1;
  }
}

function reset(){
  gameState = PLAY;
  score = 0;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  gameOver.visible = false;
  restart.visible = false;
}
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}