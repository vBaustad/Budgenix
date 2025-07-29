using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Budgenix.Services.BankStatements.NameSuggester
{
    public class AiNameSuggesterService : INameSuggesterService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AiNameSuggesterService> _logger;
        private readonly IMemoryCache _cache;
        private readonly string _deploymentName;
        private readonly string _apiKey;
        private readonly string _endpoint;

        public AiNameSuggesterService(
            HttpClient httpClient,
            IConfiguration config,
            ILogger<AiNameSuggesterService> logger,
            IMemoryCache cache)
        {
            _httpClient = httpClient;
            _logger = logger;
            _cache = cache;
            _deploymentName = config["AzureOpenAI:DeploymentName"]!;
            _apiKey = config["AzureOpenAI:ApiKey"]!;
            _endpoint = config["AzureOpenAI:Endpoint"]!.TrimEnd('/');
        }

        public async Task<string> SuggestNameAsync(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                return "[auto] Unknown";

            var normalizedKey = NormalizeDescription(description);

            if (_cache.TryGetValue(normalizedKey, out string cachedName))
            {
                _logger.LogDebug("Cache hit for '{Description}' → '{CachedName}'", description, cachedName);
                return cachedName;
            }

            var prompt = $"Turn this messy bank transaction into a clean, short name:\n\n{description.Trim()}";

            var requestBody = new
            {
                messages = new[]
                {
                    new { role = "system", content = "You generate short and clean names for bank transactions." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 20,
                temperature = 0.4
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"{_endpoint}/openai/deployments/{_deploymentName}/chat/completions?api-version=2025-01-01-preview");

            request.Headers.Add("api-key", _apiKey);
            request.Content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseJson);
                var result = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                var finalName = $"[auto] {result?.Trim()}";

                _logger.LogInformation("AI suggester: '{Description}' → '{FinalName}'", description, finalName);
                _cache.Set(normalizedKey, finalName, TimeSpan.FromDays(30));
                return finalName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Azure OpenAI name suggestion failed. Falling back.");
                return "[auto] Imported transaction";
            }
        }

        private static string NormalizeDescription(string input)
        {
            var cleaned = input.ToLower().Trim();
            cleaned = Regex.Replace(cleaned, @"[^a-zæøå\s]", "");
            cleaned = Regex.Replace(cleaned, @"\s+", " ");
            return cleaned;
        }
    }
}
