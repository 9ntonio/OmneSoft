# OmneSoft

A modern Blazor WebAssembly application built with .NET 8, featuring comprehensive user management capabilities with advanced data grid functionality and centralized state management.

## Features

- **Professional User Management Interface**: Clean, modern layout with dedicated header section and optimized content area for enhanced user experience
- **Branded Application Header**: Professional header with "Users Management" branding, integrated navigation controls, and error simulation toggle
- **Dynamic Viewport Layout**: Streamlined layout with proper content organization and visual hierarchy using full-height containers for optimal space utilization
- **Advanced UsersGrid Component**: Production-ready grid component with comprehensive error handling, data loading, retry mechanisms, enhanced refresh functionality with grid state reset, stable v33.3.2 configuration with Quartz theme, explicit DOM layout control, and state integration
- **AG Grid Integration**: Advanced data grid with sorting, filtering, selection capabilities, stable v33.3.2 API with correct createGrid method, simplified configuration approach relying on AG Grid Community Edition defaults, explicit DOM layout control with dedicated CSS container classes, and viewport-based responsive sizing
- **User Management Data**: Comprehensive user dataset with 40+ superhero-themed records including roles, licenses, and status tracking
- **Production-Ready Error Handling**: Comprehensive HTTP error scenarios with user-friendly messages and retry mechanisms
- **Network Resilience**: Handles connection failures, timeouts, and various server error conditions
- **Enhanced Error Simulation Testing**: Advanced error simulation system with 5 distinct error scenarios including network failures, timeouts, JSON parsing errors, actual HTTP 404 responses, and unexpected errors with structured control flow and realistic testing capabilities
- **Modern UI Components**: Custom Button and UsersGrid components with Tailwind CSS styling
- **Enhanced Loading States & User Feedback**: Animated indicators, contextual messages, full-height loading states, and streamlined state management for all async operations
- **Centralized State Management**: AppStateService with reactive patterns for global application state
- **Service Integration**: Dependency injection with scoped services for HttpClient and state management
- **JavaScript Interop**: Robust JavaScript interoperability with AG Grid v33.3.2 using the correct createGrid API method through dedicated interop functions
- **Accessibility Features**: WCAG-compliant components with proper focus management, semantic HTML, ARIA attributes, and consistent rendering
- **Responsive Design**: Professional layout that adapts to any screen size with Tailwind CSS and optimized viewport calculations
- **Professional Branding**: Branded header with "Users Management" title and technology stack footer for enhanced user experience
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks for consistent code formatting, with modern C# control flow patterns and structured error handling for better maintainability

## Tech Stack

- **Frontend**: Blazor WebAssembly (.NET 8.0.8 LTS)
- **State Management**: Custom AppStateService with reactive patterns
- **Dependency Injection**: Built-in .NET DI container with scoped services
- **Styling**: Tailwind CSS v3.4.17 with PostCSS processing and autoprefixer
- **Data Grid**: AG Grid Community Edition v33.3.2 (CDN-hosted) with Quartz theme and stable configuration using correct createGrid API
- **JavaScript Interop**: Custom interop functions for AG Grid v33.3.2 integration using correct createGrid API with simplified grid lifecycle management
- **HTTP Client**: Configured HttpClient with 30-second timeout
- **Build Tools**: npm scripts with automated CSS building and .NET integration
- **Code Quality**: ESLint v9.33.0, Prettier v3.6.2, Husky v9.1.7, lint-staged v16.1.5
- **CSS Processing**: PostCSS v8.4.47 with cssnano v7.1.0 for production minification
- **Package Management**: npm for frontend dependencies, NuGet for .NET packages
- **Development Environment**: VS Code workspace configuration for optimal development experience

## Technical Decisions

### Code Quality & Reliability Improvements

**Recent Error Simulation Enhancements**: The UsersGrid component's error simulation system has been improved with better control flow management and more realistic testing scenarios:

- **Modern Control Flow**: Uses structured control flow with `switch` statements and `break` patterns, following modern C# best practices for better code readability
- **Enhanced HTTP Error Testing**: Comprehensive error simulation including actual HTTP requests to non-existent endpoints for realistic 404 testing
- **Unified Response Processing**: Both successful and error responses are processed through the same HTTP status code handling logic, ensuring consistent behavior
- **Better Code Maintainability**: Clean, readable code structure with proper error handling patterns, improving long-term maintainability and code review quality
- **Comprehensive Error Coverage**: 5 distinct error scenarios covering network failures, timeouts, JSON parsing errors, HTTP status codes, and unexpected exceptions

### AG Grid CSS Optimization

**Enhanced Grid Container Management**: The application now includes dedicated CSS classes for reliable AG Grid rendering across different environments:

- **Viewport-Based Sizing**: Uses `calc(100vh - 200px)` calculations for dynamic height adjustment based on available screen space
- **Reliable Rendering**: `!important` declarations ensure grid dimensions are consistently applied regardless of CSS specificity conflicts
- **Responsive Design**: Minimum height constraints (`500px`) prevent grid collapse on smaller screens while maintaining usability
- **Universal Container Class**: `.ag-grid-container` class provides consistent styling for any AG Grid instance in the application
- **Cross-Browser Compatibility**: Explicit width and height declarations ensure consistent behavior across different browsers and devices

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
- **AG Grid CSS Optimization** with dedicated container classes and viewport-based sizing using `!important` declarations for reliable grid rendering
- **Responsive Grid Containers** with `calc(100vh - 200px)` height calculations and minimum height constraints for consistent display across devices

#### JavaScript Efficiency

- **CDN-hosted AG Grid** reduces bundle size and leverages browser caching
- **Modular interop functions** prevent loading unnecessary JavaScript with dedicated `users-interop.js`
- **Modern ES6+ syntax** for better performance and smaller code
- **Error boundaries** with proper logging for production debugging
- **Grid lifecycle management** with proper creation, destruction, and resource cleanup
- **ARIA compliance optimizations** with setTimeout-based grid structure validation for accessibility
- **Correct AG Grid API** using v33.3.2 createGrid method with streamlined filter configuration and enhanced grid options

#### .NET WebAssembly Optimizations

- **Scoped HttpClient** with 30-second timeout prevents hanging requests
- **Minimal service registration** reduces startup overhead with focused DI container configuration
- **Development-only logging** prevents performance impact in production builds
- **Blazor WebAssembly** eliminates server round-trips for UI interactions
- **Optimized Build Configuration** with warnings treated as errors for code quality enforcement
- **AOT Compilation Disabled** for faster development builds while maintaining production flexibility

#### Build & Development Efficiency

- **Integrated build pipeline** automatically builds Tailwind CSS before .NET compilation
- **Environment-aware PostCSS** applies minification only in production builds
- **Pre-commit hooks** with Husky ensure code quality without manual intervention
- **Lint-staged optimization** runs linters only on changed files, not entire codebase
- **npm script automation** combines CSS building with .NET commands for streamlined workflow
- **VS Code Integration** with workspace settings for consistent development environment
- **Multi-format Linting** supports JavaScript, CSS, HTML, JSON, Markdown, Razor, and C# files

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

#### UsersGrid Component Parameters

The `UsersGrid` component provides flexible configuration options for optimal integration:

```csharp
[Parameter] public string ContainerId { get; set; } = Guid.NewGuid().ToString();
[Parameter] public string Height { get; set; } = "500px";  // Default fixed height
[Parameter] public string Width { get; set; } = "100%";
[Parameter] public EventCallback<object> OnRowClicked { get; set; }
[Parameter] public EventCallback<object[]> OnSelectionChanged { get; set; }
[Parameter] public bool EnableSelection { get; set; } = true;
[Parameter] public string SelectionMode { get; set; } = "single";
[Parameter] public string DataUrl { get; set; } = "data/users.json";
[Parameter] public bool SimulateErrors { get; set; } = false;
```

**Key Parameter Features:**

- **Flexible Height**: Defaults to `500px` but can be customized using any CSS value (px, %, vh, calc(), etc.)
- **Responsive Width**: Defaults to `100%` for full container width utilization
- **Error Simulation**: Built-in error simulation for testing and development purposes with 50% chance when enabled
- **Event Callbacks**: Row click and selection change events for interactive functionality
- **AG Grid Quartz Theme**: Uses the modern Quartz theme for professional appearance

### UsersGrid Integration Example

The `UsersGrid` component demonstrates AppStateService integration with optimized loading state management and enhanced refresh functionality:

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

    public async Task RefreshData()
    {
        // Reset grid state to ensure clean initialization
        if (isGridInitialized)
        {
            try
            {
                await JSRuntime.InvokeVoidAsync("usersInterop.destroyGrid", ContainerId);
            }
            catch
            {
                // Ignore errors during cleanup
            }
            isGridInitialized = false;
        }

        await LoadUsers();
        if (errorState == null && usersData != null)
        {
            // Force a re-render to show the grid container
            StateHasChanged();
            // Small delay to ensure DOM is updated
            await Task.Delay(50);
            await InitializeGrid();
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
- **Enhanced Refresh Functionality**: Grid state reset ensures clean re-initialization during refresh operations

#### Loading State Management Strategy

The UsersGrid component implements a **dual loading state approach** with streamlined UI feedback for optimal user experience:

**Local Loading State (`isLoading`)**:

- Controls component-specific UI elements (button states, grid visibility, retry button styling)
- Provides immediate visual feedback without waiting for global state propagation
- Used for conditional rendering of loading indicators, error states, and grid content
- Ensures component UI remains responsive during async operations
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

// Conditional rendering with flexible layout management
@if (errorState != null)
{
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
        <!-- Error state content -->
    </div>
}
else if (isLoading)
{
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
        <!-- Loading state content -->
    </div>
}
else
{
    <div id="@ContainerId" class="ag-theme-alpine" style="height: @Height; width: @Width;"></div>
}
```

This approach ensures both immediate component responsiveness and proper global state coordination with flexible layout management.

### Layout Architecture

The application implements an **optimized layout pattern** using Tailwind CSS and full-height containers for professional presentation:

#### Streamlined Layout Structure

- **Header Section**: `bg-white shadow-sm border-b` with branded title, navigation controls, and error simulation toggle
- **Main Content Area**: Flexible layout using `flex-1 p-8` with full height grid container (`h-full`) for optimal space utilization
- **Dynamic Grid Sizing**: UsersGrid component uses viewport-based calculations (`calc(100vh - 200px)`) with dedicated CSS container classes for reliable sizing
- **Footer Section**: `bg-white border-t` with technology stack information and branding
- **Responsive Container**: `min-h-screen bg-gray-50 flex flex-col` ensures full viewport coverage with proper layout structure

#### Design Benefits

- **Optimized Grid Display**: Viewport-based CSS calculations with `!important` declarations ensure reliable grid rendering and maximum space utilization
- **Professional Appearance**: Clean visual hierarchy with proper spacing, shadows, and borders
- **Consistent Branding**: Dedicated header space for application title and navigation elements
- **Adaptive Layout**: Full-height containers automatically adjust to available screen space across different devices
- **Informative Footer**: Technology stack display enhances credibility and provides useful information
- **Accessibility Compliance**: Semantic HTML structure with proper heading hierarchy and navigation landmarks
- **Interactive Controls**: Header includes refresh button and error simulation toggle for enhanced functionality

### Interface Design Philosophy

The application implements a **streamlined interface approach** focused on optimal user experience:

#### Professional Interface (Home Page)

- **Optimized Layout**: The home page (`/`) features a streamlined layout with full-height containers for maximum grid visibility
- **Branded Header**: Clean header section with "Users Management" title, refresh button, and error simulation toggle
- **Flexible Content Area**: Main content section uses `flex-1 p-8` with full height grid container for dynamic space utilization
- **Dynamic Grid Sizing**: UsersGrid automatically adjusts to fill available container space for different screen sizes
- **Professional Footer**: Informative footer displaying technology stack and branding information
- **Modern Design**: Uses Tailwind CSS classes for consistent styling, shadows, borders, and responsive design
- **Production-Ready**: Designed for professional environments with optimal data grid presentation and user experience
- **Interactive Controls**: Header includes animated refresh button and toggle switch for error simulation testing

#### Key Design Decisions

- **Flexible Grid Sizing**: The UsersGrid component uses customizable height parameters with sensible defaults for various layout scenarios
- **Simplified Configuration**: Column definitions rely on AG Grid's native capabilities for optimal performance and compatibility
- **Integrated Error Controls**: Error simulation toggle is built into the header for easy access during development and testing
- **Streamlined Navigation**: Single-page focus with all essential controls integrated into the main interface
- **Native Grid Features**: Layout leverages AG Grid's built-in sorting, filtering, and rendering capabilities for maximum reliability

This approach ensures the UsersGrid component provides reliable data presentation while maintaining professional appearance and functionality through AG Grid's proven default behaviors.

## Current Project Status

The OmneSoft application is a fully functional Blazor WebAssembly project with the following current implementation:

### Core Features ✅

- **Professional User Management Interface**: Complete home page with branded header, data grid, and controls
- **AG Grid Integration**: Stable v33.3.2 implementation with Quartz theme and optimized CSS container classes for reliable rendering
- **Error Simulation System**: Built-in error testing with 5 different error scenarios (50% chance when enabled)
- **Comprehensive Error Handling**: Network errors, timeouts, JSON parsing, HTTP status codes, and unexpected errors
- **State Management**: Centralized AppStateService with reactive patterns and proper subscription management
- **Loading States**: Dual loading state management (local and global) with animated indicators
- **Refresh Functionality**: Complete data refresh with grid state reset and proper resource cleanup
- **JavaScript Interop**: Robust AG Grid integration with lifecycle management and event handling
- **Responsive Design**: Professional layout with dynamic viewport calculations and Tailwind CSS styling

### Technical Implementation ✅

- **.NET 8 LTS**: Long-term support foundation with WebAssembly hosting
- **Dependency Injection**: Scoped services for HttpClient and state management
- **Modern Build Pipeline**: Automated CSS building with PostCSS, Tailwind CSS, and production minification
- **Code Quality Tools**: ESLint, Prettier, Husky pre-commit hooks, and lint-staged for consistent formatting
- **Memory Management**: Proper disposal patterns with IAsyncDisposable and resource cleanup
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

- **Data Grid**: Displays user information with sorting, filtering, and selection capabilities
- **Refresh Button**: Reloads data and resets grid state
- **Error Simulation Toggle**: Enables/disables error simulation for testing (50% chance when enabled)
- **Professional Layout**: Full-height responsive design with branded header and footer

#### Error Simulation

Toggle the "Simulate Errors" switch in the header to test error handling:

- **Network Errors**: Simulated connection failures
- **Timeout Errors**: Request timeout scenarios
- **JSON Parsing Errors**: Invalid data format handling
- **HTTP 404 Errors**: Missing resource responses
- **Unexpected Errors**: General exception handling

Each error type displays appropriate user feedback with retry options.

#### Grid Features

The UsersGrid component provides:

- **Sorting**: Click column headers to sort data
- **Filtering**: Use column filters for data search
- **Selection**: Single-row selection with event callbacks
- **Responsive Design**: Automatically adjusts to container size
- **Professional Styling**: Modern Quartz theme with consistent appearance

## Development

### Architecture Overview

The application follows modern Blazor WebAssembly patterns with:

- **Component-Based Architecture**: Reusable UI components with clear separation of concerns
- **Centralized State Management**: AppStateService for global application state
- **Dependency Injection**: Scoped services for HTTP client and state management
- **JavaScript Interop**: Dedicated interop layer for AG Grid integration
- **Responsive Design**: Tailwind CSS with mobile-first approach

### Key Components

#### UsersGrid Component

Located at `Components/UI/UsersGrid.razor`, this is the main data grid component featuring:

- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Animated loading indicators with proper state management
- **AG Grid Integration**: Uses v33.3.2 with correct createGrid API
- **Event Callbacks**: Row click and selection change events
- **Configurable Parameters**: Height, width, data URL, and error simulation options

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

The application includes built-in error simulation for testing:

1. Enable "Simulate Errors" toggle in the header
2. Refresh data to trigger random error scenarios
3. Test different error types and recovery mechanisms
4. Verify user feedback and retry functionality

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
│   └── Home.razor       # Professional user management interface with header controls and full-height layout
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
│   ├── index.html               # Main HTML template with AG Grid CDN references (Quartz and Alpine themes)
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

### Latest Update: AG Grid API Method Correction (Current)

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

### AG Grid Version Stability Update

**AG Grid Community Edition Downgrade to v33.3.2**: The project has been updated to use AG Grid Community Edition v33.3.2 (downgraded from v34.1.2) for enhanced stability and compatibility:

- **Stable Release**: v33.3.2 is a proven stable release with extensive community testing and bug fixes
- **Enhanced Compatibility**: Better compatibility across different browser environments and deployment scenarios
- **Reduced Breaking Changes**: Avoids potential breaking changes and API instabilities present in newer versions
- **Production Reliability**: Ensures consistent behavior in production environments with well-tested functionality
- **CDN Consistency**: Both CSS and JavaScript resources use the same v33.3.2 version for complete compatibility
- **Interop Stability**: JavaScript interop functions use the correct v33.3.2 createGrid API method for optimal patterns and behaviors
- **Long-term Support**: v33.3.2 provides stable foundation for long-term maintenance and updates

**Updated Dependencies:**

- AG Grid Community Edition: `^33.3.2` (package.json)
- CDN CSS: `https://cdn.jsdelivr.net/npm/ag-grid-community@33.3.2/styles/ag-grid.css`
- CDN Themes:
  - Quartz (primary): `https://cdn.jsdelivr.net/npm/ag-grid-community@33.3.2/styles/ag-theme-quartz.css`
  - Alpine (available): `https://cdn.jsdelivr.net/npm/ag-grid-community@33.3.2/styles/ag-theme-alpine.css`
- CDN JavaScript: `https://cdn.jsdelivr.net/npm/ag-grid-community@33.3.2/dist/ag-grid-community.min.js`

This version provides the optimal balance between modern features and production stability for the UsersGrid component.

**Theme Implementation**: The project uses the AG Grid Quartz theme as the primary theme for modern, professional appearance, with Alpine theme available as an alternative.

### AG Grid API Method Correction

**AG Grid v33.3.2 API Method Update**: The JavaScript interop layer has been updated to use the correct AG Grid v33.3.2 API method for grid creation:

- **Correct API Method**: Updated from `new agGrid.Grid(container, gridOptions)` to `agGrid.createGrid(container, gridOptions)` for proper v33.3.2 compatibility
- **Enhanced Reliability**: Using the official AG Grid v33.3.2 createGrid API ensures proper grid initialization and lifecycle management
- **Improved Stability**: The correct API method provides better error handling and resource management during grid creation
- **Future-Proof Implementation**: Aligns with AG Grid's recommended patterns for v33.3.2 and later versions
- **Consistent Documentation**: JavaScript interop comments now accurately reflect the v33.3.2 API usage patterns

**Technical Details:**

```javascript
// Updated implementation in users-interop.js
// Create the grid using v33 API - correct method
const gridApi = agGrid.createGrid(container, gridOptions);
```

This correction ensures the UsersGrid component uses the proper AG Grid v33.3.2 API patterns for reliable grid creation and management.

### AG Grid Layout Configuration Enhancement

**Explicit DOM Layout Control with Visual Styling Enhancement**: The UsersGrid component has been updated with explicit layout configuration, CSS box model optimization, and consistent visual styling for improved rendering consistency:

- **DOM Layout Specification**: Added `domLayout = "normal"` to grid options for predictable rendering behavior
- **CSS Box Model Optimization**: Added `box-sizing: border-box` to the grid container for consistent sizing calculations that include padding and borders
- **Explicit Visual Styling**: Added `background-color: white` and `border: 1px solid #ddd` for consistent appearance across different themes and environments
- **Container Compatibility**: Ensures consistent grid sizing and scrolling behavior within various container environments
- **Layout Stability**: Prevents layout issues that can occur with automatic DOM layout detection and inconsistent box model calculations
- **Cross-Browser Consistency**: Provides uniform grid rendering across different browsers and viewport sizes with standardized box model behavior and explicit styling
- **Enhanced Reliability**: Explicit layout control, box model optimization, and visual styling reduce potential rendering inconsistencies in complex layouts

This enhancement ensures the data grid renders consistently across all deployment environments while maintaining optimal performance and user experience with predictable sizing behavioravior and professional appearance.

### Column Configuration Simplification

**Simplified Column Definitions**: The UsersGrid component has been updated with streamlined column configuration for better maintainability and compatibility:

- **Minimal Configuration**: Column definitions now use only essential properties (`field`, `headerName`, `width`)
- **Native AG Grid Rendering**: Removed custom cell renderers in favor of AG Grid's default rendering capabilities
- **Automatic Feature Detection**: AG Grid automatically enables sorting, filtering, and appropriate cell formatting based on data types
- **Enhanced Performance**: Native rendering provides better performance compared to custom JavaScript cell renderers
- **Improved Compatibility**: Simplified configuration ensures maximum compatibility across AG Grid versions
- **Reduced Complexity**: Easier maintenance and debugging with fewer custom implementations

This simplification ensures the data grid leverages AG Grid's optimized default behaviors while maintaining professional appearance and functionality.

### AG Grid Configuration Optimization

**Simplified Configuration Approach**: The UsersGrid component has been optimized with a minimal configuration strategy that maximizes AG Grid Community Edition v33.3.2 compatibility:

- **Explicit DOM Layout**: Grid options include `domLayout = "normal"` for consistent rendering behavior across different container environments
- **Default Grid Behavior**: Column definitions use minimal configuration, relying entirely on AG Grid's built-in defaults for sorting, filtering, and cell rendering
- **Automatic Feature Detection**: AG Grid Community Edition v33.3.2 automatically enables appropriate sorting and filtering based on data types and column content
- **Native Cell Rendering**: Removed custom cell renderers in favor of AG Grid's default rendering capabilities for better performance and compatibility
- **Simplified Column Definitions**: Each column uses only essential properties (`field`, `headerName`, `width`) allowing AG Grid to handle all other functionality automatically
- **Maximum Compatibility**: This approach ensures the grid works reliably with AG Grid Community Edition v33.3.2 across all browser environments
- **Reduced Maintenance**: Minimal configuration reduces potential compatibility issues and simplifies future updates
- **Enhanced Performance**: Native AG Grid rendering provides optimal performance compared to custom cell renderers
- **Consistent Behavior**: All columns use the same minimal declaration pattern for predictable and reliable rendering

This simplified approach provides reliable grid functionality while maximizing compatibility with AG Grid Community Edition v33.3.2's proven behaviors and ensuring consistent rendering across all deployment environments.

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
    <div id="@ContainerId" class="ag-theme-alpine" style="height: @Height; width: @Width; box-sizing: border-box; background-color: white; border: 1px solid #ddd;"></div>
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
- **Enhanced Error Simulation Testing**: Configurable error simulation toggle (50% chance) with 5 comprehensive error scenarios using structured control flow, integrated into the header for thorough development testing of all error handling paths

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
- Alpine theme CSS for modern styling
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
- **Enhanced error simulation testing** - Configurable 50% random error generation with 5 distinct error scenarios: network failures, timeouts, JSON parsing errors, HTTP 404 responses, and unexpected exceptions for comprehensive development testing

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
                // Stable row selection configuration for v33.3.2
                rowSelection = EnableSelection ? (SelectionMode == "single" ? "single" : "multiple") : (object?)null,
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
- **Error simulation testing** with configurable 50% random error generation
- **Comprehensive error handling** with user-friendly messages and retry mechanisms
- **Status message system** with contextual icons and auto-dismiss functionality
- **Responsive controls** with loading states and animated indicators

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
