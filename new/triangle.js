//recalculate triangle center and vertices 
var triangles = [];
var velDamper = .99;
var spinDamper = .99;
var ratioOldNew = 0;
var ratioNewOld = 1 - ratioOldNew;

var worldDim = 20;


class Triangle {
  constructor(x, y, angle) {

    this.center = new Vector2D(x, y);
    this.angle = angle;
    this.vertices = [new Vector2D(), new Vector2D(), new Vector2D()];
    this.velocity = new Vector2D();
    this.spin = 0;
    this.connections = [];
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
    // apply dampening
    this.velocity.scale(velDamper);
    this.spin *= spinDamper;

    this.center.add(this.velocity);
    this.angle += this.spin;

    this.applyConnections();
    this.updateVertices();
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

    let oldPos = this.vertices[vertIndex];

    newPos.x = newPos.x * ratioNewOld + oldPos.x * ratioOldNew;
    newPos.y = newPos.y * ratioNewOld + oldPos.y * ratioOldNew;

    // center of triangle
    let oldAxis = oldPos.difference(this.center);
    let newAxis = newPos.difference(this.center);

    // get the angle between the two vectors, to be used to rotate the triangle
    let angle = oldAxis.getAngleBetween(newAxis); // angleBetweenVectors(oldVertexAxisX, oldVertexAxisY, newVertexAxisX, newVertexAxisY);

    // change in vertex position
    let vertexDelta = newPos.difference(oldPos);
    // magnitude of the vertex delta
    let M = vertexDelta.getMagnitude();
    if (M < .001) return;
    if (M > 1.0) {
      vertexDelta.x /= M;
      vertexDelta.y /= M;
      M = 1;
    }

    // take the dot product of the axis and vertex position delta to determine the degree of translation and spin
    let dot = Math.abs(oldAxis.dot(vertexDelta));

    var translationFactor = dot / M;
    if (translationFactor > 1) {
      translationFactor = 1;
    }
    var rotationFactor = 1 - translationFactor;

    this.center.x += vertexDelta.x * translationFactor;
    this.center.y += vertexDelta.y * translationFactor;
    this.angle += rotationFactor * angle;
  }

  updateVertices() {
    // now calculate the vertex points (slow)
    var cosa, sina;
    var a = this.angle;
    var r = 1;
    var x = this.center.x,
      y = this.center.y;

    for (let i = 0; i < 3; i++) {
      cosa = Math.cos(a);
      sina = Math.sin(a);
      this.vertices[i].x = x + cosa * r;
      this.vertices[i].y = y + sina * r;

      a += 2.094395102393195;
    }
  }
}

// create a triangle and push to the array
function addTriangle(x, y, angle) {
  triangles.push(new Triangle(x, y, angle));
}

var numTris = 4;
var spacing = 2;

var x = worldDim / 2 - numTris * spacing / 2;
var y = x;

for (let i = 0; i < numTris; i++) {
  for (let j = 0; j < numTris; j++) {
    addTriangle(x + i * spacing, y + j * spacing, 0);
  }
}

for (let k = 1; k < triangles.length; k++) {
  triangles[k - 1].addConnection(1, triangles[k], 1);
  triangles[k - 1].addConnection(1, triangles[k], 2, .1);
}

// addTriangle(worldDim / 2, worldDim / 2, 0);
// addTriangle(worldDim / 2, worldDim / 2, 0);

// triangles[0].addConnection(1, triangles[1], 1, 2);
//triangles[0].addConnection(1, triangles[1], 2);