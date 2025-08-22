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

// Custom Cell Renderers for AG Grid v33 Community Edition
// Full Name Cell Renderer with Avatar Circle and Bold Name
class FullNameCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; gap: 12px; padding: 4px 0;';

    const fullName = params.value || '';
    const initials = this.getInitials(fullName);

    this.eGui.innerHTML = `
      <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #3b82f6; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 500; flex-shrink: 0;">
        ${initials}
      </div>
      <span style="font-weight: 600; color: #111827;">${fullName}</span>
    `;
  }

  getInitials(name) {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getGui() {
    return this.eGui;
  }
}

// Roles Cell Renderer showing first role + count
class RolesCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; padding: 4px 0;';

    const roles = params.value || [];
    let displayText = '';

    if (Array.isArray(roles) && roles.length > 0) {
      displayText = roles[0];
      if (roles.length > 1) {
        displayText += ` +${roles.length - 1} more`;
      }
    } else if (typeof roles === 'string') {
      displayText = roles;
    }

    this.eGui.innerHTML = `<span style="color: #374151;">${displayText}</span>`;
  }

  getGui() {
    return this.eGui;
  }
}

// License Cell Renderer with badge styling
class LicenseCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; padding: 8px 0;';

    const license = params.value || '';
    const badgeStyle = this.getBadgeStyle(license);

    this.eGui.innerHTML = `
      <span style="display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; line-height: 1.3; ${badgeStyle}">
        ${license}
      </span>
    `;
  }

  getBadgeStyle(license) {
    switch (license.toLowerCase()) {
      case 'enterprise':
        return 'background-color: #f3e8ff; color: #7c3aed;';
      case 'standard':
        return 'background-color: #dbeafe; color: #1d4ed8;';
      case 'field level':
        return 'background-color: #dcfce7; color: #16a34a;';
      default:
        return 'background-color: #f3f4f6; color: #374151;';
    }
  }

  getGui() {
    return this.eGui;
  }
}

// Email Cell Renderer with mailto link
class EmailCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; padding: 4px 0;';

    const email = params.value || '';

    this.eGui.innerHTML = `
      <a href="mailto:${email}" class="text-blue-600 hover:text-blue-800 hover:underline">
        ${email}
      </a>
    `;
  }

  getGui() {
    return this.eGui;
  }
}

// Last Active Cell Renderer with formatted date/time
class LastActiveCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; padding: 4px 0;';

    const lastActive = params.value;
    let displayText = '';

    if (lastActive) {
      try {
        const date = new Date(lastActive);

        // Format: "Nov 5, 2025 - 15:12"
        const dateStr = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const timeStr = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        displayText = `${dateStr} - ${timeStr}`;
      } catch {
        displayText = lastActive;
      }
    }

    this.eGui.innerHTML = `<span style="color: #374151; font-size: 14px;">${displayText}</span>`;
  }

  getGui() {
    return this.eGui;
  }
}

// Status Cell Renderer with colored pills
class StatusCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'display: flex; align-items: center; padding: 8px 0;';

    const status = params.value || '';
    const pillStyle = this.getPillStyle(status);

    this.eGui.innerHTML = `
      <span style="display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; line-height: 1.3; ${pillStyle}">
        ${status}
      </span>
    `;
  }

  getPillStyle(status) {
    switch (status.toLowerCase()) {
      case 'active':
        return 'background-color: #dcfce7; color: #16a34a;';
      case 'inactive':
        return 'background-color: #f3f4f6; color: #374151;';
      case 'suspended':
        return 'background-color: #fed7aa; color: #ea580c;';
      case 'archived':
        return 'background-color: #fecaca; color: #dc2626;';
      default:
        return 'background-color: #f3f4f6; color: #374151;';
    }
  }

  getGui() {
    return this.eGui;
  }
}

// Invite Cell Renderer showing Yes/No or checkmark
class InviteCellRenderer {
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'padding: 4px 0; display: flex; align-items: center; justify-content: center;';

    // For now, show a checkmark for all active users
    const status = params.data?.status || '';
    const isInvited = status.toLowerCase() === 'active';

    if (isInvited) {
      this.eGui.innerHTML = `
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
      `;
    } else {
      this.eGui.innerHTML = `
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      `;
    }
  }

  getGui() {
    return this.eGui;
  }
}

// Actions Cell Renderer with dropdown menu
class ActionsCellRenderer {
  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.style.cssText =
      'padding: 4px 0; display: flex; align-items: center; justify-content: center;';

    this.eGui.innerHTML = `
      <div class="relative">
        <button class="actions-btn p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="button" aria-label="Actions">
          <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </button>
        <div class="actions-dropdown absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 hidden">
          <div class="py-1">
            <button class="action-view block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View</button>
            <button class="action-edit block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
            <button class="action-archive block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Archive</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.eGui.querySelector('.actions-btn');
    const dropdown = this.eGui.querySelector('.actions-dropdown');

    button.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      if (!this.eGui.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Handle action clicks
    this.eGui.querySelector('.action-view').addEventListener('click', () => {
      console.log('View action for:', this.params.data);
      dropdown.classList.add('hidden');
    });

    this.eGui.querySelector('.action-edit').addEventListener('click', () => {
      console.log('Edit action for:', this.params.data);
      dropdown.classList.add('hidden');
    });

    this.eGui.querySelector('.action-archive').addEventListener('click', () => {
      console.log('Archive action for:', this.params.data);
      dropdown.classList.add('hidden');
    });
  }

  getGui() {
    return this.eGui;
  }

  destroy() {
    // Cleanup event listeners
    const button = this.eGui.querySelector('.actions-btn');
    if (button) {
      button.removeEventListener('click', this.buttonClickHandler);
    }
  }
}

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
      // Don't override floatingFilter here - let column definitions control it
      gridOptions.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 100,
        flex: 1,
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

      // Register custom cell renderers and status panel components for v33 Community Edition
      if (!gridOptions.components) {
        gridOptions.components = {};
      }

      // Register custom cell renderers
      gridOptions.components.fullNameCellRenderer = FullNameCellRenderer;
      gridOptions.components.rolesCellRenderer = RolesCellRenderer;
      gridOptions.components.licenseCellRenderer = LicenseCellRenderer;
      gridOptions.components.emailCellRenderer = EmailCellRenderer;
      gridOptions.components.lastActiveCellRenderer = LastActiveCellRenderer;
      gridOptions.components.statusCellRenderer = StatusCellRenderer;
      gridOptions.components.inviteCellRenderer = InviteCellRenderer;
      gridOptions.components.actionsCellRenderer = ActionsCellRenderer;

      // Register custom status panel
      gridOptions.components.customRecordCountStatusPanel =
        CustomRecordCountStatusPanel;

      // Custom cell renderers handle all formatting, no need for value formatters

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

      // Ensure container is completely clean before creating grid
      container.innerHTML = '';

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

  // Refresh filters to ensure they're properly displayed
  refreshFilters: function (containerId) {
    try {
      const gridApi = this.grids.get(containerId);
      if (gridApi) {
        // Force refresh of header and floating filters
        gridApi.refreshHeader();

        // Additional check to ensure floating filter row is visible
        setTimeout(() => {
          const container = document.getElementById(containerId);
          if (container) {
            const floatingFilterRow = container.querySelector(
              '.ag-floating-filter'
            );
            if (floatingFilterRow) {
              // Ensure floating filter row is visible
              floatingFilterRow.style.display = '';
              console.log('Floating filters refreshed successfully');
            } else {
              console.warn(
                'Floating filter row not found, attempting to trigger refresh'
              );
              // Try to trigger a column resize to force filter rendering
              if (gridApi.sizeColumnsToFit) {
                gridApi.sizeColumnsToFit();
              }
            }
          }
        }, 100);

        return true;
      }
      return false;
    } catch (err) {
      console.error('Error refreshing filters:', err);
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
