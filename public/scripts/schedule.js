$(document).ready(function(){
    $("#schedule-filters input, #schedule-filters select").change(function(){
        let tableBody = $("#schedule-table").find(".table__body");
        let retrievalMessage = $("<p>").text("Retrieving data...").addClass("table__message");
        tableBody.children("tr").remove();
        retrievalMessage.insertAfter(tableBody.closest("table"));
        $.ajax({
            type: "GET",
            url: "/schedule/filter/" + $("#schedule-filters__date").val() + "/" + $("#schedule-filters__trip").val(),
            success: function(data){
                retrievalMessage.remove();
                for(let i=0; i<data.length; ++i){
                    let timeEntry = $("<td>").html(data[i].time);
                    let slotEntry = $("<td>").html(data[i].openSlots);
                    let row = $("<tr>").append(timeEntry).append(slotEntry);
                    tableBody.append(row);
                }
            },
            error: function(jqxhr){
               retrievalMessage.text("Cannot retrieve data at this time");
            }
        });
    });

    $("#schedule-filters input").trigger("change");
})