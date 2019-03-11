$(document).ready(function () {


	// SUBMIT FORM
	$("#verify_otp").click(function (event) {
		// Prevent the form from submitting via the browser.
		if ($("#otp").val() == '') {
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
			$('#otp_form_group').css('display','flex');
			$('#verify_otp').css('display','block');
			generateOTP();
		}
	});

	function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
	var raw = 'http://localhost:5560/?client_id=dNBhms6AvdY6LKw1To1vLW5232HghPiD#'
	console.log(qs(raw));
	function generateOTP() {
		$("#postResultDiv").html('')
		// PREPARE FORM DATA
		var phone_no = $("#phone_no").val();
		var client_id = $("#client_id").val();
		console.log(phone_no)
		var formData = {
			phone_no: phone_no,
			client_id: client_id
		}
		console.log(formData)
		$.ajax({
			type: "GET",
			contentType: "application/json",
			url: "/api/validateMobileNo",
			data: { phone_no: phone_no },
			dataType: 'json',
			success: function (subsciber) {
				// DO POST
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/generate/otp",
					data: JSON.stringify(formData),
					dataType: 'json',
					success: function (subsciber) {

						if (subsciber['statusCode'] == 200 || subsciber['statusCode'] == 201) {
							$("#postResultDiv").html("<p class='success'>" + subsciber['message'] +
								"</p>")
							$("#subscriber_id").val(subsciber['subscriber_id'])
						} else {
							$("#postResultDiv").html("<p class='error'>" + subsciber['error_message'] +
								"</p>")
						}
					},
					error: function (e) {

						$("#postResultDiv").html("<p class='error'>" +
							"Error! an error occured during opt generation.<br>")
						console.log("ERROR: ", e);
					}
				});
			},
			error: function (e) {

				$("#postResultDiv").html("<p class='error'>" +
					"Please enter valid Globe no.<br>")
				console.log("ERROR: ", e);
			}
		});


	}

	function verifyOTP() {
		$("#postResultDiv").html('')
		// PREPARE FORM DATA
		var formData = {
			subscriber_id: $("#subscriber_id").val(),
			client_id:  $("#client_id").val(),
			otp: $("#otp").val()
		}
		console.log(formData)
		// DO POST
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/api/verify/otp",
			data: JSON.stringify(formData),
			dataType: 'json',
			success: function (subsciber) {

				if (subsciber['statusCode'] == 302) {
					window.location.href = subsciber['redirect']
					$("#postResultDiv").html("<p class='success'>" + subsciber['message'] +
						"</p>")
				} else {
					$("#postResultDiv").html("<p class='error'>" + subsciber['error_message'] +
						"</p>")
				}
			},
			error: function (e) {

				$("#postResultDiv").html("<p class='error'>" +
					"Error! Invalid OTP.<br>")
				console.log("ERROR: ", e);
			}
		});

	}

})
