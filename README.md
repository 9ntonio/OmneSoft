# OmneSoft

A modern Blazor WebAssembly application demonstrating professional user management with AG Grid integration and reactive state management.

## Features

- **Professional UI**: Clean layout with responsive design and contextual controls
- **Advanced Data Grid**: AG Grid Community Edition v33.3.2 with sorting, filtering, pagination, and global search
- **Error Handling**: 5 error simulation scenarios with user-friendly messages and retry mechanisms
- **State Management**: Reactive AppStateService with intelligent loading coordination
- **Modern Components**: Custom UsersGrid with Tailwind CSS and accessibility compliance
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks

## Tech Stack

- **Frontend**: Blazor WebAssembly (.NET 8.0.8 LTS)
- **Styling**: Tailwind CSS v3.4.17 with PostCSS processing
- **Data Grid**: AG Grid Community Edition v33.3.2 (CDN-hosted)
- **Code Quality**: ESLint v9.33.0, Prettier v3.6.2, Husky v9.1.7
- **Build**: npm scripts with automated CSS compilation

## Architecture

### State Management

Custom `AppStateService` provides reactive state coordination with triple-layer loading states:

```csharp
// Service registration and component integration
builder.Services.AddScoped<IAppStateService, AppStateService>();

@inject IAppStateService AppState
@implements IDisposable

// Triple-layer loading: local, global, and component awareness
private async Task LoadData()
{
    isLoading = true;                    // Component UI
    AppState.SetLoading(true);           // Global coordination
    AppState.SetComponentLoading(true);  // Suppress duplicate loaders

    try { /* operations */ }
    finally { /* cleanup all states */ }
}
```

### AG Grid Integration

**Fixed Height Strategy**: Uses `calc(100vh - 250px)` to prevent v33.3.2 percentage height issues.

**Value Formatters**: Automatic handling for arrays (roles) and dates (lastActive) with proper fallbacks.

### Error Handling

5 error simulation types: network failures, timeouts, JSON parsing, 404s, and server errors. Features automatic grid state reset and centered error display.

## Project Structure

```
OmneSoft/
├── Components/UI/           # Reusable UI components
│   └── UsersGrid.razor     # Advanced data grid component with AG Grid v33.3.2
├── Pages/
│   └── Home.razor         # Main users management page
├── Services/
│   ├── IAppStateService.cs # State management interface
│   └── AppStateService.cs  # Reactive state implementation
├── Models/
│   └── AppSettings.cs     # Application configuration models
├── wwwroot/
│   ├── css/
│   │   ├── app.css        # Source Tailwind CSS with AG Grid optimizations
│   │   └── app.min.css    # Compiled and minified CSS (auto-generated)
│   ├── js/
│   │   └── users-interop.js # AG Grid JavaScript interop with v33.3.2 compatibility
│   ├── data/users.json    # Sample user data (40 superhero-themed records)
│   ├── index.html         # Main HTML template with CDN references
│   └── appsettings.json   # Client-side configuration
├── App.razor              # Root application component with routing
├── MainLayout.razor       # Application layout
├── Program.cs             # Entry point and DI configuration
└── _Imports.razor         # Global using statements
```

## Components

### Core Components

### UsersGrid Component

Advanced data grid with AG Grid v33.3.2 integration:

**Key Features:**

- 8-column layout with custom cell renderers
- Global search and floating column filters
- Pagination (10/25/50 rows), sorting, selection
- Strategic column pinning (Name left, Actions right)
- WCAG accessibility with ARIA attributes
- Error simulation with automatic state reset

**API Methods:**

```javascript
// Global search, clear filters, get filter state
usersInterop.setQuickFilter(containerId, searchText);
usersInterop.clearAllFilters(containerId);
usersInterop.getFilterModel(containerId);
```

#### Loading States

Triple-layer approach: local (`isLoading`), global (`AppState.SetLoading`), and component awareness (`SetComponentLoading`) to prevent duplicate loaders.

## Accessibility

WCAG compliance with unique row IDs, ARIA attributes, keyboard navigation, and screen reader support (NVDA, JAWS, VoiceOver).

### Layout

Header with contextual refresh button, main content with 300px spacing for header/footer, responsive design with semantic HTML.

### AG Grid Configuration

Community Edition v33.3.2 with Quartz theme, fixed heights, floating filters, and custom cell renderers using inline styles for CSS independence.

#### Height Configuration

Fixed heights (`calc(100vh - 250px)`, min 500px) prevent v33 percentage height issues. CSS fixes ensure floating filter visibility.

#### Developer Notes

**Community Edition**: Configured for AG Grid Community Edition. Enterprise features replaced with custom implementations.

**Best Practices**: Use fixed heights, implement proper cleanup, use inline styles in cell renderers, test with error simulation.

**Troubleshooting**: Check height configuration for rendering issues, verify floating filter CSS fixes, ensure proper JavaScript interop setup.

### Interface Design

Professional layout with branded header, contextual refresh button (error simulation only), centered error display, and responsive Tailwind CSS styling.

## Recent Updates

- **JavaScript Interop**: Simplified dropdown handler with direct container-based click detection
- **AdvancedDropdown Component**: Added demo component with click-outside detection and keyboard navigation
- **Error Display**: Centered, card-style error layout for better UX
- **Contextual UI**: Refresh button appears only during error simulation
- **AG Grid Config**: Streamlined floating filter setup with global configurationbase:

**Changes Made:**

- **JavaScript Interop Cleanup**: Removed `exportFilteredDataToCsv` function and related export utilities from `users-interop.js`
- **Component Simplification**: Focused on core data grid functionality with advanced filtering capabilities
- **Reduced Complexity**: Eliminated export-related state management and UI components
- **Performance Optimization**: Streamlined JavaScript interop layer for better performance

This change simplifies the application architecture while maintaining all core data management and filtering capabilities.

**Note**: The UsersGrid.razor component may still contain UI elements referencing export functionality, but the underlying JavaScript implementation has been removed. The component focuses on advanced filtering and data visualization capabilities.

### Data Filtering & Management System

**Comprehensive Filtering Capabilities**: The UsersGrid component features advanced filtering and data management:

**Implementation Features:**

- **Global Search**: Quick filter functionality for searching across all columns with debounced input
- **Status Filtering**: Custom dropdown filter for user status types (Active, Inactive, Suspended, Archived)
- **Enhanced Column Filtering**: Individual column filters with floating filter inputs below headers for immediate inline filtering
- **Client-Side Filtering**: Optimized client-side data filtering for AG Grid Community Edition compatibility
- **Filter State Management**: Real-time filter application with proper state tracking and UI updates
- **Combined Filtering**: Multiple filter types work seamlessly together for precise data selection

**Key Filtering Features:**

```javascript
// Core filtering methods
setQuickFilter(containerId, filterText); // Global search
clearAllFilters(containerId); // Reset all filters
getFilterModel(containerId); // Get current filter state
setFilterModel(containerId, filterModel); // Apply filter configuration
```

This filtering system provides comprehensive data management capabilities while maintaining optimal performance with AG Grid Community Edition.

### Cell Renderer Styling Enhancement

**Complete Inline Styling Implementation**: All custom cell renderers in the UsersGrid component have been fully converted to use inline styles for maximum reliability and consistency:

**Implementation Improvements:**

- **Full Inline Style Conversion**: All cell renderers now use `cssText` for inline styling instead of CSS classes, ensuring complete independence from external stylesheets
- **FullNameCellRenderer Enhancement**: Avatar circles, spacing, and typography use inline styles with specific pixel values and color codes
- **RolesCellRenderer Alignment Optimization**: Enhanced with flexbox layout (`display: flex; align-items: center; padding: 4px 0;`) for improved vertical alignment and consistent spacing with other cell renderers
- **LicenseCellRenderer Padding Optimization**: Enhanced vertical spacing with `padding: 8px 0;` for improved visual balance and consistent alignment with other cell renderers, while maintaining refined badge styling with optimized dimensions (`padding: 2px 10px`, `border-radius: 12px`, `font-size: 13px`) and improved line-height (1.2) for enhanced readability and professional appearance
- **InviteCellRenderer Alignment Enhancement**: Improved vertical alignment with `align-items: center` in addition to horizontal centering for perfect icon positioning within cells
- **CSS Framework Independence**: Cell renderers no longer depend on Tailwind CSS or any external CSS frameworks
- **Improved Reliability**: Inline styling prevents rendering issues that could occur if CSS classes are not available in the AG Grid context
- **Professional Avatar Display**: Enhanced full name cell with circular avatar showing user initials, proper spacing, and bold name formatting
- **Consistent Styling Approach**: All visual elements use inline styles with specific pixel values and color codes for predictable appearance across all renderers

This enhancement ensures that all custom cell renderers work reliably in all environments and contexts, providing consistent professional appearance without any external dependencies. The complete conversion to inline styles eliminates potential styling conflicts and ensures reliable rendering regardless of CSS loading order or availability.

### AG Grid Community Edition Status Bar Optimization

**Enhanced Community Edition Compatibility**: The UsersGrid component has been optimized for AG Grid v33.3.2 Community Edition by removing Enterprise-only status bar components:

**Implementation Changes:**

- **Enterprise Component Removal**: Removed `agTotalRowCountComponent` and `agFilteredRowCountComponent` from status bar configuration to prevent console errors
- **Custom Status Panel Only**: Status bar now uses only the custom `customRecordCountStatusPanel` for record count display
- **Improved Console Output**: Eliminates Enterprise-only component warnings while maintaining full functionality
- **Community Edition Focus**: Configuration optimized specifically for Community Edition capabilities and limitations

This optimization ensures clean console output and reliable status bar functionality while maintaining the professional appearance and user experience.

**Common Enterprise Feature Errors Fixed:**

- **Console Error**: `AG Grid: Invalid gridOptions property 'agTotalRowCountComponent'` → **Solution**: Removed Enterprise-only status panel components
- **Console Error**: `AG Grid: Invalid gridOptions property 'agFilteredRowCountComponent'` → **Solution**: Replaced with custom status panel
- **Console Error**: `AG Grid: Invalid gridOptions property 'agSetColumnFilter'` → **Solution**: Changed to `agTextColumnFilter` for Community compatibility
- **Console Error**: `AG Grid: Invalid gridOptions property 'agDateColumnFilter'` → **Solution**: Changed to `agTextColumnFilter` with custom date formatting

These changes maintain full functionality while ensuring compatibility with AG Grid Community Edition v33.3.2.

### Status Filtering Implementation Enhancement

**Complete Status Filtering System**: The UsersGrid component now features a fully implemented custom status filtering system with client-side data filtering:

**Implementation Features:**

- **Custom Status Filter UI**: Interactive dropdown with checkbox selection for Active, Inactive, and Suspended status types
- **Client-Side Data Filtering**: Optimized client-side filtering approach using `FilterUserData` method for AG Grid Community Edition compatibility
- **Real-time Filter Application**: Status filters apply immediately when selections change with proper state management
- **Filter State Tracking**: `selectedStatusFilters` array maintains current filter selections with automatic UI updates
- **Combined Filtering**: Status filters work seamlessly alongside global search and column filters
- **Performance Optimized**: Client-side filtering implementation ensures smooth performance and reliable operation in Community Edition

This enhancement provides a complete, production-ready status filtering system that uses client-side data filtering for maximum compatibility with AG Grid Community Edition while maintaining optimal performance.

### Component Initialization Enhancement (Latest)

**Improved Dropdown Handler Setup**: The UsersGrid component has been optimized for better initialization timing and user experience:

**Implementation Improvements:**

- **Early Dropdown Handler Initialization**: The status filter dropdown handler is now set up immediately when the component renders, ensuring the filter button works even before grid initialization
- **Improved User Experience**: Users can interact with the status filter dropdown immediately after component load, without waiting for the data grid to fully initialize
- **Better Error Recovery**: The dropdown functionality remains available even if grid initialization encounters errors
- **Optimized Initialization Sequence**: DotNetObjectReference creation and dropdown handler setup moved to the beginning of the `OnAfterRenderAsync` method for immediate availability

**Technical Changes:**

```csharp
// Enhanced initialization sequence in OnAfterRenderAsync
if (firstRender)
{
    // Set up dropdown handler immediately when component renders
    // This ensures filter button works even before grid initialization
    dotNetRef = DotNetObjectReference.Create(this);
    await JSRuntime.InvokeVoidAsync("usersInterop.setupDropdownHandler", ContainerId, dotNetRef);

    previousSimulateErrors = SimulateErrors;
    await LoadUsers();
    if (errorState == null)
    {
        await InitializeGrid();
    }
}
```

This enhancement ensures that all interactive UI elements are available to users as soon as possible, improving the perceived performance and responsiveness of the application.

### Enhanced Column Configuration & Cell Renderers

**Professional Data Presentation**: The UsersGrid component features comprehensive custom cell renderers for enhanced data visualization:

**Custom Cell Renderer Implementation:**

- **Strategic Column Layout**: 8-column layout with optimized widths and strategic pinning for improved user experience
- **Custom Cell Renderers**: Each column features specialized renderers for professional data presentation:
  - **fullNameCellRenderer**: Enhanced name display with avatar circles, initials, and bold formatting using inline styles for maximum reliability (200px width, pinned left)
  - **rolesCellRenderer**: Comma-separated role display with styling (180px width)
  - **licenseCellRenderer**: License type formatting with visual indicators (120px width)
  - **emailCellRenderer**: Email formatting with clickable links (220px width)
  - **lastActiveCellRenderer**: Date/time formatting with relative time display (160px width)
  - **statusCellRenderer**: Status badges with color coding (100px width)
  - **inviteCellRenderer**: Compact invitation status display (80px width)
  - **actionsCellRenderer**: Action buttons for user management (100px width, pinned right)
- **Column Pinning Strategy**: Full Name pinned left for context, Actions pinned right for accessibility
- **Responsive Width Allocation**: Optimized column widths totaling 1060px with flex sizing for container adaptation
- **Inline Styling Approach**: Cell renderers use inline styles instead of CSS classes for maximum reliability and independence from external stylesheets
- **Enhanced User Experience**: Strategic layout improvements for better data scanning and interaction

This enhanced column configuration provides professional data presentation with improved usability and visual hierarchy while maintaining full AG Grid Community Edition compatibility.

### Error Simulation Enhancement & Grid Lifecycle Management

The UsersGrid component has been updated with enhanced error simulation capabilities and improved grid lifecycle management for robust development and testing workflows.

- **Grid Destruction & Recreation**: Automatically destroys and recreates the grid when transitioning from error simulation to normal mode for optimal reliability
- **Extended DOM Update Delays**: Increased delay from 50ms to 100ms for DOM cleanup/update operations to ensure proper grid initialization after state changes
- **Error-Safe Cleanup**: Grid destruction operations include comprehensive error handling to prevent cleanup failures from affecting component state
- **State Reset Protection**: Grid initialization flag is properly reset during cleanup operations to maintain accurate component state

#### **Robust Error Simulation System**:

- **Comprehensive Error Testing**: Error simulation cycles through 5 different error types (network, timeout, JSON parsing, 404, unexpected) for thorough testing
- **Clean State Management**: Error counter resets when switching off error simulation to ensure predictable behavior
- **Grid State Coordination**: Parameter changes trigger appropriate grid updates or recreation based on current state
- **Development-Friendly**: Simple toggle between normal operation and error demonstration with automatic state cleanup
- **Improved Reliability**: Enhanced error handling ensures component remains stable during simulation mode transitions

#### **Implementation Highlights**:

```csharp
// Clean slate when switching off error simulation
if (!SimulateErrors)
{
    errorCounter = 0;

    // Destroy and recreate grid for pristine state
    if (isGridInitialized)
    {
        try
        {
            await JSRuntime.InvokeVoidAsync("usersInterop.destroyGrid", ContainerId);
            isGridInitialized = false;
        }
        catch
        {
            // Ignore cleanup errors - ensure state is reset
            isGridInitialized = false;
        }
    }
}

// Extended delay for DOM cleanup/update operations
await Task.Delay(100); // Longer delay for DOM cleanup/updateDelay(50); // Small delay for DOM update
        await InitializeGrid();
    }
    else
    {
        StateHasChanged();
    }
}

// Comprehensive error simulation cycling through 5 error types
if (SimulateErrors)
{
    var errorType = errorCounter % 5; // Cycle through 0-4
    errorCounter++;

    switch (errorType)
    {
        case 0: throw new HttpRequestException("Simulated network connection error");
        case 1: throw new TaskCanceledException("Simulated request timeout");
        case 2: throw new JsonException("Simulated JSON parsing error");
        case 3: // Simulate 404 directly
            errorState = new ErrorState
            {
                Message = "File Not Found (404)",
                Details = "The users data file could not be located on the server.",
                ActionText = "Retry Loading"
            };
            return;
        case 4: throw new Exception("Simulated unexpected error");
    }
}
```

## Current Project Status

The OmneSoft application is a fully functional Blazor WebAssembly project with streamlined data management capabilities and the following current implementation:

### Core Features ✅

- **Professional User Management Interface**: Complete home page with branded header, data grid, and controls
- **Enhanced User Data Model**: Comprehensive 40-user dataset with 3 status types (Active, Inactive, Suspended) for complete user lifecycle management
- **Advanced AG Grid Integration**: Stable v33.3.2 implementation with Quartz theme, pagination, global search, floating column filters, and responsive flex columns
- **AG Grid v33 Height Fix**: Automatic percentage-to-fixed height conversion to prevent Community Edition rendering issues
- **Error Simulation System**: Built-in error testing with 5 different error scenarios
- **Comprehensive Error Handling**: Network errors, timeouts, JSON parsing, HTTP status codes, and unexpected errors
- **Hybrid State Management**: Centralized AppStateService with reactive patterns, dual loading states, and comprehensive disposal patterns
- **Cross-Component Coordination**: Components automatically react to global state changes with memory-safe subscription patterns
- **Loading States**: Dual loading state management (local and global) with animated indicators and cross-component awareness
- **Refresh Functionality**: Complete data refresh with grid state reset and proper resource cleanup
- **JavaScript Interop**: Robust AG Grid integration with lifecycle management, event handling, and advanced filtering capabilities
- **Enhanced Data Management**: AG Grid v33 pagination (10/25/50 rows) with custom status bar, performance-optimized global search with debouncing, individual column filters, custom status filtering with client-side data filtering, custom cell renderers for professional data presentation, and strategic column pinning
- **Advanced Filtering System**: Complete filtering implementation with global search, status filtering, column filters, and filter state management
- **Responsive Design**: Professional layout with viewport-based CSS calculations, dedicated grid container classes, and Tailwind CSS styling

### Technical Implementation ✅

- **.NET 8 LTS**: Long-term support foundation with WebAssembly hosting
- **Dependency Injection**: Scoped services for HttpClient and state management
- **Modern Build Pipeline**: Automated CSS building with PostCSS, Tailwind CSS, AG Grid optimizations, and production minification
- **Code Quality Tools**: ESLint, Prettier, Husky pre-commit hooks, and lint-staged for consistent formatting
- **Memory Management**: Proper disposal patterns with IDisposable and IAsyncDisposable implementations for comprehensive resource cleanup, including debounce timer disposal
- **Production Ready**: Comprehensive error handling, timeout configuration, and stability optimizations

### Current Dependencies ✅

- **AG Grid Community**: v33.3.2 (CDN-hosted with Quartz theme)
- **Tailwind CSS**: v3.4.17 with PostCSS v8.4.47 processing
- **ESLint**: v9.33.0 with Prettier v3.6.2 integration
- **Husky**: v9.1.7 for Git hooks with lint-staged v16.1.5
- **.NET**: 8.0.8 LTS with WebAssembly components
- **Microsoft.Extensions.Http**: v8.0.0 for HTTP client configuration

The project is ready for development, testing, and production deployment with all core features implemented and thoroughly tested.

## Getting Started

### Installation & Setup

1. **Prerequisites**
   - .NET 8 SDK (8.0.8 or later)
   - Node.js (v16 or later) with npm
   - Modern web browser with WebAssembly support

2. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd OmneSoft
   ```

3. **Install npm dependencies**

   ```bash
   npm install
   ```

4. **Build and run the application**

   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Open your browser** and navigate to `https://localhost:5001` or `http://localhost:5000`

### Available Scripts

- `npm run dev` - Build CSS and start development server
- `npm start` - Build CSS and start development server (alias for dev)
- `npm run build` - Build CSS and compile .NET project
- `npm run publish` - Build CSS and publish for production
- `npm run build-css` - Build CSS in watch mode for development
- `npm run build-css-prod` - Build production CSS (minified)
- `npm run lint` - Run ESLint code analysis
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes

### Usage

#### Main Interface

The application opens to the **Users Management** interface featuring:

- **Data Grid**: Displays user information with advanced sorting, filtering, pagination, global search, custom status filtering, and selection capabilities
- **Search Controls**: Global search box with debounced input and custom status filter dropdown with checkbox selection
- **Filter Management**: Comprehensive filtering with status dropdown, global search, and column-specific filters
- **Filter Management**: Active filter counter and clear filters functionality
- **Contextual Refresh Button**: Appears only during error simulation, reloads data and resets grid state
- **Error Simulation Toggle**: Enables/disables error simulation for testing
- **Professional Layout**: Full-height responsive design with branded header and footer

#### Error Simulation

Toggle the "Simulate Errors" switch in the header to test error handling scenarios:

1. **Network Connection Error**: Simulates network connectivity issues
2. **Request Timeout**: Simulates slow server response times
3. **JSON Parsing Error**: Simulates malformed data responses
4. **File Not Found (404)**: Simulates missing resource errors
5. **Unexpected Error**: Simulates general application errors

Each error type displays appropriate user feedback with retry mechanisms and clear error descriptions.

#### Data Grid Features

The AG Grid v33.3.2 Community Edition implementation includes:

- **Advanced Sorting**: Click column headers to sort data with multi-column support
- **Triple Filtering System**:
  - **Global Search**: Quick filter searches across all columns simultaneously
  - **Column Filters**: Individual column filters with floating filter inputs
  - **Custom Status Filter**: Interactive dropdown with checkbox selection
- **Pagination**: Navigate through data with configurable page sizes (10, 25, 50 rows)
- **Custom Cell Renderers**: Professional data presentation with inline styling
- **Selection**: Single-row selection with event callbacks
- **Responsive Design**: Grid adapts to different screen sizes with fixed height strategy

#### Development Features

- **Hot Reload**: CSS compilation with watch mode and Blazor hot reload
- **Error Boundaries**: Comprehensive error handling with user-friendly messages
- **Loading States**: Dual loading state management (local and global)
- **Memory Management**: Proper cleanup of subscriptions and resources with IDisposable
- **Accessibility**: WCAG-compliant implementation with ARIA attributes
- **Code Quality**: Automated formatting and linting with pre-commit hooks

## Contributing

This project follows modern development practices:

- **Code Quality**: ESLint v9.33.0 and Prettier v3.6.2 ensure consistent formatting
- **Git Hooks**: Husky v9.1.7 runs quality checks before commits with lint-staged
- **Architecture**: Clean separation of concerns with dependency injection
- **Testing**: Error simulation system for comprehensive testing scenarios
- **Build Pipeline**: Automated CSS compilation integrated into .NET build process

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Architecture Details

### AG Grid v33.3.2 Integration

The application uses AG Grid Community Edition v33.3.2 with several key optimizations:

- **CDN Hosting**: AG Grid is loaded via CDN for optimal performance
- **Fixed Height Strategy**: Uses `calc(100vh - 250px)` to prevent v33 percentage height issues
- **Custom Cell Renderers**: All cell renderers use inline styles for maximum reliability
- **Community Edition Compatibility**: Removes Enterprise-only features to prevent console errors
- **Theming API**: Uses v33 Theming API with Quartz theme customizations

### State Management

The `AppStateService` provides reactive state coordination:

```csharp
// Service registration
builder.Services.AddScoped<IAppStateService, AppStateService>();

// Component integration
@inject IAppStateService AppState
@implements IDisposable

// Reactive updates
AppState.OnChange += StateHasChanged;
```

### Error Handling

Comprehensive error simulation with 5 different scenarios:

1. **Network Connection Error**: Simulates connectivity issues
2. **Request Timeout**: Simulates slow server responses
3. **JSON Parsing Error**: Simulates malformed data
4. **File Not Found (404)**: Simulates missing resources
5. **Unexpected Error**: Simulates general exceptions

Each error type provides appropriate user feedback with retry mechanisms.

- **Network Errors**: Simulated connection failures
- **Timeout Errors**: Request timeout scenarios
- **JSON Parsing Errors**: Invalid data format handling
- **HTTP 404 Errors**: Missing resource responses
- **Unexpected Errors**: General exception handling
- **Intelligent Toggle**: Changes take effect immediately with lifecycle-aware parameter detection
- **Automatic Refresh**: Grid data refreshes automatically when simulation mode changes

Each error type displays appropriate user feedback with retry options.

#### Grid Features

The UsersGrid component provides comprehensive data management capabilities:

- **Advanced Sorting**: Click column headers to sort data with multi-column support
- **Triple Filtering System**:
  - **Global Search**: Quick filter searches across all columns simultaneously
  - **Column Filters**: Individual column filters with floating filter inputs below headers, including native AG Grid set filters for status selection
  - **Custom Status Filter**: Interactive dropdown with checkbox selection for precise status filtering using client-side data filtering
- **Intelligent Pagination**:
  - Configurable page sizes (10, 25, 50 rows per page)
  - Navigation controls with page size selector
  - Automatic page size management
- **Enhanced Column Layout**: 8-column layout with custom cell renderers and strategic pinning (Full Name left, Actions right)
- **Professional Data Presentation**: Custom cell renderers for each data type (fullName, roles, license, email, lastActive, status, invite, actions)
- **Selection Management**: Single-row selection with event callbacks and keyboard navigation
- **Responsive Design**: Automatically adapts to container size with optimal space utilization and flex sizing
- **Professional Styling**: Modern Quartz theme with consistent appearance and accessibility compliance

#### Column Structure

The data grid displays the following user information columns in optimized order with custom cell renderers:

- **Full Name**: User's complete name with text filtering and custom cell renderer (pinned left for better UX)
- **Assigned Roles**: User roles displayed as comma-separated values with text filtering and custom role renderer (manager, admin, field, analyst, tech, etc.)
- **License**: User license type with text filtering and custom license renderer for flexible search capabilities
- **Email**: User's email address with text filtering and custom email renderer
- **Last Active**: Last activity timestamp with text filtering and custom date/time renderer
- **Status**: User account status with text filtering and custom status renderer (Active, Inactive, Suspended)
- **Invite?**: Invitation status with custom invite renderer (compact 80px width)
- **Actions**: User action buttons with custom actions renderer (pinned right for easy access)

#### Data Management Features

The enhanced UsersGrid now provides powerful data management capabilities:

**Using Pagination:**

- Navigate through data using the pagination controls at the bottom of the grid
- Change page size using the dropdown selector (10, 25, 50 rows per page)
- Default page size is 25 rows for optimal performance and usability

**Status Bar Information:**

- Custom record count panel shows current view status (e.g., "25 of 100 records")
- Status bar updates automatically when data changes or filters are modified
- Enterprise-only components (agTotalRowCountComponent, agFilteredRowCountComponent) removed for Community Edition compatibility

**Using Global Search:**

- Use the quick filter to search across all columns simultaneously
- Type in the search box to filter data with optimized performance (300ms debounce)
- Search works across all visible columns and data types
- Debouncing ensures smooth performance while typing

**Using Column Filters:**

- Individual column filters appear below each column header
- Click on the filter icon in any column to access filtering options
- Status column features AG Grid's native set filter with predefined values (Active, Inactive, Suspended) for precise status selection
- Combine column filters with global search and custom status filters for precise data discovery

**Using Custom Status Filter:**

- Click the "Filters" button to open the status filter dropdown
- Select/deselect status types (Active, Inactive, Suspended) using checkboxes
- Filter counter shows the number of active filters in the button label
- Status filters apply immediately using client-side data filtering and work alongside other filtering methods
- Use "Clear Status Filters" to remove all status filter selections
- Click outside the dropdown or use "Clear filters" button to reset all filters

**Column Management:**

- Columns automatically resize to fit available space using flex layout
- Drag column borders to manually resize columns
- All columns maintain minimum width for readability

## Development

### Architecture Overview

The application follows modern Blazor WebAssembly patterns with:

- **Component-Based Architecture**: Reusable UI components with clear separation of concerns and proper disposal patterns
- **Centralized State Management**: AppStateService for global application state with reactive subscriptions
- **Dependency Injection**: Scoped services for HTTP client and state management
- **JavaScript Interop**: Dedicated interop layer for AG Grid integration with resource cleanup
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Memory Management**: Comprehensive disposal patterns using both IDisposable and IAsyncDisposable interfaces, with automatic timer cleanup

### Key Components

#### UsersGrid Component

Located at `Components/UI/UsersGrid.razor`, this is the main data grid component featuring:

- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Animated loading indicators with proper state management
- **AG Grid Integration**: Uses v33.3.2 with correct createGrid API
- **Custom Status Filtering**: Complete status filtering implementation with interactive dropdown UI and dedicated JavaScript interop function
- **Intelligent Parameter Management**: Lifecycle-aware detection of `SimulateErrors` parameter changes with proper initialization state tracking
- **Optimized Update Logic**: Only processes parameter changes after grid initialization to prevent unnecessary operations during startup
- **Real-Time Data Refresh**: Automatic grid data refresh when error simulation mode is toggled with immediate UI updates
- **Event Callbacks**: Row click and selection change events
- **Performance Optimizations**: Debounced search input with 300ms delay and automatic timer cleanup
- **Configurable Parameters**: Height, width, data URL, and intelligent error simulation options with lifecycle-aware parameter detection

#### AppStateService

Located at `Services/AppStateService.cs`, provides:

- **Reactive State Updates**: Event-based notifications for component updates
- **Loading State Management**: Global loading indicators
- **Memory Leak Prevention**: Proper subscription cleanup patterns

### Build Process

The project uses an integrated build pipeline:

1. **CSS Processing**: Tailwind CSS compiled with PostCSS
2. **Production Optimization**: CSS minification with cssnano
3. **Automated Builds**: CSS builds automatically before .NET compilation
4. **Code Quality**: Pre-commit hooks ensure consistent formatting

### Code Quality Tools

- **ESLint v9.33.0**: JavaScript/TypeScript linting with Prettier integration
- **Prettier v3.6.2**: Code formatting for multiple file types
- **Husky v9.1.7**: Git hooks for automated quality checks
- **lint-staged v16.1.5**: Run linters only on changed files

### Testing Error Scenarios

The application includes built-in error simulation for testing with intelligent lifecycle-aware parameter detection:

1. Toggle "Simulate Errors" switch in the header (changes apply immediately with intelligent state tracking)
2. Grid automatically refreshes data when simulation mode changes
3. Test different error types and recovery mechanisms
4. Verify user feedback and retry functionality
5. Toggle can be changed multiple times without manual refresh

### Deployment

The application can be deployed to any static hosting service:

- **Build**: `npm run publish`
- **Output**: `bin/Release/net8.0/publish/wwwroot/`
- **Requirements**: Static file hosting with WebAssembly support
- **CDN Dependencies**: AG Grid loaded from jsdelivr CDN

### .NET 8 Selection

.NET 8 was chosen for this project due to its **Long Term Support (LTS) status**, providing 3 years of support until November 2026. This ensures long-term stability, security updates, and enterprise-grade reliability for production deployments.

### Blazor WebAssembly Architecture

The application uses **Blazor WebAssembly** instead of Blazor Server for several key advantages:

- **No Server Dependency**: The app runs entirely in the browser, eliminating server-side rendering requirements and reducing infrastructure complexity
- **Enhanced JSInterop**: WebAssembly provides superior JavaScript interoperability, enabling seamless integration with third-party libraries like AG Grid
- **Offline Capability**: Once loaded, the application can function without network connectivity
- **Client-Side Performance**: All processing happens on the client, reducing server load and improving responsiveness
- **Static Hosting**: Can be deployed to any static file hosting service (CDN, GitHub Pages, etc.)

## Project Structure

```text
├── Components/
│   ├── Layout/          # Layout components (currently empty - using MainLayout.razor)
│   └── UI/              # Reusable UI components
│       ├── Button.razor         # Custom button component
│       └── UsersGrid.razor      # Advanced user management grid with 7-column layout, error handling, and Quartz theme
├── Pages/
│   └── Home.razor       # Professional user management interface with header controls, full-height layout, and IDisposable implementation
├── Services/            # Application services
│   ├── AppStateService.cs       # Centralized state management implementation
│   └── IAppStateService.cs      # State management interface
├── Models/              # Data models and configuration
│   └── AppSettings.cs   # Application configuration model
├── wwwroot/
│   ├── js/
│   │   ├── advanced-dropdown-helper.js  # Advanced dropdown with keyboard navigation and click-outside detection
│   │   ├── users-interop.js     # AG Grid JavaScript interop with v33.3.2 createGrid API, lifecycle management, and filtering functionality
│   │   └── app.js               # Application-specific JavaScript
│   ├── css/
│   │   ├── app.css              # Source Tailwind CSS with AG Grid container optimizations
│   │   └── app.min.css          # Compiled and minified CSS
│   ├── data/
│   │   └── users.json           # User management dataset (40 superhero-themed records with 4 status types)
│   ├── appsettings.json         # Application configuration
│   ├── index.html               # Main HTML template with AG Grid CDN references
│   └── favicon.png              # Application icon
├── .vscode/
│   └── settings.json    # VS Code workspace settings
├── Program.cs           # Application startup and service configuration
├── MainLayout.razor     # Main application layout with conditional rendering and footer
├── App.razor            # Root application component with routing
├── _Imports.razor       # Global using statements
├── OmneSoft.csproj      # Project configuration with automated CSS builds and .NET 8.0.8
├── package.json         # npm dependencies and build scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration for CSS processing
├── eslint.config.js     # ESLint configuration for code quality
├── .husky/              # Git hooks for code quality
│   ├── pre-commit       # Pre-commit hook for linting and formatting
│   └── pre-push         # Pre-push hook for additional checks
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Prettier ignore patterns
└── .editorconfig        # Editor configuration for consistent formatting
```

## Previous Updates

### Status Filtering Infrastructure Enhancement

**Enhanced Filtering Infrastructure**: The UsersGrid component has been updated with status filtering infrastructure, including `selectedStatusFilters` state management and configurable `statusOptions` array, preparing the component for advanced filtering capabilities while maintaining current AG Grid native filtering functionality.

### Column Structure Optimization

**Enhanced User Experience**: The UsersGrid component has been updated with an optimized column structure for improved user experience and logical data presentation:

**Column Structure Changes:**

- **Removed ID Column**: Eliminated the technical ID column to focus on user-relevant information
- **Optimized Column Order**: Grid displays 7 essential columns in logical order: Full Name, Roles, Email, License, Status, Last Active, and Invited By
- **Roles Positioning**: Moved Roles column to second position for better visibility of user permissions
- **Cleaner Interface**: Simplified column layout reduces visual clutter and improves data readability
- **Enhanced Focus**: Users can concentrate on meaningful business data without technical identifiers

**Benefits:**

- **Improved Usability**: More space for important user information with logical column ordering
- **Enhanced Data Scanning**: Roles column positioned early for quick permission assessment
- **Professional Appearance**: Cleaner, business-focused data presentation
- **Better Performance**: Fewer columns to render and process
- **Enhanced User Experience**: Focus on actionable user management data with intuitive flow

### Previous Update: Simplified Pagination Configuration

**Streamlined Data Management**: The UsersGrid component has been updated with simplified pagination configuration for better performance and user experience:

**Updated Pagination Settings:**

- **Default Page Size**: Set to 20 rows per page for optimal performance
- **Expanded Options**: Page size selector includes 10, 20, 50, 100 rows for flexible data viewing
- **Community Edition Status Bar**: Custom record count component optimized for AG Grid v33 Community Edition compatibility
- **Enhanced Performance**: Streamlined grid configuration for faster rendering and interaction

**Previous Update: Performance-Optimized Search with Debouncing**

**Enhanced Search Performance**: The UsersGrid component has been optimized with intelligent debouncing for improved search performance and user experience:

**New Performance Features:**

- **Debounced Search Input**: 300ms debounce timer prevents excessive API calls while typing
- **Optimized Resource Management**: Automatic timer disposal prevents memory leaks
- **Smooth User Experience**: Responsive search without performance degradation
- **Thread-Safe Implementation**: Uses `InvokeAsync` for proper Blazor component updates

**Advanced Data Management Features**: The UsersGrid component includes comprehensive data management capabilities:

**Core Features:**

- **Intelligent Pagination System**:
  - Built-in AG Grid v33 pagination controls with 25 rows per page default
  - Configurable page sizes: 10, 25, 50 rows per page (selectable via dropdown)
  - Native AG Grid pagination panel with navigation controls
  - Automatic page size management without manual configuration

- **Performance-Optimized Global Search**:
  - Debounced quick filter that searches across all visible columns simultaneously
  - 300ms delay prevents excessive filtering during typing
  - Real-time search results with optimal performance
  - Integrated search box in the grid interface

- **Enhanced Column Filtering**:
  - Individual column filters for precise data filtering
  - Floating filter inputs displayed below column headers
  - Specialized set filter for status column with predefined values
  - Combined with global search for powerful data discovery

- **Responsive Column Layout**:
  - Flex-based column sizing (`flex = 1`) for optimal space utilization
  - Columns automatically adjust to available container width
  - Maintains minimum width requirements while maximizing readability

**Implementation Details:**

```csharp
// Debounced search implementation
private async Task OnQuickFilterChanged(ChangeEventArgs e)
{
    quickFilterText = e.Value?.ToString() ?? string.Empty;

    // Dispose existing timer
    debounceTimer?.Dispose();

    // Create new timer with 300ms delay
    debounceTimer = new System.Threading.Timer(async _ =>
    {
        if (isGridInitialized)
        {
            await InvokeAsync(async () =>
            {
                await JSRuntime.InvokeVoidAsync("usersInterop.setQuickFilter", ContainerId, quickFilterText);
            });
        }
        debounceTimer?.Dispose();
        debounceTimer = null;
    }, null, 300, Timeout.Infinite);
}
```

```javascript
// Enhanced grid configuration
gridOptions = {
  // Pagination
  pagination: true,
  paginationPageSize: 25,
  paginationPageSizeSelector: [10, 25, 50],

  // Status Bar Configuration (AG Grid v33 Community Edition)
  // Enterprise-only components removed to prevent console errors
  statusBar: {
    statusPanels: [
      {
        statusPanel: 'customRecordCountStatusPanel',
        align: 'left',
      },
      // Enterprise-only components removed to prevent console errors:
      // - agTotalRowCountComponent (Enterprise)
      // - agFilteredRowCountComponent (Enterprise)
    ],
  },

  // Global search
  quickFilterText: '',

  // Column filtering
  enableFilter: true,
  floatingFilter: true,

  // Responsive columns
  defaultColDef: {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 100,
  },
};
```

**Benefits:**

- **Optimized Performance**: Debounced search prevents excessive API calls and improves responsiveness
- **Enhanced User Experience**: Users can efficiently navigate large datasets with smooth search and pagination
- **Improved Data Discovery**: Combined global search and column filtering enable precise data location
- **Professional Interface**: Modern data grid features expected in enterprise applications
- **Resource Efficiency**: Proper timer disposal prevents memory leaks and resource waste
- **Responsive Design**: Flexible column layout adapts to different screen sizes and container widths

### Previous Update: AG Grid API Method Correction

**JavaScript Interop API Fix**: The most recent update corrects the AG Grid initialization method in the JavaScript interop layer to use the proper v33.3.2 API:

**Change Made:**

```javascript
// Before (incorrect for v33.3.2):
const gridApi = new agGrid.Grid(container, gridOptions);

// After (correct v33.3.2 API):
const gridApi = agGrid.createGrid(container, gridOptions);
```

**Benefits:**

- **Proper API Usage**: Now uses the officially recommended AG Grid v33.3.2 createGrid method
- **Enhanced Reliability**: Correct API method ensures proper grid initialization and resource management
- **Better Error Handling**: The createGrid method provides improved error handling during grid creation
- **Future Compatibility**: Aligns with AG Grid's current and future API patterns
- **Consistent Implementation**: JavaScript interop now matches AG Grid v33.3.2 documentation standards

This update ensures the UsersGrid component operates with the correct AG Grid v33.3.2 API patterns for maximum stability and reliability.

### AG Grid Layout Configuration Enhancement

**Explicit DOM Layout Control with Visual Styling Enhancement**: The UsersGrid component has been updated with explicit layout configuration, CSS box model optimization, and consistent visual styling for improved rendering consistency:

- **DOM Layout Specification**: Added `domLayout = "normal"` to grid options for predictable rendering behavior
- **CSS Box Model Optimization**: Added `box-sizing: border-box` to the grid container for consistent sizing calculations that include padding and borders
- **Explicit Visual Styling**: Added `background-color: white` and `border: 1px solid #ddd` for consistent appearance across different themes and environments
- **Container Compatibility**: Ensures consistent grid sizing and scrolling behavior within various container environments
- **Layout Stability**: Prevents layout issues that can occur with automatic DOM layout detection and inconsistent box model calculations
- **Cross-Browser Consistency**: Provides uniform grid rendering across different browsers and viewport sizes with standardized box model behavior and explicit styling
- **Enhanced Reliability**: Explicit layout control, box model optimization, and visual styling reduce potential rendering inconsistencies in complex layouts

This enhancement ensures the data grid renders consistently across all deployment environments while maintaining optimal performance and user experience with predictable sizing behavior and professional appearance.

### Column Configuration Simplification

**Simplified Column Definitions**: The UsersGrid component has been updated with streamlined column configuration for better maintainability and compatibility:

- **Minimal Configuration**: Column definitions now use only essential properties (`field`, `headerName`, `width`)
- **Native AG Grid Rendering**: Removed custom cell renderers in favor of AG Grid's default rendering capabilities
- **Automatic Feature Detection**: AG Grid automatically enables sorting, filtering, and appropriate cell formatting based on data types
- **Enhanced Performance**: Native rendering provides better performance compared to custom JavaScript cell renderers
- **Improved Compatibility**: Simplified configuration ensures maximum compatibility across AG Grid versions
- **Reduced Complexity**: Easier maintenance and debugging with fewer custom implementations

This simplification ensures the data grid leverages AG Grid's optimized default behaviors while maintaining professional appearance and functionality.

### Component Layout Architecture

**Conditional Rendering Pattern**: The UsersGrid component uses a traditional conditional rendering approach for different UI states:

- **State-Based Rendering**: Each UI state (error, loading, grid) is rendered conditionally with appropriate styling
- **Flexible Dimensions**: The grid container uses inline styles for height and width parameters with `box-sizing: border-box`, explicit white background, and subtle border for maximum flexibility and consistent visual presentation
- **Consistent Visual Design**: Error and loading states use consistent card-based design with rounded corners and appropriate colors
- **Responsive Layout**: Components adapt to parent container dimensions while maintaining visual consistency
- **Clean State Management**: Clear separation between error, loading, and success states with appropriate visual indicators
- **Accessible Design**: Proper semantic HTML structure with ARIA-compliant elements and visual feedback

```razor
@if (errorState != null)
{
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
        <!-- Error state content with retry functionality -->
    </div>
}
else if (isLoading)
{
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
        <!-- Loading state with animated spinner -->
    </div>
}
else
{
    <div id="@ContainerId" class="ag-theme-quartz" style="height: @Height; width: @Width;"></div>ing: border-box; background-color: white; border: 1px solid #ddd;"></div>
}
```

This approach provides clear visual feedback for each application state while maintaining flexibility in layout and styling.

### Enhanced Refresh Functionality

**Grid State Reset Improvements**: The UsersGrid component's refresh functionality has been enhanced with proper grid state management:

- **Clean Grid Re-initialization**: The `RefreshData()` method now properly destroys and recreates the grid instance to ensure clean state
- **Improved Resource Management**: Grid cleanup is performed before re-initialization to prevent memory leaks and state conflicts
- **Error-Safe Cleanup**: Grid destruction errors are safely handled during the cleanup process
- **Consistent Refresh Behavior**: Ensures reliable refresh operations regardless of current grid state
- **Enhanced User Experience**: Provides more predictable refresh behavior with proper loading state management

### Code Quality Improvements

**Control Flow Modernization**: The UsersGrid component has been updated to follow modern C# best practices:

- **Structured Control Flow**: Uses clean `switch` statements with `break` patterns for better code organization
- **Improved Code Readability**: Cleaner, more maintainable code structure that's easier to review and understand
- **Better Error Flow**: Streamlined error simulation handling while maintaining comprehensive testing capabilities
- **Modern C# Patterns**: Follows current C# coding standards and best practices for control flow management
- **Enhanced Documentation**: Added inline comments explaining control flow logic for better code maintainability

These changes improve code maintainability and user experience while maintaining all existing functionality - all 5 error simulation scenarios continue to work exactly as before, with enhanced refresh capabilities and optimized AG Grid configuration with explicit DOM layout control for maximum Community Edition compatibility and rendering consistency.

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js (for npm dependencies)
- uv/uvx (recommended: `brew install uv` on macOS)

### Installation

1. Clone the repository
2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Restore .NET packages:

   ```bash
   dotnet restore
   ```

### Service Configuration

The application is configured with the following services in `Program.cs`:

```csharp
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using OmneSoft.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Configure root components
builder.RootComponents.Add<OmneSoft.App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure services
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
    Timeout = TimeSpan.FromSeconds(30)
});

// Register application services
builder.Services.AddScoped<IAppStateService, AppStateService>();

// Configure logging for development
if (builder.HostEnvironment.IsDevelopment())
{
    builder.Logging.SetMinimumLevel(LogLevel.Debug);
}

await builder.Build().RunAsync();
```

### JavaScript Interop Architecture

The application uses a comprehensive JavaScript interop system for both AG Grid integration and general UI interactions:

#### users-interop.js Features

- **Grid Lifecycle Management**: Complete grid creation, update, and destruction lifecycle
- **Stable AG Grid API**: Uses v33.3.2 `createGrid` API with minimal configuration approach optimized for Community Edition
- **Essential Row Selection**: Basic row selection configuration using direct string values for reliable functionality
- **Intelligent Value Formatters**: Automatic handling of complex data types including array fields (roles displayed as comma-separated values) and date fields (lastActive formatted as localized date/time) to prevent AG Grid v33 warnings
- **Custom Status Filtering**: Client-side data filtering using `FilterUserData` method for Community Edition compatibility
- **Data Filtering Implementation**: Client-side filtering logic that processes data before passing to AG Grid
- **Event Handling**: Row click and selection change events with .NET callbacks
- **Resource Management**: Proper cleanup and memory management with grid destruction
- **Error Handling**: Comprehensive error handling with console logging
- **Core Accessibility**: Basic ARIA compliance with essential grid functionality
- **Grid Operations**: Data updates, column sizing, selection management, auto-sizing, and custom filtering
- **UI Interaction**: Dropdown click-outside handling for custom filter components

#### advanced-dropdown-helper.js Features

- **Advanced Dropdown Functionality**: Comprehensive dropdown behavior with click-outside detection and keyboard navigation
- **Escape Key Support**: Automatically closes dropdown on Escape key press and returns focus to trigger button
- **Element Identification**: Uses unique element IDs and data attributes for reliable element targeting
- **Event Management**: Proper event listener setup and cleanup to prevent memory leaks
- **Blazor Integration**: Seamless integration with Blazor components via `DotNetObjectReference`
- **Error Handling**: Comprehensive error handling for setup and cleanup operations
- **Multiple Instance Support**: Supports multiple components using click-outside detection simultaneously

```javascript
// Click-outside helper API
window.clickOutsideHelper = {
  setup: function (elementId, dotNetRef),    // Setup click-outside detection
  cleanup: function (elementId)             // Clean up event listeners
};
```

```javascript
// Key interop functions with simplified grid configuration
window.usersInterop = {
  createGrid: function (containerId, gridOptions, dotNetRef),
  setRowData: function (containerId, rowData),
  getSelectedRows: function (containerId),
  sizeToFit: function (containerId),
  destroyGrid: function (containerId),
  autoSizeAllColumns: function (containerId),
  applyStatusFilter: function (containerId, selectedStatuses),
  setQuickFilter: function (containerId, filterText),
  clearAllFilters: function (containerId),
  setupDropdownHandler: function (containerId, dotNetRef)
};
```

### Development

Run the application in development mode:

```bash
npm run dev
```

This will:

- Build Tailwind CSS in production mode
- Start the Blazor WebAssembly development server
- Open the application at `https://localhost:5001`

### Data Structure

The application includes a comprehensive user management dataset (`wwwroot/data/users.json`) with 40 superhero-themed records, each containing:

```json
{
  "id": "u-1001",
  "fullName": "Clark Kent",
  "roles": ["manager", "warehouse"],
  "license": "Field Level",
  "email": "ckent@dailyplanet.com",
  "lastActive": "2025-11-05T15:12:00Z",
  "status": "Active",
  "invitedBy": "Bruce Wayne",
  "avatarUrl": null
}
```

**Data Features:**

- **User Identification**: Unique IDs and full names
- **Role Management**: Multiple roles per user (admin, manager, field, analyst, etc.)
- **License Types**: Enterprise, Field Level, Standard licensing
- **Contact Information**: Email addresses with themed domains
- **Activity Tracking**: Last active timestamps with timezone support
- **Status Management**: Active, Inactive, Suspended status tracking
- **Invitation Tracking**: Records who invited each user
- **Extensible Structure**: Avatar URL field for future profile image support

### Application Navigation

The application provides a streamlined single-page interface:

- **`/` (Home)**: Professional user management interface with optimized layout, integrated controls, and maximum grid visibility

The Home page focuses on providing an optimal data management experience with streamlined navigation, integrated controls, and calculated viewport heights for maximum grid presentation efficiency.

### Available Scripts

- `npm run dev` - Build CSS and start development server
- `npm run start` - Build CSS and start the application
- `npm run build` - Build CSS and compile .NET application
- `npm run publish` - Build CSS and publish the application
- `npm run lint` - Run ESLint on JavaScript files
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run build-css` - Build CSS in watch mode for development
- `npm run build-css-prod` - Build and minify CSS for production
- `npm run prepare` - Set up Husky git hooks

### Component Architecture

The application features a modular component architecture:

#### UI Components

- **UsersGrid.razor**: Specialized user management grid with comprehensive error handling, loading states, and AG Grid integration
- **Button.razor**: Custom button component with variants (Primary, Secondary, Success, Danger) and loading states

#### Layout Components

- **MainLayout.razor**: Responsive main layout with conditional rendering for full viewport pages
- **App.razor**: Root application component with routing configuration

#### Services

- **AppStateService**: Centralized state management with reactive patterns and event-driven updates
- **IAppStateService**: Service interface for dependency injection and testability

## Application Overview

### Main User Management Interface (Home Page)

The application's primary interface (`/`) provides a professional, optimized user management system featuring:

#### Core Functionality

- **Professional Data Grid**: Interactive AG Grid displaying 40 superhero-themed user records with sorting, filtering, and selection capabilities within an optimized flexible layout
- **Streamlined User Experience**: Professional interface with dedicated header and flexible content area that adapts to viewport size
- **User Selection Management**: Single-row selection with real-time row click and selection event handling
- **Simple Error Simulation Testing**: Toggle-able error simulation that demonstrates 404 "File Not Found" errors, integrated into the header for easy development testing of error handling

#### User Interface Features

- **Flexible Layout**: Streamlined layout with branded header and flexible content area using `flex-1` for maximum grid visibility
- **Branded Header**: "Users Management" title with contextual refresh functionality (appears only during error simulation) and error simulation toggle
- **Adaptive Content Area**: Main section with proper padding (p-8) and full height grid container (`h-full`) for optimal data grid presentation
- **Technology Footer**: Footer displaying the technology stack (Blazor WebAssembly, .NET 8, AG Grid, Tailwind CSS)
- **Modern Styling**: Tailwind CSS classes for shadows, borders, background colors, and responsive design
- **Integrated Controls**: Error simulation toggle and refresh controls built directly into the header for streamlined access
- **Comprehensive Error Handling**: All error states, loading indicators, and retry mechanisms are built directly into the grid component

#### Data Management

- **Automatic Data Loading**: Users data automatically loads from `data/users.json` on page initialization
- **Comprehensive Error Handling**: Handles network failures, timeouts, HTTP errors (404, 401, 500), and JSON parsing errors
- **Built-in Retry Mechanisms**: Error states include retry functionality with loading state management
- **Loading State Management**: Dual loading state approach (component-specific and global coordination)
- **Enhanced Manual Refresh**: Contextual header-integrated refresh button (visible during error simulation) with grid state reset for clean re-initialization and loading state feedback

#### User Experience Enhancements

- **Adaptive Grid Display**: Flexible layout system ensures maximum data visibility that adapts to different viewport sizes
- **Integrated Controls**: Error simulation and refresh functionality built directly into the header for streamlined access
- **Professional Presentation**: Clean, modern interface optimized for data management tasks
- **Responsive Design**: Layout automatically adjusts to provide optimal user experience across different screen sizesntrols\*\*: All essential controls are built into the header for streamlined user experience
- **Visual Consistency**: Consistent use of Tailwind CSS classes for shadows (shadow-sm), borders (border-b, border-t), and spacing
- **Accessibility**: Proper focus management, ARIA attributes, and keyboard navigation support
- **Responsive Design**: Grid and layout automatically adapt to viewport size changes with optimized height calculations
- **State Persistence**: Integration with AppStateService for global state coordination

## AG Grid + Blazor Integration

### JavaScript Interop Approach

This application uses **IJSRuntime with Custom JavaScript Functions** for AG Grid integration.

#### Chosen Approach: Custom JavaScript Functions

**Implementation:**

- Custom `window.usersInterop` namespace in `users-interop.js`
- C# calls JavaScript via `IJSRuntime.InvokeVoidAsync()` and `IJSRuntime.InvokeAsync<T>()`
- JavaScript calls C# via `DotNetObjectReference` and `[JSInvokable]` methods

**Why This Approach:**

- Full control over AG Grid lifecycle and features
- Direct JavaScript calls without abstraction layers
- Clear separation between C# and JavaScript concerns
- Proven pattern for complex library integrations

#### Usage Pattern

```csharp
// C# Component
@inject IJSRuntime JSRuntime
private DotNetObjectReference<MyComponent>? dotNetRef;

protected override async Task OnAfterRenderAsync(bool firstRender)
{
    if (firstRender)
    {
        dotNetRef = DotNetObjectReference.Create(this);
        await JSRuntime.InvokeVoidAsync("usersInterop.createGrid", containerId, options, dotNetRef);
    }
}

[JSInvokable]
public void HandleGridEvent(object data) { /* Handle callback */ }

public async ValueTask DisposeAsync()
{
    await JSRuntime.InvokeVoidAsync("usersInterop.destroyGrid", containerId);
    dotNetRef?.Dispose();
}
```

```javascript
// JavaScript (users-interop.js)
window.usersInterop = {
  createGrid: function (containerId, options, dotNetRef) {
    // Initialize AG Grid
    // Set up event handlers that call dotNetRef.invokeMethodAsync()
  },
};
```

### Integration Architecture

#### 1. **JavaScript Interop Layer** (`wwwroot/js/users-interop.js`)

- Creates a bridge between Blazor C# and AG Grid JavaScript
- Manages grid instances in a Map for multiple grids
- Handles grid lifecycle: create, update, destroy
- Provides callbacks for row clicks and selection changes
- Uses the stable AG Grid v33.3.2 API (`agGrid.createGrid()`)
- Namespace: `window.usersInterop`

#### 2. **Blazor Component** (`Components/UI/UsersGrid.razor`)

- Wraps the JavaScript interop in a specialized user management component
- Provides strongly-typed parameters for configuration
- Handles component lifecycle and cleanup
- Supports event callbacks for row interactions
- Uses `DotNetObjectReference` for JavaScript-to-C# callbacks
- Can work with either interop layer depending on configuration

#### 3. **Dependencies** (`wwwroot/index.html`)

- AG Grid Community v33.3.2 from CDN
- Built-in Quartz theme via JavaScript configuration
- Multiple custom interop JavaScript files

### How to Use AG Grid Integration

#### UsersGrid Component (Primary User Management Interface)

The `UsersGrid` component is the core of the application's user management functionality. It's a production-ready grid specifically designed for user management with built-in error handling, loading states, data fetching, **centralized state management integration via AppStateService**, and **accessibility compliance**.

**Main Application Usage (Home Page - Professional Interface):**

```razor
@page "/"
@inject IJSRuntime JSRuntime
@inject IAppStateService AppState

<PageTitle>Users - OmneSoft</PageTitle>

<header class="bg-white shadow-sm border-b">
    <div class="px-8 py-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
            <div class="flex items-center space-x-4">
                @if (simulateErrors)
                {
                    <button @onclick="RefreshData"
                            disabled="@isRefreshing"
                            class="@GetRefreshButtonClass() font-medium py-2 px-4 rounded-lg transition-colors">
                        <!-- Contextual refresh button with loading state -->
                    </button>
                }

                <div class="flex items-center space-x-2">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" @bind="simulateErrors" class="sr-only">
                        <!-- Error simulation toggle -->
                    </label>
                </div>
            </div>
        </div>
    </div>
</header>

<div class="p-8" style="height: calc(100vh - 160px);">
    <UsersGrid @ref="usersGrid"
               ContainerId="users-grid"
               Height="100%"
               Width="100%"
               EnableSelection="true"
               SelectionMode="single"
               OnRowClicked="OnRowClicked"
               OnSelectionChanged="OnSelectionChanged"
               DataUrl="data/users.json"
               SimulateErrors="@simulateErrors" />
</div>

@code {
    private UsersGrid? usersGrid;
    private bool simulateErrors = true;
    private bool isRefreshing = false;

    private async Task RefreshData()
    {
        isRefreshing = true;
        if (usersGrid != null)
        {
            await usersGrid.RefreshData();
        }
        isRefreshing = false;
    }

    private void OnRowClicked(object rowData)
    {
        // Handle row click event
    }

    private void OnSelectionChanged(object[] selectedRows)
    {
        // Handle selection change
    }
}
```

**Custom Implementation (Embedded Usage):**

```razor
<!-- Customized usage with different settings for embedded scenarios -->
<div style="height: 600px;">
    <UsersGrid ContainerId="my-users-grid"
               Height="100%"
               Width="100%"
               DataUrl="api/users"
               EnableSelection="true"
               SelectionMode="multiple"
               OnRowClicked="HandleUserClick"
               OnSelectionChanged="HandleSelectionChange"
               SimulateErrors="false" />
</div>
```

#### UsersGrid Features

**Data Management:**

- **Automatic data loading** from JSON endpoints with comprehensive error handling
- **Structured error simulation** with 5 distinct scenarios using modern C# control flow patterns
- **HTTP status code handling** for various server response scenarios (200, 404, 401, 500, timeout)
- **JSON deserialization** with case-insensitive property matching
- **Retry mechanisms** with user-friendly error messages and actionable retry buttons
- **Loading state management** with both component-level and global state coordination endpoints (default: `data/users.json`)
- **Comprehensive error handling** with user-friendly error messages and visual error states
- **Built-in retry functionality** for failed requests with loading state management
- **Network resilience** handling 404, 401, 500, timeout, and connection error scenarios
- **Simple error simulation testing** - Demonstrates 404 "File Not Found" error handling for development testing and UI validation

**User Interface:**

- **Dual loading state management** with component-specific and global loading coordination
- **Enhanced loading indicators** with animated spinners, contextual messages, and dedicated grid placeholders during initialization
- **Improved loading UX** with dedicated grid placeholders instead of opacity effects for better visual feedback
- **Empty state handling** with user-friendly "No data available" message when no data is loaded
- **Pre-configured columns** optimized for user data display with custom cell renderers
- **Status color coding** (Active=green, Inactive=orange, Suspended=red) with inline styling
- **Date formatting** for last active timestamps with locale-aware display
- **Role display** with comma-separated values and proper array handling

**Technical Implementation:**

- **AppStateService integration** - Uses centralized state management for global loading coordination
- **Service injection** - Built-in dependency injection for HttpClient and IAppStateService
- **Optimized lifecycle management** - Synchronous initialization for subscriptions, async for operations
- **Automatic re-rendering** - Reactive UI updates via AppStateService.OnChange subscription
- **Memory leak prevention** - Comprehensive cleanup of subscriptions, JS interop, and .NET object references
- **Resource management** - Proper disposal of grid instances and DotNetObjectReference objects
- **Accessibility compliance** - Proper focus management, semantic HTML, ARIA attributes, WCAG guidelines adherence, and enhanced ARIA structure handling for empty grid states

**User Data Schema:**
The application manages users with the following data structure:

- **ID**: Unique user identifier (e.g., "u-1001")
- **Full Name**: User's complete name
- **Email**: Contact email address
- **Roles**: Array of user roles (manager, admin, field, analyst, etc.)
- **License**: License type (Enterprise, Field Level, Standard)
- **Status**: Current status (Active, Inactive, Suspended)
- **Last Active**: Timestamp of last activity
- **Invited By**: Name of the user who invited this user

#### Programmatic Grid Control

```razor
@code {
    private UsersGrid? usersGridRef;

    // UsersGrid methods
    private async Task RefreshUsers()
    {
        await usersGridRef!.RefreshData();
    }

    private async Task GetSelectedUsers()
    {
        var selected = await usersGridRef!.GetSelectedRows();
        // Process selected users
    }

    private async Task ResizeGrid()
    {
        await usersGridRef!.SizeToFit();
    }
}
```

### JS Interop Implementation Details

#### JavaScript Side (`users-interop.js`)

```javascript
window.usersInterop = {
  grids: new Map(), // Manages multiple grid instances

  createGrid: function (containerId, gridOptions, dotNetRef) {
    // Creates grid with .NET callbacks using stable AG Grid v33.3.2 API
    const container = document.getElementById(containerId);

    // Add .NET callbacks for row events
    if (dotNetRef) {
      gridOptions.onRowClicked = event => {
        dotNetRef.invokeMethodAsync('HandleRowClicked', event.data);
      };
      gridOptions.onSelectionChanged = event => {
        const selectedRows = event.api.getSelectedRows();
        dotNetRef.invokeMethodAsync('HandleSelectionChanged', selectedRows);
      };
    }

    // Ensure valid row data to prevent ARIA issues
    if (!gridOptions.rowData || gridOptions.rowData.length === 0) {
      gridOptions.rowData = [];
    }

    const gridApi = agGrid.createGrid(container, gridOptions);
    this.grids.set(containerId, gridApi);

    // ARIA compliance: Wait for grid rendering to complete
    setTimeout(() => {
      if (
        gridApi &&
        gridApi.getDisplayedRowCount() === 0 &&
        gridOptions.rowData.length === 0
      ) {
        // Ensure proper ARIA structure for empty grids
        const gridElement = container.querySelector('[role="grid"]');
        if (gridElement && !gridElement.querySelector('[role="row"]')) {
          gridApi.setGridOption('rowData', []);
        }
      }
    }, 100);

    return true;
  },

  setRowData: function (containerId, rowData) {
    // Updates grid data using modern API
    const gridApi = this.grids.get(containerId);
    gridApi.setGridOption('rowData', rowData);
  },

  // Additional methods: getSelectedRows, sizeToFit, destroyGrid, autoSizeAllColumns
};
```

#### C# Side (UsersGrid.razor)

```csharp
@inject IJSRuntime JSRuntime
@inject HttpClient HttpClient
@inject IAppStateService AppState

@code {
    private DotNetObjectReference<UsersGrid>? dotNetRef;
    private bool isGridInitialized = false;
    private ErrorState? errorState = null;

    protected override void OnInitialized()
    {
        // Synchronous subscription - optimized lifecycle management
        AppState.OnChange += StateHasChanged;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await LoadUsersAndInitializeGrid();
        }
    }

    private async Task InitializeGrid()
    {
        try
        {
            dotNetRef = DotNetObjectReference.Create(this);

            var gridOptions = new
            {
                columnDefs = columnDefs,
                rowData = validRowData,
                // v33 Community Edition compatible row selection configuration
                rowSelection = EnableSelection ? SelectionMode : (object?)null,
                animateRows = true,
                suppressNoRowsOverlay = validRowData.Length == 0,
                loadingOverlayComponent = (object?)null,
                noRowsOverlayComponent = (object?)null,
                defaultColDef = new
                {
                    sortable = true,
                    filter = true,
                    resizable = true,
                    flex = 1,
                    minWidth = 100
                },
                // Stable grid options for v33.3.2
                suppressMenuHide = false,
                suppressMovableColumns = false,
                enableRangeSelection = false,
                suppressCopyRowsToClipboard = true,
                // Accessibility improvements
                suppressRowClickSelection = false,
                suppressCellFocus = false,
                // Performance optimizations
                suppressAnimationFrame = false,
                suppressParentsInRowNodes = true,
                suppressFieldDotNotation = false
            };

            isGridInitialized = await JSRuntime.InvokeAsync<bool>(
                "usersInterop.createGrid", ContainerId, gridOptions, dotNetRef);
        }
        catch (Exception)
        {
            errorState = new ErrorState
            {
                Message = "Grid initialization failed",
                Details = "Failed to initialize the data grid component.",
                ActionText = "Reload Grid"
            };
            AppState.NotifyStateChanged();
        }
    }

    // JavaScript can call these methods
    [JSInvokable]
    public async Task HandleRowClicked(object rowData)
    {
        if (OnRowClicked.HasDelegate)
        {
            await OnRowClicked.InvokeAsync(rowData);
        }
    }

    [JSInvokable]
    public async Task HandleSelectionChanged(object[] selectedRows)
    {
        if (OnSelectionChanged.HasDelegate)
        {
            await OnSelectionChanged.InvokeAsync(selectedRows);
        }
    }

    public async ValueTask DisposeAsync()
    {
        // Comprehensive cleanup
        AppState.OnChange -= StateHasChanged;

        if (isGridInitialized)
        {
            await JSRuntime.InvokeVoidAsync("usersInterop.destroyGrid", ContainerId);
        }
        dotNetRef?.Dispose();
    }
}
```

### Key Integration Patterns

#### 1. Bidirectional Communication

- **C# → JS**: `JSRuntime.InvokeAsync()` calls JavaScript functions
- **JS → C#**: `dotNetRef.invokeMethodAsync()` calls C# methods marked with `[JSInvokable]`

#### 2. Multiple Interop Namespaces

The project supports multiple JavaScript interop namespaces for different use cases:

```csharp
// Use users interop (default)
await JSRuntime.InvokeAsync<bool>("usersInterop.createGrid", ...);

// Use users-specific interop
await JSRuntime.InvokeAsync<bool>("usersInterop.createGrid", ...);
```

#### 3. Object Reference Management

```csharp
// Create reference for JavaScript callbacks
dotNetRef = DotNetObjectReference.Create(this);

// Always dispose to prevent memory leaks
public async ValueTask DisposeAsync()
{
    dotNetRef?.Dispose();
}
```

#### 4. Grid Instance Management

```javascript
// The interop namespace manages grid instances
// usersInterop.grids stores all grid instances
grids: new Map(),

createGrid: function (containerId, gridOptions, dotNetRef) {
    const gridApi = agGrid.createGrid(container, gridOptions);
    this.grids.set(containerId, gridApi); // Store by container ID
}
```

### Integration Features

#### Core AG Grid Features

✅ **Stable AG Grid API** - Uses v33.3.2 with proper `rowSelection` syntax  
✅ **Event Handling** - Row clicks and selection changes  
✅ **Data Management** - Dynamic row data updates  
✅ **Responsive Design** - Auto-sizing and fit-to-container  
✅ **Memory Management** - Proper disposal and cleanup  
✅ **Error Handling** - Try-catch blocks and logging  
✅ **Loading States** - User feedback during operations  
✅ **Accessibility Support** - Keyboard navigation, screen reader compatibility, ARIA attributes, and enhanced ARIA compliance for empty grid states

#### UsersGrid Enhanced Features

✅ **Comprehensive Error Handling** - Detailed error states for all HTTP scenarios with visual feedback  
✅ **Network Resilience** - Handles 404, 401, 500, timeout, and connection errors gracefully  
✅ **User-Friendly Messages** - Clear error descriptions with actionable retry buttons and loading states  
✅ **Automatic Data Loading** - Fetches data from configurable JSON endpoints with 1-second realistic delay  
✅ **Enhanced Loading Indicators** - Animated spinners with contextual messages and dedicated grid placeholders  
✅ **Improved Loading UX** - Dedicated grid placeholders with "Preparing grid..." message instead of opacity effects  
✅ **Empty State Handling** - User-friendly "No data available" message with consistent grid styling when no data is loaded  
✅ **Retry Mechanisms** - Smart retry functionality with comprehensive loading state management  
✅ **Status Visualization** - Color-coded user status display with inline CSS styling  
✅ **Date Formatting** - Human-readable timestamp formatting with locale-aware display  
✅ **Role Management** - Comma-separated role display with proper array rendering  
✅ **Error Simulation** - Simple 404 error demonstration for testing error handling  
✅ **Lifecycle Optimization** - Synchronous initialization for subscriptions, async for data operations  
✅ **Resource Management** - Comprehensive disposal of JS interop, subscriptions, and .NET references  
✅ **Accessibility Features** - Focus management, semantic HTML structure, ARIA attributes, and WCAG compliance

### Error Simulation & Testing

The UsersGrid component includes built-in error simulation functionality for development and testing purposes. This feature helps developers test error handling scenarios without needing to simulate actual network failures or server errors.

#### Error Simulation Features

- **Simple Error Demonstration** - Toggle-able error simulation that demonstrates 404 "File Not Found" errors
- **Consistent Error Type** - Always simulates the same error scenario for predictable testing:
  - **404 Not Found** - Demonstrates "File Not Found" error handling with user-friendly messaging
- **1-Second Loading Delay** - Simulates realistic network latency for testing loading states
- **Comprehensive Error Recovery** - Tests retry mechanisms and user feedback systems
- **Interactive Control** - Toggle error simulation on/off via UI switch in Grid Demo page

#### Error Types Simulated

```csharp
// Error simulation with 50% probability when enabled
if (SimulateErrors && random.Next(0, 2) == 0)
{
    var errorType = random.Next(0, 5);
    switch (errorType)
    {
        case 0: // Network connection failure
            throw new HttpRequestException("Simulated network error for testing");
        case 1: // Request timeout
            throw new TaskCanceledException("Simulated timeout for testing");
        case 2: // Invalid JSON response
            throw new JsonException("Simulated JSON parsing error for testing");
        case 3: // Resource not found (404) - actual HTTP request
            response = await HttpClient.GetAsync("data/nonexistent.json");
            break; // Process actual 404 response through standard flow
        case 4: // Unexpected system error
            throw new Exception("Simulated unexpected error for testing");
    }
}
else
{
    // Normal data loading
    response = await HttpClient.GetAsync(DataUrl);
}

processResponse:
// Process HTTP response (both successful and error responses)
switch (response.StatusCode)
{
    case HttpStatusCode.OK: /* Handle success */ break;
    case HttpStatusCode.NotFound: /* Handle 404 */ break;
    // ... other status codes
}
```

#### Testing Error Handling

1. **Navigate to Grid Demo** (`/grid-demo`)
2. **Enable Error Simulation** - Toggle the "Simulate Errors" switch to activate 50% error rate
3. **Click "Refresh Users Data"** - Triggers data reload with potential simulated errors
4. **Observe Error States** - User-friendly error messages with retry options
5. **Test Accessibility** - Use keyboard navigation and screen readers to verify accessibility compliance
6. **Interactive Controls** - Test all buttons, toggles, and grid interactions for proper focus management\*Test Retry Functionality\*\* - Click retry buttons to test error recovery
7. **Monitor Loading States** - Animated indicators during simulated delays
8. **Disable Simulation** - Turn off error simulation for normal operation testing

This simulation system ensures robust error handling and provides a realistic testing environment for error scenarios that would be difficult to reproduce in development.

#### Recent Improvements

**Enhanced HTTP Error Simulation**: The error simulation system has been improved to handle actual HTTP responses more effectively:

- **Structured Control Flow**: Improved code quality by eliminating `goto` statements in favor of structured `break` statements, following modern C# best practices
- **Realistic 404 Testing**: Case 3 now makes actual HTTP requests to non-existent endpoints, generating real 404 responses that are processed by the same status code handling logic as successful requests
- **Unified Response Processing**: Both simulated errors and successful requests are processed through the same HTTP status code switch statement, ensuring consistent error handling behavior
- **Improved Code Maintainability**: Cleaner separation between error simulation logic and response processing logic

These improvements ensure that the error simulation system provides more realistic testing scenarios while maintaining clean, maintainable code that properly handles all error conditions.

### Usage Best Practices

#### Component Selection

1. **Use UsersGrid for user management** - Provides built-in error handling, loading states, and user-specific features

#### General Best Practices

1. **Always use `@ref`** to get component reference for programmatic control
2. **Handle disposal** - Components implement `IAsyncDisposable`
3. **Unique ContainerIds** - Each grid needs a unique container ID across all interop namespaces
4. **Error handling** - JavaScript functions include try-catch blocks
5. **Async patterns** - All JS interop calls are async
6. **Namespace isolation** - Different interop namespaces maintain separate grid instance collections

#### UsersGrid Specific

1. **Configure DataUrl** - Set custom endpoints for different environments
2. **Handle error states** - UsersGrid provides comprehensive error information for debugging
3. **Use retry functionality** - Built-in retry mechanisms handle transient network issues
4. **Monitor loading states** - Component provides visual feedback during data operations

## Data Structure

### User Management Dataset

The application includes a comprehensive user dataset (`wwwroot/data/users.json`) with 40 superhero-themed records featuring:

#### User Properties

- **ID**: Unique identifier (format: `u-1001` to `u-1040`)
- **Full Name**: Complete user name
- **Roles**: Array of role assignments (admin, manager, field, analyst, tech, security, etc.)
- **License**: Tier level (Enterprise, Field Level, Standard)
- **Email**: Contact information with themed domains
- **Last Active**: ISO 8601 timestamp of last activity
- **Status**: Current state (Active, Inactive, Suspended)
- **Invited By**: User who sent the invitation
- **Avatar URL**: Profile image (currently null for all users)

#### Sample User Record

```json
{
  "id": "u-1003",
  "fullName": "Bruce Wayne",
  "roles": ["admin", "manager"],
  "license": "Enterprise",
  "email": "bwayne@wayneenterprises.com",
  "lastActive": "2025-11-08T22:45:00Z",
  "status": "Active",
  "invitedBy": "Alfred Pennyworth",
  "avatarUrl": null
}
```

#### Data Distribution

- **40 total users** across various organizational roles
- **3 status types**: Active (30 users), Inactive (7 users), Suspended (3 users)
- **3 license tiers**: Enterprise (4 users), Field Level (16 users), Standard (20 users)
- **Diverse role assignments**: From trainees to department heads and specialists
- **Realistic organizational hierarchy** with invitation relationships

## Features Overview

### User Management Interface (`/`)

- **Primary application interface** with comprehensive user management capabilities
- **Interactive data grid** displaying 40 superhero-themed user records
- **Real-time data loading** with automatic initialization and manual refresh controls
- **User selection management** with single-row selection and detailed feedback
- **Error simulation testing** with simple 404 error demonstration
- **Comprehensive error handling** with user-friendly messages and retry mechanisms
- **Status message system** with contextual icons and auto-dismiss functionality
- **Responsive controls** with loading states and animated indicators

### Grid Demo (`/grid-demo`)

- **UsersGrid component** with comprehensive user management data
- **40 superhero-themed user records** with realistic organizational structure
- **Advanced error handling** with detailed error states and retry mechanisms
- **Simple error simulation** - Toggle-able 404 error demonstration for development and testing
- **User status tracking** (Active, Inactive, Suspended) with color-coded display
- **Role-based visualization** (admin, manager, field, analyst, etc.) with comma-separated display
- **License tier management** (Enterprise, Field Level, Standard)
- **Smart data loading** with configurable JSON endpoints
- **Network resilience** handling various HTTP error scenarios (network errors, timeouts, JSON parsing errors, 404s)
- **Loading states** with animated indicators and user feedback
- **Row selection and click handling** with event callbacks
- **Advanced filtering and sorting** capabilities
- **Responsive design** with auto-sizing columns
- **Interactive controls** - Contextual refresh data button (error simulation mode), selection retrieval, and error simulation toggle
- **Real-time status updates** - Auto-hiding success/error messages with visual indicators

### Custom Components

#### Button Component

- Multiple variants (Primary, Secondary, Success, Danger)
- Loading states with spinner animation
- Hover effects and transitions
- Flexible sizing options

#### UsersGrid Component

- **Specialized user management grid** built with AG Grid Community Edition v33.3.2
- **Comprehensive error handling** with user-friendly error states
- **Error simulation for testing** - Configurable random error generation including network errors, timeouts, JSON parsing errors, and HTTP status codes
- **Automatic data loading** from configurable JSON endpoints
- **Built-in loading indicators** with animated spinners
- **Retry functionality** for failed data loads
- **Pre-configured user columns** with custom renderers for roles, status, and dates
- **Status-based styling** (Active/Inactive/Suspended with color coding)
- **HTTP status code handling** (404, 401, 500, timeout scenarios)
- **Network resilience** with proper error recovery
- **Memory management** with proper disposal patterns and subscription cleanup
- **AppStateService integration** - Centralized state management with reactive UI updates and global loading coordination
- **Service-based architecture** - Uses dependency injection for HttpClient and IAppStateService
- **Automatic state synchronization** - Subscribes to state changes for seamless UI updates without manual StateHasChanged() calls

## Code Quality

The project includes comprehensive code quality tools:

- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files only
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting for multiple file types
- **dotnet format**: C# code formatting

Pre-commit hooks automatically:

- Format JavaScript/CSS/HTML/JSON/Markdown files
- Lint and fix JavaScript files
- Format C# and Razor files

## License

ISC License

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js and npm
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   dotnet restore
   ```

3. Build and run:
   ```bash
   npm run build:css
   dotnet run
   ```

### Development

- **CSS Development**: `npm run watch:css` for live Tailwind CSS compilation
- **Code Quality**: Pre-commit hooks automatically run ESLint and Prettier
- **Error Testing**: Toggle error simulation in the UI to test error handling

## Performance Optimizations

- **System Fonts**: Uses OS default fonts for zero network requests and instant rendering
- **CSS Optimization**: Tailwind purging and PostCSS minification reduce bundle size
- **CDN Assets**: AG Grid hosted via CDN for better caching
- **Scoped Services**: HttpClient with 30-second timeout prevents hanging requests
- **Memory Management**: Proper disposal patterns prevent memory leaks
- **Build Pipeline**: Automated CSS building integrated with .NET compilation
