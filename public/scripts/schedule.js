$(document).ready(function(){
    $("#schedule-filters input, #schedule-filters selector").change(function(){
        $.ajax({
            type: "GET",
            url: "/schedule/filter/" + $("#schedule-filters__date").val() + "/" + $("#schedule-filters__trip").val(),
            success: function(){
                
            }
        });
    });
})