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

      // Set default grid options for v33
      gridOptions.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        ...gridOptions.defaultColDef,
      };

      // Create the grid using v33 API - correct method
      const gridApi = agGrid.createGrid(container, gridOptions);
      this.grids.set(containerId, gridApi);

      // Wait for grid to be ready
      setTimeout(() => {
        if (gridApi) {
          console.log(
            `AG Grid created successfully for container: ${containerId}`
          );
        }
      }, 100);

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

  // Auto-size all columns using v33 API
  autoSizeAllColumns: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        // In v33, columnApi is deprecated - use gridApi directly
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

  // Refresh the grid
  refreshGrid: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.refreshCells();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error refreshing grid:', err);
      return false;
    }
  },
};
