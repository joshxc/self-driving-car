// Set canvas size
const canvas = document.querySelector('#myCanvas');
canvas.width = 200;

//* https://www.w3schools.com/tags/ref_canvas.asp
// create a context for the canvas
const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

animate();

function animate() {
  // console.log(car.x.toFixed(2), car.y.toFixed(2));
  car.update(road.borders);
  // resizing the canvas here will clear existing car positions and only leave 1 box visible
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);
  ctx.restore();
  // Calls `animate()` repeatedly
  requestAnimationFrame(animate);
}
