$(document).ready(function() {
  // SUBMIT FORM
  $("#verify_otp").click(function(event) {
    // Prevent the form from submitting via the browser.
    if ($("#otp").val() == "") {
      $("#postResultDiv").html(
        "<p class='error'>" +
          "Please enter the otp you have recieved on your mobile.<br>"
      );
    } else {
      event.preventDefault();
      verifyOTP();
    }
  });

  $("#generate_otp").click(function(event) {
    // Prevent the form from submitting via the browser.
    if ($("#phone_no").val() == "") {
      $("#postResultDiv").html(
        "<p class='error'>" + "Please enter your valid Globe Mobile no<br>"
      );
    } else {
      event.preventDefault();
      // Validate the phone no
      $("#generate_otp").text("Resend OTP");
      generateOTP();
    }
  });

  function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
    var match = location.search.match(
      new RegExp("[?&]" + key + "=([^&]+)(&|$)")
    );
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }
  var raw =
    "http://localhost:5560/?client_id=dNBhms6AvdY6LKw1To1vLW5232HghPiD#";
  console.log(qs(raw));
  function generateOTP() {
    $("#postResultDiv").html("");
    // PREPARE FORM DATA
    var phone_no = $("#phone_no").val();
    var client_id = $("#client_id").val();
    console.log(phone_no);
    var formData = {
      phone_no: phone_no,
      client_id: client_id
    };
    console.log(formData);
    $.ajax({
      type: "GET",
      contentType: "application/json",
      url: "/api/validateMobileNo",
      data: { phone_no: phone_no },
      dataType: "json",
      success: function(subscriber) {
        // DO POST
        $.ajax({
          type: "POST",
          contentType: "application/json",
          url: "/api/generate/otp",
          data: JSON.stringify(formData),
          dataType: "json",
          success: function(subscriber) {
<<<<<<< HEAD
=======
            console.log('SUBSCRIBER, ',subscriber)
>>>>>>> develop
            if (subscriber.statusCode == 200 || subscriber.statusCode == 201) {
              $("#postResultDiv").html(
                "<p class='success'>" + subscriber.message + "</p>"
              );
<<<<<<< HEAD
              $("#subscriber_id").val(subscriber.subscriber_id);
=======
              $("#subscriber_id").val(subscriber["subscriber_id"]);
>>>>>>> develop
              $("#generate_otp").removeClass("generate_otp");
              $("#otp_form_group").css("display", "flex");
              $("#verify_otp").css("display", "block");
            } else {
              $("#postResultDiv").html(
                "<p class='error'>" + subscriber.error_message + "</p>"
              );
              if(subscriber.error_code == "InvalidClient"){
                $("#generate_otp").text("Generate OTP");
              }
            }
          },
          error: function(e) {
            console.log(e)
            $("#postResultDiv").html(
              "<p class='error'>" +
                "Error! an error occured during opt generation.<br>"
            );
            
            console.log("ERROR: ", e);
          }
        });
      },
      error: function(e) {
        let error = JSON.parse(e.responseText);
        $("#postResultDiv").html(
          "<p class='error'>" + `${error.error_message}<br>`
        );
        if(error.error_code == "InvalidPhoneNo"){
          $("#generate_otp").text("Generate OTP");
        }
      }
    });
  }

  function verifyOTP() {
    $("#postResultDiv").html("");
    // PREPARE FORM DATA
    var formData = {
      subscriber_id: $("#subscriber_id").val(),
      client_id: $("#client_id").val(),
      otp: $("#otp").val()
    };
    console.log(formData);
    // DO POST
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: "/api/verify/otp",
      data: JSON.stringify(formData),
      dataType: "json",
      success: function(subscriber) {
        console.log("SUBSCRIBER ", subscriber);
        if (subscriber.statusCode == 302) {
          window.location.href = subscriber["redirect"];
          $("#postResultDiv").html(
            "<p class='success'>" + subscriber.message + "</p>"
          );
        } else {
          $("#postResultDiv").html(
            "<p class='error'>" + subscriber.error_message + "</p>"
          );
        }
      },
      error: function(e) {
        let error = JSON.parse(e.responseText);
        if (error.statusCode != 302) {
          $("#postResultDiv").html(
            "<p class='error'>" + error.error_message + "<br>"
          );
        } else {
          window.location.href = error.redirect;
          $("#postResultDiv").html(
            "<p class='success'>" + error.message + "</p>"
          );
        }
      },
      complete: function(data){
        console.log(JSON.parse(data));
      }
    });
  }
});
