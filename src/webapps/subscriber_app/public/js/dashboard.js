
$(document).ready(function () {

  acSubscriberApps();
  $('#revoke_all').click(function (event) {
    event.preventDefault();
    dialogRevokeAll()
  });

  $('.revoke_app').click(function (event) {

   // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this).closest('.developer_id').attr('id');
    console.log(dev_id)
    var app_id =  $(this).closest('.developer_id').find('.app_id').attr('id');
    console.log(app_id)
    var appname =  $(this).closest('.developer_id').find('.app_id').text()
    console.log(appname)
    event.preventDefault();
    dialogRevokeApp(dev_id,app_id,appname)
  });
  $('.blacklist_app').click(function (event) {
    // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this).closest('.developer_id').attr('id');
    console.log(dev_id)
    var app_id =  $(this).closest('.developer_id').find('.app_id').attr('id');
    console.log(app_id)
    var appname =  $(this).closest('.developer_id').find('.app_id').text()
    console.log(appname)
    event.preventDefault();
    dialogBlacklist(dev_id,app_id,appname)
  });

  function dialogRevokeAll() {
    $.confirm({
      escapeKey: 'cancel',
      title: 'Revoke All apps!',
      content: '<p>This action will revoke the permissions from all installed apps.</p>' +
        '<p>Are you sure you want to revoke permissions from all the apps?</p>',
      buttons: {
        yes: {
          text: 'Yes',
          btnClass: 'btn-blue',
          keys: ['enter', 'shift'],
          action: function () {
          }
        },
        cancel: function () {
        }
      }
    });
  }

  function dialogRevokeApp(dev_id,app_id,appname) {
    $.confirm({
      escapeKey: 'cancel',
      title: 'Revoke App',
      content: '<p>This action will revoke all the permissions from this app</p>' +
        '<p>Are you sure you want to revoke all the permission from this app?</p>',
      buttons: {
        yes: {
          text: 'Yes',
          btnClass: 'btn-blue',
          keys: ['enter', 'shift'],
          action: function () {
            
            var paramsdata = {
              app_id : app_id,
              developer_id : dev_id
            }
            console.log(paramsdata)
            // Ajax here 
            $.ajax({
              type : "POST",
              contentType : "application/json",
              url : "/api/revokeapp",
              data : JSON.stringify(paramsdata),
              dataType : 'json',
              success : function(response) {
                console.log(response)
                if(subsciber['statusCode'] == 200){
                  location.reload();
                } else {
                  $("#postResultDiv").html("<p class='error'>There is an error occured during the operation.</p>")
                }
                
              },
              error : function(e) {
                console.log("ERROR: ", e);
              }
            });
          }
        },
        cancel: function () {
        }
      }
    });
  }

  function dialogBlacklist() {
    $.confirm({
      escapeKey: 'cancel',
      title: 'Blacklist App',
      content: '<p>This action will revoke all the app permissions and put it in blacklist.</p>' +
        '<p>Are you sure you want to blacklist this app?</p>',
      buttons: {
        yes: {
          text: 'Yes',
          btnClass: 'btn-blue',
          keys: ['enter', 'shift'],
          action: function () {
            $.ajax({
              type : "POST",
              contentType : "application/json",
              url : "/api/blacklist",
              data : JSON.stringify(paramsdata),
              dataType : 'json',
              success : function(response) {
                console.log(response)
                if(subsciber['statusCode'] == 200){
                  location.reload();
                } else {
                  $("#postResultDiv").html("<p class='error'>There is an error occured during the operation.</p>")
                }
              },
              error : function(e) {
                console.log("ERROR: ", e);
              }
            });
          }
        },
        cancel: function () {
        }
      }
    });
  }
  /**
   * Autocomplete States
   */
  function acSubscriberApps() {

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
      source: [states]
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
