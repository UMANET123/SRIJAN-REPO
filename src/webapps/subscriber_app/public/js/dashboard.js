
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
            $.ajax({
              type : "POST",
              contentType : "application/json",
              url : "/api/revokeallapps",
              data : '',
              dataType : 'json',
              success : function(response) {
                console.log(response)
                if(subsciber['statusCode'] == 200){
                  window.location.href = window.location.href
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
                if(subsciber['statusCode'] == 200){
                  window.location.href = window.location.href
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
                if(subsciber['statusCode'] == 200){
                  window.location.href = window.location.href
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
   * Autocomplete Apps
   */
  function getApps(request, response){
    var all_apps = []
   $.ajax({
    //  type: "GET",
    //  contentType: "application/json",
      url: "/api/search",
      dataType: 'json',
      success: function (success) {
          // DO POST
        all_apps = success['appname']
        
        

        

         
        //   response($.map(success, function(item) {
        //     console.log(item.value)
        //     return {
        //         label: item.value,//text comes from a collection of mongo
        //         value: item
        //     };
        // }));
      },
      error: function (e) {
          console.log("ERROR: ", e);
      }

  });
    
    return all_apps;
  }
  function acSubscriberApps() {
    
    
   $("#subscriber_apps").autocomplete({
      source: function (req,res){
        getApps()
      },
      minLength: 3
      

    });

  }
  
});
