let Validator = function() {
	const emailFormat = /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/;
	const emailChecker = (input) => emailFormat.test(input.val());
	const idChecker = (input) => input.val().length === 8;
	const emptyChecker = (input) => $.trim(input.val()).length !== 0;

	// Marks the input as invalid
	function markInput(input, message){
		let errElement = $("<span>").addClass("error-message").html("&ensp;" + message);
		let label = $(`[for=${input.attr("id")}]`);
		input.addClass("form__input--invalid");
		
		if(message && !label.children(".error-message").length)
			label.append(errElement);
	}

	// Reverts the input back to its normal state
	function unmarkInput(input){
		input.removeClass("form__input--invalid");
		$(`[for=${input.attr("id")}]`).children(".error-message").remove();
	}

	function checkInput(input, callback, message){
		let isValid = callback(input);
		if(!isValid)
			markInput(input, message);
		else 
			unmarkInput(input);
		return isValid;
	}

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
			checkInput(input, emptyChecker, "*Required");
		});

		$(".email").blur(function(){
			let input = $(this);
			checkInput(input, emailChecker, "*Invalid DLSU email");
		});

		$(".id-number").blur(function(){
			let input = $(this);
			checkInput(input, idChecker, "*Invalid ID Number");
		});
	});

	return {
		markInput: markInput,
		unmarkInput: unmarkInput,
		// Takes a JQuery input object and checks if value follows the appropiate input format and marks it if not
		checkEmail(emailInput){
			return checkInput(emailInput, emailChecker, "*Invalid DLSU email");
		},

		// Takes a JQuery input object and checks if value is a valid ID and marks it if not
		checkID(idInput){
			return checkInput(idInput, idChecker, "*Invalid ID Number")
		},

		// Takes a two JQuery input objects and checks if values are the same and marks it if not
		checkEqual(input1, input2, message){
			if(input1.val() !== input2.val() || input1.val() === "" || input2.val() == ""){
				markInput(input1, message);
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
				isValid = checkInput(currentInput, emptyChecker, "*Required");
			});
			return isValid;
		},

		// Checks if a date input is on a weekend and marks the date input if so
		checkWeekend(input){
			let day = (new Date(input.val())).getDay();
			if(day === 0 || day === 6){
				markInput(input);
				return false;
			}
			return true;
		}
	}
}();





