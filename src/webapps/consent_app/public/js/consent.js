
$(document).ready(function () {
	// add multiple select / deselect functionality
	// $("#selectall").click(function () {
	// 	$('.consents').attr('checked', this.checked);
	// });

	// if all checkbox are selected, check the selectall checkbox
	// and viceversa
	$(".consents").click(function () {

		if ($(".consents").length == $(".consents:checked").length) {
			$("#selectall").attr("checked", "checked");
		} else {
			$("#selectall").removeAttr("checked");
		}

	});
	$('#reject').click(function () {
		redirect_uri = $(this).val()
		window.location.href=redirect_uri
	});
	$('#accept_consent').click(function () {
		checked_cons = $(".consents:checked")
		console.log(checked_cons)
		if (checked_cons.length == 0) {
			$("#postResultDiv").html("<p class='error'>You need to select atleast 1 service.</p>")
		} else {
			var scopes = [];
			checked_cons.map(function () {
				scopes.push($(this).val());
			});
			console.log(scopes)
			// var scopes_data = scopes.join('')
			var scopes_data = JSON.stringify(scopes)
			console.log({scopes_data})
			// Get checked values
			event.preventDefault();
			updateConsent(scopes_data);
		}
		function updateConsent(scopes) {
			$("#postResultDiv").html('')
			console.log()
			// PREPARE FORM DATA
			var formData = {
				scopes: scopes,
				//	subsciber_id: subsciber_id
			};
			console.log(formData)
			// DO POST
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: "/api/consent",
				data: JSON.stringify(formData),
				dataType: 'json',
				success: function (subsciber) {
					if (subsciber['statusCode'] == 302) {
						window.location.href = subsciber['redirect_uri']
					}
				},
				error: function (e) {

					$("#postResultDiv").html("<p class='error'>" +
						"There are some error during the updates.<br>")
					console.log("ERROR: ", e);
				}
			});
		}
	});
})
