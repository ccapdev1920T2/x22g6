$(document).ready(function(){
    const FILTER_FORM_ID = "#user-reservations-filters";
    let tripFilter = $("#user-reservations-filters__trip");
    tripFilter.change(function(){
        $.ajax({
            type: "GET",
            url: "/schedule/time-slots/" + tripFilter.val(),
            success: function(data){
                console.log(data);
            }
        })
    });
    $(FILTER_FORM_ID + " input, " +  FILTER_FORM_ID + " select").change(function(){
        let isValid = Validator.checkRequired($(FILTER_FORM_ID));
        if(isValid){
            let date = $(FILTER_FORM_ID +"__date").val();
            let time = $(FILTER_FORM_ID + "__time").val();
            let trip = tripFilter.val();
            $.ajax({
                type: "GET",
                url: `/reservation/user-reservations/${date}/${time}/${trip}`,
            });
        }
    });
});