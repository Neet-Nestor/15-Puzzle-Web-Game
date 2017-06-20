$(document).ready(function () {
	$("#uploadimage").on('submit',(function(e) {
		e.preventDefault();
		$("#message").empty();
		$('#loading').show();
		var file = $("#fileupload")[0].files[0];
		var picData = new FormData();
		picData.append("upfile", file);
		picData.append("picName", file.name);
		$.ajax({
			url: "php/upload.php", // Url to which the request is send
			type: "POST",             // Type of request to be send, called as method
			data: picData, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
			contentType: false,       // The content type used when sending data to the server.
			cache: false,             // To unable request pages to be cached
			processData:false,        // To send DOMDocument or non processed data file it is set to false
			success: function(data)   // A function to be called if request succeeds
			{
				if (data !== "Upload Successfully") {
					alert("Error! " + data);
				} else {
					var tiles = $(".puzzletile");
					for (var i = 0; i < tiles.length; i++) {
						$(tiles[i]).css("background-image","url(img/"+ file.name + ")");
					}
				}
			},
			error: function(data)
			{
				alert("Error! " + data);
			}
		});
	}));
});