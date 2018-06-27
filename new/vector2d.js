class Vector2D {
  constructor(src1, src2) {
    this.x = this.y = 0;

    if (src1 !== undefined && src2 !== undefined) {
      // two parameters, so assume x, y
      this.x = src1;
      this.y = src2;
    } else if (src1 && src1.x !== undefined) {
      // initialize from another vector
      this.x = src1.x;
      this.y = src1.y;
    }
  }

  clear() {
    this.x = 0.0;
    this.y = 0.0;
  }

  setXY(x_, y_) {
    this.x = x_;
    this.y = y_;
  }


  // methods that return a new vector
  difference(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  sum(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  // informational methods
  getAngleBetween(v) {
    let dot = this.dot(v);
    let det = this.cross(v);
    return Math.atan2(det, dot); //# atan2(y, x) or atan2(sin, cos)
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }


  getMagnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }


  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  getDistanceTo(position) {
    return Math.sqrt(this.getDistanceSquaredTo(position));
  }

  getDistanceSquaredTo(position) {
    let xd = this.x - position.x;
    let yd = this.y - position.y;
    return xd * xd + yd * yd;
  }

  ///////

  addXY(x_, y_) {
    this.x += x_;
    this.y += y_;
  }

  setToDifference(v1, v2) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
  }


  normalize() {
    let m = this.getMagnitude();
    this.x /= m;
    this.y /= m;
  }


  scale(s) {
    this.x *= s;
    this.y *= s;
  }

  addScaled(vectorToAdd, scale) {
    this.x += vectorToAdd.x * scale;
    this.y += vectorToAdd.y * scale;
  }

  setToPerpendicular() {
    var y = -this.x;
    this.x = this.y;
    this.y = y;
  }


  //-------------------------------------------------------------------
  // getClosestPointOnLineSegment(segmentEnd1, segmentEnd2) {
  //   var position = new Vector2D();
  //   position.setXY(x, y);

  //   var vectorFromEnd1ToPosition = new Vector2D();
  //   vectorFromEnd1ToPosition.set(position);
  //   vectorFromEnd1ToPosition.subtract(segmentEnd1);

  //   var segmentVector = new Vector2D();
  //   segmentVector.set(segmentEnd2);
  //   segmentVector.subtract(segmentEnd1);

  //   var dot = vectorFromEnd1ToPosition.dotWith(segmentVector);
  //   if (dot < 0.0) {
  //     return segmentEnd1;
  //   }

  //   var squared = segmentVector.dotWith(segmentVector);
  //   if (dot > squared) {
  //     return segmentEnd2;
  //   }

  //   var extent = dot / squared;

  //   var positionOnSegment = new Vector2D();
  //   positionOnSegment.set(segmentEnd1);
  //   positionOnSegment.addScaled(segmentVector, extent);

  //   var vectorFromPositionToPositionOnSegment = new Vector2D();

  //   vectorFromPositionToPositionOnSegment.set(positionOnSegment);
  //   vectorFromPositionToPositionOnSegment.subtract(position);

  //   return positionOnSegment;
  // }
}