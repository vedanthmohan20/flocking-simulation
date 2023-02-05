// this class is a representation of a two dimensional vector
export class Vector2D {

    // this vector consists of an x and y component
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // returns the magnitude of this vector
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    // sets the magnitude of this vector to the given value. this is done by
    // converting this vector to a unit vector by dividing it by its current
    // magnitude and then multiplying it by the new magnitude
    setMagnitude(newMagnitude) {
        let currentMagnitude = this.magnitude();
        this.divide(currentMagnitude);
        this.multiply(newMagnitude);
    }

    // adds the given vector to this vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    // subtracts the given vector from this vector
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    // multiplies this vector by the given scalar
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    // divides this vector by the given scalar
    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    // returns a deep copy of this vector
    copy() {
        return new Vector2D(this.x, this.y);
    }

}