$(document).ready(function(){
	let timeSelector = $("#reservation-form__time");
	let locationSelector = $("#reservation-form__location");
	let reservationForm = $("#reservation-form");

	locationSelector.change(function(){
		$.ajax({
			type: "GET",
			url: "/schedule/time-slots/" + locationSelector.val(),
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
		let isValid = Validator.checkRequired(reservationForm);
		if(isValid){
			Modal.closeModal($("#reservation-modal"));
			Modal.displayBufferModal("Making Reservation");
			$.ajax({
				type: "POST",
				url: "/reservation/create",
				data: reservationForm.serialize(),
				success: function(){
					Modal.displayModalMessage("You reservation has been made");
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
					console.log(window.location.href);
				},
				complete: function(){
					Modal.closeBufferModal();
				}
			});
		}
	});

});