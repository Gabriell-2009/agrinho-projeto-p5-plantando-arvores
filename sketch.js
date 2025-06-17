let farmer;
let plots = [];
let score = 0;
let gameTime = 60 * 60; // 60 segundos

function setup() {
  createCanvas(600, 400);
  farmer = new Farmer();

  // criar 3x3 canteiros (9 no total)
  for (let y = 150; y <= 250; y += 50) {
    for (let x = 200; x <= 400; x += 50) {
      plots.push(new Plot(x, y));
    }
  }
}

function draw() {
  background(100, 200, 100); // grama

  // desenhar os canteiros
  for (let p of plots) {
    p.update();
    p.display();
  }

  // desenhar o fazendeiro
  farmer.move();
  farmer.display();

  // mostrar HUD
  fill(255);
  textSize(18);
  text("Tempo: " + int(gameTime / 60), 10, 20);
  text("Plantas crescidas: " + score, 10, 40);

  // fim de jogo
  gameTime--;
  if (gameTime <= 0) {
    noLoop();
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Fim da colheita!\nPlantas crescidas: " + score, width / 2, height / 2);
  }
}

function keyPressed() {
  if (key === ' ') {
    for (let p of plots) {
      if (p.isNear(farmer) && p.state === 0) {
        p.plant();
      }
    }
  }
}

class Farmer {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.size = 30;
    this.speed = 3;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    fill(50, 100, 200);
    rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

class Plot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.state = 0; // 0: vazio, 1: plantado, 2: crescendo, 3: crescido
    this.growthTimer = 0;
  }

  plant() {
    this.state = 1;
    this.growthTimer = 180; // 3 segundos para crescer
  }

  update() {
    if (this.state === 1 || this.state === 2) {
      this.growthTimer--;
      if (this.growthTimer <= 0) {
        this.state++;
        if (this.state === 3) {
          score++;
        }
      } else if (this.growthTimer < 90 && this.state === 1) {
        this.state = 2;
      }
    }
  }

  display() {
    stroke(0);
    fill(139, 69, 19); // terra
    rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

    if (this.state === 1) {
      fill(0, 200, 0);
      ellipse(this.x, this.y, 10);
    } else if (this.state === 2) {
      fill(0, 150, 0);
      ellipse(this.x, this.y, 15);
    } else if (this.state === 3) {
      fill(0, 100, 0);
      ellipse(this.x, this.y, 20);
    }
  }

  isNear(farmer) {
    return dist(this.x, this.y, farmer.x, farmer.y) < 40;
  }
}