var webRtcClient = new WebRtcClient();

webRtcClient.init();

webRtcClient.subscribe('offline', function(){
    $('div.status').text('status: offline');
});

webRtcClient.subscribe('register_response', function(data, socket){
    $('div.status').text('registration: ' + data.status);
});

webRtcClient.subscribe('connected', function(socket){
    $.ajax({
	type : "GET",
	url : "/getUserName"
    }).done(function(data){
	if(data.username)
	    webRtcClient.register(data.username);
    });
});

webRtcClient.subscribe('call_response', function(data){
    $('<div />').html(data.reason).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
});

webRtcClient.subscribe('call_request', function(data){
    console.log('call_request: ' + JSON.stringify(data));
    $('<div />').html(' call from: ' + data.from).dialog({
      modal: true,
      buttons: {
        Answer: function() {
	  data.status = "accepted";
	  data.room = "super_room";
	  webRtcClient.acceptCall(data);
          $( this ).dialog( "close" );
        },
	Decline: function(){
	  data.status = "rejected";
	  data.reason = "User busy";
	  webRtcClient.rejectCall(data);
	  $( this ).dialog( "close" );  
	}
      }
    });
});

webRtcClient.subscribe('call_accepted_answer', function(data){
    $('<div />').html(' call accepted by:' + data.to + '!!! Call in room: ' + data.room).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
});


webRtcClient.subscribe('call_rejected_answer', function(data){
    $('<div />').html(' call rejected by:' + data.to + '!!! reason: ' + data.reason).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
});
