import { Vector2D } from "./vector.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// this class is a representation of a single boid
export class Boid {

    constructor(px = Math.random()*WIDTH, py = Math.random()*HEIGHT, vx = 1, vy = 1) {
        this.perceptionRadius = 80; // the maximum distance another boid can be to be perceived by this boid
        this.speedLimit = 5; // the maximum speed this boid can travel at
        this.boidLength = 5; // since i draw the boids as triangles, i use this to set a boid's length

        this.position = new Vector2D(px, py);
        this.velocity = new Vector2D(vx, vy);
    }

    // returns the distance between this boid and the given boid (considering wrap-around as well)
    distance(boid) {
        // the distance between the x components if we DON'T wrap around the canavs
        let dx1 = Math.abs(this.position.x - boid.position.x); 
        // the distance between the x components if we DO wrap around the canvas
        let dx2 = Math.min(this.position.x, boid.position.x) + WIDTH - Math.max(this.position.x, boid.position.x);
        // the distance between the x components is the minimum of the two calculated values
        let dx = Math.min(dx1, dx2);

        let dy1 = Math.abs(this.position.y - boid.position.y);
        let dy2 = Math.min(this.position.y, boid.position.y) + HEIGHT - Math.max(this.position.y, boid.position.y);
        let dy = Math.min(dy1, dy2);

        return Math.sqrt(dx*dx + dy*dy);
    }

    // this function just draws the boid, you can draw it as any shape you want
    draw() {
        let p0 = this.position.copy();
        let p1 = this.position.copy();
        let p2 = this.position.copy();
        let p3 = this.position.copy();

        let vel = this.velocity.copy();
        vel.setMagnitude(this.boidLength);
        p1.add(vel);

        let correction = Math.atan(vel.y / vel.x);
        if (vel.x >= 0) {
            correction += Math.PI;
        }
        p2.x += this.boidLength * (3/4) * Math.cos(correction + Math.PI/6);
        p2.y += this.boidLength * (3/4) * Math.sin(correction + Math.PI/6);
        p3.x += this.boidLength * (3/4) * Math.cos(correction - Math.PI/6);
        p3.y += this.boidLength * (3/4) * Math.sin(correction - Math.PI/6);

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p0.x, p0.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.fill();
    }

    // this function updates the position and velocity vectors of this boid with respect to the flock
    update(flock, targetBoid) {
        // calculating the three vectors that will be considered to steer this boid
        // you can read about them here: https://red3d.com/cwr/boids/ 
        let v1 = this.cohesion(flock, targetBoid);
        let v2 = this.separation(flock, targetBoid);
        let v3 = this.alignment(flock, targetBoid);

        this.velocity.add(v1);
        this.velocity.add(v2);
        this.velocity.add(v3);
        // making sure this boid adheres to the speed limit
        if (this.velocity.magnitude() > this.speedLimit) {
            this.velocity.setMagnitude(this.speedLimit);
        }

        this.position.add(this.velocity);
        // making this boid wrap around the edges of the canvas in case it exceeds the boundaries
        if (this.position.x < 0) {
            this.position.x += WIDTH;
        }
        else if (this.position.x > WIDTH) {
            this.position.x -= WIDTH;
        }
        if (this.position.y < 0) {
            this.position.y += HEIGHT;
        }
        else if (this.position.y > HEIGHT) {
            this.position.y -= HEIGHT;
        }

        // finally, we need to draw this boid after updating it
        this.draw();
    }

    // rule 1: https://vergenet.net/~conrad/boids/pseudocode.html 
    cohesion(flock, targetBoid) {
        let cohesionFactor = 0.005;
        let perceivedCentre = new Vector2D(0, 0);
        let numberOfBoidsWithinPerceptionRadius = 0;

        for (let currentBoid = 0; currentBoid < flock.length; currentBoid++) {
            if (currentBoid != targetBoid 
                && this.distance(flock[currentBoid]) <= this.perceptionRadius) {
                perceivedCentre.add(flock[currentBoid].position);
                numberOfBoidsWithinPerceptionRadius++;
            }
        }

        if (numberOfBoidsWithinPerceptionRadius > 0) {
            perceivedCentre.divide(numberOfBoidsWithinPerceptionRadius);
            perceivedCentre.subtract(this.position);
            perceivedCentre.multiply(cohesionFactor);
        }

        return perceivedCentre;
    }

    // rule 2: https://vergenet.net/~conrad/boids/pseudocode.html 
    separation(flock, targetBoid) {
        let separationFactor = 20;
        let separationVector = new Vector2D(0, 0);

        for (let currentBoid = 0; currentBoid < flock.length; currentBoid++) {
            if (currentBoid != targetBoid
                && this.distance(flock[currentBoid]) < separationFactor) {
                let b = flock[currentBoid].position.copy();
                b.subtract(this.position);
                separationVector.subtract(b);
            }
        }

        return separationVector;
    }

    // rule 3: https://vergenet.net/~conrad/boids/pseudocode.html 
    alignment(flock, targetBoid) {
        let alignmentFactor = 0.125;
        let perceivedVelocity = new Vector2D(0, 0);
        let numberOfBoidsWithinPerceptionRadius = 0;

        for (let currentBoid = 0; currentBoid < flock.length; currentBoid++) {
            if (currentBoid != targetBoid
                && this.distance(flock[currentBoid]) <= this.perceptionRadius) {
                perceivedVelocity.add(flock[currentBoid].velocity);
                numberOfBoidsWithinPerceptionRadius++;
            }
        }

        if (numberOfBoidsWithinPerceptionRadius > 0) {
            perceivedVelocity.divide(numberOfBoidsWithinPerceptionRadius);
            perceivedVelocity.subtract(this.velocity);
            perceivedVelocity.multiply(alignmentFactor);
        }

        return perceivedVelocity;
    }

}