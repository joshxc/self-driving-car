class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y; // -y it upward, +y is downward
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.25;
    this.maxSpeed = 4;
    this.friction = 0.05;
    this.angle = 0;

    this.sensor = new Sensor(this); // passing the Car object to Sensor
    this.controls = new Controls();
  }

  update(roadBorders) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  // private method
  #move() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;
    // cap the max speed going forward
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    // cap the max speed going in reverse
    if (this.speed < -this.maxSpeed / 1.5) this.speed = -this.maxSpeed / 1.5;
    // decrease the forward speed due to friction
    if (this.speed > 0) this.speed -= this.friction;
    // decrease the reverse speed due to friction
    if (this.speed < 0) this.speed += this.friction;
    // if the speed happens to be less than the friction value, set speed to 0
    if (Math.abs(this.speed) < this.friction) this.speed = 0;
    // flip left and right controls if going in reverse
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      // imagine a unit circle rotated 90deg ccw
      if (this.controls.left) this.angle += 0.03 * flip;
      if (this.controls.right) this.angle -= 0.03 * flip;
    }
    // unit circle has a radius of 1, multiplying by the speed scales it to the magnitude of the speed
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();
    this.sensor.draw(ctx);
  }
}
