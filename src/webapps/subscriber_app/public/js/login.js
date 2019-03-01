$( document ).ready(function() {
		
	// SUBMIT FORM
    $("#verify_otp").click(function(event) {
		// Prevent the form from submitting via the browser.
		if($("#otp").val() == ''){
			$("#postResultDiv").html("<p class='error'>" + 
						"Please enter the otp you have recieved on your mobile.<br>");
		} else {
			event.preventDefault();
			verifyOTP();
		}
	});

	
	$(".generate_otp").click(function (event) {
		// Prevent the form from submitting via the browser.
		if ($("#phone_no").val() == '') {
			$("#postResultDiv").html("<p class='error'>" +
				"Please enter your valid Globe Mobile no<br>");
		} else {

			event.preventDefault();
			// Validate the phone no
			$("#generate_otp").text("Resend OTP");
			generateOTP();
		}
	});
    
    function generateOTP(){
    	$("#postResultDiv").html('')
			// PREPARE FORM DATA
			var phone_no = $("#phone_no").val();
    	var formData = {
    		phone_no : phone_no,
			}
			$.ajax({
				type : "GET",
				contentType : "application/json",
				url : "/api/validateMobileNo",
				data : {phone_no: phone_no},
				dataType : 'json',
				success : function(subsciber) {
					// DO POST
					$.ajax({
						type : "POST",
						contentType : "application/json",
						url : "/api/generate/otp",
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
				},
				error : function(e) {
					
					$("#postResultDiv").html("<p class='error'>" + 
						"Invalid Phone No/OTP<br>")
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
			url : "/api/verify/otp",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(subsciber) {

				if(subsciber['statusCode'] == 201){
				  window.location.href = window.location.href
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
