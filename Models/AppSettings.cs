namespace OmneSoft.Models;

public class AppSettings
{
    public string AppName { get; set; } = "OmneSoft";
    public string Version { get; set; } = "1.0.0";
    public ApiSettings Api { get; set; } = new();
}

public class ApiSettings
{
    public string BaseUrl { get; set; } = string.Empty;
    public int TimeoutSeconds { get; set; } = 30;
}