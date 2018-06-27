var mc = false;

function begin() {
  canvas = document.getElementById('Tricanvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', MouseDown, false);
  canvas.addEventListener('mousemove', MouseMove, false);
  canvas.addEventListener('mouseup', MouseUp, false);
}


function MouseDown(e) {
  var pos = getMousePos(canvas, e);
  MouseX = pos.x;
  MouseY = pos.y;
  triangles[0].repositionVertex(0, new Vector2D(MouseX, MouseY));
  mc = true;
}



function MouseMove(e) {
  if (mc) {
    var pos = getMousePos(canvas, e);
    MouseX = pos.x;
    MouseY = pos.y;
    triangles[0].repositionVertex(0, new Vector2D(MouseX, MouseY));
  }
}

function MouseUp() {
  mc = false;
}

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;
  scaleX /= canvas.width / worldDim;
  scaleY /= canvas.width / worldDim;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}


window.setInterval(function () {

  if (! canvas) {
    return;
  }
  if (mc) {
//    triangles[0].repositionVertex(0, new Vector2D(MouseX, MouseY));
  }

  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  scaleX *= canvas.width / worldDim;
  scaleY *= canvas.width / worldDim;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  triangles.forEach(function (triangle) {
    triangle.applyPhysics();

    ctx.beginPath();
    ctx.moveTo(triangle.vertices[0].x * scaleX, triangle.vertices[0].y * scaleY);
    ctx.lineTo(triangle.vertices[1].x * scaleX, triangle.vertices[1].y * scaleY);
    ctx.lineTo(triangle.vertices[2].x * scaleX, triangle.vertices[2].y * scaleY);
    ctx.lineTo(triangle.vertices[0].x * scaleX, triangle.vertices[0].y * scaleY);
    ctx.closePath();
    ctx.stroke();
    
    triangle.connections.forEach(connection => {
  	  let from = triangle.vertices[connection.fromVertex];
  	  let to = connection.toTriangle.vertices[connection.toVertex];
  	  
  	  ctx.beginPath();
  	  ctx.moveTo(from.x * scaleX, from.y * scaleY);
  	  ctx.lineTo(to.x * scaleX, to.y * scaleY);
  	  ctx.closePath();
  	  ctx.stroke();
    });	
  });

}, 1000 / 60);