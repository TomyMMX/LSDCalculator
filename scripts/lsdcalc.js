var stoneRadius = 142;
var prevStoneX = '';
var prevStoneY = '';

$(document).ready(function() { 
    //select all when selecting an input field
    $("input").on("click", function () {
        $(this).select();
    });
    
    //help for some stupid samsung devices
    //add/remove decimal seperator before last char
    $("input").on("doubletap", function () {
        addRemovePoint($(this));
    });
    $("input").dblclick( function () {
        addRemovePoint($(this));
    });

    //redraw the graphic if window resizes
    window.onresize = function(event) {
        if(prevStoneX!=''){
            DrawStoneLocation(prevStoneX, prevStoneY);
        }    
    };
});

function addRemovePoint(element){
    var curVal = element.val().replace(",", ".");
    if(curVal.indexOf(".")>-1){
        element.val(curVal.replace(".",""));
    }else if(curVal.length > 1){
        var l = curVal.length;
        curVal = curVal.slice(0,l-1)+"."+curVal.slice(l-1);
        element.val(curVal);
    }
}

function DrawStoneLocation(stoneX, stoneY){
    //so we have the calculation if we have to redraw
    prevStoneX=stoneX;
    prevStoneY=stoneY;

    var canvas = document.getElementById('sheet');
    var context = canvas.getContext('2d');
      
    context.clearRect(0, 0, canvas.width, canvas.height);
      
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = centerX;

    //4ft an 1 ft circles
    DrawCircle(context, radius, '#d2271a', centerX, centerY); 
    DrawCircle(context, radius/3, 'white', centerX, centerY); 
        
    //center and T lines
    DrawLine(context, canvas.width/2, 0, canvas.width/2, canvas.width, 4, '#111');
    DrawLine(context, canvas.width, canvas.width/2, 0, canvas.width/2, 4, '#111');

    //position of the stone
    var centerx = 150-(stoneX*(radius-5));
    var centery = 150-(stoneY*(radius-5));

    //lines from the measuring point to the stone
    DrawLine(context, 400, 200, centerx+50, centery+50, 8, '#5abc5d');
    DrawLine(context, 200, 400, centerx+50, centery+50, 8, '#0f75bc');

    //the stone
    var img = new Image();
    img.onload = function() {
        context.drawImage(img, centerx, centery);
    }
    img.src =  "img/stone.png";

    var ww = window.innerWidth-35;
    
    //scale the drawing if window too narow
    if(ww<canvas.width){
        canvas.style.width = ww+'px';
        canvas.style.height = ww+'px';
    }else{
        canvas.style.width = '400px';
        canvas.style.height = '400px';
    }
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
    prevStoneX='';
    prevStoneY='';
}

function SimpleLSDCalculation(){
    var fromPinText = $("#fromPin").val().replace(",", ".");
    var fromPin = parseFloat(fromPinText);
	
    //just add the stone radius
    var	res = fromPin*10 + stoneRadius;
	
    res = (res/10).toFixed(1);
    
    //we don't draw this since there is no way to know where the stone is
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
    
    //measured distances in mm
	var from3 = parseFloat(from3Text)*10;
	var from6 = parseFloat(from6Text)*10;
    var res = CalculateLSDDistance(from6, from3);

    if(res.x=="NaN"){
        EraseCanvas();
  	    $("#resultLabel").text("Input value error.");
    }else{
  	    $("#resultLabel").text("x = "+res.x+" cm");
        DrawStoneLocation(res.y, res.z);
    }
}

function CalculateLSDDistance(from6, from3){
    //all values in mm
    //radius of the 4ft circle
    var r = 609.6;
    
    //distance from the 6 o'clock measuring point to the center of the stone
    var a = from6 + stoneRadius;

    //distance from the 3 o'clock measuring point to the center of the stone
    var b = from3 + stoneRadius;

    var A = 2;
    var B = (2*r) - ((b*b - a*a) / r);    
    var C = (b*b - a*a) / (2*r);
    var D = C*C - b*b + r*r;
    var E = Math.sqrt((B*B) - (4*A*D));
		
    var y1 = (-B + E) / (2*A);
    var y2 = (-B - E) / (2*A);
    
    var y = y1>y2 ? y1 : y2;

    var z = C - y;

    var x = Math.sqrt((2*y*y) - ((b*b - a*a) / r)*y + (C*C));
    
    var point = {};
   
    //x is the distance of the stone center to the button in cm
    point.x = (x/10).toFixed(1);
    
    //y is the distance from the T line in percent of the 4ft radius
    point.y = y/r;
    
    //z is the distance from the center line in percent of the 4ft radius
    point.z = -z/r;

    return point;
}
