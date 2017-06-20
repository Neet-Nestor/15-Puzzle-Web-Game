<?php
	if (!isset($_GET["mode"]) || ($_GET["mode"] != "moves" && $_GET["mode"] != "time")) {
		header("Content-Type: text/plain");
		echo "Bad mode parameter.";
		die();
	}
	
    $db = new PDO('mysql:host=vergil11.u.washington.edu;dbname=puzzleScores;charset=utf8;port=37173', 'root', 'password');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	header("Content-Type: application/json");

	if ($_GET["mode"] == 'moves') {
		$rows = $db->query("select * from Scores order by movesUsed ASC");
		$results = [];
		foreach ($rows as $row) {
			$rowData = ["name" => $row["name"], "moves" => $row["movesUsed"]];
			$results[]= $rowData;
		}
		echo json_encode($results);
	} else {
		$rows = $db->query("select * from Scores order by timeUsed ASC");
		$results = [];
		foreach ($rows as $row) {
			$rowData = ["name" => $row["name"], "time" => $row["timeUsed"]];
			$results[]= $rowData;
		}
		echo json_encode($results);
	}
?>