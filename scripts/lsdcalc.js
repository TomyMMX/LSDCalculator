$(document).ready(function() { 
	$("input[type='text']").on("click", function () {
   		$(this).select();
	});
});

var stoneRadius = 142;
function DrawStoneLocation(stoneX, stoneY){
      var canvas = document.getElementById('sheet');
      var context = canvas.getContext('2d');
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = centerX;

      DrawCircle(context, radius, '#d2271a', centerX, centerY); 
      DrawCircle(context, radius/3, 'white', centerX, centerY); 
     
      DrawLine(context, 200, 0, 200, 400, 4, '#111');
      DrawLine(context, 400, 200, 0, 200, 4, '#111');

      var centerx = 150-(stoneX*(radius-5));
      var centery = 150-(stoneY*(radius-5));

      DrawLine(context, 400, 200, centerx+50, centery+50, 8, '#5abc5d');
      DrawLine(context, 200, 400, centerx+50, centery+50, 8, '#0f75bc');

      var img = new Image();
      img.onload = function() {
        context.drawImage(img, centerx, centery);
      }
      img.src =  "img/stone.png";
}

function DrawLine(context, fromX, fromY, toX, toY, width, color){
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.lineWidth = width;
      context.strokeStyle = color;
      context.stroke();
}

function DrawCircle(context, radius, fill, centerX, centerY){
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = fill;
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = '#111';
      context.stroke();
}

function ResetAll(){
    $("#fromPin").val("");    
    $("#from3").val("");    
    $("#from6").val("");    

    $("#resultLabel").text("");
    EraseCanvas();
}

function EraseCanvas(){
    var canvas = document.getElementById('sheet');
    var context = canvas.getContext('2d');
      
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function SimpleLSDCalculation(){
	var fromPinText = $("#fromPin").val().replace(",", ".");
    var fromPin = parseFloat(fromPinText);
	var	res = fromPin*10 + stoneRadius;
	res = (res/10).toFixed(1);
    EraseCanvas(); 
    if(res=="NaN"){
  	    $("#resultLabel").text("Input value error.");
    }else{
  	    $("#resultLabel").text("x = "+res+" cm");
    }
}
function StartLSDCalculaton(){
	var from3Text = $("#from3").val().replace(",", ".");
	var from6Text = $("#from6").val().replace(",", ".");	
	
	var res = 0.0;

	var from3 = parseFloat(from3Text)*10;
	var from6 = parseFloat(from6Text)*10;
    res = CalculateLSDDistance(from6, from3);

    if(res.x=="NaN"){
        EraseCanvas();
  	    $("#resultLabel").text("Input value error.");
    }else{
  	    $("#resultLabel").text("x = "+res.x+" cm");
        DrawStoneLocation(res.y, res.z);
    }
}

function CalculateLSDDistance(from6, from3){
	var A = 2;
	//all values in mm	

	//radius of the 4ft circle
	var r = 609.6;

	var a = from6 + stoneRadius;
	var b = from3 + stoneRadius;

	var B = - ((b*b - a*a) / r) + (2*r);
	var D = Math.pow(((b*b - a*a)/(2*r)), 2) - (b*b) + (r*r);

	var psq = (B*B) - (4 * A * D);
	var sq = Math.sqrt(psq);
	var y1 = (-B + sq)/(2 * A);
	var y2 = (-B - sq)/(2 * A);

	var y = y1;

	if(y < 0){
		if(y2>-1){
			y = y2;   
		} 
	}

	var x = Math.sqrt((2*y*y) - ((b*b-a*a)/r)*y + Math.pow(((b*b-a*a)/(2*r)), 2));
    
    var point = {};
    point.x = (x/10).toFixed(1);
    point.y = (y/r).toFixed(4);

    var k = (((b*b)-(a*a))/(2*r))-y;
    var z = Math.sqrt((x*x)-(y*y));
    point.z = (-k/r).toFixed(4);


	return point;
}
