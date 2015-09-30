$(document).ready(function() { 
	$("input[type='text']").on("click", function () {
   		$(this).select();
	});
});

var stoneRadius = 142;

function StartLSDCalculaton(){
	var fromPinText = $("#fromPin").val().replace(",", ".");
	var from3Text = $("#from3").val().replace(",", ".");
	var from6Text = $("#from6").val().replace(",", ".");	
	
	var res = 0.0;
	if(fromPinText!=""){
		var fromPin = parseFloat(fromPinText);
		res = fromPin*10 + stoneRadius;
		res = (res/10).toFixed(1);
	}else{

		var from3 = parseFloat(from3Text)*10;
		var from6 = parseFloat(from6Text)*10;

		res = CalculateLSDDistance(from6, from3);
	}


  	$("#resultLabel").text(res+" cm");
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

	return (x/10).toFixed(1);
}
