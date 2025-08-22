/* eslint-disable no-console */
/* global agGrid, setTimeout */

// Users App JavaScript Interop for Blazor
window.usersInterop = {
  grids: new Map(),

  // Initialize AG Grid
  createGrid: function (containerId, gridOptions, dotNetRef) {
    try {
      // Check if AG Grid is loaded
      if (typeof agGrid === 'undefined') {
        console.error(
          'AG Grid is not loaded. Make sure ag-grid-community.min.js is included.'
        );
        return false;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return false;
      }

      // Add .NET reference for callbacks
      if (dotNetRef) {
        gridOptions.onRowClicked = event => {
          dotNetRef.invokeMethodAsync('HandleRowClicked', event.data);
        };

        gridOptions.onSelectionChanged = event => {
          const selectedRows = event.api.getSelectedRows();
          dotNetRef.invokeMethodAsync('HandleSelectionChanged', selectedRows);
        };
      }

      // Ensure we have valid row data to prevent ARIA issues
      if (!gridOptions.rowData || gridOptions.rowData.length === 0) {
        gridOptions.rowData = [];
      }

      // Create the grid using the modern API
      const gridApi = agGrid.createGrid(container, gridOptions);
      this.grids.set(containerId, gridApi);

      // Wait for grid to be fully rendered to avoid ARIA issues
      setTimeout(() => {
        if (
          gridApi &&
          gridApi.getDisplayedRowCount() === 0 &&
          gridOptions.rowData.length === 0
        ) {
          // If no data, ensure proper ARIA structure
          const gridElement = container.querySelector('[role="grid"]');
          if (gridElement && !gridElement.querySelector('[role="row"]')) {
            // Add a placeholder row to satisfy ARIA requirements
            gridApi.setGridOption('rowData', []);
          }
        }
      }, 100);

      console.log(`AG Grid created successfully for container: ${containerId}`);
      return true;
    } catch (err) {
      console.error('Error creating AG Grid:', err);
      return false;
    }
  },

  // Update grid data
  setRowData: function (containerId, rowData) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.setGridOption('rowData', rowData);
        return true;
      }
      console.error(`Grid not found for container: ${containerId}`);
      return false;
    } catch (err) {
      console.error('Error setting row data:', err);
      return false;
    }
  },

  // Get selected rows
  getSelectedRows: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        return gridApi.getSelectedRows();
      }
      return [];
    } catch (err) {
      console.error('Error getting selected rows:', err);
      return [];
    }
  },

  // Resize grid to fit container
  sizeToFit: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.sizeColumnsToFit();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error sizing columns to fit:', err);
      return false;
    }
  },

  // Destroy grid
  destroyGrid: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.destroy();
        this.grids.delete(containerId);
        console.log(`Grid destroyed for container: ${containerId}`);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error destroying grid:', err);
      return false;
    }
  },

  // Auto-size all columns
  autoSizeAllColumns: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        const allColumnIds = [];
        gridApi.getColumns().forEach(column => {
          allColumnIds.push(column.getId());
        });
        gridApi.autoSizeColumns(allColumnIds, false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error auto-sizing columns:', err);
      return false;
    }
  },
};
