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
		checkEmail(e);
		checkText(e);
	});

	changePasswordSubmit.click(function(e){
		checkPassword(e);
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


		