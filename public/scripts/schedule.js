$(document).ready(function(){
    $("#schedule-filters input, #schedule-filters select").change(function(){
        $.ajax({
            type: "GET",
            url: "/schedule/filter/" + $("#schedule-filters__date").val() + "/" + $("#schedule-filters__trip").val(),
            success: function(data){
                let tableBody = $("#schedule-table").find(".table__body");
                tableBody.children("tr").remove();
                for(let i=0; i<data.length; ++i){
                    let timeEntry = $("<td>").html(data[i].time);
                    let slotEntry = $("<td>").html(data[i].openSlots + "/25");
                    let row = $("<tr>").append(timeEntry).append(slotEntry);
                    tableBody.append(row);
                }
            },
            error: function(jqxhr){
                console.log(jqxhr.responseText);
            }
        });
    });

    $("#schedule-filters input").trigger("change");
})