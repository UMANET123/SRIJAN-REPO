
$(document).ready(function () {

  acSubscriberApps();

  function dialog(message, yesCallback, noCallback) {
    $('.title').html(message);
    var dialog = $('#modal_dialog').dialog();

    $('#btnYes').click(function() {
        dialog.dialog('close');
        yesCallback();
    });
    $('#btnNo').click(function() {
        dialog.dialog('close');
        noCallback();
    });
}     
      /**
       * Autocomplete States
       */
      function acSubscriberApps(){
       
        var states = [
          'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
          'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
          'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
          'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
          'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
          'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
          'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
          'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
          'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
          'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
          'West Virginia', 'Wisconsin', 'Wyoming'
        ];

        $("#subscriber_apps").autocomplete({
          source:[states]
        }); 

      }
    // getAllApps()

    // function getAllApps() {
        

    //     // $.ajax({
    //     //     type: "GET",
    //     //     contentType: "application/json",
    //     //     url: window.location + "api/validateMobileNo",
    //     //     data: { phone_no: phone_no },
    //     //     dataType: 'json',
    //     //     success: function (success) {
    //     //         // DO POST
    //     //         console.log(success)
    //     //     },
    //     //     error: function (e) {

    //     //         $("#postResultDiv").html("<p class='error'>" +
    //     //             "Invalid Phone No/OTP<br>")
    //     //         console.log("ERROR: ", e);
    //     //     }
    //     // });

    // }
});
