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
                success: function(data){
                    let tableBody = $("#user-reservations-table .table__body");
                    tableBody.find("tr").remove();
                    for(let i=0; i<data.length; ++i){
                        let nameEntry = $("<td>").html(data[i].lastName + ", " + data[i].firstName);
                        let typeEntry = $("<td>").html(data[i].type);
                        let idEntry = $("<td>").html(data[i].idNumber);
                        let row = $("<tr>").append(nameEntry).append(typeEntry).append(idEntry);
                        tableBody.append(row);
                    }
                }
            });
        }
    });

    tripFilter.trigger("change");
});