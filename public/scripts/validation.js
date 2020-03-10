$(document).ready(function(){
	$(".numonly").keypress(function(e){
		var key = e.keyCode;
		if(!(key >= 48 && key <= 57)){
			e.preventDefault();
		}
	});

	$(".textonly").keypress(function(e){
		var key = e.keyCode;
		if(key >= 48 && key <= 57){
			e.preventDefault();
		}
	});

	$(".required").blur(function(){

		if($(this).val() == ""){
			$(this).css("border-color", "red");
		}

		else{
			$(this).css("border-color", "#707070")
		}
	});

	
	$("#register").click(function(e){
		checkText(e);
		checkEmail(e);
		checkID(e);
		checkPassword(e);		
	});
});
function checkEmail(e){
	var email = $("#email").val();
	var emailFormat = /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/;

	if(!emailFormat.test(email)){
		$("#email").css("border-color", "red");
		e.preventDefault();
	}

	else{
		$("#email").css("border-color", "#707070");
	}
}

function checkID(e){
	var id = $("#id-number").val();

	if(id.length != 8){
		$("#id-number").css("border-color", "red");
		e.preventDefault();
	}

	else{
		$("#id-number").css("border-color", "#707070");
	}
}

function checkPassword(e){
	var password = $("#password");
	var confirmpassword = $("#confirm-password");
	if(password.val() !== confirmpassword.val() || password.val() === "" || confirmpassword.val() == ""){
		password.css("border-color", "red");
		confirmpassword.css("border-color", "red");
		e.preventDefault();
	}

	else{
		password.css("border-color", "#707070");
		confirmpassword.css("border-color", "#707070");
	}
}

function checkText(e){
	var valid = true;
	$('input[type="text"]').each(function(){
		if($.trim($(this).val()) === ""){
			valid = false;
			$(this).css("border-color", "red");
		}
		else{
			$(this).css("border-color", "#707070");
		}
	});

	if(valid == false){
		e.preventDefault();
	}
}

