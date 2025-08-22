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
    message.includes('AG Grid: Value Formatter') ||
    // Enterprise feature warnings (these features are not available in Community Edition)
    message.includes('agTotalRowCountComponent') ||
    message.includes('agFilteredRowCountComponent') ||
    message.includes('agSetColumnFilter') ||
    message.includes('agDateColumnFilter') ||
    message.includes('Enterprise feature')
  ) {
    return; // Suppress these specific v33 Community Edition warnings
  }

  // Allow other warnings through
  originalConsoleWarn.apply(console, args);
};

// Custom Status Panel Component for AG Grid v33 Community Edition
// This replaces Enterprise-only status panels like agTotalRowCountComponent and agFilteredRowCountComponent
class CustomRecordCountStatusPanel {
  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.className = 'ag-status-panel ag-status-panel-custom-record-count';
    this.eGui.style.cssText =
      'padding: 4px 8px; font-size: 12px; color: #6b7280; display: flex; align-items: center; gap: 16px;';
    this.updateCount();

    // Listen for data changes
    params.api.addEventListener('modelUpdated', () => this.updateCount());
    params.api.addEventListener('filterChanged', () => this.updateCount());
    params.api.addEventListener('sortChanged', () => this.updateCount());
  }

  updateCount() {
    if (!this.params || !this.params.api) return;

    const displayedRows = this.params.api.getDisplayedRowCount();
    const totalRows = this.params.api.getModel().getRowCount();
    const selectedRows = this.params.api.getSelectedRows().length;

    // Build status text with multiple metrics (Community Edition compatible)
    let statusText = '';

    if (displayedRows === totalRows) {
      statusText = `${totalRows} records`;
    } else {
      statusText = `${displayedRows} of ${totalRows} records`;
    }

    if (selectedRows > 0) {
      statusText += ` • ${selectedRows} selected`;
    }

    this.eGui.innerHTML = statusText;
  }

  getGui() {
    return this.eGui;
  }

  destroy() {
    // Cleanup event listeners if needed
    if (this.params && this.params.api) {
      // Event listeners are automatically cleaned up when grid is destroyed
    }
  }
}

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

      // Register custom status panel components for v33 Community Edition
      if (!gridOptions.components) {
        gridOptions.components = {};
      }
      gridOptions.components.customRecordCountStatusPanel =
        CustomRecordCountStatusPanel;

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

      // External filtering removed - using client-side data filtering instead for Community Edition compatibility

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

        // Clean up the container and event listeners
        const container = document.getElementById(containerId);
        if (container) {
          // Remove click handler if it exists
          if (container.clickHandler) {
            document.removeEventListener('click', container.clickHandler);
            delete container.clickHandler;
          }
          // Clean up dotNetRef
          if (container.dotNetRef) {
            delete container.dotNetRef;
          }
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

        // Status filters are handled client-side now

        // Clear all column filters using Community Edition compatible method
        try {
          gridApi.setFilterModel(null);
        } catch {
          // If setFilterModel fails (Enterprise feature), try alternative
          console.warn(
            'setFilterModel not available, clearing individual filters'
          );
          const columns = gridApi.getColumns();
          if (columns) {
            columns.forEach(column => {
              try {
                const filter = gridApi.getFilterInstance(column.getId());
                if (filter && filter.setModel) {
                  filter.setModel(null);
                }
              } catch {
                // Ignore individual filter errors
              }
            });
          }
        }

        // Trigger filter update
        gridApi.onFilterChanged();

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

  // Set status filter specifically

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

  // Setup dropdown click outside handler
  setupDropdownHandler: function (containerId, dotNetRef) {
    try {
      const container = document.getElementById(containerId);
      if (!container) return;

      // Store reference for cleanup
      container.dotNetRef = dotNetRef;

      // Add click handler to document
      const clickHandler = function (event) {
        const dropdownContainer = container.querySelector('.relative');
        if (dropdownContainer && !dropdownContainer.contains(event.target)) {
          dotNetRef.invokeMethodAsync('CloseStatusDropdown');
        }
      };

      // Store handler for cleanup
      container.clickHandler = clickHandler;
      document.addEventListener('click', clickHandler);
    } catch (err) {
      console.error('Error setting up dropdown handler:', err);
    }
  },

  // Close status dropdown (called from document click handler)
  closeStatusDropdown: function (containerId) {
    try {
      // Find the .NET object reference for this grid
      const container = document.getElementById(containerId);
      if (container && container.dotNetRef) {
        container.dotNetRef.invokeMethodAsync('CloseStatusDropdown');
      }
    } catch (err) {
      console.error('Error closing status dropdown:', err);
    }
  },
};
