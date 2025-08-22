namespace OmneSoft.Services;

/// <summary>
/// Centralized state management service for tracking global application state.
/// Provides a reactive pattern where components can subscribe to state changes
/// and automatically re-render when the state updates.
/// </summary>
public class AppStateService : IAppStateService
{
    /// <summary>
    /// Event fired whenever application state changes.
    /// Components subscribe to this to trigger re-renders when state updates.
    /// </summary>
    public event Action? OnChange;

    private bool _isLoading;
    /// <summary>
    /// Indicates whether the application is currently performing a loading operation.
    /// Read-only property that components can bind to for showing loading indicators.
    /// </summary>
    public bool IsLoading
    {
        get => _isLoading;
        private set
        {
            // Only notify subscribers if the value actually changed
            // This prevents unnecessary re-renders and improves performance
            if (_isLoading != value)
            {
                _isLoading = value;
                NotifyStateChanged();
            }
        }
    }

    /// <summary>
    /// Updates the loading state and notifies all subscribed components.
    /// Use this when starting or completing async operations that should
    /// show loading indicators across the application.
    /// </summary>
    /// <param name="isLoading">True to show loading state, false to hide it</param>
    public void SetLoading(bool isLoading)
    {
        IsLoading = isLoading;
    }



    /// <summary>
    /// Manually triggers state change notifications to all subscribers.
    /// Useful for forcing component updates when state changes outside
    /// of the normal property setters.
    /// </summary>
    public void NotifyStateChanged() => OnChange?.Invoke();
}
