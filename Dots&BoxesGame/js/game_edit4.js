var boxes = [];
var turn = true;
var you = 0;
var comp = 0;

const tool = document.querySelector(".tool");
const newgame = tool.querySelector(".newgame");
const body = document.querySelector("body");
const game = document.querySelector(".game");
const option = document.querySelector(".option");
newgame.addEventListener("click",function(){
	console.log("click");
	Swal.fire({
		title: 'New Game?',
		// text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes'
	  }).then((result) => {
		if (result.isConfirmed) {
			isConfirmed();
		}
	  });
    
});
function isConfirmed(){
	option.classList.remove("hind");
    game.classList.add("hind");
	body.style.backgroundColor = "#96d2be";
	you = 0;
	comp = 0;
	$(".player2").html('<i class="fa-solid fa-splotch"></i> You : ' + you);
	$(".player1").html('<i class="fa-solid fa-robot"></i> AI : ' + comp);
}

function init(size){
	
	boxes = [];
	turn = true;
	you = 0;
	comp = 0;
	let board_size = size;
	var m ;
	var n ;
	
	if(board_size=="3x3"){
		m=2;
		n=2;
	}
	else if(board_size=="5x5"){
		m=3;
		n=3;
	}
	else if(board_size=="7x7"){
		m=4;
		n=4;
	}

	var offset = 70;

	var sx= sx = window.innerWidth/2 - (m*offset)/2,
	sy = offset*5.5;
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
			boxes.push({count:0,line:[]});
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
		boxes[id1].line.push(id2);

		if(checkValid(this) && turn){	
			var a = false, b = false;

			if(id1 >= 0) var a = addValue(id1);
			if(id2 >= 0) var b = addValue(id2);

			
			console.log(boxes);

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

	if(full){
		var winner,gifURL,text;
		if(you>comp){
			winner = "You won!"
			gifURL ="https://thenewdaily.com.au/wp-content/uploads/2023/02/1676249684-Dumb-Ways-to-Die.gif"
			text ="You did it!"
		}
		else if(you==comp){
			winner ="Draw!"
			gifURL = "https://aml.ca/wp-content/uploads/2013/12/dumbOpenDoor.gif"
			text ="Once more... You can do it!"

		}
		else{
			winner = "You lose"
			gifURL = "https://i.pinimg.com/originals/13/1b/7b/131b7b3bc33d168b9140ab2a3caa2e08.gif"
			text ="Never give up"
		}
		Swal.fire({
			title: winner,
			text: text,
			imageUrl: gifURL,
			backdrop: `rgba(0,0,123,0.4)`,
			imageHeight: 200,
			imageAlt: 'Custom image',
			confirmButtonText: 'Play Again',
		}).then((result) => {
		  if (result.isConfirmed) {
			  isConfirmed();
		  }
  });
  function isConfirmed(){
	  option.classList.remove("hind");
	  game.classList.add("hind");
	  body.style.backgroundColor = "#96d2be";
	  you = 0;
	  comp = 0;
		$(".player2").html('<i class="fa-solid fa-splotch"></i> You : ' + you);
		$(".player1").html('<i class="fa-solid fa-robot"></i> AI : ' + comp);
  }
	};
}


function addValue(id){
	boxes[id].count++;
	if(boxes[id].count === 4){
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
	$("#turn").text("Turn : " + "AI");acquire

	setTimeout(function(){		
		var bestScore = -Infinity;
		var bestMove;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i].count === 0){
				boxes[i].count = 1;
				var score = minimax(boxes, 0, false);
				boxes[i].count = 0;
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
	if(depth === 3){
		var score = 0;
		for(var i=0; i<boxes.length; i++){
			if(boxes[i].count == 1){
				score += 1;
			}else if(boxes[i].count == 2){
				score -= 100;
			}else if(boxes[i].count == 3){
				score += 100;
			}
		}
		return score;
	}

	if (isMaximizing) {
		var bestScore = -Infinity;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i].count === 0){
				boxes[i].count = 1;
				var score = minimax(boxes, depth+1, false);
				boxes[i].count = 0;
				bestScore = Math.max(score, bestScore);
			}
		}
		return bestScore;
	} else {
		var bestScore = Infinity;
		for (var i = 0; i < boxes.length; i++) {
			if(boxes[i].count === 0){
				boxes[i].count = 2;
				var score = minimax(boxes, depth+1, true);
				boxes[i].count = 0;
				bestScore = Math.min(score, bestScore);
			}
		}
		return bestScore;
	}
}


function computerSelect(id,valid=true){
	console.log("Box " + id);
	if(id == undefined){
		for(var i=0; i<boxes.length; i++){
			if(boxes[i].count != 2){
				if(boxes[i].count == 3){
					id=i;
				}
				else if(boxes[i].count < 2){
					id=i;
				}
			}
		}
	}
	if(id == undefined){
		for(var i=0; i<boxes.length; i++){
			if(boxes[i].count <4 ){
				id=i;
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
			boxes[id1].line.push(id2);
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
