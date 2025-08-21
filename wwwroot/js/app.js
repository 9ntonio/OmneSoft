// Custom JavaScript functions for JSInterop
window.blazorFunctions = {
  showAlert: function (message) {
    alert(message);
  },

  getWindowSize: function () {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  setTitle: function (title) {
    document.title = title;
  },

  logToConsole: function (message) {
    console.log('From Blazor:', message);
  },
};
