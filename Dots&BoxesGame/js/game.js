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
		m=2;
		n=2;
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
	console.log("-------------------------")
	console.log("id:"+id)
	console.log("boxes[id]:"+boxes[id])
	
	console.log("-------------------------")
	for(var i=boxes.length-1; i>=0; i--){
		console.log("i:"+i)
		console.log("boxes[i]:"+boxes[i])
		if(boxes[i] != "full"){
			full = false;
			break;
		}
	}
	console.log("full:"+full)
	console.log("-------------------------")
	


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
	console.log(boxes[id],id);
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

		//play
		var length = boxes.length;

		var arr3 = [], arr2 = [], arr1 = [], arr0 = [];
		
		for(var i=length-1; i>=0; i--){
			if(boxes[i] === 3) arr3.push(i);
			else if(boxes[i] === 2) arr2.push(i);
			else if(boxes[i] === 1) arr1.push(i);
			else if(boxes[i] === 0) arr0.push(i);
			//else arr0.push(i);
		}
		console.log("arr0=",arr0);
		//best case
		if(arr3.length > 0){
			console.log("best case");
			computerSelect(arr3[random(0, arr3.length-1)]);
		}

		//better case
		else if(arr1.length > 0){
			console.log("better case");
			computerSelect(arr1[random(0, arr1.length-1)]);
		}

		//normal case
		else if(arr0.length > 0){
			console.log("normal case");
			computerSelect(arr0[random(0, arr0.length-1)]);
		}

		//worst case
		else if(arr2.length > 0){
			console.log("worst case");
			computerSelect(arr2[random(0, arr2.length-1)]);
		}
		else{
			console.log("No valid boxes");
			computerSelect(arr2[random(0, arr2.length-1)],false);
		}
		
	}, 500);

}

function selectBox(){

}


function computerSelect(id,valid=true){
	console.log("Box " + id);
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

function random(min, max){        
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//===================================================

// 	var sx= sx = window.innerWidth/2 - (m*offset)/2,
// 	sy = offset*6.5;
// 	var html = "";
// 	$("#app").html(html);
// 	var c = 0;
// 	for(var j=0; j<m; j++){
// 		for(var i=0; i<n; i++){

// 			var x = sx + i * offset,
// 				y = sy + j * offset;

// 			html += `
// 				<div class="box" data-id="${c}" style="z-index=${i-1}; left:${x+2.5}px; top:${y+2.5}px"></div>
// 				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>						
// 				<div class="line lineh" data-line-1="${c}" data-line-2="${c-m}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
// 				<div class="line linev" data-line-1="${c}" data-line-2="${c-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
// 				`;			
// 			boxes.push(0);
// 			c++;
// 		}
// 	}

// 	//right boxes
// 	for(var i=0; i<n; i++){
// 		var x = sx + m * offset,
// 			y = sy + i * offset;
// 		html += `				
// 				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
// 				<div class="line linev" data-line-1="${m*(i+1)-1}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
// 				`;		
// 	}

// 	//bottom boxes
// 	for(var i=0; i<m; i++){
// 		var x = sx + i * offset,
// 			y = sy + n * offset;
// 		html += `				
// 				<div class="dot" style="z-index=${i}; left:${x-5}px; top:${y-5}px" data-box="${c}"></div>
// 				<div class="line lineh" data-line-1="${((n-1)*m)+i}" data-line-2="${-1}" style="z-index=${i}; left:${x}px; top:${y}px" data-active="false"></div>
// 				`;		
// 	}

// 	//right-bottom most dot
// 	html += `<div class="dot" style="z-index=${i}; left:${sx+m*offset-5}px; top:${sy+n*offset-5}px" data-active="false"></div>`
	
// 	//append to dom
// 	$("#app").html(html);
// 	applyEvents();
// }

// function applyEvents(){
// 	$("div.line").unbind('click').bind('click', function(){

// 		var id1 = parseInt($(this).attr("data-line-1"));
// 		var id2 = parseInt($(this).attr("data-line-2"));  
		
// 		if(checkValid(this) && turn){	
// 			var a = false, b = false;
// 			var color ="rgb(27, 85, 52)";
// 			if(id1 >= 0) var a = addValue(id1);
// 			if(id2 >= 0) var b = addValue(id2);
// 			$(this).addClass("line-active");
// 			$(this).css("background-color", color);	
// 			$(this).attr("data-active", "true");

// 			if(a === false && b === false){
// 				computer();	
// 			}			
// 		}	
// 	});
// }

// function acquire(id){

// 	var color;
// 	if(turn){
// 		// color = "salmon";
// 		color = "seagreen";
// 		you++;
// 	}else{
// 		// color = "skyblue";
// 		color = "tomato";
// 		comp++;
// 	}
	
// 	$("div.box[data-id='"+id+"']").css("background-color", color);	
// 	// boxes[id] = "full"; ***

// 	$(".player2").html('<i class="fa-solid fa-splotch"></i> You : '+ you);
// 	$(".player1").html('<i class="fa-solid fa-robot"></i> AI : '+ comp);

// 	var full = true;
// 	for(var i=boxes.length-1; i>=0; i--){
// 		if(boxes[i] != false){
// 			full = false;
// 			break;
// 		}
// 	}

// 	if(full) alert(((you>comp) ? "You": "AI") + " won");
// }


// function addValue(id){
// 	boxes[id]++;

// 	if(boxes[id] === 4){
// 		acquire(id);
// 		return true;
// 	}
// 	return false;
// }


// function checkValid(t){
// 	return($(t).attr("data-active") === "false");
// }

// function computer(){
// 	turn = false;
// 	$("#turn").text("Turn - " + "AI");

// 	setTimeout(function(){		

// 		//play
// 		var length = boxes.length;

// 		var arr3 = [], arr2 = [], arr1 = [], arr0 = [];

// 		for(var i=length-1; i>=0; i--){
// 			if(boxes[i] === 3) arr3.push(i);
// 			else if(boxes[i] === 2) arr2.push(i);
// 			else if(boxes[i] === 1) arr1.push(i);
// 			else arr0.push(i);
// 		}

// 		//best case
// 		if(arr3.length > 0){
// 			computerSelect(arr3[random(0, arr3.length-1)]);
// 		}

// 		//better case
// 		else if(arr1.length > 0){
// 			computerSelect(arr1[random(0, arr1.length-1)]);
// 		}

// 		//normal case
// 		else if(arr0.length > 0){
// 			computerSelect(arr0[random(0, arr0.length-1)]);
// 		}

// 		//worst case
// 		else if(arr2.length > 0){
// 			computerSelect(arr2[random(0, arr2.length-1)]);
// 		}
		
// 	}, 600);

// }

// function selectBox(){

// }


// function computerSelect(id){
// 	console.log("Box " + id);

// 	$("div.line[data-line-1='"+id+"'], div.line[data-line-2='"+id+"']").each(function(i, v){		
// 		if(!$(v).hasClass("line-active")){
// 			var id1 = parseInt($(v).attr("data-line-1"));
// 			var id2 = parseInt($(v).attr("data-line-2"));  

// 			console.log("----- " + turn);

// 			if(checkValid(v) && turn === false){
// 				var color ="rgb(209, 53, 25)";
// 				console.log("-----");
// 				if(id1 >= 0) var a = addValue(id1);
// 				if(id2 >= 0) var b = addValue(id2);
// 				$(v).addClass("line-active");
// 				$(this).css("background-color", color);	
// 				$(v).attr("data-active", "true");

// 				if(a === true || b === true){
// 					computer();	
// 				}else{
// 					turn = true;
// 					$("#turn").text("Turn - " + "You");
// 				}					
// 			}
// 		}
// 	});
// }

// function random(min, max){        
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }