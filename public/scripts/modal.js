let Modal = function(){
    $(document).ready(function(){
        connectModalToggles();
        connectModalClosers();
    });
    
    
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
    
    return{
        // Displays a pop up message
        displayModalMessage(message){
            let modalContainer = $("<div>").addClass("modal");
            let messageElement = $("<p>").append(message).addClass("modal__message");
            let closingElement = $("<button>").append("OK").addClass("modal__close button").attr("type", "button");
            let confirmationContainer =  $("<div>").addClass("modal__confirmation-choices modal__confirmation-choices--centered");
            let modalContent = $("<div>").addClass("container container--padded");
        
        
            modalContent.append(messageElement).append(confirmationContainer.append(closingElement));
            modalContainer.append(modalContent);
        
            closingElement.click(function(){
                this.closest(".modal").remove();
            });
            $("body").append(modalContainer);
        },

        closeModal(modal){
            modal.addClass("modal--hidden");
        }
    };
    
}();
