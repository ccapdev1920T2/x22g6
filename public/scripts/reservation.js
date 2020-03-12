$(document).ready(function(){
	let timeSelector = $("#reservation-time");
	let locationSelector = $("#reservation-location");

	locationSelector.change(function(){
		$.ajax({
			type: "GET",
			url: "/location/" + locationSelector.val(),
			success: function(data){
				timeSelector.children().remove();
				for(let i=0; i<data.length; ++i){
					let text = document.createTextNode(data[i].presentation);
					timeSelector.append($("<option>").attr("value", data[i].value).append(text));
				}
			}
		});
	});
});