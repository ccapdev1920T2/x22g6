const Table = function(){
    return{
        showDataLoading(table, message){
            if(table.find("#table-data-load").length) return;
            table.find(".table__message").remove();
            let buffer = $("<div>").addClass("buffer");
            let messageElem = $("<p>").html(message).css({margin: "0.7em"});
            let container = $("<div>").attr("id", "table-data-load").css({
                display: "flex",
                "margin-top": "1em",
                "flex-direction": "column",
                "align-items": "center"
            });
            container.append(buffer).append(messageElem);
            container.insertAfter(table.find("table"));
        },
        removeDataLoading(table){
            table.find("#table-data-load").remove();
        },
        showMessage(table, message){
            table.find("#table-data-load").remove();
            let messageElem;
            if((messageElem = table.find(".table__message")).length){
                messageElem.html(message);
            }else{
                messageElem = $("<p>").addClass("table__message").html(message);
                messageElem.insertAfter(table.find("table"));
                console.log("test2");
            } 
        },
        removeMessage(table){
            table.find(".table__message").remove();
        }
    }
}();