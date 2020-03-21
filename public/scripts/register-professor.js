$(document).ready(function(){
    let professorRegistrationForm = $("#professor-registration-form");
    $("#professor-registration-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        //Validates Input
        let isValid = Validator.checkRequired(professorRegistrationForm) &&
            Validator.checkEmail($("#email")) && Validator.checkID($("#id-number")) &&
            Validator.checkEqual($("#password"), $("#confirm-password"));
        if(isValid){
            Modal.displayBufferModal("Registering Professor");
            // POST request to register professor
            $.ajax({
                type: "POST",
                url: "/register/professor",
                data: professorRegistrationForm.serialize(),
                success: function(){
                    Modal.displayModalMessage("Professor was successfully registered");
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
});
