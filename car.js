class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 4) {
    this.x = x;
    this.y = y; // -y is upward, +y is downward
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.25;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false; // false if car has not crashed

    this.useBrain = controlType == 'AI';

    // only show sensors on USER car
    if (controlType != 'BOT') {
      this.sensor = new Sensor(this); // passing the Car object to Sensor
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map((sens) =>
        // null = no reading from sensor (neurons receive low values if obstacle is far away)
        // neurons receive higher values closer to 1 if the obstacle is close
        sens === null ? 0 : 1 - sens.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      // console.log(outputs);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }

  // find the four points on the car
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    // top right point
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    // top left point
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    // bottom left point
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    // bottom right point
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
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

  draw(ctx, colour) {
    ctx.fillStyle = this.damaged ? 'black' : colour;
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    // starting at 1 because we moved to the first point above
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
