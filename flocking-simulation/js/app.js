import { Boid } from "./boid.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let flock = [] // a flock consists of all the boids
const numberOfBoids = 80;
for (let i = 0; i < numberOfBoids; i++) {
    // all the boids start off at a random point on the canvas with some velocity
    let xPosition = Math.random() * WIDTH;
    let yPosition = Math.random() * HEIGHT;
    let xVelocity = (Math.random() < 0.5 ? -1 : 1);
    let yVelocity = (Math.random() < 0.5 ? -1 : 1);
    flock.push(new Boid(xPosition, yPosition, xVelocity, yVelocity));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (let currentBoid = 0; currentBoid < flock.length; currentBoid++) {
        flock[currentBoid].update(flock, currentBoid);
    }
}

animate();