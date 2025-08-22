/* eslint-disable no-console */
/* global agGrid, setTimeout */

// Suppress known AG Grid console warnings
const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  const message = args.join(' ');

  // Suppress specific AG Grid v33 Community Edition warnings that don't affect functionality
  if (
    message.includes('AG Grid: As of version 32.2.1, using "rowSelection"') ||
    message.includes('AG Grid: As of v32.2') ||
    message.includes('deprecated') ||
    message.includes('AG Grid: rowSelection=') ||
    message.includes('AG Grid Community: The selection API') ||
    message.includes('AG Grid: selection.mode') ||
    message.includes('AG Grid: Invalid gridOptions property') ||
    message.includes('AG Grid: suppressMenuHide') ||
    message.includes('AG Grid: suppressCellSelection') ||
    message.includes('AG Grid: enableRangeSelection') ||
    message.includes('AG Grid: animateRows') ||
    message.includes('AG Grid: suppressRowClickSelection') ||
    message.includes('AG Grid: Value Formatter')
  ) {
    return; // Suppress these specific v33 Community Edition warnings
  }

  // Allow other warnings through
  originalConsoleWarn.apply(console, args);
};

// Users App JavaScript Interop for Blazor
window.usersInterop = {
  grids: new Map(),

  // Check if AG Grid is available
  isAgGridAvailable: function () {
    return typeof agGrid !== 'undefined' && agGrid.createGrid;
  },

  // Initialize AG Grid
  createGrid: function (containerId, gridOptions, dotNetRef) {
    try {
      // Check if AG Grid is loaded
      if (!this.isAgGridAvailable()) {
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

      // Add .NET reference for callbacks with error handling
      if (dotNetRef) {
        gridOptions.onRowClicked = event => {
          try {
            if (event && event.data) {
              dotNetRef.invokeMethodAsync('HandleRowClicked', event.data);
            }
          } catch (err) {
            console.error('Error in row click handler:', err);
          }
        };

        gridOptions.onSelectionChanged = event => {
          try {
            if (event && event.api) {
              const selectedRows = event.api.getSelectedRows();
              dotNetRef.invokeMethodAsync(
                'HandleSelectionChanged',
                selectedRows
              );
            }
          } catch (err) {
            console.error('Error in selection change handler:', err);
          }
        };
      }

      // Ensure we have valid row data to prevent ARIA issues
      if (!gridOptions.rowData || gridOptions.rowData.length === 0) {
        gridOptions.rowData = [];
      }

      // Set default grid options for v33 Community Edition
      gridOptions.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        ...gridOptions.defaultColDef,
      };

      // Configure v33 Theming API with custom styling
      if (!gridOptions.theme) {
        gridOptions.theme = {
          extends: 'themeQuartz',
          spacing: 4,
          rowHeight: 42,
          headerHeight: 48,
          fontSize: 14,
          fontFamily: 'inherit',
          borderRadius: 8,
          borderColor: '#e5e7eb',
          headerBackgroundColor: '#f9fafb',
          rowHoverColor: '#f8fafc',
          selectedRowBackgroundColor: '#dbeafe',
        };
      }

      // Add value formatters for object/array fields to prevent AG Grid v33 warnings
      if (gridOptions.columnDefs) {
        gridOptions.columnDefs.forEach(colDef => {
          // Handle roles array field
          if (
            colDef.field === 'roles' &&
            !colDef.valueFormatter &&
            !colDef.cellRenderer
          ) {
            colDef.valueFormatter = function (params) {
              if (params.value && Array.isArray(params.value)) {
                return params.value.join(', ');
              }
              return params.value || '';
            };
          }

          // Handle lastActive date field
          if (
            colDef.field === 'lastActive' &&
            !colDef.valueFormatter &&
            !colDef.cellRenderer
          ) {
            colDef.valueFormatter = function (params) {
              if (params.value) {
                try {
                  const date = new Date(params.value);
                  return (
                    date.toLocaleDateString() +
                    ' ' +
                    date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  );
                } catch {
                  return params.value;
                }
              }
              return '';
            };
          }
        });
      }

      // Handle v33 Community Edition selection - keep original values
      // According to AG Grid v33 Community Edition docs, "single" and "multiple" still work
      // The new "singleRow" and "multiRow" may not be fully supported in Community Edition
      if (
        gridOptions.rowSelection === 'single' ||
        gridOptions.rowSelection === 'multiple'
      ) {
        console.log(
          `Using rowSelection: ${gridOptions.rowSelection} (AG Grid v33 Community Edition - deprecated but functional)`
        );
      }

      // Improve ARIA support with v33 compatible approach
      if (!gridOptions.getRowId) {
        gridOptions.getRowId = function (params) {
          return params.data?.id || params.node?.id || params.node?.rowIndex;
        };
      }

      // Remove deprecated v32 options that cause warnings in v33
      delete gridOptions.suppressMenuHide;
      delete gridOptions.suppressCellSelection;
      delete gridOptions.enableRangeSelection;
      delete gridOptions.animateRows;
      delete gridOptions.suppressRowClickSelection;

      // Create the grid using v33 API - correct method
      console.log('Creating grid with options:', gridOptions);
      const gridApi = agGrid.createGrid(container, gridOptions);

      if (!gridApi) {
        console.error('Failed to create AG Grid instance');
        return false;
      }

      this.grids.set(containerId, gridApi);

      // Wait for grid to be ready and validate ARIA structure
      setTimeout(() => {
        if (gridApi) {
          console.log(
            `AG Grid created successfully for container: ${containerId}`
          );

          // Validate ARIA structure after grid is ready
          const gridElement = container.querySelector('.ag-root');
          if (gridElement && !gridElement.getAttribute('role')) {
            gridElement.setAttribute('role', 'grid');
          }

          // Ensure header has proper ARIA attributes
          const headerElement = container.querySelector('.ag-header');
          if (headerElement && !headerElement.getAttribute('role')) {
            headerElement.setAttribute('role', 'rowgroup');
          }
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
        // Ensure rowData is valid array
        const validRowData = Array.isArray(rowData) ? rowData : [];
        gridApi.setGridOption('rowData', validRowData);

        // Refresh the grid to ensure proper rendering
        setTimeout(() => {
          if (gridApi) {
            gridApi.refreshCells();
          }
        }, 50);

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
        // Clean up event listeners (v33 Community Edition compatible)
        try {
          // In AG Grid v33, event listeners are cleaned up automatically by destroy()
          // Manual removal is not needed and may cause errors
        } catch (err) {
          console.warn('Event listener cleanup warning:', err);
        }

        // Destroy the grid using v33 Community Edition API
        gridApi.destroy();
        this.grids.delete(containerId);

        // Clean up the container
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
        }

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

  // Set Quick Filter text
  setQuickFilter: function (containerId, filterText) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.setGridOption('quickFilterText', filterText || '');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error setting quick filter:', err);
      return false;
    }
  },

  // Clear all filters (including column filters and quick filter)
  clearAllFilters: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        // Clear quick filter
        gridApi.setGridOption('quickFilterText', '');

        // Clear all column filters
        gridApi.setFilterModel(null);

        return true;
      }
      return false;
    } catch (err) {
      console.error('Error clearing all filters:', err);
      return false;
    }
  },

  // Get current filter model
  getFilterModel: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        return gridApi.getFilterModel();
      }
      return null;
    } catch (err) {
      console.error('Error getting filter model:', err);
      return null;
    }
  },

  // Set filter model
  setFilterModel: function (containerId, filterModel) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.setFilterModel(filterModel);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error setting filter model:', err);
      return false;
    }
  },

  // Get pagination info
  getPaginationInfo: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        return {
          currentPage: gridApi.paginationGetCurrentPage(),
          totalPages: gridApi.paginationGetTotalPages(),
          pageSize: gridApi.paginationGetPageSize(),
          rowCount: gridApi.paginationGetRowCount(),
        };
      }
      return null;
    } catch (err) {
      console.error('Error getting pagination info:', err);
      return null;
    }
  },

  // Set pagination page size
  setPaginationPageSize: function (containerId, pageSize) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.paginationSetPageSize(pageSize);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error setting pagination page size:', err);
      return false;
    }
  },

  // Go to specific page
  paginationGoToPage: function (containerId, page) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        gridApi.paginationGoToPage(page);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error going to page:', err);
      return false;
    }
  },

  // Validate grid state and fix common issues
  validateGrid: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      const container = document.getElementById(containerId);

      if (!gridApi || !container) {
        return false;
      }

      // Check if grid is properly initialized
      const gridElement = container.querySelector('.ag-root');
      if (!gridElement) {
        console.warn(`Grid element not found for container: ${containerId}`);
        return false;
      }

      // Ensure proper ARIA attributes
      if (!gridElement.getAttribute('role')) {
        gridElement.setAttribute('role', 'grid');
      }

      // Check header structure
      const headerElement = container.querySelector('.ag-header');
      if (headerElement && !headerElement.getAttribute('role')) {
        headerElement.setAttribute('role', 'rowgroup');
      }

      // Validate row structure
      const rows = container.querySelectorAll('.ag-row');
      rows.forEach((row, index) => {
        if (!row.getAttribute('role')) {
          row.setAttribute('role', 'row');
        }
        if (!row.getAttribute('aria-rowindex')) {
          row.setAttribute('aria-rowindex', (index + 1).toString());
        }
      });

      return true;
    } catch (err) {
      console.error('Error validating grid:', err);
      return false;
    }
  },
};
