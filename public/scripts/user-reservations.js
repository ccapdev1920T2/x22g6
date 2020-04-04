$(document).ready(function(){
    const FILTER_FORM_ID = "#user-reservations-filters";
    let filterForm = $(FILTER_FORM_ID);
    let tripFilter = $("#user-reservations-filters__trip");
    let dateFilter = $(FILTER_FORM_ID +"__date");
    let timeFilter = $(FILTER_FORM_ID +"__time");
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
                sendUserReservationsRequest();
            }
        })
    });
    $([dateFilter[0], timeFilter[0]]).change(function(){
        sendUserReservationsRequest();
    });
    function sendUserReservationsRequest(){
        let isValid = Validator.checkRequired(filterForm);
        if(isValid){
            let date = dateFilter.val();
            let time = timeFilter.val();
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
    }
    tripFilter.trigger("change");
});