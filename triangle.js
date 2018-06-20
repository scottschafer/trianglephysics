var triangles = [];
var velDamper = .99;
var spinDamper = .99;

var worldDim = 20;

// create a triangle and push to the array
function addTriangle(xCenter, yCenter, angle) {
  triangles.push({
    xCenter: xCenter,
    yCenter: yCenter,
    angle: angle,
    x: [0, 0, 0],
    y: [0, 0, 0],

    xVel: 0,
    yVel: 0,
    spin: 0
  })
}

function applyMomemntum() {
  triangles.forEach(function(triangle) {

    // apply dampening
    triangle.xVel *= velDamper;
    triangle.yVel *= velDamper;
    triangle.spin *= spinDamper;
    
    // apply momentum
    triangle.xCenter += triangle.xVel;
    triangle.yCenter += triangle.yVel;
    triangle.angle += triangle.spin;

    // now calculate the vertex points
    var cosa, sina;
    var a = triangle.angle;
    var r = 1;
    var x = triangle.xCenter, y = triangle.yCenter;
  
    cosa = Math.cos(a);
    sina = Math.sin(a);
    triangle.x[0] = x + cosa * r;
    triangle.y[0] = y + sina * r;
    
    a += 2.094395102393195;
  
    cosa = Math.cos(a);
    sina = Math.sin(a);
    triangle.x[1] = x + cosa * r;
    triangle.y[1] = y + sina * r;
    
    a += 2.094395102393195;
  
    cosa = Math.cos(a);
    sina = Math.sin(a);
    triangle.x[2] = x + cosa * r;
    triangle.y[2] = y + sina * r;    
  })
}


function angleBetweenVectors(x1, y1, x2, y2) {

  var dot = x1*x2 + y1*y2;      // dot product
  var det = x1*y2 - y1*x2;      // # determinant
  return Math.atan2(det, dot);  //# atan2(y, x) or atan2(sin, cos)
}

function repositionVertex(triangle, vertex, newVertexX, newVertexY) {
  
  // center of triangle
  var centerX = triangle.xCenter, centerY = triangle.yCenter;
  var oldVertexX = triangle.x[vertex];
  var oldVertexY = triangle.y[vertex];

  // vector from old vertex position to triangle center
  var oldVertexAxisX = oldVertexX - centerX;
  var oldVertexAxisY = oldVertexY - centerY;

  // vector from new vertex position to triangle center
  var newVertexAxisX = newVertexX - centerX;
  var newVertexAxisY = newVertexY - centerY;

  // get the angle between the two vectors, to be used to rotate the triangle
  var angle = angleBetweenVectors(oldVertexAxisX, oldVertexAxisY, newVertexAxisX, newVertexAxisY);

  // change in vertex position
  var vertexDeltaX = newVertexX - oldVertexX;
  var vertexDeltaY = newVertexY - oldVertexY;

  // magnitude of the vertex delta

  var M = Math.sqrt(vertexDeltaX*vertexDeltaX + vertexDeltaY*vertexDeltaY);
  if (M < .0001) return;

  
  // take the dot product of the axis and vertex position delta to determine the degree of translation and spin
  var dot = oldVertexAxisX * vertexDeltaX + oldVertexAxisY * vertexDeltaY;
  dot = Math.abs(dot);

  var translationFactor = dot / M;
  var rotationFactor = 1- translationFactor;


  triangle.xCenter += vertexDeltaX * translationFactor;
  triangle.yCenter += vertexDeltaY * translationFactor;
  triangle.angle += rotationFactor * angle;
}



addTriangle(worldDim / 2, worldDim / 2, 0);