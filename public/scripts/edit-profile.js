$(document).ready(function(){
	//Retrieves elements from DOM
	let cancelButton = $("#cancel-edit-profile");
	let editProfileButton = $("#edit-profile-toggle");
	let saveButton = $("#edit-profile-save");
	let changePasswordSubmit = $("#change-password-submit");
	let changePasswordToggle = $("#change-password-toggle");
	let editableInputs = $(".editable");

	// When the user wants to edit the profile
	editProfileButton.click(enableProfileEdit);

	// When the cancel button is clicked
    cancelButton.click(lockProfileEdit);

	// When the user wants to save changes made to profile
	saveButton.click(function(e){
		e.preventDefault();
		let editProfileForm = $("#edit-profile-form");
		// Validates inputs
		let isValid = Validator.checkRequired(editProfileForm) &&
			Validator.checkEmail($("#email"));
		if(isValid){
			// POST request to edit profile
			$.ajax({
				type: "POST",
				url: "/profile",
				data: editProfileForm.serialize(),
				success: function(){
					Modal.displayModalMessage("Profile edited successfully");
					$(editProfileForm.find(".editable")).each(function(){
						let currentInput = $(this);
						let currentValue = currentInput.val();
						if(currentValue !== currentInput.attr("value"))
							currentInput.attr("value", currentValue);
					});
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					lockProfileEdit();
				}
			});
		}
	});

	// When user wants to change password
	changePasswordSubmit.click(function(e){
		e.preventDefault();
		let changePasswordForm = $("#change-password-form");
		//Validates inputs
		let isValid = Validator.checkRequired(changePasswordForm) &&
			Validator.checkEqual($("#new-password"), $("#confirm-new-password"));
		if(isValid){
			Modal.closeModal($("#change-password-modal"));
			// POST request to change password
			$.ajax({
				type: "POST",
				url: "/change-password",
				data: changePasswordForm.serialize(),
				success: function(){
					Modal.displayModalMessage("Password was successfully changed");
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					changePasswordForm.find("input").val("");
				}
			});
		}
	});

	// Prevents the profile from being edited
	function lockProfileEdit(){
		editProfileButton.show();
		changePasswordToggle.show();
		editableInputs.attr('disabled', 'disabled');
		cancelButton.hide();
		saveButton.hide();
	}

	// Renders the profile editable
	function enableProfileEdit(){
		editableInputs.removeAttr('disabled');
		changePasswordToggle.hide();
		saveButton.show();
		cancelButton.show();
		editProfileButton.hide();
	}
});


		