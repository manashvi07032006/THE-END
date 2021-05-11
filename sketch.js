var trex, trex_running, trex_collided, trex_standing;
var checkSound, dieSound, jumpSound, minusSound;
var PLAY =1;
var END = 0;
var gameState;
var score = 0;
var lives = 3;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, restart, gameOverImg, restartImg, backgrounImg;
var grounddImage;
function preload(){
  trex_standing = loadImage("trex1.png");
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  grounddImage = loadImage("groundd.png");
  cloudImage = loadImage("cloud.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  checkSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  minusSound = loadSound("minus.mp3");
  backgroundImg = loadImage("bg.png")
}

function setup(){
  createCanvas(displayWidth - (displayWidth/5), displayHeight/2);
  
  trex = createSprite(displayWidth/16, (displayHeight/2) - 90,20,50);
  trex.addAnimation("standing", trex_standing);
  trex.scale = 0.5;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  ground = createSprite(trex.position.x,(displayHeight/2) ,10,20);
  ground.addImage("ground",grounddImage);

  ground.depth = trex.depth;
  trex.depth += 1;

  invisibleGround = createSprite(trex.x ,(displayHeight/2)-60,displayWidth/2,20);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(displayWidth/2 - 100 ,displayHeight/6);
  gameOver.addImage("over", gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  
  restart = createSprite(displayWidth/2-100 ,displayHeight/4);
  restart.addImage("rego", restartImg);
  restart.visible = false;
  restart.scale = 0.8;

  score = 0;
  }

function draw(){
  background(backgroundImg);
   
  if(gameState != PLAY && gameState != END){
    fill("red");
    textSize(22);
    text("Press space to start", displayWidth/3, 50);

    if(keyDown("space")){
      gameState = PLAY;
      trex.changeAnimation("running", trex_running);    
    }
  }

  if(gameState === PLAY){
    ground.velocityX = -(2 + Math.round(score/100));

    if(keyDown("space") && trex.y>=displayHeight/6) {
      trex.velocityY = -10;
    }

    if(keyWentDown("space")){
      jumpSound.play();
    }
     
    if(ground.x<0){
      ground.x = trex.position.x;
    }
    
      trex.velocityY = trex.velocityY + 0.8;

      camera.position.x = trex.x + 500;

      score = score + Math.round(getFrameRate()/60);

      spawnClouds();
      spawnObstacles();

      if (score>0 && score%100 === 0){
        checkSound.play();
      }

      if(obstaclesGroup.isTouching(trex)){
        obstaclesGroup.destroyEach();
        lives = lives - 1;
        minusSound.play();
      }  

      if(lives === 0){
        dieSound.play();
        gameState = END;
      }
  }
  if(gameState === END){
    trex.velocityY = 0;
    trex.x = displayWidth/16;
    trex.y = (displayHeight/2) - 90;
    trex.changeAnimation("collided", trex_collided);
    ground.velocityX = 0
    gameOver.visible = true;
    restart.visible = true;

    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    
    fill("Yellow");
    textSize(25);
    text("PRESS THE RESTART BUTTON TO REPLAY", displayWidth/4, displayHeight/16);

    if(mousePressedOver(restart)){
      reset();
    }
  }
 
  trex.collide(invisibleGround);
  drawSprites();

  fill("red");
  textSize(22);
  text("score: " + score, displayWidth/2 + 200, 80);
  text("Lives: " + lives, displayWidth/2 + 200, 120);
}

function spawnClouds(){
  if (frameCount % 80 === 0) {
    var cloud = createSprite(displayWidth, (displayHeight/2), 10, 10);
    cloud.y = Math.round(random((displayHeight/8), (displayHeight/4)));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = displayWidth/3;
  
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = restart.depth;
    restart.depth = restart.depth + 1;
  
    cloudsGroup.add(cloud);
  } 
}

function spawnObstacles(){
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(trex.x + displayWidth, (displayHeight/2)-90,20,20);
    obstacle.velocityX = -4;

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    obstacle.depth = ground.depth;
    obstacle.depth += 1;

    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth/4;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  score = 0;
  lives = 3;
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ground.velocityX = -(2 + Math.round(score/100));
  ground.velocityX = -(2 + Math.round(score/100));
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
}