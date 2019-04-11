$(document).ready(function() {
  // add multiple select / deselect functionality
  // $("#selectall").click(function () {
  // 	$('.consents').attr('checked', this.checked);
  // });

  // if all checkbox are selected, check the selectall checkbox
  // and viceversa
  $(".consents").click(function() {
    if ($(".consents").length == $(".consents:checked").length) {
      $("#selectall").attr("checked", "checked");
    } else {
      $("#selectall").removeAttr("checked");
    }
  });
  $("#reject").click(function() {
    let redirect_uri = $(this).val();
    $.ajax({
      url: "/destroy/session",
      type: "GET",
      dataType: "json", // added data type
      success: function(res) {
        // console.log(res);
        window.location.href = redirect_uri;
        // // ! need to comment before push for local only  -------
        // window.location.href = redirect_uri.replace(
        //   "13.232.77.36",
        //   "localhost"
        // );
        // // ! need to comment before push for local only  -------
      }
    });
  });
  $("#accept_consent").click(function() {
    let checkedConsents = $(".consents:checked");
    // console.log(checkedConsents);
    // console.log(checkedConsents)
    if (checkedConsents.length == 0) {
      $("#postResultDiv").html(
        "<p class='error'>You need to select atleast 1 service.</p>"
      );
    } else {
      let consentValues = [];
      $(checkedConsents).each(item => {
        // console.log(checkedConsents[item], item);
        consentValues.push($(checkedConsents[item]).val());
      });

      consentValues = consentValues.join(" ");
      // console.log(consentValues);
      // let transactionId = $("#transaction_id").val();
      event.preventDefault();
      updateConsent(consentValues);
    }
  });
  function updateConsent(subscriber_consent) {
    $("#postResultDiv").html("");
    // DO POST
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/consent",
      data: JSON.stringify({ subscriber_consent }),
      dataType: "json",
      success: function(subsciber) {
        // console.log({ subscriber });
      },
      error: function(e) {
        let error = JSON.parse(e.responseText);
        // console.log(error.statusCode, error);
        if (error.statusCode != 302) {
          $("#postResultDiv").html(
            "<p class='error'>" + error.error_message + "<br>"
          );
        } else {
          $("#postResultDiv").html(
            "<p class='success'>" + error.message + "</p>"
          );
          window.location.href = error.success_redirect_uri;
        }
        // console.log("ERROR: ", e);
      }
    });
  }
});
