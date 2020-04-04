$(document).ready(function(){
    let timeSelector = $("#check-in-form__time");
    let locationSelector = $("#check-in-form__trip");
    locationSelector.change(function(){
        console.log("test");
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
    
    // When the user wants to submit check in form
    $("#check-in-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        let checkInForm = $("#check-in-form");
        let isValid = Validator.checkRequired(checkInForm) && Validator.checkID($("#check-in-form__id-number"));
        let dateInput = $("#check-in-form__date");
        let checkInDate = new Date(dateInput.val());
        let today = new Date();
        if(checkInDate.getTime() < today.getTime()){
            Validator.markInput(dateInput, "*Date has already passed");
            isValid = false;
        }else
            Validator.unmarkInput(dateInput);
        if(isValid){
            Modal.closeModal($("#check-in-modal"));
            Modal.displayBufferModal("Checking-in User");
            // POST request for check in
            $.ajax({
                type: "POST",
                url: "/reservation/check-in",
                data: checkInForm.serialize(),
                success: function(){
                    Modal.displayModalMessage("The user was checked in");
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText);
                },
                complete: function(){
                    Modal.closeBufferModal();
                }
            })
        }
    });

    locationSelector.trigger("change");
});