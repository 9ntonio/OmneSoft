# OmneSoft

A modern Blazor WebAssembly application built with .NET 8, featuring comprehensive user management with advanced data grid functionality and intelligent state management.

## Features

- **Professional User Interface**: Clean, modern layout with branded header, optimized content areas, and responsive design
- **Advanced Data Grid**: AG Grid v33.3.2 integration with sorting, filtering, pagination, global search, and intelligent value formatters
- **Comprehensive Error Handling**: Production-ready error scenarios with user-friendly messages, retry mechanisms, and error simulation testing
- **Intelligent State Management**: Enhanced AppStateService with reactive patterns, smart loading coordination, and component awareness
- **Modern UI Components**: Custom Button and UsersGrid components with Tailwind CSS styling and accessibility features
- **JavaScript Interop**: Robust AG Grid integration with proper lifecycle management and WCAG compliance
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks with modern C# patterns

## Tech Stack

- **Frontend**: Blazor WebAssembly (.NET 8.0.8 LTS)
- **State Management**: Custom AppStateService with reactive patterns
- **Styling**: Tailwind CSS v3.4.17 with PostCSS and autoprefixer
- **Data Grid**: AG Grid Community Edition v33.3.2 (CDN-hosted)
- **HTTP Client**: Configured HttpClient with 30-second timeout
- **Code Quality**: ESLint v9.33.0, Prettier v3.6.2, Husky v9.1.7
- **Build Tools**: npm scripts with automated CSS building
- **Package Management**: npm for frontend, NuGet for .NET packages

## Architecture

### State Management

The application uses a custom `AppStateService` for intelligent state coordination:

```csharp
// Service Registration
builder.Services.AddScoped<IAppStateService, AppStateService>();

// Component Integration
@inject IAppStateService AppState
@implements IDisposable

protected override void OnInitialized()
{
    AppState.OnChange += StateHasChanged;
}

private async Task LoadData()
{
    isLoading = true;
    AppState.SetLoading(true);
    AppState.SetComponentLoading(true); // Suppress global loader

    try
    {
        // Load operations...
    }
    finally
    {
        isLoading = false;
        AppState.SetLoading(false);
        AppState.SetComponentLoading(false);
    }
}

public void Dispose()
{
    AppState.OnChange -= StateHasChanged;
}
```

### AG Grid Integration

**Fixed Height Strategy**: AG Grid v33.3.2 Community Edition has issues with percentage heights. This app uses fixed heights for reliable rendering:

```css
.ag-grid-container {
  height: calc(100vh - 200px) !important;
  min-height: 500px !important;
  width: 100% !important;
}
```

**Intelligent Value Formatters**: Automatically handles complex data types:

```javascript
// Array formatting (roles)
colDef.valueFormatter = function (params) {
  if (params.value && Array.isArray(params.value)) {
    return params.value.join(', ');
  }
  return params.value || '';
};

// Date formatting (lastActive)
colDef.valueFormatter = function (params) {
  if (params.value) {
    const date = new Date(params.value);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  return '';
};
```

### Error Handling

Comprehensive error simulation system with 5 error types:

- Network failures
- Timeouts
- JSON parsing errors
- 404 responses
- Unexpected server errors

Components feature intelligent parameter change detection and automatic grid state reset for clean error simulation transitions.

## Project Structure

```
OmneSoft/
├── Components/UI/           # Reusable UI components
│   ├── Button.razor        # Custom button with variants
│   └── UsersGrid.razor     # Advanced data grid component
├── Pages/
│   └── Home.razor         # Main users management page
├── Services/
│   ├── IAppStateService.cs # State management interface
│   └── AppStateService.cs  # Reactive state implementation
├── wwwroot/
│   ├── css/app.css        # Tailwind CSS with AG Grid styles
│   ├── js/users-interop.js # AG Grid JavaScript interop
│   └── data/users.json    # Sample user data
├── MainLayout.razor       # Application layout
└── Program.cs            # Entry point and DI configuration
```

## Components

### Button Component

Versatile button with variants (Primary, Secondary, Success, Danger), sizes, loading states, and accessibility support.

### UsersGrid Component

Advanced data grid with AG Grid v33.3.2 integration featuring comprehensive data management capabilities:

**Parameters:**

```csharp
[Parameter] public string Height { get; set; } = "500px";  // Fixed height strategy
[Parameter] public string Width { get; set; } = "100%";
[Parameter] public bool SimulateErrors { get; set; } = false;
[Parameter] public string SelectionMode { get; set; } = "single";
[Parameter] public EventCallback<object> OnRowClicked { get; set; }
```

**Key Features:**

- **Advanced Data Management**: Pagination with configurable page sizes (10, 20, 50, 100 rows)
- **Global Search**: Quick filter functionality for searching across all columns
- **Column Filtering**: Individual column filters with floating filter inputs below headers
- **Flexible Layout**: Responsive columns with flex sizing for optimal space utilization
- **Intelligent Error Simulation**: Lifecycle-aware parameter detection with automatic state management
- **Automatic Grid State Reset**: Clean state transitions during refresh operations
- **WCAG-Compliant Accessibility**: Full ARIA attributes and keyboard navigation support
- **Fixed-Height Strategy**: Prevents AG Grid v33 rendering issues with reliable display
- **Professional UI**: Loading states with visual feedback and error recovery mechanisms

#### Loading State Management

The application implements a **triple-layer loading state approach** with intelligent global loader suppression:

**Three Loading Layers:**

1. **Local Loading State** (`isLoading`/`isRefreshing`) - Component-specific UI control
2. **Global Loading State** (`AppState.SetLoading()`) - Cross-component coordination
3. **Component Loading Awareness** (`AppState.SetComponentLoading()`) - Prevents duplicate loaders

```csharp
private async Task LoadUsers()
{
    isLoading = true;                    // Show component loader
    AppState.SetLoading(true);           // Coordinate globally
    AppState.SetComponentLoading(true);  // Suppress global loader

    try
    {
        // Data loading operations...
    }
    finally
    {
        isLoading = false;
        AppState.SetLoading(false);
        AppState.SetComponentLoading(false);
    }
}
```

This ensures immediate component responsiveness, proper global coordination, and prevents duplicate loading indicators.

## Accessibility Features

The application implements comprehensive WCAG compliance features:

**Key Features:**

- **Unique Row Identification**: `getRowId` function for screen reader compatibility
- **Enhanced ARIA Support**: Proper attributes and semantic structure
- **Keyboard Navigation**: Full accessibility without mouse dependency
- **Screen Reader Optimization**: Compatible with NVDA, JAWS, and VoiceOver
- **Automated Validation**: Built-in grid validation ensures consistent compliance

```javascript
// AG Grid accessibility configuration
if (!gridOptions.getRowId) {
  gridOptions.getRowId = params => params.data?.id || params.node.id;
}

// Grid validation ensures proper ARIA structure
validateGrid: function (containerId) {
  // Validates and fixes accessibility issues automatically
}
```

### Layout Architecture

**Streamlined Layout Structure:**

- **Header**: Branded title, navigation controls, and error simulation toggle
- **Main Content**: Flexible layout with full-height grid container
- **Footer**: Technology stack information and branding
- **Responsive Design**: Viewport-based calculations for optimal space utilization

**Key Benefits:**

- Professional appearance with clean visual hierarchy
- Adaptive layout for different screen sizes
- Semantic HTML structure for accessibility compliance

### AG Grid v33.3.2 Configuration

The application uses AG Grid Community Edition v33.3.2 with specific configurations for reliability:

**Key Configurations:**

- **Theming**: Uses built-in Quartz theme for professional appearance
- **Selection**: Maintains backward-compatible 'single'/'multiple' modes
- **Height Strategy**: Fixed heights to prevent rendering issues

```javascript
// v33 Community Edition configuration
gridOptions.theme = 'themeQuartz';
gridOptions.rowSelection = 'single'; // Deprecated but functional
```

#### Height Configuration Solution

**Fixed Height Strategy**: Prevents AG Grid v33 percentage height issues:

```csharp
private string GetGridContainerStyle()
{
    var height = Height.Contains("%") ? "500px" : Height;
    return $"height: {height}; width: {Width};";
}
```

```css
.ag-grid-container {
  height: calc(100vh - 200px) !important;
  min-height: 500px !important;
  width: 100% !important;
}
```

#### Developer Notes

**Deprecation Warnings**: The application suppresses known v33 Community Edition warnings for deprecated but functional properties.

**Best Practices:**

- Use fixed heights for grid containers
- Implement proper loading states and error boundaries
- Test with error simulation enabled
- Use built-in validation functions for ARIA structure

**Troubleshooting:**

- **Grid not rendering**: Check height configuration (avoid percentages)
- **Selection issues**: Ensure `rowSelection` is "single" or "multiple"
- **Performance**: Minimize column configuration, use AG Grid defaults

### Interface Design

**Streamlined approach focused on optimal user experience:**

- **Professional Layout**: Full-height containers for maximum grid visibility
- **Branded Header**: Clean design with title, refresh button, and error simulation toggle
- **Flexible Content**: Dynamic grid sizing that adapts to different screen sizes
- **Modern Styling**: Tailwind CSS with consistent shadows, borders, and responsive design
- **Integrated Controls**: Error simulation and refresh functionality built into the interface

## Recent Updates

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

The OmneSoft application is a fully functional Blazor WebAssembly project with the following current implementation:

### Core Features ✅

- **Professional User Management Interface**: Complete home page with branded header, data grid, and controls
- **Advanced AG Grid Integration**: Stable v33.3.2 implementation with Quartz theme, pagination, global search, column filtering, and responsive flex columns
- **AG Grid v33 Height Fix**: Automatic percentage-to-fixed height conversion to prevent Community Edition rendering issues
- **Error Simulation System**: Built-in error testing with 5 different error scenarios
- **Comprehensive Error Handling**: Network errors, timeouts, JSON parsing, HTTP status codes, and unexpected errors
- **Hybrid State Management**: Centralized AppStateService with reactive patterns, dual loading states, and comprehensive disposal patterns
- **Cross-Component Coordination**: Components automatically react to global state changes with memory-safe subscription patterns
- **Loading States**: Dual loading state management (local and global) with animated indicators and cross-component awareness
- **Refresh Functionality**: Complete data refresh with grid state reset and proper resource cleanup
- **JavaScript Interop**: Robust AG Grid integration with lifecycle management and event handling
- **Enhanced Data Management**: Comprehensive pagination (10/20/50/100 rows), global search functionality, individual column filters, and responsive flex-based column layout
- **Responsive Design**: Professional layout with viewport-based CSS calculations, dedicated grid container classes, and Tailwind CSS styling

### Technical Implementation ✅

- **.NET 8 LTS**: Long-term support foundation with WebAssembly hosting
- **Dependency Injection**: Scoped services for HttpClient and state management
- **Modern Build Pipeline**: Automated CSS building with PostCSS, Tailwind CSS, AG Grid optimizations, and production minification
- **Code Quality Tools**: ESLint, Prettier, Husky pre-commit hooks, and lint-staged for consistent formatting
- **Memory Management**: Proper disposal patterns with IDisposable and IAsyncDisposable implementations for comprehensive resource cleanup
- **Production Ready**: Comprehensive error handling, timeout configuration, and stability optimizations

### Current Dependencies ✅

- **AG Grid Community**: v33.3.2 (stable release with Quartz theme)
- **Tailwind CSS**: v3.4.17 with PostCSS v8.4.47 processing
- **ESLint**: v9.33.0 with Prettier v3.6.2 integration
- **Husky**: v9.1.7 for Git hooks with lint-staged v16.1.5
- **.NET**: 8.0.8 LTS with WebAssembly components
- **Microsoft.Extensions.Http**: v8.0.0 for HTTP client configuration

The project is ready for development, testing, and production deployment with all core features implemented and thoroughly tested.

## Getting Started

### Prerequisites

- **.NET 8 SDK** (8.0.8 or later)
- **Node.js** (v16 or later) with npm
- **Modern web browser** with WebAssembly support

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd OmneSoft
   ```

2. **Install npm dependencies**

   ```bash
   npm install
   ```

3. **Build and run the application**

   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Open your browser** and navigate to `https://localhost:5001` or `http://localhost:5000`

### Available Scripts

- `npm run dev` - Build CSS and start development server
- `npm run build` - Build CSS and compile .NET project
- `npm run publish` - Build CSS and publish for production
- `npm run lint` - Run ESLint code analysis
- `npm run format` - Format code with Prettier
- `npm run build-css-prod` - Build production CSS only

### Usage

#### Main Interface

The application opens to the **Users Management** interface featuring:

- **Data Grid**: Displays user information with advanced sorting, filtering, pagination, global search, and selection capabilities
- **Refresh Button**: Reloads data and resets grid state
- **Error Simulation Toggle**: Enables/disables error simulation for testing
- **Professional Layout**: Full-height responsive design with branded header and footer

#### Error Simulation

Toggle the "Simulate Errors" switch in the header to test error handling with intelligent lifecycle-aware response:

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
- **Dual Filtering System**:
  - **Global Search**: Quick filter searches across all columns simultaneously
  - **Column Filters**: Individual column filters with floating filter inputs below headers
- **Intelligent Pagination**:
  - Configurable page sizes (10, 20, 50, 100 rows per page)
  - Navigation controls with page size selector
  - Automatic page size management
- **Flexible Column Layout**: Responsive columns with flex sizing that automatically adjust to container width
- **Selection Management**: Single-row selection with event callbacks and keyboard navigation
- **Responsive Design**: Automatically adapts to container size with optimal space utilization
- **Professional Styling**: Modern Quartz theme with consistent appearance and accessibility compliance

#### Data Management Features

The enhanced UsersGrid now provides powerful data management capabilities:

**Using Pagination:**

- Navigate through data using the pagination controls at the bottom of the grid
- Change page size using the dropdown selector (10, 20, 50, or 100 rows per page)
- Default page size is 20 rows for optimal performance and usability

**Using Global Search:**

- Use the quick filter to search across all columns simultaneously
- Type in the search box to filter data in real-time
- Search works across all visible columns and data types

**Using Column Filters:**

- Individual column filters appear below each column header
- Click on the filter icon in any column to access filtering options
- Combine column filters with global search for precise data discovery

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
- **Memory Management**: Comprehensive disposal patterns using both IDisposable and IAsyncDisposable interfaces

### Key Components

#### UsersGrid Component

Located at `Components/UI/UsersGrid.razor`, this is the main data grid component featuring:

- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Animated loading indicators with proper state management
- **AG Grid Integration**: Uses v33.3.2 with correct createGrid API
- **Intelligent Parameter Management**: Lifecycle-aware detection of `SimulateErrors` parameter changes with proper initialization state tracking
- **Optimized Update Logic**: Only processes parameter changes after grid initialization to prevent unnecessary operations during startup
- **Real-Time Data Refresh**: Automatic grid data refresh when error simulation mode is toggled with immediate UI updates
- **Event Callbacks**: Row click and selection change events
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
│       └── UsersGrid.razor      # Specialized user management grid with error handling and Quartz theme
├── Pages/
│   └── Home.razor       # Professional user management interface with header controls, full-height layout, and IDisposable implementation
├── Services/            # Application services
│   ├── AppStateService.cs       # Centralized state management implementation
│   └── IAppStateService.cs      # State management interface
├── Models/              # Data models and configuration
│   └── AppSettings.cs   # Application configuration model
├── wwwroot/
│   ├── js/
│   │   ├── users-interop.js     # AG Grid JavaScript interop with correct v33.3.2 createGrid API and lifecycle management
│   │   ├── interop.js           # General JavaScript interop functions
│   │   └── app.js               # Application-specific JavaScript
│   ├── css/
│   │   ├── app.css              # Source Tailwind CSS with AG Grid container optimizations
│   │   └── app.min.css          # Compiled and minified CSS
│   ├── data/
│   │   └── users.json           # User management dataset (40+ superhero-themed records)
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

## Recent Updates

### Latest Update: Enhanced Data Grid Functionality (Current)

**Advanced Data Management Features**: The UsersGrid component has been significantly enhanced with comprehensive data management capabilities:

**New Features Added:**

- **Intelligent Pagination System**:
  - Built-in pagination with 20 rows per page default
  - Configurable page sizes: 10, 20, 50, 100 rows per page
  - Page size selector dropdown for user customization
  - Automatic page size management without manual configuration

- **Global Search Functionality**:
  - Quick filter that searches across all visible columns simultaneously
  - Real-time search results as you type
  - Integrated search box in the grid interface

- **Enhanced Column Filtering**:
  - Individual column filters for precise data filtering
  - Floating filter inputs displayed below column headers
  - Combined with global search for powerful data discovery

- **Responsive Column Layout**:
  - Flex-based column sizing (`flex = 1`) for optimal space utilization
  - Columns automatically adjust to available container width
  - Maintains minimum width requirements while maximizing readability

**Implementation Details:**

```javascript
// Enhanced grid configuration
gridOptions = {
  // Pagination
  pagination: true,
  paginationPageSize: 20,
  paginationPageSizeSelector: [10, 20, 50, 100],

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

- **Enhanced User Experience**: Users can now efficiently navigate large datasets with pagination and search
- **Improved Data Discovery**: Combined global search and column filtering enable precise data location
- **Professional Interface**: Modern data grid features expected in enterprise applications
- **Optimal Performance**: Pagination reduces DOM load for better performance with large datasets
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

The application uses a dedicated JavaScript interop system for AG Grid integration:

#### users-interop.js Features

- **Grid Lifecycle Management**: Complete grid creation, update, and destruction lifecycle
- **Stable AG Grid API**: Uses v33.3.2 `createGrid` API with minimal configuration approach optimized for Community Edition
- **Essential Row Selection**: Basic row selection configuration using direct string values for reliable functionality
- **Intelligent Value Formatters**: Automatic handling of complex data types including array fields (roles displayed as comma-separated values) and date fields (lastActive formatted as localized date/time) to prevent AG Grid v33 warnings
- **Event Handling**: Row click and selection change events with .NET callbacks
- **Resource Management**: Proper cleanup and memory management with grid destruction
- **Error Handling**: Comprehensive error handling with console logging
- **Core Accessibility**: Basic ARIA compliance with essential grid functionality
- **Grid Operations**: Data updates, column sizing, selection management, and auto-sizing

```javascript
// Key interop functions with simplified grid configuration
window.usersInterop = {
  createGrid: function (containerId, gridOptions, dotNetRef),
  setRowData: function (containerId, rowData),
  getSelectedRows: function (containerId),
  sizeToFit: function (containerId),
  destroyGrid: function (containerId),
  autoSizeAllColumns: function (containerId)
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
- **Branded Header**: "Users Management" title with integrated navigation controls, refresh functionality, and error simulation toggle
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
- **Enhanced Manual Refresh**: Header-integrated refresh button with grid state reset for clean re-initialization and loading state feedback

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

This application uses **IJSRuntime with Custom JavaScript Functions** for AG Grid integration. This is the recommended approach for complex JavaScript library integrations in Blazor.

#### Why This Approach

- **Full Control** - Complete control over AG Grid initialization and lifecycle
- **Performance** - Direct JavaScript calls without additional abstraction layers
- **Flexibility** - Can expose any AG Grid feature as needed
- **Maintainability** - Clear separation between C# and JavaScript concerns

#### Alternative Options Not Used

- ❌ **JSImport/JSExport** (newer .NET 7+ approach) - More complex setup
- ❌ **Direct DOM manipulation** - Limited functionality, harder to maintain
- ❌ **Third-party wrappers** - Less control, potential version conflicts

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
                <button @onclick="RefreshData"
                        disabled="@isRefreshing"
                        class="@GetRefreshButtonClass() font-medium py-2 px-4 rounded-lg transition-colors">
                    <!-- Refresh button with loading state -->
                </button>

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
- **Interactive controls** - Refresh data button, selection retrieval, and error simulation toggle
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
