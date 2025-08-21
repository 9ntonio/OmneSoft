namespace OmneSoft.Services;

public class AppStateService : IAppStateService
{
    public event Action? OnChange;
    
    private bool _isLoading;
    public bool IsLoading 
    { 
        get => _isLoading;
        private set
        {
            if (_isLoading != value)
            {
                _isLoading = value;
                NotifyStateChanged();
            }
        }
    }

    public void SetLoading(bool isLoading)
    {
        IsLoading = isLoading;
    }

    public void NotifyStateChanged() => OnChange?.Invoke();
}