connectModalToggles();
connectModalClosers();

// Connects the modal toggles to their corresponding modals
function connectModalToggles(){
    $(".modal-toggle").click(function(){
        let targetId = this.getAttribute("data-modal-target");
        $(`#${targetId}`).removeClass("modal--hidden");
    });
}

// Connects the modal closers to their corresponding modals
function connectModalClosers(){
    $(".modal__close").click(function(){
        this.closest(".modal").classList.add("modal--hidden");
    });
}