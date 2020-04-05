const Table = function(){
    let messageElem = $("<p>").addClass("table__message");
    return{
        showMessage(table){
            messageElem.insertAfter(table.find("table"));
        },
        editMessage(message){
            messageElem.text(message);
        },
        removeMessage(){
            messageElem.remove();
        }
    }
}();