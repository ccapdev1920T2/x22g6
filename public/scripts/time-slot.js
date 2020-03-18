$(document).ready(function(){

    // For time-slot deletion
    let toDelete;
    // Marks the time-slot that would be deleted upon clicking the delete symbol for the corresponding time-slot
    $(".time-slot__delete").click(function(){
        toDelete = $(this.closest(".time-slot"));
    });

    // When the deletion is cancelled
    $("#reject-deletion").click(function(){
        toDelete = null;
    });

    // When the deletion is confirmed
    $("#accept-deletion").click(function(){
        let toSend = {
            date : toDelete.attr("data-reservation-date")
        }
        Modal.displayBufferModal("Deleting Reservation");
        $.ajax({
            type: "DELETE",
            url: "/delete-reservation",
            data: toSend,
            success: function(){
                Modal.displayModalMessage("Your reservation at <b>" + toSend.date + "</b> has been deleted");
                deleteTimeSlot();
            },
            error: function(jqxhr){
                Modal.displayModalMessage(jqxhr.responseText);
            },
            complete: function(){
                Modal.closeBufferModal();
            }
        })
    });

    function deleteTimeSlot(){
        let timeSlotsContainer = $(toDelete.closest(".calendar__time-slots"));
        let monthContainer = $(toDelete.closest(".calendar__month-reservations"));
        toDelete.remove();
        //Checks if there is any more reservations in a given day
        if(timeSlotsContainer && timeSlotsContainer.children().length === 0){
            timeSlotsContainer.closest(".calendar__day-reservations").remove(); //Removes section for a day without any reservations
            if(monthContainer && monthContainer.children(".calendar__day-reservations").length === 0)
                monthContainer.remove(); //Removes section for a month without any reservations
        }
    }
});
