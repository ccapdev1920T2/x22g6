$(document).ready(function(){
    // When the user wants to submit check in form
    $("#check-in-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        let checkInForm = $("#check-in-form");
        let isValid = Validator.checkRequired(checkInForm) && Validator.checkID($("#check-in-form__id-number"));
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
    })
});