/*jshint esversion: 6 */
$(document).ready(function() {
  let app_search_target = "#subscriber_apps";
  $(app_search_target)
    .off("keyup")
    .on("keyup", e => {
      // console.log({ search_element: e.target.value });
      autoCompleteSearch(e.target.value);
    });
  $("#revoke_all").click(function(event) {
    event.preventDefault();
    dialogRevokeAll();
  });

  $(".revoke_app").click(function(event) {
    // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this)
      .closest(".subscribers_apps")
      .find(".developer_id")
      .attr("id");
    var app_id = $(this)
      .closest(".subscribers_apps")
      .find(".app_id")
      .attr("id");
    var appname = $(this)
      .closest(".subscribers_apps")
      .find(".app_id")
      .text();
    event.preventDefault();
    dialogRevokeApp(dev_id, app_id, appname);
  });
  $(".blacklist_app").click(function(event) {
    // var parent = $(this).closest('.subscribers_apps');
    var dev_id = $(this)
      .closest(".subscribers_apps")
      .find(".developer_id")
      .attr("id");
    var app_id = $(this)
      .closest(".subscribers_apps")
      .find(".app_id")
      .attr("id");
    var appname = $(this)
      .closest(".subscribers_apps")
      .find(".app_id")
      .text();
    event.preventDefault();
    dialogBlacklist(dev_id, app_id, appname);
  });

  function dialogRevokeAll() {
    $.confirm({
      backgroundDismiss: true,
      escapeKey: "cancel",
      title: "Revoke All apps!",
      content:
        "<p>This action will revoke the permissions from all installed apps.</p>" +
        "<p>Are you sure you want to revoke permissions from all the apps?</p>",
      buttons: {
        yes: {
          text: "Yes",
          btnClass: "btn-blue",
          keys: ["enter", "shift"],
          action: function() {
            let self = this;
            $.ajax({
              type: "POST",
              contentType: "application/json",
              url: "/api/revokeallapps",
              data: "",
              dataType: "json",
              success: function(response) {
                console.log(response);
                if (response["statusCode"] == 200) {
                  console.log({ status: response["statusCode"] });
                  self.setContentPrepend(
                    '<p class="success">Apps have been revoked successfully.</p>'
                  );
                } else {
                  self.setContentPrepend(
                    '<p class="error">There is an error occured during the operation.</p>'
                  );
                }
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              },
              error: function(e) {
                console.log("ERROR: ", e);
              }
            });
            return false;
          }
        },
        cancel: function() {}
      }
    });
  }

  function dialogRevokeApp(dev_id, app_id, appname) {
    $.confirm({
      backgroundDismiss: true,
      escapeKey: "cancel",
      title: "Revoke App",
      content:
        "<p>This action will revoke all the permissions from this app</p>" +
        "<p>Are you sure you want to revoke all the permission from this app?</p>",
      buttons: {
        yes: {
          text: "Yes",
          btnClass: "btn-blue",
          keys: ["enter", "shift"],
          action: function() {
            var paramsdata = {
              app_id: app_id,
              developer_id: dev_id
            };
            // Ajax here
            let self = this;
            $.ajax({
              type: "POST",
              contentType: "application/json",
              url: "/api/revokeapp",
              data: JSON.stringify(paramsdata),
              dataType: "json",
              success: function(response) {
                console.log(response);
                if (response["statusCode"] == 200) {
                  console.log({ status: response["statusCode"] });
                  self.setContentPrepend(
                    '<p class="success">App has been revoked successfully.</p>'
                  );
                } else {
                  self.setContentPrepend(
                    '<p class="error">There is an error occured during the operation.</p>'
                  );
                }
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              },
              error: function(e) {
                console.log("ERROR: ", e);
              }
            });
            return false;
          }
        },
        cancel: function() {}
      }
    });
  }

  function dialogBlacklist(dev_id, app_id, appname) {
    $.confirm({
      backgroundDismiss: true,
      escapeKey: "cancel",
      title: "Blacklist App",
      content:
        "<p>This action will revoke all the app permissions and put it in blacklist.</p>" +
        "<p>Are you sure you want to blacklist this app?</p>",
      buttons: {
        yes: {
          text: "Yes",
          btnClass: "btn-blue",
          keys: ["enter", "shift"],
          action: function() {
            var paramsdata = {
              app_id: app_id,
              developer_id: dev_id
            };
            let self = this;
            $.ajax({
              type: "POST",
              contentType: "application/json",
              url: "/api/blacklist",
              data: JSON.stringify(paramsdata),
              dataType: "json",
              success: function(response) {
                console.log(response);
                if (response["statusCode"] == 200) {
                  console.log({ status: response["statusCode"] });
                  self.setContentPrepend(
                    '<p class="success">App has been blacklisted successfully.</p>'
                  );
                } else {
                  self.setContentPrepend(
                    '<p class="error">There is an error occured during the operation.</p>'
                  );
                }
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              },
              error: function(e) {
                console.log("ERROR: ", e);
              }
            });
            return false;
          }
        },
        cancel: function() {}
      }
    });
  }
  /**
   * Autocomplete search
   */
  function autoCompleteSearch(appname) {
    // console.log("auto-complete called");
    let reqUri = `/api/search`;
    if (appname) reqUri = `/api/search?app_name=${appname}`;

    $("#subscriber_apps").autocomplete({
      minLength: 1,
      source: function(req, res) {
        $.ajax({
          url: reqUri,
          success: function(data) {
            res(data.appname);
          },
          error: function(e) {
            console.log("ERROR: ", e);
          }
        });
      },
      select: (e, item) => {
        if (item) {
          let app_name = item.item.value;
          let current_url = window.location.href;
          if (current_url.includes("?")) {
            current_url = current_url.split("?")[0];
          }
          window.location.href = `${current_url}?appname=${app_name}`;
        }
      }
    });
  }
});
