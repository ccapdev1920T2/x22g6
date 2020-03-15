$(document).ready(function(){
    let studenRegistrationForm = $("#student-registration-form");
    $("#student-registration-form button[type=\"submit\"]").click(function(e){
        e.preventDefault();
        // Validates Inputs
        let isValid = Validator.checkRequired(studenRegistrationForm) &&
            Validator.checkEmail($("#email")) && Validator.checkID($("#id-number")) &&
            Validator.checkEqual($("#password"), $("#confirm-password"));
        if(isValid){
            let bufferModal = Modal.displayBufferModal("Registering");
            // POST request to register student
            $.ajax({
                type: "POST",
                url: "register-student",
                data: studenRegistrationForm.serialize(),
                success: function(){
                    Modal.displayModalMessage(`You're account has been created.  Click <a href="/login">here</a> to login`);
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText);
                },
                complete: function(){
                    console.log(studenRegistrationForm.children("input"));
                    $(studenRegistrationForm.find("input")).each(function(){
                        $(this).val("");
                    });
                    Modal.removeModal(bufferModal);
                }
            })
        }
    })
});