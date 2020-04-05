$(document).ready(function(){
    let professorRegistrationForm = $("#prof-registration-form");
    $("#prof-registration-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        //Validates Input
        let isValid = Validator.checkRequired(professorRegistrationForm) &&
            Validator.checkEmail($("#prof-registration-form__email")) && Validator.checkID($("#prof-registration-form__id-number")) &&
            Validator.checkEqual($("#prof-registration-form__password"), $("#prof-registration-form__confirm-password"));
        if(isValid){
            Modal.displayBufferModal("Registering Professor");
            // POST request to register professor
            $.ajax({
                type: "POST",
                url: "/register/professor",
                data: professorRegistrationForm.serialize(),
                success: function(){
                    Modal.displayModalMessage("Professor was successfully registered", true);
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
