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
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI');
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
// set the best brain to the best car
if (localStorage.getItem('bestBrain')) {
  bestCar.brain = JSON.parse(localStorage.getItem('bestBrain'));
}
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'BOT', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'BOT', 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'BOT', 2),
];

animate();

// Save the 'best car' to local storage
function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

// Discard the 'best car' - if a better car exists
function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return cars;
}

// `time` comes form requestAnimationFrame
function animate(time) {
  // console.log(car.x.toFixed(2), car.y.toFixed(2));

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // define best car (i.e. the car that survives the longest)
  // find the car with the minimum y value out of all cars y values
  bestCar = cars.find((car) => car.y == Math.min(...cars.map((car) => car.y)));

  // resizing the canvas here will clear existing car positions and only leave 1 box visible
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'grey');
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'red');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'red', true);

  carCtx.restore();

  // animate the networkCtx
  networkCtx.lineDashOffset = -time / 100;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // Calls `animate()` repeatedly
  requestAnimationFrame(animate);
}
