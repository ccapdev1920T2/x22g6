$(document).ready(function(){
    let timeSelector = $("#check-in-form__time");
    let locationSelector = $("#check-in-form__trip");
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
				for(let i=0; i<data.length; ++i){
					let text = document.createTextNode(data[i].presentation);
					timeSelector.append($("<option>").attr("value", data[i].value).append(text));
                }
                timeSelector.prop("disabled", false);
            },
            error: function(){
                if(xhrTimeSlots.readyState === 4)
                    timeSelector.find("option").html("Cannot retrieve time slots");
            }
		});
	});
    
    // When the user wants to submit check in form
    $("#check-in-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        let checkInForm = $("#check-in-form");
        let dateInput = $("#check-in-form__date");
        let isValid = Validator.checkRequired(checkInForm) & Validator.checkID($("#check-in-form__id-number"))
            & Validator.checkWeekend(dateInput) & Validator.checkDatePassed(dateInput);
        if(isValid){
            Modal.closeModal($("#check-in-modal"));
            Modal.displayBufferModal("Checking-in User");
            // POST request for check in
            $.ajax({
                type: "POST",
                url: "/reservation/check-in",
                data: checkInForm.serialize(),
                success: function(){
                    Modal.displayModalMessage("The user was checked in", true);
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText, false);
                },
                complete: function(){
                    Modal.closeBufferModal();
                }
            })
        }
    });

    locationSelector.trigger("change");
});