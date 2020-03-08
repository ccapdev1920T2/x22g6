let timeSlotsDeleteIcons = document.getElementsByClassName("time-slot__delete");
let deletionConfirmationModal = document.getElementById("deletion-confirmation-modal");
for(let i=0; i<timeSlotsDeleteIcons.length; ++i){
    timeSlotsDeleteIcons[i].addEventListener("click", function(){
        this.parentElement.id = "time-slot-to-delete";
        deletionConfirmationModal.setAttribute("data-time-slot-target", "time-slot-to-delete");
    });
}

let reject = document.getElementById("reject-deletion");
let accept = document.getElementById("accept-deletion")

reject.addEventListener("click", function(){
    document.getElementById("time-slot-to-delete").removeAttribute("id");
});

accept.addEventListener("click", function(){
    let toDelete = document.getElementById("time-slot-to-delete");
    let day = toDelete.closest(".calendar__time-slots");
    let month = toDelete.closest(".calendar__month-reservations");
    toDelete.remove();
    if(day && day.children.length === 0){
        day.closest(".calendar__day-reservations").remove();
    }
    if(month && month.children.length === 1){
        month.remove();
    }
    
});