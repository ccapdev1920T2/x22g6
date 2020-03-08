let modalToggles = document.getElementsByClassName("modal-toggle");

for(let i=0; i<modalToggles.length; ++i){
    modalToggles[i].addEventListener("click", function(){
        let targetId = this.getAttribute("data-modal-target");
        document.getElementById(targetId).classList.remove("modal--hidden");
    });
}

let modalCloser = document.getElementsByClassName("modal__close");

for(let i=0; i<modalCloser.length; ++i){
    modalCloser[i].addEventListener("click", function(){
        this.closest(".modal").classList.add("modal--hidden");
    });
}