$(document).ready(function(){
    let loginForm = $("#login-form");
    $("#login-form button[type=\"submit\"").click(function(e){
        e.preventDefault();
        // Validates inputs
        let isValid = Validator.checkRequired(loginForm) && Validator.checkEmail($("#login-form #email"));
        if(isValid){
            Modal.displayBufferModal("Logging In");
            // POST request for logging ing
            $.ajax({
                type: "POST",
                url: "/login",
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