$(document).ready(function(){
    let xhr;
    $("#schedule-filters input, #schedule-filters select").change(function(){
        let table = $("#schedule-table");
        let tableBody = table.find(".table__body");
        tableBody.find("tr").remove();
        let dateInput = $("#schedule-filters__date").val();
        if(!dateInput){
            Table.showMessage(table, "Invalid date input");
            return;
        }
        let date = new Date(dateInput + "T00:00:00");
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if(date.getDay() === 0 || date.getDay() === 6){
            Table.showMessage(table, "No reservations on weekends");
            return;
        }
        if(date.getTime() < today.getTime()){
            Table.showMessage(table, "Date has already passed");
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