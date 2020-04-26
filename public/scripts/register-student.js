$(document).ready(function(){
    let passwordInput = $("#password");
    let confirmPasswordInput = $("#confirm-password");
    let studenRegistrationForm = $("#student-registration-form");
    $("#student-registration-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        // Validates Inputs
        let isValid = Validator.checkRequired(studenRegistrationForm) &
            Validator.checkEmail($("#email")) & Validator.checkID($("#id-number")) &
            Validator.checkEqual(passwordInput, confirmPasswordInput, passwordInput.attr("data-err-message")) 
            & Validator.checkMinLength(passwordInput) & Validator.checkMinLength(confirmPasswordInput);
        if(isValid){
            Modal.displayBufferModal("Registering");
            // POST request to register student
            $.ajax({
                type: "POST",
                url: "/register/student",
                data: studenRegistrationForm.serialize(),
                success: function(){
                    Modal.displayModalMessage(`You're account has been created.  You must first verify your email to login`, true);
                    $(studenRegistrationForm.find("input")).each(function(){
                        $(this).val("");
                    });
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText, false);
                },
                complete: function(){
                    Modal.closeBufferModal();
                }
            })
        }
    })
});