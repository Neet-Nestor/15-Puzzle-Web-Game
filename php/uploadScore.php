<?php
	// connects to the mysql database using PDO
    $db = new PDO('mysql:host=vergil11.u.washington.edu;dbname=puzzleScores;charset=utf8;port=37173', 'root', 'password');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	if (!isset($_POST["name"])) {
		header("Content-Type: text/plain");
		echo("You need send the name.");
		die();
	}
	if (!isset($_POST["moves"])) {
		header("Content-Type: text/plain");
		echo("You need send the moves.");
		die();
	}	
	if (!isset($_POST["time"])) {
		header("Content-Type: text/plain");
		echo("You need send the time.");
		die();
	}

	$name = $_POST["name"];
	$moves = $_POST["moves"];
	$time = $_POST["time"];
	
	if (checkExists($name, $db)) {	// if this name already exists in database
		$previousRow = $db->query("SELECT * FROM Scores WHERE name LIKE '$name'");
		$previousData = $previousRow->fetch();
		$newMoves = min($moves, $previousData["movesUsed"]);
		$newTime = min($time, $previousData["timeUsed"]);
		$db->exec("UPDATE Scores SET movesUsed = '$newMoves', timeUsed = '$newTime'
				   WHERE name LIKE '$name'");
		header("Content-Type: application/json");
		echo json_encode(['success' => 'You have updated your score successful!']);
	} else {
		$db->exec("INSERT INTO Scores (name, movesUsed, timeUsed)
				   VALUES ('$name', '$moves', '$time')");
		header("Content-Type: application/json");
		echo json_encode(['success' => 'You have uploaded your score successful!']);
	}

	function checkExists($name, $db) {
		$row = $db->query("SELECT * FROM Scores WHERE name LIKE '$name'");
		return $row->rowCount();
	}
?>