(function() {
    "use strict";
    
	var start = false;
    var emptyRow = 3;	// the row where the missing square is
    var emptyCol = 3;	// the column where the missing square is
	var timer;
    
	// sets up the events when the page is loaded successfully
    window.onload = function() {
        initPuzzle();
        var puzzles = document.querySelectorAll(".puzzletile");
        for (var i = 0; i < puzzles.length; i++) {
            puzzles[i].onclick = moveClicked;
        }
        $("#shufflebutton").on("click", shuffle);
		$("#imgchoice").on("change", changeImg);
		$("#numberOrNot").on("change", showNum);
    };
	
	function showNum() {
		var serials = document.querySelectorAll(".serial");
		if (document.getElementById("numberOrNot").checked) {
			for (var i = 0; i < serials.length; i++) {
				serials[i].style.visibility = "visible";
			}
		} else {
			for (var i = 0; i < serials.length; i++) {
				serials[i].style.visibility = "hidden";
			}
		}
	}
	
	function changeImg() {
		var tiles = document.querySelectorAll(".puzzletile");
		for (var i = 0; i < tiles.length; i++) {
			tiles[i].style.backgroundImage = "url(img/" + document.getElementById("imgchoice").value + ".jpg)";
		}
	}
	
	// initializes the puzzle, fills it with the 15 pieces in correct position and
	// updates movable tiles
    function initPuzzle() {
        for (var i = 0; i < 15; i++) {
            var puzzleTile = document.createElement("div");
            var row = parseInt(i / 4);
            var col = i % 4;
            puzzleTile.className = "puzzletile";
            puzzleTile.style.backgroundPosition = "-" + col * 100 + "px " + "-" + row * 100 + "px";
            puzzleTile.style.left = col * 100 + "px";
            puzzleTile.style.top = row * 100 + "px";
            puzzleTile.innerHTML = "<span class='serial'>" + parseInt(i + 1) +"</span>";
            puzzleTile.setAttribute("id", "tile" + col + "-" + row);
			puzzleTile.setAttribute("finalPosition", parseInt(i + 1));
            $("#puzzlearea").append(puzzleTile);
        }
		updateMovable();
    }
    
	// be called when the user click one tile
	// if the tile being clicked is movable, moves this tile to the missing square's 
	// position and then updates movable tiles 
    function moveClicked() {
		if (this.classList.contains("movable")) {
        	move(this);
		}
		updateMovable();
    }
    
	// moves the given tile to the missing square's position if it's movable (next 
	// to the missing square)
    function move(tile) {
		var privousX = emptyCol * 100;
		var privousY = emptyRow * 100;
		tile.setAttribute("id", "tile" + emptyCol + "-" + emptyRow);
		emptyCol = tile.offsetLeft / 100;
		emptyRow = tile.offsetTop / 100;
		tile.style.left = privousX + "px";
		tile.style.top = privousY + "px";
		if (start) {
			$("#moveN").html(parseInt($("#moveN").html()) + 1);
			check();
		}
    }
	
	// be called when the user clicks the Shuffle button
	// randomly rearrange the tiles of the puzzle into a solvable ordering
    function shuffle() {   
        for (var i = 0; i < 1000; i++) {
            var neighbors = getNeighbors();
            var rand = parseInt(Math.random() * neighbors.length);
            var tile = document.getElementById(neighbors[rand]);
            move(tile);
        }
		updateMovable();
		start = true;
		document.getElementById("moveN").innerHTML = 0;
		document.getElementById("second").innerHTML = "00";
		document.getElementById("minute").innerHTML = "00";
		if (start) {
			clearInterval(timer);
		}
		timer = setInterval(updateTime, 1000);
    }

	// removes movable class of the old movable tiles, and then adds movable class 
	// to the current neighbor tiles of the missing square
	function updateMovable() {
		var oldMovables = document.querySelectorAll(".movable");
		for (var i = 0; i < oldMovables.length; i++) {
			oldMovables[i].classList.remove("movable");
		}
		var newMovables = getNeighbors();
		for (var i = 0; i < newMovables.length; i++) {
			document.getElementById(newMovables[i]).classList.add("movable");
		}
	}
	
	// returns the neighbor tiles of the missing square
    function getNeighbors() {
        var up = "tile" + emptyCol + "-" + (emptyRow - 1);
        var down = "tile" + emptyCol + "-" + (emptyRow + 1);
        var left = "tile" + (emptyCol - 1) + "-" + emptyRow;
        var right = "tile" + (emptyCol + 1) + "-" + emptyRow;
        var tiles = [up, down, left, right];
        var realNeighbors = [];
        for (var i = 0; i < tiles.length; i++) {
            if (document.getElementById(tiles[i])) {
                realNeighbors.push(tiles[i]);
            }
        }
        return realNeighbors;
    }
	
	function check() {
		var right = (emptyCol === 3 && emptyRow === 3);
		var tiles = document.querySelectorAll(".puzzletile");
		for (var i = 0; i < tiles.length; i++) {
			var num = tiles[i].getAttribute("finalPosition") - 1;
			var col = parseInt(tiles[i].getAttribute("id").substring(4,5));
			var row = parseInt(tiles[i].getAttribute("id").substring(6));
			if (parseInt(num / 4) !==  row || num % 4 !== col) {
				right = false;
				break;
			}
		}
		if (right) {
			alert("You Win!");
			upload();
			start = false;
			clearInterval(timer);
		}
	}
	
	function updateTime() {
		var second = parseInt($("#second").html()) + 1;
		var minute = parseInt($("#minute").html());
		if (second > 59) {
			$("#second").innerHTML = "00";
			minute++;
			if (minute < 10) {
				$("#minute").html() = "0" + minute;
			} else {
				$("#minute").html() = minute;
			}
		} else if (second < 10) {
			$("#second").html("0" + second);
		} else {
			$("#second").html(second);
		}
	}
	
	function upload() {
		if (confirm("Do you want to upload your score?")) {
			var userName = prompt("What's your name?", "Player's Name");
			var seconds = parseInt($("#minute").html()) * 60 + parseInt($("#second").html());
			var moves = parseInt($("#moveN").html());
			debugger;
			$.post("./php/uploadScore.php", {
				"name" : userName,
				"moves" : moves,
				"time" : seconds
			}, function(data, status) {
				if (status == "success" && data["success"]) {
					alert(data["success"] + " Wow!");
				} else {
					alert("Eh..There are some errors while uploading, please contact me or try again!");
					console.log(data);
				}
			});
		}
	}
})();
