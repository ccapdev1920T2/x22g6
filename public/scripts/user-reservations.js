$(document).ready(function(){
    const FILTER_FORM_ID = "#user-reservations-filters";
    $(FILTER_FORM_ID + " input, " +  FILTER_FORM_ID + " select").change(function(){
        let isValid = Validator.checkRequired($(FILTER_FORM_ID));
        if(isValid){
            let date = $(FILTER_FORM_ID + " #date").val();
            let time = $(FILTER_FORM_ID + " #time").val();
            let trip = $(FILTER_FORM_ID + " #trip").val();
            $.ajax({
                type: "GET",
                url: `user-reservations/${date}/${time}/${trip}`,
                success: function(data){
                    console.log(data);
                },
                error: function(jqxhr){
                    Modal.displayModalMessage(jqxhr.responseText);
                }
            });

        }
    });
});