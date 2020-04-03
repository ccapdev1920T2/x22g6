$(document).ready(function(){
    const FILTER_FORM_ID = "#user-reservations-filters";
    let tripFilter = $("#user-reservations-filters__trip");
    tripFilter.change(function(){
        $.ajax({
            type: "GET",
            url: "/schedule/time-slots/" + tripFilter.val(),
            success: function(data){
                let timeSelector = $("#user-reservations-filters__time");
                timeSelector.children().remove();
				for(let i=0; i<data.length; ++i){
					let text = document.createTextNode(data[i].presentation);
					timeSelector.append($("<option>").attr("value", data[i].value).append(text));
				}
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

    tripFilter.trigger("change");
});