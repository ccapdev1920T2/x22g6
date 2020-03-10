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
		let input = $(this);
		if(input.val() == ""){
			markInput(input);
		}else{
			unmarkInput(input)
		}
	});
});

let Validator = function() {
	// Marks the input as invalid
	function markInput(input){
		input.addClass("form__input--invalid");
	}

	// Reverts the input back to its normal state
	function unmarkInput(input){
		input.removeClass("form__input--invalid");
	}

	return {
		// Takes a JQuery input object and checks if value follows the appropiate input format and marks it if not
		checkEmail(emailInput){
			var emailFormat = /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/;

			if(!emailFormat.test(emailInput.val())){
				markInput(emailInput);
				return false;
			}else{
				unmarkInput(emailInput);
				return true;
			}
		},

		// Takes a JQuery input object and checks if value is a valid ID and marks it if not
		checkID(idInput){
			if(idInput.val().length != 8){
				markInput(idInput);
				return false;
			}else{
				unmarkInput(idInput);
				return true;
			}
		},

		// Takes a two JQuery input objects and checks if values are the same and marks it if not
		checkEqual(input1, input2){
			console.log(input1);
			if(input1.val() !== input2.val() || input1.val() === "" || input2.val() == ""){
				markInput(input1);
				markInput(input2);
				return false;
			}else{
				unmarkInput(input1);
				unmarkInput(input2);
				return true;
			}
		},

		// Checks if all the inputs in a given form is filled
		checkRequired(form){
			let isValid = true;
			form.find(".required").each(function(){
				let currentInput = $(this);
				if($.trim(currentInput.val()).length === 0){
					isValid = false;
					markInput(currentInput);
				}else{
					unmarkInput(currentInput);
				}
			});
			return isValid;
		}
	}
}();





