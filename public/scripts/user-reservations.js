$(document).ready(function(){
    const TABLE_ID = "#user-reservations-table";
    const FILTER_FORM_ID = "#user-reservations-filters";
    let filterForm = $(FILTER_FORM_ID);
    let tripFilter = $("#user-reservations-filters__trip");
    let dateFilter = $(FILTER_FORM_ID +"__date");
    let timeFilter = $(FILTER_FORM_ID +"__time");
    let tableBody = $(TABLE_ID + " .table__body");
    let table = $(TABLE_ID);
    let xhrTimeSlots;
    let xhrReservations;
    tripFilter.change(function(){
        Table.showDataLoading(table, "Retrieving reservations");
        if(xhrTimeSlots && xhrTimeSlots.readyState !== 4)
            xhrTimeSlots.abort();
        timeFilter.prop("disabled", true);
        timeFilter.children().remove();
        timeFilter.append($("<option>").html("Loading..."));
        xhrTimeSlots = $.ajax({
            type: "GET",
            url: "/schedule/time-slots/" + tripFilter.val(),
            success: function(data){
                timeFilter.children().remove();
				for(let i=0; i<data.length; ++i){
					let text = document.createTextNode(data[i].presentation);
					timeFilter.append($("<option>").attr("value", data[i].value).append(text));
                }
                timeFilter.prop("disabled", false);
                sendUserReservationsRequest();
            },
            error: function(){
                if(xhrTimeSlots.readyState === 4)
                    timeFilter.find("options").html("Cannot retrieve time slots");
            }
        })
    });
    $([dateFilter[0], timeFilter[0]]).change(function(){
        sendUserReservationsRequest();
    });
    function sendUserReservationsRequest(){
        tableBody.find("tr").remove();
        let isValid = Validator.checkRequired(filterForm);
        Table.showDataLoading(table, "Retrieving reservations");
        if(isValid){
            if(xhrReservations && xhrReservations.readyState != 4)
                xhrReservations.abort();
            let date = dateFilter.val();
            let time = timeFilter.val();
            let trip = tripFilter.val();
            xhrReservations = $.ajax({
                type: "GET",
                url: `/reservation/user-reservations/${date}/${time}/${trip}`,
                success: function(data){
                    if(data.length === 0){
                        Table.showMessage(table, "No reservations found");
                    }else
                        Table.removeDataLoading(table);
                    for(let i=0; i<data.length; ++i){
                        let nameEntry = $("<td>").html(data[i].lastName + ", " + data[i].firstName);
                        let typeEntry = $("<td>").html(data[i].type);
                        let idEntry = $("<td>").html(data[i].idNumber);
                        let row = $("<tr>").append(nameEntry).append(typeEntry).append(idEntry);
                        tableBody.append(row);
                    }
                },
                error: function(){
                    if(xhrReservations.readyState === 4)
                        Table.showMessage(table, "Cannot retrieve data at this time");
                }
            });
        }
    }
    tripFilter.trigger("change");
});