$(document).ready(function(){
	$(".textonly").keypress(function(e){
		var key = e.keyCode;
		if(key >= 48 && key <= 57){
			e.preventDefault();
		}
	});
});


$(document).ready(function(){
	$(".numonly").keypress(function(e){
		var key = e.keyCode;
		if(!(key >= 48 && key <= 57)){
			e.preventDefault();
		}
	});
});

$(document).ready(function(){
	$(".required").blur(function(){

		if($(this).val() == ""){
			$(this).css("border-color", "red");
		}

		else{
			$(this).css("border-color", "#707070")
		}
	});
});