
function getTimeSlots(){

	$("#reservation-time").empty();
	if($("#reservation-location").val() == "LAG-to-MNL"){
		$("#reservation-time").append(LAG_to_MNL);
	}

	else{
		$("#reservation-time").append(MNL_to_LAG);
	}
}

var LAG_to_MNL = '';

LAG_to_MNL += ('<option value="0545">5:45 AM</option>');
LAG_to_MNL += ('<option value="0700">7:00 AM</option>');
LAG_to_MNL += ('<option value="0730">7:30 AM</option>');
LAG_to_MNL += ('<option value="0900">9:00 AM</option>');
LAG_to_MNL += ('<option value="1100">11:00 AM</option>');
LAG_to_MNL += ('<option value="1300">1:00 PM</option>');
LAG_to_MNL += ('<option value="1430">2:30 PM</option>');
LAG_to_MNL += ('<option value="1530">3:30 PM</option>');
LAG_to_MNL += ('<option value="1700">5:00 PM</option>');
LAG_to_MNL += ('<option value="1815">6:15 PM</option>');

var MNL_to_LAG = '';

MNL_to_LAG += ('<option value="0600">6:00 AM</option>');
MNL_to_LAG += ('<option value="0730">7:30 AM</option>');
MNL_to_LAG += ('<option value="0930">9:30 AM</option>');
MNL_to_LAG += ('<option value="1100">11:00 AM</option>');
MNL_to_LAG += ('<option value="1300">1:00 PM</option>');
MNL_to_LAG += ('<option value="1430">2:30 PM</option>');
MNL_to_LAG += ('<option value="1530">3:30 PM</option>');
MNL_to_LAG += ('<option value="1700">5:30 PM</option>');
MNL_to_LAG += ('<option value="1815">6:15 PM</option>');
