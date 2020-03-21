$(document).ready(function(){

    //Temporary
    $("#schedule-date").val("2020-03-15");
    $("#schedule-trip, #schedule-date").change(function(){
        $.ajax({
            type: "GET",
            url: "/schedule/" + $("#schedule-date").val() + "/" + $("#schedule-trip").val(),
            success: function(){
                console.log("Successs");
            }
        });
    });
})