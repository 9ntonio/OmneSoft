// Modern JavaScript interop functions for Blazor
window.blazorInterop = {
  // Enhanced alert with modern styling
  showAlert: message => {
    return new Promise(resolve => {
      // You could replace this with a custom modal in the future
      alert(message);
      resolve();
    });
  },

  // Local storage helpers
  localStorage: {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: key => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    removeItem: key => {
      localStorage.removeItem(key);
    },
  },

  // Theme management
  theme: {
    setDarkMode: isDark => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    getSystemPreference: () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
  },

  // Focus management for accessibility
  focus: {
    setFocus: elementId => {
      const element = document.getElementById(elementId);
      if (element) {
        element.focus();
      }
    },
  },
};
