class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2; // 90 deg from first ray to last ray

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders));
    }
  }

  #getReading(ray, roadBorders) {

  }

  // private method
  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      // add the car's angle so that the rays move with the car
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          // if rayCount is 1, set it to be halfway between the two interpolated points i.e. straight up
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      // define start and end points for the rays
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      // push each segment to the rays array
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';

      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); // move to start position of ray i
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y); // line to end position of ray i
      ctx.stroke();
    }
  }
}
