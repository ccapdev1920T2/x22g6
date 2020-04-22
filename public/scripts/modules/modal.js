let Modal = function(){
    $(document).ready(function(){
        connectModalToggles();
        connectModalClosers();
    });

    // Connects the argument to its modal target
    function connectModalToggle(toggle){
        toggle.click(function(){
            let targetId = this.getAttribute("data-modal-target");
            $(`#${targetId}`).removeClass("modal--hidden");
        })
        
    }

    // Connects the modal toggles to their corresponding modals
    function connectModalToggles(){
        $(".modal-toggle").each(function(){
            connectModalToggle($(this));
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
        displayModalMessage(message, isSuccess){
            let modalContainer = $("<div>").addClass("modal");
            let headerElement = $("<p>").text(isSuccess ? "SUCCESS" : "ERROR").css({
                "font-weight": "bold",
                "color": isSuccess ? "green": "red",
            });
            let messageElement = $("<p>").append(message).addClass("modal__message");
            let closingElement = $("<button>").append("OK").addClass("modal__close button").attr("type", "button");
            let confirmationContainer =  $("<div>").addClass("modal__confirmation-choices modal__confirmation-choices--centered");
            let modalContent = $("<div>").addClass("container container--padded");
            
        
            modalContent.append(headerElement).append(messageElement).append(confirmationContainer.append(closingElement));
            modalContainer.append(modalContent);
        
            closingElement.click(function(){
                this.closest(".modal").remove();
            });
            $("body").append(modalContainer);
        },

        displayBufferModal(message){
            let modalElem = $("<div>").addClass("modal modal--center-column").attr("id", "buffer-modal");
            let modalContent = $("<div>").addClass("modal__content");
            let container = $("<div>").addClass("container container--padded container--centered-vertical");
            let buffer = $("<div>").addClass("buffer").css({"margin-bottom": "0.5em"});
            let messageElem = $("<p>").html(message);
            modalElem.append(modalContent.append(container.append(buffer).append(messageElem)));
            $("body").append(modalElem);
        },

        closeBufferModal(){
            $("#buffer-modal").remove();
        },

        closeModal(modal){
            modal.addClass("modal--hidden");
        },

        removeModal(modal){
            modal.remove();
        },

        connectModalToggle
    };
    
}();

