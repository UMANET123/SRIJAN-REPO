$( document ).ready(function() {
		
		$("#resend_otp").hide()
	// SUBMIT FORM
    $("#verify_otp").click(function(event) {
		// Prevent the form from submitting via the browser.
		
		event.preventDefault();
		verifyOTP();
	});

	
    $(".generate_otp").click(function(event) {
		// Prevent the form from submitting via the browser.
		$("#generate_otp").hide()
		$("#resend_otp").show()
		event.preventDefault();
		// Validate the phone no
		$("#generate_otp").val("Resend OTP")
		console.log('Generate OTP click')
		generateOTP();
	});
    
    function generateOTP(){
    	$("#postResultDiv").html('')
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

				if(subsciber['statusCode'] == 200 || subsciber['statusCode'] == 201){
					$("#postResultDiv").html("<p class='success'>" + subsciber['message'] +
					"</p>")
					$("#subscriber_id").val(subsciber['subscriber_id'])
				} else {
					$("#postResultDiv").html("<p class='error'>" + subsciber['error_message'] +
					"</p>")
				}
			},
			error : function(e) {
				
				$("#postResultDiv").html("<p class='error'>" + 
					"Error! an error occured during opt generation.<br>")
				console.log("ERROR: ", e);
			}
		});
    
		}
		
		function verifyOTP(){
    	$("#postResultDiv").html('')
    	// PREPARE FORM DATA
    	var formData = {
				subscriber_id : $("#subscriber_id").val(),
				otp: $("#otp").val()
			}
			console.log(formData)
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : window.location + "api/verify/otp",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(subsciber) {

				if(subsciber['statusCode'] == 302){
					$("#postResultDiv").html("<p class='success'>" + subsciber['message'] +
					"</p>")
				} else {
					$("#postResultDiv").html("<p class='error'>" + subsciber['error_message'] +
					"</p>")
				}
			},
			error : function(e) {
				
				$("#postResultDiv").html("<p class='error'>" + 
					"Error! Invalid OTP.<br>")
				console.log("ERROR: ", e);
			}
		});
    
    }
    
})
