const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
const TEXT_CENTERED_CLASS = "container__content-section--text-centered";
const parseBase10 = (string) => parseInt(string, 10);

let timeSlotsTodayContainer;
let timeSlotsFutureContainer;

// Adds a new time slots to the page
function addNewTimeSlot(htmlData){
    let parsedContainer = $($.parseHTML(htmlData));
    let parsedDayContainer = parsedContainer.children(".calendar__day-reservations");
    let parsedTimeSlot = parsedDayContainer.find(".time-slot");

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let reservationDate = new Date(parsedTimeSlot.attr("data-reservation-date"));
    if(today.getTime() === reservationDate.getTime()){
        insertToTodaysReservations(parsedTimeSlot);
    }else{
        insertToFutureReservations(parsedContainer);
    }
    Modal.connectModalToggle(parsedTimeSlot.find(".time-slot__delete"));
}

// Inserts time slot element to the today's reservation container
function insertToTodaysReservations(timeSlot){
    let timeSlotToday = timeSlotsTodayContainer.find(".time-slot");
    console.log(timeSlotToday);
    console.log(timeSlotToday.length);
    if(timeSlotToday.length === 0){
        timeSlotsTodayContainer.children().remove();
        timeSlotsTodayContainer.removeClass(TEXT_CENTERED_CLASS);
        timeSlotsTodayContainer.append(timeSlot);
    }else{
        determineInsertOrder(timeSlot, timeSlotToday);
    }
}

// Inserts time slot element to the upcoming reservation container
function insertToFutureReservations(parsedContainer){
    let reservationMonth = parseBase10(parsedContainer.attr("data-month-num"));
    let reservationYear = parseBase10(parsedContainer.attr("data-year"));
    let existingMonthContainer = timeSlotsFutureContainer.children(`[data-month-num=${reservationMonth}][data-year=${reservationYear}]`);
    if(existingMonthContainer.length !== 0){
        let parsedDayContainer = parsedContainer.children(".calendar__day-reservations");
        let existingDayContainer = existingMonthContainer.children(`[data-day=${parsedDayContainer.attr("data-day")}]`);
        if(existingDayContainer.length !== 0)
            insertToDayContainer(parsedDayContainer.find(".time-slot"), existingDayContainer);
        else
            insertToMonthContainer(parsedDayContainer, existingMonthContainer);
    }else{
        let otherMonthContainers = timeSlotsFutureContainer.find(".calendar__month-reservations");
        if(otherMonthContainers.length === 0){
            timeSlotsFutureContainer.removeclass(TEXT_CENTERED_CLASS);
            timeSlotsFutureContainer.children().remove();
            timeSlotsFutureContainer.append(parsedContainer);
        }else{
            let i =0;
            for(i=0; i<otherMonthContainers.length; ++i){
                let existing = $(otherMonthContainers[i]);
                let existingMonthValue = parseBase10(existing.attr("data-month-num"));
                let existingYearValue = parseBase10(existing.attr("data-year"));
                if(existingYearValue > reservationYear
                    || (existingYearValue === reservationYear && existingMonthValue > reservationMonth)){
                    parsedContainer.insertBefore(existing);
                    break;
                }
            }
            if(otherMonthContainers.length === i){
                parsedContainer.insertAfter(otherMonthContainers[i - 1]);
            }
        }
    }
}

function insertToDayContainer(timeSlot, existingDayContainer){
    let otherTimeSlots = existingDayContainer.find(".time-slot");
    determineInsertOrder(timeSlot, otherTimeSlots);
}

function insertToMonthContainer(parsedDayContainer, monthContainer){
    let otherDayContainers = monthContainer.find(".calendar__day-reservations");
    let parsedDayValue = parsedDayContainer.attr("data-day");
    let i=0;
    for(i=0; i<otherDayContainers.length; ++i){
        let existing = $(otherDayContainers[i]);
        let existingDayValue = existing.attr("data-day");
        if(parseBase10(existingDayValue) > parseBase10(parsedDayValue)){
            parsedDayContainer.insertBefore(existing);
            break;
        }
    }
    if(otherDayContainers.length === i){
        parsedDayContainer.insertAfter(otherDayContainers[i - 1]);
    }
}

// Determines whether to insert the first time-slot argument before or after the second time-slot argument
function determineInsertOrder(toInsert, toCompare){
    let toInsertTime = parseBase10(toInsert.attr("data-reservation-time"));
    let toCompareTime = parseBase10(toCompare.attr("data-reservation-time"));
    if(toCompareTime > toInsertTime){
        toInsert.insertBefore(toCompare);
    }else
        toInsert.insertAfter(toCompare);
}

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
            date : toDelete.attr("data-reservation-date"),
            time: toDelete.attr("data-reservation-time"),
            trip: toDelete.attr("data-reservation-trip")
        }
        Modal.displayBufferModal("Deleting Reservation");
        $.ajax({
            type: "DELETE",
            url: "/reservation/delete",
            data: toSend,
            success: function(){
                let date = new Date(toSend.date);
                Modal.displayModalMessage("Your reservation at <b>" + MONTH_NAMES[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + "</b> has been deleted");
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

    timeSlotsTodayContainer = $("#time-slots-today");
    timeSlotsFutureContainer = $("#time-slots-future");

    if(timeSlotsTodayContainer.children().length === 0){
        timeSlotsTodayContainer.html("<p>You have no reservations today</p>");
        timeSlotsTodayContainer.addClass(TEXT_CENTERED_CLASS);
    }
    if(timeSlotsFutureContainer.children().length === 0){
        timeSlotsFutureContainer.html("<p>You have no upcoming reservations</p>");
        timeSlotsFutureContainer.addClass(TEXT_CENTERED_CLASS);
    }

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
