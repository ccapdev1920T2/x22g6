$(document).ready(function(){
    $("#cancel_profile").click(function(e){
		$("#edit_profile").html("Edit Profile");
		$("#change_password").show();
		$("#form__profile input").attr('disabled', 'disabled');
		$("#cancel_profile").hide();
		e.preventDefault();
	});

	$("#change-password").click(function(e){
		checkPassword(e);
	});

	$("#edit_profile").click(function(e){
		if($("#edit_profile").text() == "Edit Profile"){
			$("#edit_profile").html("Save");
			$("#form__profile input").removeAttr('disabled');
			$("#change_password").hide();
			$("#id-number").attr('disabled', 'disabled');
			$("#cancel_profile").show();
			e.preventDefault();
		}

		else{
			checkText(e);
			checkEmail(e);
		}
	});
})