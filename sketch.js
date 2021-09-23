const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg, waterSound, backgroundMusic, cannonExplosion;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenAnimation = [];
var brokenSpritedata, brokenSpritesheet;



function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");

  brokenSpritedata = loadJSON("assets/boat/broken_boat.json")
  brokenSpritesheet = loadImage("assets/boat/broken_boat.png")

}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 110, 50, angle);

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenSpritedata.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos2 = brokenBoatFrames[i].position;
    var img2 = brokenSpritesheet.get(pos2.x, pos2.y, pos2.w, pos2.h);
    brokenAnimation.push(img2);
  }



}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);


  Engine.update(engine);
  ground.display();

  showBoats();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithBoat(i);
  }

  cannon.display();
  tower.display();


}


function collisionWithBoat(index){
  for (var j = 0; j < boats.length; j++) {
    if (balls[index] !== undefined && boats[j] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[j].body);
      if (collision.collided) {
        boats[j].remove(j);

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      
      }
    }
  }
}


//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  if(ball){
    ball.display();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    ball.remove(index)
  }
  }
}


//function to show the boat
function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 && boats[boats.length-1] !== undefined && boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );

      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();
      var collision = Matter.SAT.collides(tower.body, boats[i].body);
      if(collision.collided){
        gameover();
      }

    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(boat);
  }
}


//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}

function gameover(){
  swal({
    title: "Game Over!",
    text: "Thanks for playing",
    imageURL: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "150x150",
    confirmButtonText: "Play Again?"
  
  }, function (isConfirm){
    if(isConfirm){
      location.reload();
    }
  })
}
