jQuery(document).ready(function() {
	"use strict";
	$("#showscore").click(getScores);
});

function getScores() {
	if ($("#scorescont").css("display") == "none") {
		$("#loading-1").show();
		$("#loading-2").show();
		$("#leastmove ol").html("");
		$("#leasttime ol").html("");
		$("#loading-break1").show();
		$("#loading-break2").show();
		$("#scorescont").slideToggle();
		$.get("./php/getScores.php?mode=moves", function(data, status) {
			if (status === "success") {
				for (var i = 0; i < data.length; i++) {
					var row = data[i];
					var newLi = document.createElement("li");
					$(newLi).html(row['name'] + " -- Moves " + row['moves']);
					$("#leastmove ol").append(newLi);	// clean the current content
				}
				$("#loading-1").hide();
				$("#loading-break1").hide();
			} else {
				alert("Error! Cannot load the moves data. Error type: " + status);
			}
		});

		$.get("./php/getScores.php?mode=time", function(data, status) {
			if (status === "success") {
				for (var i = 0; i < data.length; i++) {
					var row = data[i];
					var newLi = document.createElement("li");
					var time = "";
					if (row['time'] % 60 < 10) {
						time = time + "" + parseInt(row['time'] / 60) + ":0" + row['time'] % 60;
					} else {
						time = time + "" + parseInt(row['time'] / 60) + ":" + row['time'] % 60;
					}
					$(newLi).html(row['name'] + " -- Time " + time);
					$("#leasttime ol").append(newLi);	// clean the current content
				}
				$("#loading-2").hide();
				$("#loading-break2").hide();
			} else {
				alert("Error! Cannot load the time data. Error type: " + status);
			}
		});
	} else {
		$("#scorescont").slideToggle();
	}
}