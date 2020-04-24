$(document).ready(function(){
    let retrievalMessage;
    let xhr;
    $("#schedule-filters input, #schedule-filters select").change(function(){
        let table = $("#schedule-table");
        let tableBody = table.find(".table__body");
        tableBody.find("tr").remove();
        let dateInput = $("#schedule-filters__date").val();
        let date = new Date(dateInput + "T00:00:00");
        if(date.getDay() === 0 || date.getDay() === 6){
            Table.showMessage(table, "No reservations on weekends");
            return;
        }
        Table.showDataLoading(table, "Retrieving schedule");
        if(xhr && xhr.readyState != 4)
            xhr.abort();
        xhr = $.ajax({
            type: "GET",
            url: "/schedule/filter/" + dateInput + "/" + $("#schedule-filters__trip").val(),
            success: function(data){
                Table.removeDataLoading(table);
                for(let i=0; i<data.length; ++i){
                    let timeEntry = $("<td>").html(data[i].time);
                    let slotEntry = $("<td>").html(data[i].openSlots);
                    let row = $("<tr>").append(timeEntry).append(slotEntry);
                    tableBody.append(row);
                }
            },
            error: function(jqxhr){
                if(xhr.readyState === 4)
                    Table.showMessage(table, "Cannot retrieve data at this time");
            }
        });
    });

    $("#schedule-filters input").trigger("change");
})