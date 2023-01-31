// Set canvas size
const carCanvas = document.querySelector('#carCanvas');
carCanvas.width = 200;

const networkCanvas = document.querySelector('#networkCanvas');
networkCanvas.width = 400;

//* https://www.w3schools.com/tags/ref_canvas.asp
// create a context for the canvas
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, 'BOT', 2)];

animate();

// `time` comes form requestAnimationFrame
function animate(time) {
  // console.log(car.x.toFixed(2), car.y.toFixed(2));

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  // resizing the canvas here will clear existing car positions and only leave 1 box visible
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'grey');
  }
  car.draw(carCtx, 'red');

  carCtx.restore();

  // animate the networkCtx
  networkCtx.lineDashOffset = -time / 100;
  Visualizer.drawNetwork(networkCtx, car.brain);

  // Calls `animate()` repeatedly
  requestAnimationFrame(animate);
}
