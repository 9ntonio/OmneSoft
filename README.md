# OmneSoft

A modern Blazor WebAssembly application built with .NET 8, featuring interactive components and advanced data grid functionality with comprehensive state management.

## Features

- **Interactive Counter Demo**: Blazor component with state management and JSInterop integration
- **Advanced User Management Grid**: Specialized UsersGrid component with comprehensive error handling, data loading, and state integration
- **AG Grid Integration**: Advanced data grid with sorting, filtering, selection capabilities, and modern v34+ API
- **User Management Data**: Comprehensive user dataset with 40 superhero-themed records including roles, licenses, and status tracking
- **Production-Ready Error Handling**: Comprehensive HTTP error scenarios with user-friendly messages and retry mechanisms
- **Network Resilience**: Handles connection failures, timeouts, and various server error conditions
- **Error Simulation Testing**: Built-in error simulation for development and testing of error handling scenarios
- **Modern UI Components**: Custom Button, AgGrid, and UsersGrid components with Tailwind CSS styling
- **Enhanced Loading States & User Feedback**: Animated indicators, contextual messages, dedicated grid placeholders, and empty state handling for all async operations
- **Centralized State Management**: AppStateService with reactive patterns for global application state
- **Service Integration**: Dependency injection with scoped services for HttpClient and state management
- **Accessibility Features**: WCAG-compliant components with proper focus management, semantic HTML, ARIA attributes, and enhanced ARIA compliance for empty grid states
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks for consistent code formatting

## Tech Stack

- **Frontend**: Blazor WebAssembly (.NET 8)
- **State Management**: Custom AppStateService with reactive patterns
- **Dependency Injection**: Built-in .NET DI container with scoped services
- **Styling**: Tailwind CSS with PostCSS processing
- **Data Grid**: AG Grid Community Edition v34+
- **HTTP Client**: Configured HttpClient with 30-second timeout
- **Build Tools**: npm scripts with automated CSS building
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Technical Decisions

### Performance & Efficiency Optimizations

This project implements several performance-first strategies for maximum efficiency:

#### Component Lifecycle Optimization

- **Synchronous initialization** for non-async operations (state subscriptions, event handlers)
- **Async operations** only when necessary (data loading, HTTP requests, JS interop)
- **Proper disposal patterns** with `IAsyncDisposable` for cleanup of subscriptions and resources
- **Memory leak prevention** through systematic unsubscription from events

#### System Font Strategy

The application uses a **system font-first approach** (`font-sans` in Tailwind CSS) that leverages the user's operating system default fonts instead of loading custom web fonts. This provides:

- **Zero network requests** for font loading
- **Instant text rendering** with no font loading delays
- **Optimal readability** using fonts designed for each platform
- **Reduced bundle size** by eliminating font file downloads
- **Better performance** especially on slower connections

#### CSS & Asset Optimization

- **Production CSS minification** with cssnano during build process
- **Tailwind CSS purging** removes unused styles, dramatically reducing CSS bundle size
- **PostCSS autoprefixer** ensures cross-browser compatibility without manual vendor prefixes
- **Automated CSS builds** integrated into .NET build pipeline for seamless development

#### JavaScript Efficiency

- **CDN-hosted AG Grid** reduces bundle size and leverages browser caching
- **Modular interop functions** prevent loading unnecessary JavaScript
- **Modern ES6+ syntax** for better performance and smaller code
- **Error boundaries** with proper logging for production debugging
- **ARIA compliance optimizations** with setTimeout-based grid structure validation for accessibility

#### .NET WebAssembly Optimizations

- **Scoped HttpClient** with 30-second timeout prevents hanging requests
- **Minimal service registration** reduces startup overhead
- **Development-only logging** prevents performance impact in production
- **Blazor WebAssembly** eliminates server round-trips for UI interactions

#### Build & Development Efficiency

- **Integrated build pipeline** automatically builds Tailwind CSS before .NET compilation
- **Environment-aware PostCSS** applies minification only in production builds
- **Pre-commit hooks** with Husky ensure code quality without manual intervention
- **Lint-staged optimization** runs linters only on changed files, not entire codebase
- **npm script automation** combines CSS building with .NET commands for streamlined workflow

### State Management Architecture

The application implements a **hybrid state management pattern** combining centralized global state with component-specific state management using a custom `AppStateService` that provides:

- **Reactive State Updates**: Components subscribe to state changes via event notifications
- **Hybrid Loading Management**: Components maintain local loading states while coordinating with global state
- **Global Loading States**: Centralized loading indicators for cross-component coordination
- **Component-Specific States**: Local state management for component-specific UI behaviors
- **Service Integration**: Seamless integration with dependency injection container
- **Performance Optimization**: Only notifies subscribers when state actually changes
- **Type Safety**: Strongly-typed state properties with compile-time checking
- **Automatic UI Updates**: Components automatically re-render when subscribed state changes
- **Memory Leak Prevention**: Proper subscription cleanup in component disposal

#### Service Registration

```csharp
// Program.cs
builder.Services.AddScoped<IAppStateService, AppStateService>();
```

#### Hybrid State Management Pattern

Components integrate with the AppStateService using a hybrid approach that combines global state coordination with local state management:

```csharp
@using OmneSoft.Services
@inject IAppStateService AppState

@code {
    private bool isLoading = false; // Component-specific loading state

    protected override void OnInitialized()
    {
        // Subscribe to automatic state change notifications
        AppState.OnChange += StateHasChanged;
    }

    private async Task LoadData()
    {
        // Set both local and global loading states
        isLoading = true;           // For component-specific UI (buttons, opacity)
        AppState.SetLoading(true);  // For global coordination (other components)

        try
        {
            // Load data operations...
        }
        finally
        {
            // Clear both loading states
            isLoading = false;          // Component UI returns to normal
            AppState.SetLoading(false); // Global state cleared
        }
    }

    public async ValueTask DisposeAsync()
    {
        // Prevent memory leaks by unsubscribing
        AppState.OnChange -= StateHasChanged;
    }
}
```

#### UsersGrid Integration Example

The `UsersGrid` component demonstrates AppStateService integration with optimized loading state management:

```csharp
@inject IAppStateService AppState

@if (isLoading)
{
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
        <div class="flex items-center">
            <svg class="animate-spin w-6 h-6 text-blue-600 mr-3">...</svg>
            <span class="text-blue-800 font-medium">Loading...</span>
        </div>
    </div>
}

@code {
    private bool isLoading = false;

    protected override void OnInitialized()
    {
        // Synchronous subscription - no async needed for event registration
        AppState.OnChange += StateHasChanged;
    }

    private async Task LoadUsers()
    {
        isLoading = true;           // Component-specific loading state
        AppState.SetLoading(true);  // Global loading state for other components
        errorState = null;

        try
        {
            // Add realistic loading delay
            await Task.Delay(1000);

            // HTTP operations with comprehensive error handling
            var response = await HttpClient.GetAsync(DataUrl);
            // ... error handling for various HTTP status codes
        }
        finally
        {
            isLoading = false;          // Clear component loading state
            AppState.SetLoading(false); // Clear global loading state
        }
    }

    public async ValueTask DisposeAsync()
    {
        // Prevent memory leaks by unsubscribing
        AppState.OnChange -= StateHasChanged;

        // Cleanup grid resources
        if (isGridInitialized)
        {
            await JSRuntime.InvokeVoidAsync("usersInterop.destroyGrid", ContainerId);
        }
        dotNetRef?.Dispose();
    }
}
```

#### Benefits of AppStateService Integration

- **No Manual StateHasChanged()**: Components automatically re-render when state changes
- **Dual Loading State Management**: Components maintain local loading states while coordinating with global state
- **Global Loading Awareness**: Other components can react to loading states across the app
- **Centralized State**: Single source of truth for application-wide state
- **Performance Optimized**: Only triggers updates when state actually changes
- **Memory Safe**: Proper subscription cleanup prevents memory leaks
- **Lifecycle Optimized**: Synchronous initialization for event subscriptions, async only when needed
- **Resource Management**: Comprehensive disposal patterns for JS interop and .NET object references

#### Loading State Management Strategy

The UsersGrid component implements a **dual loading state approach** with enhanced UI feedback for optimal user experience:

**Local Loading State (`isLoading`)**:

- Controls component-specific UI elements (button states, grid visibility, retry button styling)
- Provides immediate visual feedback without waiting for global state propagation
- Used for conditional rendering of loading indicators, error states, empty states, and grid placeholders
- Ensures component UI remains responsive during async operations
- Shows dedicated grid placeholder during initialization instead of opacity effects
- Displays user-friendly empty state message when no data is available
- **Requires manual `StateHasChanged()` calls** since local state changes are independent of global state management

**Global Loading State (`AppState.SetLoading()`)**:

- Coordinates loading states across multiple components
- Enables other parts of the application to react to data loading operations
- Maintains centralized awareness of application-wide loading activities
- Supports global loading indicators and navigation restrictions
- **Automatically triggers UI updates** via the AppStateService event system without manual `StateHasChanged()` calls

```csharp
// Dual loading state pattern in UsersGrid
private async Task LoadUsers()
{
    isLoading = true;           // Immediate component UI update
    AppState.SetLoading(true);  // Global coordination

    try
    {
        // Data loading operations...
    }
    finally
    {
        isLoading = false;          // Component returns to normal state
        AppState.SetLoading(false); // Global state cleared
    }
}

// Enhanced conditional rendering with dedicated placeholders and empty state handling
@if (errorState == null && !isLoading && (usersData != null || isGridInitialized))
{
    <div id="@ContainerId" class="ag-theme-quartz" style="height: @Height; width: @Width;"></div>
}
else if (errorState == null && !isLoading && usersData == null)
{
    <!-- Dedicated empty state when no data is available -->
    <div class="ag-theme-quartz" style="height: @Height; width: @Width; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
        <div class="flex items-center justify-center h-full">
            <span class="text-gray-500">No data available</span>
        </div>
    </div>
}
else if (errorState == null && isLoading)
{
    <!-- Dedicated grid placeholder during loading -->
    <div class="ag-theme-quartz" style="height: @Height; width: @Width; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
        <div class="d-flex align-items-center justify-content-center h-100">
            <span class="text-muted">Preparing grid...</span>
        </div>
    </div>
}
```

This approach ensures both immediate component responsiveness, proper global state coordination, and enhanced visual feedback during loading states.

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
│   ├── Layout/          # Layout components
│   └── UI/              # Reusable UI components (Button, AgGrid, UsersGrid)
├── Pages/
│   ├── Home.razor       # Counter demo page
│   └── GridDemo.razor   # AG Grid demonstration with interactive controls and accessibility features
├── Services/            # Application services
│   ├── AppStateService.cs       # Centralized state management implementation
│   └── IAppStateService.cs      # State management interface
├── Models/              # Data models and configuration
├── wwwroot/
│   ├── js/
│   │   ├── users-interop.js     # AG Grid JavaScript interop (v34+ API)
│   │   └── interop.js           # General JavaScript interop functions
│   ├── css/             # Compiled CSS files
│   ├── data/
│   │   └── users.json   # User management dataset (40 superhero-themed records)
│   └── ...              # Other static assets
├── Program.cs           # Application startup and service configuration
├── OmneSoft.csproj      # Project configuration with automated CSS builds
└── *.razor              # Root components (App, MainLayout)
```

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
// HTTP Client with timeout configuration
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
    Timeout = TimeSpan.FromSeconds(30)
});

// Application state management
builder.Services.AddScoped<IAppStateService, AppStateService>();

// Development logging
if (builder.HostEnvironment.IsDevelopment())
{
    builder.Logging.SetMinimumLevel(LogLevel.Debug);
}
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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run publish` - Publish the application
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run build-css` - Build CSS in watch mode
- `npm run build-css-prod` - Build CSS for production

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
- Uses the modern AG Grid v34+ API (`agGrid.createGrid()`)
- Namespace: `window.usersInterop`

#### 2. **Blazor Component** (`Components/UI/AgGrid.razor`)

- Wraps the JavaScript interop in a reusable Blazor component
- Provides strongly-typed parameters for configuration
- Handles component lifecycle and cleanup
- Supports event callbacks for row interactions
- Uses `DotNetObjectReference` for JavaScript-to-C# callbacks
- Can work with either interop layer depending on configuration

#### 3. **Dependencies** (`wwwroot/index.html`)

- AG Grid Community v34.1.2 from CDN
- Quartz theme CSS for modern styling
- Multiple custom interop JavaScript files

### How to Use AG Grid Integration

#### UsersGrid Component (Recommended for User Management)

The `UsersGrid` component is a specialized, production-ready grid specifically designed for user management with built-in error handling, loading states, data fetching, **centralized state management integration via AppStateService**, and **accessibility compliance**.

```razor
@using OmneSoft.Services
@inject IAppStateService AppState

<!-- Simple usage with default settings -->
<UsersGrid />

<!-- Customized usage with state integration -->
<UsersGrid ContainerId="my-users-grid"
           Height="600px"
           Width="100%"
           DataUrl="api/users"
           EnableSelection="true"
           SelectionMode="multiple"
           OnRowClicked="HandleUserClick"
           OnSelectionChanged="HandleSelectionChange"
           SimulateErrors="false" />

@code {
    private void HandleUserClick(object userData)
    {
        // Handle user row click
        Console.WriteLine($"User clicked: {userData}");
    }

    private void HandleSelectionChange(object[] selectedUsers)
    {
        // Handle selection changes
        Console.WriteLine($"Selected {selectedUsers.Length} users");

        // Update global state if needed
        AppState.NotifyStateChanged();
    }
}
```

#### UsersGrid Features

- **Automatic data loading** from JSON endpoints (default: `data/users.json`)
- **Comprehensive error handling** with user-friendly error messages and visual error states
- **Built-in retry functionality** for failed requests with loading state management
- **Dual loading state management** with component-specific and global loading coordination
- **Enhanced loading indicators** with animated spinners, contextual messages, and dedicated grid placeholders during initialization
- **Improved loading UX** with dedicated grid placeholders instead of opacity effects for better visual feedback
- **Empty state handling** with user-friendly "No data available" message when no data is loaded
- **Pre-configured columns** optimized for user data display with custom cell renderers
- **Status color coding** (Active=green, Inactive=orange, Suspended=red) with inline styling
- **Date formatting** for last active timestamps with locale-aware display
- **Role display** with comma-separated values and proper array handling
- **Network resilience** handling 404, 401, 500, timeout, and connection error scenarios
- **Error simulation testing** - Configurable 50% random error generation for comprehensive development testing
- **AppStateService integration** - Uses centralized state management for global loading coordination
- **Service injection** - Built-in dependency injection for HttpClient and IAppStateService
- **Optimized lifecycle management** - Synchronous initialization for subscriptions, async for operations
- **Automatic re-rendering** - Reactive UI updates via AppStateService.OnChange subscription
- **Memory leak prevention** - Comprehensive cleanup of subscriptions, JS interop, and .NET object references
- **Resource management** - Proper disposal of grid instances and DotNetObjectReference objects
- **Accessibility compliance** - Proper focus management, semantic HTML, ARIA attributes, WCAG guidelines adherence, and enhanced ARIA structure handling for empty grid states

#### Generic AgGrid Component

For custom data grids with full control over configuration:

```razor
<AgGrid ContainerId="my-grid"
        Height="400px"
        Width="100%"
        RowData="myData"
        ColumnDefs="myColumns" />
```

#### Generic AgGrid with Custom Configuration

```razor
<!-- Custom grid with full control -->
<AgGrid @ref="customGridRef"
        ContainerId="custom-grid"
        RowData="customData"
        ColumnDefs="customColumnDefs"
        EnableSelection="true"
        SelectionMode="single"
        OnRowClicked="HandleRowClick"
        OnSelectionChanged="HandleSelectionChange" />

@code {
    private AgGrid? customGridRef;
    private object[]? customData;

    private object[] customColumnDefs = new object[]
    {
        new { field = "id", headerName = "ID", width = 100 },
        new { field = "name", headerName = "Name", sortable = true },
        new { field = "value", headerName = "Value", filter = true }
    };

    protected override async Task OnInitializedAsync()
    {
        // Load custom data
        customData = await GetCustomData();
    }

    private void HandleRowClick(object rowData)
    {
        Console.WriteLine($"Row clicked: {rowData}");
    }

    private void HandleSelectionChange(object[] selectedRows)
    {
        Console.WriteLine($"Selected {selectedRows.Length} rows");
    }
}
```

#### Programmatic Grid Control

```razor
@code {
    private UsersGrid? usersGridRef;
    private AgGrid? customGridRef;

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

    // Generic AgGrid methods
    private async Task UpdateCustomData()
    {
        var newData = GetNewData();
        await customGridRef!.UpdateRowData(newData);
    }

    private async Task ResizeGrids()
    {
        await usersGridRef!.SizeToFit();
        await customGridRef!.SizeToFit();
    }
}
```

### JS Interop Implementation Details

#### JavaScript Side (`users-interop.js`)

```javascript
window.usersInterop = {
  grids: new Map(), // Manages multiple grid instances

  createGrid: function (containerId, gridOptions, dotNetRef) {
    // Creates grid with .NET callbacks using modern AG Grid v34+ API
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
                rowData = usersData ?? Array.Empty<object>(),
                // Modern v34+ rowSelection syntax
                rowSelection = EnableSelection ? new {
                    mode = SelectionMode == "single" ? "singleRow" : "multiRow"
                } : (object?)null,
                animateRows = true,
                theme = "legacy",
                defaultColDef = new
                {
                    sortable = true,
                    filter = true,
                    resizable = true,
                    flex = 1,
                    minWidth = 100
                }
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

✅ **Modern AG Grid API** - Uses v34+ with proper `rowSelection` syntax  
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
✅ **Error Simulation** - Built-in 50% random error generation covering 5 different error types  
✅ **Lifecycle Optimization** - Synchronous initialization for subscriptions, async for data operations  
✅ **Resource Management** - Comprehensive disposal of JS interop, subscriptions, and .NET references  
✅ **Accessibility Features** - Focus management, semantic HTML structure, ARIA attributes, and WCAG compliance

### Error Simulation & Testing

The UsersGrid component includes built-in error simulation functionality for development and testing purposes. This feature helps developers test error handling scenarios without needing to simulate actual network failures or server errors.

#### Error Simulation Features

- **Configurable Error Rate** - Toggle-able error simulation with 50% random error rate when enabled
- **Multiple Error Types** - Simulates various real-world error scenarios:
  - **Network Errors** - `HttpRequestException` for connection failures
  - **Timeout Errors** - `TaskCanceledException` for request timeouts
  - **JSON Parsing Errors** - `JsonException` for malformed data responses
  - **404 Not Found** - Attempts to fetch non-existent resources
  - **Unexpected Errors** - Generic `Exception` for unknown failures
- **1-Second Loading Delay** - Simulates realistic network latency for testing loading states
- **Comprehensive Error Recovery** - Tests retry mechanisms and user feedback systems
- **Interactive Control** - Toggle error simulation on/off via UI switch in Grid Demo page

#### Error Types Simulated

```csharp
// Network connection failure
throw new HttpRequestException("Simulated network error");

// Request timeout
throw new TaskCanceledException("Simulated timeout");

// Invalid JSON response
throw new JsonException("Simulated JSON parsing error");

// Resource not found (404)
await HttpClient.GetAsync("data/nonexistent.json");

// Unexpected system error
throw new Exception("Simulated unexpected error");
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

### Usage Best Practices

#### Component Selection

1. **Use UsersGrid for user management** - Provides built-in error handling, loading states, and user-specific features
2. **Use AgGrid for custom scenarios** - When you need full control over column definitions and data sources

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

### Counter Demo (`/`)

- Interactive counter with increment/reset functionality
- JSInterop demonstration with browser alerts
- Loading states and user feedback
- Modern card-based UI design

### Grid Demo (`/grid-demo`)

- **UsersGrid component** with comprehensive user management data
- **40 superhero-themed user records** with realistic organizational structure
- **Advanced error handling** with detailed error states and retry mechanisms
- **Configurable error simulation** - Toggle-able random error generation for development and testing
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

#### AgGrid Component

- Generic wrapper for AG Grid Community Edition v34+
- Modern AG Grid API with proper `rowSelection` syntax
- Event handling for row selection and clicks
- Dynamic data updates
- Responsive grid sizing
- Configurable column definitions and grid options
- JavaScript interop with `usersInterop` namespace

#### UsersGrid Component

- **Specialized user management grid** built on top of AgGrid
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
