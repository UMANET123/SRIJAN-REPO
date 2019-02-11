$( document ).ready(function() {
	
	// SUBMIT FORM
    $("#globeloginform").submit(function(event) {
		// Prevent the form from submitting via the browser.

		event.preventDefault();
		ajaxPost();
	});

	
    $("#generate_otp").click(function(event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		// Validate the phone no
		
		console.log('Generate OTP click')
		ajaxPost();
	});
    
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
    		phone_no : $("#phone_no").val(),
    	}
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : window.location + "api/generate/otp",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(subsciber) {
				$("#postResultDiv").html("<p>" + 
					"Otp has been sent to the mobile no.<br>")
			},
			error : function(e) {
				$("#postResultDiv").html("<p>" + 
					"Error! an error occured during opt generation.<br>")
				console.log("ERROR: ", e);
			}
		});
    	
    	// Reset FormData after Posting
    //	resetData();
 
    }
    
    // function resetData(){
    // 	$("#firstname").val("");
    // 	$("#lastname").val("");
    // }
})
