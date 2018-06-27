let triangles = []; // global array of triangles

const velDamper = 0;
const spinDamper = 0;

const worldDim = 20;

const triRotCos = Math.cos(2.094395102393195);
const triRotSin = Math.sin(2.094395102393195);
const triRotCos2 = Math.cos(4.188790204786391);
const triRotSin2 = Math.sin(4.188790204786391);

const minMove = .0001;
const maxMove = .8;


/**
 * Triangle class. Contains the following properties:
 *  position      Vector2D     The x,y of the triangle center
 *  orientation   Vector2D     A normalized vector from the center point to the first vertex
 *  velocity      Vector2D     A vector that is added to position every turn
 *  spin          Vector2D     A normalized vector that is used to rotate orientation every turn
 *  vertices      Vector2d[3]  An array of three points, one for each vertex, in "world" dimensions
 *  connections   [{...}]      An array of objects specifying how vertices are connected
 */
class Triangle {

  constructor(x, y, angle) {

    this.position = new Vector2D(x, y);
    this.orientation = new Vector2D(Math.cos(angle), Math.sin(angle));

    this.velocity = new Vector2D(0, 0);
    var spinA = 0;
    this.spin = new Vector2D(Math.cos(spinA), Math.sin(spinA));

    this.vertices = [new Vector2D(), new Vector2D(), new Vector2D()];

    this.spin = new Vector2D(1, 0);
    this.connections = [];

    this.updateVertices();
  }

  updateVertices() {
    var ox = this.orientation.x,
      oy = this.orientation.y,
      x = this.position.x,
      y = this.position.y;
    this.vertices[0].x = x + ox;
    this.vertices[0].y = y + oy;

    this.vertices[1].x = x + triRotCos * ox - triRotSin * oy;
    this.vertices[1].y = y + triRotSin * ox + triRotCos * oy;

    this.vertices[2].x = x + triRotCos2 * ox - triRotSin2 * oy;
    this.vertices[2].y = y + triRotSin2 * ox + triRotCos2 * oy;
  }

  addConnection(fromVertex, toTriangle, toVertex, length) {
    if (length === undefined) {
      this.updateVertices();
      toTriangle.updateVertices();
      let from = this.vertices[fromVertex];
      let to = toTriangle.vertices[toVertex];
      length = from.getDistanceTo(to);
    }

    this.connections.push({
      fromVertex: fromVertex,
      toTriangle: toTriangle,
      toVertex: toVertex,
      length: length
    });
  }

  applyPhysics() {

    // rotate orientation by spin
    this.orientation.rotateBy(this.spin);

    // add velocity to position
    this.position.add(this.velocity);

    this.applyConnections();
    this.updateVertices();

    // apply dampening to spin - not sure this is right
    this.velocity.scale(velDamper);
    this.spin.x = (1 - spinDamper) + spinDamper * this.spin.x;
    this.spin.y = spinDamper * this.spin.y;
  }

  applyConnections() {
    this.connections.forEach(connection => {
      let from = this.vertices[connection.fromVertex];
      let to = connection.toTriangle.vertices[connection.toVertex];
      var distance = from.getDistanceTo(to);
      if (!distance) {
        return;
      }
      var scale = connection.length / distance;

      var centerX = (from.x + to.x) / 2;
      var centerY = (from.y + to.y) / 2;
      var deltaX = from.x - centerX;
      var deltaY = from.y - centerY;

      var newFromPos = new Vector2D(centerX + deltaX * scale, centerY + deltaY * scale);
      var newToPos = new Vector2D(centerX - deltaX * scale, centerY - deltaY * scale);

      //this.repositionVertex(connection.fromVertex, newFromPos);
      connection.toTriangle.repositionVertex(connection.toVertex, newToPos);
    });
  }

  repositionVertex(vertIndex, newPos) {

    // get the previous position, and calculate the force from that
    let oldPos = this.vertices[vertIndex];
    let f = newPos.difference(oldPos);

    // f will be normalized, so save its magnitude
    let M = f.getMagnitude();

    if (M < minMove) {
      // if the destination point is too close to the origin, ignore it 
      return;
    }

    // normalize force (and perpendicular of force)
    f.x /= M; // normalize
    f.y /= M;

    if (M > maxMove) {
      M = maxMove;
    }

    // f = the force (normalized)
    // p = the perpendicular of the force
    // c = the center of the triangle
    // v = the vertex experiencing the force 
    // a = c-v (must have length of 1)

    // vdot = the dot product of a and f 
    // pdot = the dot product of a and p

    let p = f.perpendicular();
    let c = this.position;
    let v = oldPos;
    let a = c.difference(v);

    let vdot = Math.abs(a.dot(f));
    let pdot = Math.abs(a.dot(p));

    this.velocity.x = vdot * f.x * M;
    this.velocity.y = vdot * f.y * M;


    // TODO: how to rotate spin??
    
    // if (pdot > 0) {
    //   let rotation = new Vector2D(pdot * f.x, pdot * f.y);
    //   rotation.normalize();
    //   this.spin.rotateBy(rotation);
    // }
  }
}

// create a triangle and push to the array
function addTriangle(x, y, angle) {
  triangles.push(new Triangle(x, y, angle));
}

// var numTris = 4;
// var spacing = 2;

// var x = worldDim / 2 - numTris * spacing / 2;
// var y = x;

// for (let i = 0; i < numTris; i++) {
//   for (let j = 0; j < numTris; j++) {
//     addTriangle(x + i * spacing, y + j * spacing, 0);
//   }
// }

// for (let k = 1; k < triangles.length; k++) {
//   triangles[k - 1].addConnection(1, triangles[k], 1);
//   triangles[k - 1].addConnection(1, triangles[k], 2);
// }

addTriangle(worldDim / 2, worldDim / 2, 0);
addTriangle(worldDim / 2 + 2, worldDim / 2, 3.141592653589793);

triangles[0].addConnection(0, triangles[1], 0);