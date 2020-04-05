$(document).ready(function(){
    let retrievalMessage;
    $("#schedule-filters input, #schedule-filters select").change(function(){
        let table = $("#schedule-table");
        let tableBody = table.find(".table__body");
        tableBody.find("tr").remove();
        Table.editMessage("Retrieving Data...");
        Table.showMessage(table);
        $.ajax({
            type: "GET",
            url: "/schedule/filter/" + $("#schedule-filters__date").val() + "/" + $("#schedule-filters__trip").val(),
            success: function(data){
                Table.removeMessage();
                for(let i=0; i<data.length; ++i){
                    let timeEntry = $("<td>").html(data[i].time);
                    let slotEntry = $("<td>").html(data[i].openSlots);
                    let row = $("<tr>").append(timeEntry).append(slotEntry);
                    tableBody.append(row);
                }
            },
            error: function(jqxhr){
                Table.editMessage("Cannot retrieve data at this time");
            }
        });
    });

    $("#schedule-filters input").trigger("change");
})