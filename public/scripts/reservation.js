$(document).ready(function(){
	let timeSelector = $("#reservation-form__time");
	let locationSelector = $("#reservation-form__location");
	let reservationForm = $("#reservation-form");
	let dateInput = $("#reservation-form__date");

	let currentDate = new Date(dateInput.val());

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

	locationSelector.trigger("change");

	// When the user submits the reservation form
	$("#reservation-form button[type=\"submit\"").click(function(e){
		e.preventDefault();
		let reservationDate = new Date(dateInput.val());
		let reservationDay = reservationDate.getDay();
		let isValid = Validator.checkRequired(reservationForm);
		let headers = {};
		// Checks if the reservation is on a weekend
		if(reservationDay === 0 || reservationDay === 6){
			Validator.markInput(dateInput);
			isValid = false;
		}else
			Validator.unmarkInput(dateInput);
		//Checks if reservation is on a day before
		if(reservationDate.getTime() < currentDate.getTime()){
			Validator.markInput(dateInput);
			isValid = false;
		}else
			Validator.unmarkInput(dateInput);
		
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
					let parseBase10 = (string) => parseInt(string, 10);
					Modal.displayModalMessage("You reservation has been made");
					
					

					if(window.location.pathname === "/reservation/my-reservations"){
						let parsedContainer = $($.parseHTML(data)[0]);
						let parsedMonth = parseBase10(parsedContainer.attr("data-month-num"));
						let parsedYear = parseBase10(parsedContainer.attr("data-year"));
						let monthContainer = getMonthContainer(parsedMonth, parsedYear);
						// Checks if reservation is today
						let today = new Date();
						today.setHours(0, 0, 0, 0);
						let timeSlotElem = $(parsedContainer.find(".time-slot")[0]);
						// If reservation is today
						if(today.getTime() === new Date(timeSlotElem.attr("data-reservation-date")).getTime()){
							let timeSlotsToday = $("#time-slots-today");
							if(timeSlotsToday.hasClass("container__content-section--text-centered")){
								timeSlotsToday.removeClass("container__content-section--text-centered").empty().append(timeSlotElem);
							}else{
								let otherTimeSlot = $(timeSlotsToday.find(".time-slot")[0]);
								if(parseBase10(otherTimeSlot.attr("data-reservation-time")) > parseBase10(timeSlotElem.attr("data-reservation-time")))
									timeSlotElem.insertBefore(otherTimeSlot);
								else
									timeSlotElem.insertAfter(otherTimeSlot);

							}
							
							return;
						}
						// If reservation is in the upcoming days
						if(monthContainer.length !== 0){
							// Month container exists
							parsedContainer = $(parsedContainer.children(".calendar__day-reservations")[0]);
							let parsedDay = parsedContainer.attr("data-day")
							let dayContainer = getDayContainer(monthContainer, parsedDay);
							if(dayContainer.length !== 0){
								// Day container exists
								parsedContainer = timeSlotElem;
								let otherDaySlot = $(dayContainer.find(".time-slot")[0]);
								let otherTimeValue = otherDaySlot.attr("data-reservation-time");
								let parsedTimeValue = parsedContainer.attr("data-reservation-time");
								if(parseBase10(otherTimeValue) > parseBase10(parsedTimeValue)){
									parsedContainer.insertBefore(otherDaySlot);
								}else{
									parsedContainer.insertAfter(otherDaySlot);
								}
							}else{
								// Day cotainer does not exists
								let dayContainersForMonth = $(monthContainer.children(".calendar__day-reservations"));
								let i;
								for(i=0; i<dayContainersForMonth.length; ++i){
									let current = $(dayContainersForMonth[i])
									let currentDay = current.attr("data-day");
									if(parseBase10(currentDay) > parseBase10(parsedDay)){
										parsedContainer.insertBefore(current);
										break;
									}
								}
								if(i === dayContainersForMonth.length){
									parsedContainer.insertAfter(dayContainersForMonth[i - 1]);
								}
							}
						}else{
							// Month container does not exists
							let allMonthContainers = $(".calendar__month-reservations");
							if(allMonthContainers.length === 0){
								let timeSlotsFuture = $("#time-slots-future");
								timeSlotsFuture.removeClass("container__content-section--text-centered");
								timeSlotsFuture.empty();
								timeSlotsFuture.append(parsedContainer);
								return;
							}
							let i;
							for(i=0; i<allMonthContainers.length; ++i){
								let current = $(allMonthContainers[i]);
								let currentYear = parseBase10(current.attr("data-year"));
								let currentMonth = parseBase10(current.attr("data-month-num"));
								if(currentYear > parsedYear){
									parsedContainer.insertBefore(current);
									break;
								}else if(currentYear == parsedYear && currentMonth > parsedMonth){
									parsedContainer.insertBefore(current);
									break;
								}	
							}
							if(i === allMonthContainers.length){
								parsedContainer.insertAfter(allMonthContainers[i - 1]);
							}
						}
					}
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					Modal.closeBufferModal();
				}
			});
		}
	});

	function getMonthContainer(monthNum, year){
		return $($("#time-slots-future").children(`[data-month-num=${monthNum}][data-year=${year}]`)[0]);
    }
    
    function getDayContainer(monthContainer, day){
        return $(monthContainer.children(`[data-day=${day}]`));
	}

});