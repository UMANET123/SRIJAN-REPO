
$(document).ready(function () {

  acSubscriberApps();
  $('#revoke_all').click(function (event) {
    event.preventDefault();
    dialogRevokeAll()
  });

  $('.revoke_app').click(function (event) {

   // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this).closest('.subscribers_apps').find('.developer_id').attr('id');
    var app_id =  $(this).closest('.subscribers_apps').find('.app_id').attr('id');
    var appname =  $(this).closest('.subscribers_apps').find('.app_id').text()
    event.preventDefault();
    dialogRevokeApp(dev_id,app_id,appname)
  });
  $('.blacklist_app').click(function (event) {
    // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this).closest('.subscribers_apps').find('.developer_id').attr('id');
    var app_id =  $(this).closest('.subscribers_apps').find('.app_id').attr('id');
    var appname =  $(this).closest('.subscribers_apps').find('.app_id').text()
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
            $.ajax({
              type : "POST",
              contentType : "application/json",
              url : "/api/revokeallapps",
              data : '',
              dataType : 'json',
              success : function(response) {
                console.log(response)
                if(response['statusCode'] == 200){
                  // window.location.href = window.location.href
                  // console.log();
                  console.log({status: response['statusCode'] });
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
                if(response['statusCode'] == 200){
                  // window.location.href = window.location.href
                  console.log({status: response['statusCode'] });
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

  function dialogBlacklist(dev_id,app_id,appname) {
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
            var paramsdata = {
              app_id : app_id,
              developer_id : dev_id
            }
            $.ajax({
              type : "POST",
              contentType : "application/json",
              url : "/api/blacklist",
              data : JSON.stringify(paramsdata),
              dataType : 'json',
              success : function(response) {
                console.log(response)
                if(response['statusCode'] == 200){
                  console.log({status: response['statusCode'] });
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
   * Autocomplete search
   */
  function acSubscriberApps() {
    
    
   $("#subscriber_apps").autocomplete({
      minLength: 1,
      source: function (req, res){
        $.ajax({
          url: "/api/search",
          success: function (appData) {
            res(appData['appname']);
          },
          error: function (e) {
              console.log("ERROR: ", e);
          }
    
      });
      },
      select: (e, item) => {
        if (item) {
          let app_name = item.item.value;
          let current_url = window.location.href;
          if (current_url.includes('?')) {
            current_url = current_url.split('?')[0];
          }
          window.location.href = `${current_url}?appname=${app_name}`;
        }


    }
    });

  }
  
});
