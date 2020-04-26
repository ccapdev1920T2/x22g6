let Validator = function() {
	const emailFormat = /^([a-zA-Z0-9_\.\-\+])+\@(dlsu.edu.ph)$/;
	const numberFormat = /^[0-9]+$/;
	const emailChecker = (input) => emailFormat.test(input.val());
	const idChecker = (input) => input.val().length === 8 && numberFormat.test(input.val());
	const emptyChecker = (input) => $.trim(input.val()).length !== 0;
	const minLengthChecker = (input) => input.val().length >= input.attr("data-min-length");

	function addErrmessage(input, message){
		let errElement = $("<span>").addClass("error-message").html("&ensp;" + message);
		let label = $(`[for=${input.attr("id")}]`);
		if(message && !label.children(".error-message").length)
			label.append(errElement);
	}

	function removeErrMessage(input){
		$(`[for=${input.attr("id")}]`).children(".error-message").remove();
	}

	function getEqualInput(input){
		return $(`#${input.attr("data-equal-with")}`);
	}
	// Marks the input as invalid
	function markInput(input, message){
		message = "- " + message;
		let equalInput = getEqualInput(input)
		input.addClass("form__input--invalid");
		equalInput.addClass("form__input--invalid");
		addErrmessage(input, message);
		addErrmessage(equalInput, message);			
	}

	// Reverts the input back to its normal state
	function unmarkInput(input){
		input.removeClass("form__input--invalid");
		removeErrMessage(input);
		let equalInput = getEqualInput(input);
		equalInput.removeClass("form__input--invalid");
		removeErrMessage(equalInput);
	}

	function checkInput(input, callback, message){
		let isValid = callback(input);
		if(!isValid)
			markInput(input, message);
		else 
			unmarkInput(input);
		return isValid;
	}

	// Takes a two JQuery input objects and checks if values are the same and marks it if not
	function checkEqual(input1, input2, message){
		if(input1.val() !== input2.val() || input1.val() === "" || input2.val() == ""){
			markInput(input1, message);
			return false;
		}else{
			unmarkInput(input1);
			return true;
		}
	}

	$(document).ready(function(){
		$(".form__input").focus(function(){
			unmarkInput($(this));
		});
		
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
	
		$(".required").blur(function(e){
			let input = $(this);
			if(!checkInput(input, emptyChecker, "Required"))
				e.stopImmediatePropagation();
		});

		$(".email").blur(function(e){
			let input = $(this);
			if(!checkInput(input, emailChecker, "Invalid DLSU email"))
				e.stopImmediatePropagation();
		});

		$(".id-number").blur(function(e){
			let input = $(this);
			if(!checkInput(input, idChecker, "Invalid ID Number"))
				e.stopImmediatePropagation();
		});

		$("[data-equal-with]").blur(function(e){
			let elem = $(this);
			let elemToCompare = getEqualInput(elem);
			if(!checkEqual(elem, elemToCompare, elem.attr("data-err-message")))
				e.stopImmediatePropagation();
		});

		$("[data-min-length]").blur(function(e){
			let inputElem = $(this);
			let minLength = inputElem.attr("data-min-length");
			if(!checkInput(inputElem, minLengthChecker, `Must be at least ${minLength} characters`))
				e.stopImmediatePropagation()
		})
	});

	return {
		markInput: markInput,
		unmarkInput: unmarkInput,
		// Takes a JQuery input object and checks if value follows the appropiate input format and marks it if not
		checkEmail(emailInput){
			return checkInput(emailInput, emailChecker, "Invalid DLSU email");
		},

		// Takes a JQuery input object and checks if value is a valid ID and marks it if not
		checkID(idInput){
			return checkInput(idInput, idChecker, "Invalid ID Number")
		},

		checkEqual: checkEqual,

		// Checks if all the inputs in a given form is filled
		checkRequired(form){
			let isValid = true;
			form.find(".required").each(function(){
				let currentInput = $(this);
				isValid = isValid & checkInput(currentInput, emptyChecker, "Required");
			});
			return isValid;
		},

		checkMinLength(input){
			let minLength = input.attr("data-min-length");
			return checkInput(input, minLengthChecker, "Must be at least " + minLength + " characters");
		},

		// Checks if a date input is on a weekend and marks the date input if so
		checkWeekend(input){
			let day = (new Date(input.val()  + "T00:00:00")).getDay();
			if(day === 0 || day === 6 || input.val().length === 0){
				markInput(input, "Cannot reserve on a weekend");
				return false;
			}
			unmarkInput(input);
			return true;
		},

		checkDatePassed(input){
			let inputDate = (new Date(input.val() + "T00:00:00"));
			let today = new Date();
			today.setHours(0, 0, 0, 0);
			if(inputDate.getTime() < today.getTime() || input.val().length === 0){
				markInput(input, "Date has already passed");
				return false;
			}
			unmarkInput(input);
			return true;
		}
	}
}();





