$(document).ready(function(){
    let loginForm = $("#login-form");
    $("#login-form button[type=\"submit\"").click(function(e){
        e.preventDefault();
        // Validates inputs
        let isValid = Validator.checkRequired(loginForm) && Validator.checkEmail($("#login-form__email"));
        if(isValid){
            Modal.displayBufferModal("Logging In");
            // POST request for logging ing
            $.ajax({
                type: "POST",
                url: "/login",
                data: loginForm.serialize(),
                success: function(data){
                    window.location.href = data;
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText);
                },
                complete: function(){
                    Modal.closeBufferModal();
                }
            });
        }
    })
});