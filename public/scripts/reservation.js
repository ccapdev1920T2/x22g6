$(document).ready(function(){
	let timeSelector = $("#reservation-form__time");
	let locationSelector = $("#reservation-form__location");
	let reservationForm = $("#reservation-form");
	let dateInput = $("#reservation-form__date");

	let currentDate = new Date(dateInput.val());
	let xhrTimeSlots;

	locationSelector.change(function(){
		if(xhrTimeSlots && xhrTimeSlots.readyState !== 4)
        	xhrTimeSlots.abort();
		timeSelector.prop("disabled", true);
		timeSelector.children().remove();
		timeSelector.append($("<option>").html("Loading..."));
		xhrTimeSlots = $.ajax({
			type: "GET",
			url: "/schedule/time-slots/" + locationSelector.val(),
			success: function(data){
				timeSelector.children().remove();
				timeSelector.prop("disabled", false);
				for(let i=0; i<data.length; ++i){
					let text = document.createTextNode(data[i].presentation);
					timeSelector.append($("<option>").attr("value", data[i].value).append(text));
				}
			},
			error: function(jqxhr){
				if(xhrTimeSlots.readyState === 4)
					timeSelector.find("option").html("Cannot retrieve time slots");
			}
		});
	});

	locationSelector.trigger("change");

	// When the user submits the reservation form
	$("#reservation-form button[type=\"submit\"").click(function(e){
		e.preventDefault();
		let reservationDate = new Date(dateInput.val());
		let reservationDay = reservationDate.getDay();
		let isValid = Validator.checkRequired(reservationForm) & Validator.checkWeekend(dateInput)
			& Validator.checkDatePassed(dateInput);
		let headers = {};		
		if(window.location.pathname === "/reservation/my-reservations")
			headers["Time-Slot-HTML"] = "true";
	
		if(isValid){
			Modal.closeModal($("#reservation-modal"));
			Modal.displayBufferModal("Making Reservation");
			$.ajax({
				type: "POST",
				url: "/reservation/create",
				headers: headers,
				data: reservationForm.serialize(),
				success: function(data){
					let date = new Date($("#reservation-form__date").val() + "T00:00:00");
					let dateString = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
					let time = $("#reservation-form__time option:selected").text();
					let trip = $("#reservation-form__location option:selected").text();
					Modal.displayModalMessage(`You reservation has been made on <b>${dateString} ${time} from ${trip}<b>`, true);
					if(window.location.pathname === "/reservation/my-reservations")
						addNewTimeSlot(data);
					
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText, false);
				},
				complete: function(){
					Modal.closeBufferModal();
				}
			});
		}
	});
});