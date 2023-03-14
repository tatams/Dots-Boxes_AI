var boxes = [];
var turn = true;
var you = 0;
var comp = 0;
const tool = document.querySelector(".tool");
const newgame = tool.querySelector(".newgame");

newgame.addEventListener("click",function(){
	
});

function init(size){
	
	boxes = [];
	turn = true;
	you = 0;
	comp = 0;
	let board_size = size;
	var m ;
	var n ;
	
	if(board_size=="3x3"){
		m=3;
		n=3;
	}
	else if(board_size=="5x5"){
		m=5;
		n=5;
	}
	else if(board_size=="7x7"){
		m=7;
		n=7;
	}

	var offset = 60;

	var sx= sx = window.innerWidth/2 - (m*offset)/2,
	sy = offset*6.5;
	var html = "";
	$("#app").html(html);
	var c = 0;
	
	for(var j=0; j<m; j++){
		for(var i=0; i<n; i++){

			var x = sx + i * offset,
				y = sy + j * offset;
			if(i==0){
				html += `
				<div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
				<div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				<div class="line linev" data-line-1="${c}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;
			}
			else{
				html += `
				<div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
				<div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				<div class="line linev" data-line-1="${c}" data-line-2="${c-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;			
			}
			boxes.push(0);
			c++;
		}
	}

	//right boxes
	for(var i=0; i<n; i++){
		var x = sx + m * offset,
			y = sy + i * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line linev" data-line-1="${m*(i+1)-1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//bottom boxes
	for(var i=0; i<m; i++){
		var x = sx + i * offset,
			y = sy + n * offset;
		html += `				
				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
				<div class="line lineh" data-line-1="${((n-1)*m)+i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
				`;		
	}

	//right-bottom most dot
	html += `<div class="dot" style="z-index=${i}; left:${sx+m*offset-5}px; top:${sy+n*offset-5}px" data-active="false"></div>`
	
	//append to dom
	$("#app").html(html);
	applyEvents();
}

function applyEvents(){
	$("div.line").unbind('click').bind('click', function(){

		var id1 = parseInt($(this).attr("data-line-1"));
		var id2 = parseInt($(this).attr("data-line-2"));  
		console.log("id1=",id1, " id2=",id2)
		if(checkValid(this) && turn){	
			var a = false, b = false;

			if(id1 >= 0) var a = addValue(id1);
			if(id2 >= 0) var b = addValue(id2);
			$(this).addClass("line-active");
			$(this).css("background-color","rgb(27, 85, 52)");	
			$(this).attr("data-active", "true");

			if(a === false && b === false){
				computer();	
			}			
		}	
	});
}

function acquire(id){

	var color;
	if(turn){
		color = "seagreen";
		you++;
	}else{
		color = "tomato";
		comp++;
	}
	
	$("div.box[data-id='"+id+"']").css("background-color", color);	
	boxes[id] = "full";

	$(".player2").html('<i class="fa-solid fa-splotch"></i> You : ' + you);
	$(".player1").html('<i class="fa-solid fa-robot"></i> AI : ' + comp);

	var full = true;
	for(var i=boxes.length-1; i>=0; i--){
		if(boxes[i] != "full"){
			full = false;
			break;
		}
	}
	console.log("full : "+full)
	console.log("boxes[i] : "+boxes[i]+" i :"+i)

	if(full){
		var winner;
		if(you>comp){
			winner = "You won"
		}
		else if(you=comp){
			winner ="Draw"
		}
		else{
			winner = "AI won"
		}
		Swal.fire({
			title: winner,
			showClass: {
			  popup: 'animate__animated animate__fadeInDown'
			},
			hideClass: {
			  popup: 'animate__animated animate__fadeOutUp'
			}
		  })
	};
}


function addValue(id){
	boxes[id]++;
	if(boxes[id] === 4){
		acquire(id);
		return true;
	}
	return false;
}


function checkValid(t){
	return($(t).attr("data-active") === "false");
}

function computer(){
	turn = false;
	$("#turn").text("Turn : " + "AI");

	setTimeout(function(){		
		var bestScore = -Infinity;
		var bestMove;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i] === 0){
				boxes[i] = 1;
				var score = minimax(boxes, 0, false);
				boxes[i] = 0;
				if (score > bestScore) {
					bestScore = score;
					bestMove = i;
					console.log("best=",bestMove);
				}
			}
		}
		computerSelect(bestMove);
	}, 500);

}

function minimax(boxes, depth, isMaximizing) {
	var result = checkWinner(boxes);
	if (result !== null) {
		return result;
	}

	if (isMaximizing) {
		var bestScore = -Infinity;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i] === 0){
				boxes[i] = 1;
				var score = minimax(boxes, depth + 1, false);
				boxes[i] = 0;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		var bestScore = Infinity;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i] === 0){
				boxes[i] = -1;
				var score = minimax(boxes, depth + 1, true);
				boxes[i] = 0;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}

function checkWinner(boxes) {
	var sum;
	for (var i = 0; i < 3; i++) {
		sum = boxes[i] + boxes[i + 3] + boxes[i + 6] + boxes[i + 9];
		if (sum === 4) {
			return 1;
		} else if (sum === -4) {
			return -1;
		}
	}

	for (var i = 0; i < 12; i += 3) {
		sum = boxes[i] + boxes[i + 1] + boxes[i + 2];
		if (sum === 3) {
			return 1;
		} else if (sum === -3) {
			return -1;
		}
	}

	sum = boxes[0] + boxes[4] + boxes[8];
	if (sum === 3) {
		return 1;
	} else if (sum === -3) {
		return -1;
	}

	sum = boxes[2] + boxes[4] + boxes[6];
	if (sum === 3) {
		return 1;
	} else if (sum === -3) {
		return -1;
	}

	return null;
}

function selectBox(){

}


function computerSelect(id,valid=true){
	console.log("Box " + id);
	if(id == undefined){
		for(var i=0; i<boxes.length; i++){
			if(boxes[i] < 4){
				computerSelect(i);
			}
		}
	}
	if(!valid){
		turn = true;
		$("#turn").text("Turn - " + "You");
	}
	$("div.line[data-line-1='"+id+"'], div.line[data-line-2='"+id+"']").each(function(i, v){		
		if(!$(v).hasClass("line-active")){
			var id1 = parseInt($(v).attr("data-line-1"));
			var id2 = parseInt($(v).attr("data-line-2"));  

			//console.log("----- " + turn);

			if(checkValid(v) && turn === false){
				//console.log("-----");
				if(id1 >= 0) var a = addValue(id1);
				if(id2 >= 0) var b = addValue(id2);
				$(v).addClass("line-active");
				$(this).css("background-color","rgb(209, 53, 25)");	
				$(v).attr("data-active", "true");
				
				console.log("idAi=",id1,id2)

				if(a === true || b === true){
					computer();	
				}else{
					turn = true;
					$("#turn").text("Turn - " + "You");
				}					
			}
		}
	});
}
