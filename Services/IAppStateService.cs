namespace OmneSoft.Services;

public interface IAppStateService
{
    event Action? OnChange;
    bool IsLoading { get; }
    void SetLoading(bool isLoading);
    void NotifyStateChanged();
}
