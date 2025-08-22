# OmneSoft

A modern Blazor WebAssembly application built with .NET 8, featuring interactive components and data grid functionality.

## Features

- **Interactive Counter Demo**: Blazor component with state management and JSInterop integration
- **AG Grid Integration**: Advanced data grid with sorting, filtering, and selection capabilities
- **Modern UI Components**: Custom Button and AgGrid components with Tailwind CSS styling
- **State Management**: Centralized app state service with loading indicators
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks for consistent code formatting

## Tech Stack

- **Frontend**: Blazor WebAssembly (.NET 8)
- **Styling**: Tailwind CSS with PostCSS processing
- **Data Grid**: AG Grid Community Edition
- **Build Tools**: npm scripts with automated CSS building
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Technical Decisions

### Performance & Efficiency Optimizations

This project implements several performance-first strategies for maximum efficiency:

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

```
├── Components/
│   ├── Layout/          # Layout components
│   └── UI/              # Reusable UI components (Button, AgGrid)
├── Pages/
│   ├── Home.razor       # Counter demo page
│   └── GridDemo.razor   # AG Grid demonstration
├── Services/            # Application services (AppStateService)
├── Models/              # Data models and configuration
├── wwwroot/             # Static assets and configuration
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

#### Why This Approach:

- **Full Control** - Complete control over AG Grid initialization and lifecycle
- **Performance** - Direct JavaScript calls without additional abstraction layers
- **Flexibility** - Can expose any AG Grid feature as needed
- **Maintainability** - Clear separation between C# and JavaScript concerns

#### Alternative Options Not Used:

- ❌ **JSImport/JSExport** (newer .NET 7+ approach) - More complex setup
- ❌ **Direct DOM manipulation** - Limited functionality, harder to maintain
- ❌ **Third-party wrappers** - Less control, potential version conflicts

### Integration Architecture

#### 1. **JavaScript Interop Layer** (`wwwroot/js/ag-grid-interop.js`)

- Creates a bridge between Blazor C# and AG Grid JavaScript
- Manages grid instances in a Map for multiple grids
- Handles grid lifecycle: create, update, destroy
- Provides callbacks for row clicks and selection changes
- Uses the modern AG Grid v34+ API (`agGrid.createGrid()`)

#### 2. **Blazor Component** (`Components/UI/AgGrid.razor`)

- Wraps the JavaScript interop in a reusable Blazor component
- Provides strongly-typed parameters for configuration
- Handles component lifecycle and cleanup
- Supports event callbacks for row interactions
- Uses `DotNetObjectReference` for JavaScript-to-C# callbacks

#### 3. **Dependencies** (`wwwroot/index.html`)

- AG Grid Community v34.1.2 from CDN
- Quartz theme CSS for modern styling
- Custom interop JavaScript

### How to Use AG Grid Integration

#### Basic Usage

```razor
<AgGrid ContainerId="my-grid"
        Height="400px"
        Width="100%"
        RowData="myData"
        ColumnDefs="myColumns" />
```

#### With Event Handling

```razor
<AgGrid @ref="gridRef"
        ContainerId="employee-grid"
        RowData="employees"
        ColumnDefs="columnDefs"
        EnableSelection="true"
        SelectionMode="single"
        OnRowClicked="HandleRowClick"
        OnSelectionChanged="HandleSelectionChange" />

@code {
    private AgGrid? gridRef;
    private object[]? employees;
    private object[] columnDefs = new object[]
    {
        new { field = "name", headerName = "Name", sortable = true },
        new { field = "email", headerName = "Email", filter = true },
        new { field = "department", headerName = "Department" }
    };

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
    private AgGrid? gridRef;

    private async Task UpdateData()
    {
        var newData = GetNewData();
        await gridRef!.UpdateRowData(newData);
    }

    private async Task GetSelected()
    {
        var selected = await gridRef!.GetSelectedRows();
        // Process selected rows
    }

    private async Task ResizeGrid()
    {
        await gridRef!.SizeToFit();
        // or
        await gridRef!.AutoSizeAllColumns();
    }
}
```

### JS Interop Implementation Details

#### JavaScript Side (`ag-grid-interop.js`)

```javascript
window.agGridInterop = {
  grids: new Map(), // Manages multiple grid instances

  createGrid: function (containerId, gridOptions, dotNetRef) {
    // Creates grid with .NET callbacks
    const gridApi = agGrid.createGrid(container, gridOptions);
    this.grids.set(containerId, gridApi);
    return true;
  },

  setRowData: function (containerId, rowData) {
    // Updates grid data
    const gridApi = this.grids.get(containerId);
    gridApi.setGridOption('rowData', rowData);
  },
  // ... other methods
};
```

#### C# Side (AgGrid.razor)

```csharp
@inject IJSRuntime JSRuntime

@code {
    private DotNetObjectReference<AgGrid>? dotNetRef;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            dotNetRef = DotNetObjectReference.Create(this);

            // Call JavaScript function
            await JSRuntime.InvokeAsync<bool>(
                "agGridInterop.createGrid",
                ContainerId,
                gridOptions,
                dotNetRef);
        }
    }

    // JavaScript can call this method
    [JSInvokable]
    public async Task HandleRowClicked(object rowData)
    {
        await OnRowClicked.InvokeAsync(rowData);
    }
}
```

### Key Integration Patterns

#### 1. Bidirectional Communication

- **C# → JS**: `JSRuntime.InvokeAsync()` calls JavaScript functions
- **JS → C#**: `dotNetRef.invokeMethodAsync()` calls C# methods marked with `[JSInvokable]`

#### 2. Object Reference Management

```csharp
// Create reference for JavaScript callbacks
dotNetRef = DotNetObjectReference.Create(this);

// Always dispose to prevent memory leaks
public async ValueTask DisposeAsync()
{
    dotNetRef?.Dispose();
}
```

#### 3. Grid Instance Management

```javascript
// JavaScript manages multiple grid instances
grids: new Map(),

createGrid: function (containerId, gridOptions, dotNetRef) {
    const gridApi = agGrid.createGrid(container, gridOptions);
    this.grids.set(containerId, gridApi); // Store by container ID
}
```

### Integration Features

✅ **Modern AG Grid API** - Uses v34+ with proper `rowSelection` syntax  
✅ **Event Handling** - Row clicks and selection changes  
✅ **Data Management** - Dynamic row data updates  
✅ **Responsive Design** - Auto-sizing and fit-to-container  
✅ **Memory Management** - Proper disposal and cleanup  
✅ **Error Handling** - Try-catch blocks and logging  
✅ **Loading States** - User feedback during operations

### Usage Best Practices

1. **Always use `@ref`** to get component reference for programmatic control
2. **Handle disposal** - Component implements `IAsyncDisposable`
3. **Unique ContainerIds** - Each grid needs a unique container ID
4. **Error handling** - JavaScript functions include try-catch blocks
5. **Async patterns** - All JS interop calls are async

## Features Overview

### Counter Demo (`/`)

- Interactive counter with increment/reset functionality
- JSInterop demonstration with browser alerts
- Loading states and user feedback
- Modern card-based UI design

### Grid Demo (`/grid-demo`)

- AG Grid integration with sample employee data
- Dynamic data loading with loading indicators
- Row selection and click handling
- Add/remove rows functionality
- Sorting and filtering capabilities

### Custom Components

#### Button Component

- Multiple variants (Primary, Secondary, Success, Danger)
- Loading states with spinner animation
- Hover effects and transitions
- Flexible sizing options

#### AgGrid Component

- Wrapper for AG Grid Community Edition
- Event handling for row selection and clicks
- Dynamic data updates
- Responsive grid sizing

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
