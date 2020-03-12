$(document).ready(function(){
	let timeSelector = $("#reservation-time");
	let locationSelector = $("#reservation-location");
	let reservationForm = $("#reservation-form");

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

	// When the user submits the reservation form
	$("#reservation-form button[type=\"submit\"").click(function(e){
		e.preventDefault();
		console.log("test");
		let isValid = Validator.checkRequired(reservationForm);
		if(isValid){
			$.ajax({
				type: "POST",
				url: "/reserve",
				success: function(){
					Modal.displayModalMessage("You reservation has been made");
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					Modal.closeModal($("#reservation-modal"));
				}
			});
		}
	});


});