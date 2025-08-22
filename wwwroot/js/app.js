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
    // eslint-disable-next-line no-console
    console.log('From Blazor:', message);
  },
};
