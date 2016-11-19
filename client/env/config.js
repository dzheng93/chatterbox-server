// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader('X-Parse-Application-Id', 'dSNCwIniCXIY3dJz4KTuz9ROSUREvvCknGB11ReX');
  jqXHR.setRequestHeader('X-Parse-REST-API-Key', 'WsWpCFH7gaxcB2B0jVvyKPOcT5NVHriAulknx789');
});
