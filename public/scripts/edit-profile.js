$(document).ready(function(){
	//Retrieves elements from DOM
	let cancelButton = $("#cancel-edit-profile");
	let editProfileButton = $("#edit-profile-toggle");
	let saveButton = $("#edit-profile-save");
	let changePasswordSubmit = $("#change-password-form button[type=\"submit\"]");
	let changePasswordToggle = $("#change-password-toggle");
	let editableInputs = $(".editable");

	// For storing the actual profile values
	let firstName = $("#edit-profile-form__first-name").val();
	let lastName = $("#edit-profile-form__last-name").val();
	let email = $("#edit-profile-form__email").val();

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
			Validator.checkEmail($("#edit-profile-form__email"));
		if(isValid){
			Modal.displayBufferModal("Editing Profile");
			// POST request to edit profile
			$.ajax({
				type: "POST",
				url: "/profile/edit",
				data: editProfileForm.serialize(),
				success: function(){
					Modal.displayModalMessage("Profile edited successfully");
					firstName = $("#edit-profile-form__first-name").val();
					lastName = $("#edit-profile-form__last-name").val();
					email = $("#edit-profile-form__email").val();
					$("#navbar__name").html(firstName + " " + lastName);
					revertProfile();
					lockProfileEdit();
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					Modal.closeBufferModal();
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
			Validator.checkEqual($("#change-password-form__new-password"), $("#change-password-form__confirm-password"), "*Passwords do not match");
		if(isValid){
			Modal.closeModal($("#change-password-modal"));
			Modal.displayBufferModal("Changing Password");
			// POST request to change password
			$.ajax({
				type: "POST",
				url: "/profile/change-password",
				data: changePasswordForm.serialize(),
				success: function(){
					Modal.displayModalMessage("Password was successfully changed");
				},
				error: function(jqxhr){
					Modal.displayModalMessage(jqxhr.responseText);
				},
				complete: function(){
					changePasswordForm.find("input").val("");
					Modal.closeBufferModal();
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

	// Revert the inputs to the values that is stored on firstName, lastName, and email
	function revertProfile(){
		$("#edit-profile-form__first-name").attr("value", firstName).val(firstName);
		$("#edit-profile-form__last-name").attr("value", lastName).val(lastName);
		$("#edit-profile-form__email").attr("value", email).val(email);
	}
});


		