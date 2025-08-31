using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IHttpClientFactory _http;
    private string AssistantId = Environment.GetEnvironmentVariable("OPENAI_ASSISTANT_ID"); // TODO: put your assistant id
    private static readonly JsonSerializerOptions J = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ChatController(IHttpClientFactory http) => _http = http;

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest req, CancellationToken ct)
    {
        var http = _http.CreateClient("openai");

        // 1) Ensure we have a thread
        string? threadId = req.ThreadId;
        if (string.IsNullOrWhiteSpace(threadId))
        {
            var t = await http.PostAsync("v1/threads",
                new StringContent("{}", Encoding.UTF8, "application/json"), ct);
            var tTxt = await t.Content.ReadAsStringAsync(ct);
            if (!t.IsSuccessStatusCode)
                return Problem(detail: tTxt, statusCode: (int)t.StatusCode);

            using var tDoc = JsonDocument.Parse(tTxt);
            if (!tDoc.RootElement.TryGetProperty("id", out var idEl))
                return Problem(detail: $"Unexpected thread response: {tTxt}", statusCode: 502);
            threadId = idEl.GetString();
        }

        // 2) Add user message
        var userMsg = new { role = "user", content = req.Message };
        var add = await http.PostAsync($"v1/threads/{threadId}/messages",
            new StringContent(JsonSerializer.Serialize(userMsg, J), Encoding.UTF8, "application/json"), ct);
        var addTxt = await add.Content.ReadAsStringAsync(ct);
        if (!add.IsSuccessStatusCode)
            return Problem(detail: addTxt, statusCode: (int)add.StatusCode);

        // 3) Run assistant
        var runBody = new { assistant_id = AssistantId };
        var run = await http.PostAsync($"v1/threads/{threadId}/runs",
            new StringContent(JsonSerializer.Serialize(runBody, J), Encoding.UTF8, "application/json"), ct);
        var runTxt = await run.Content.ReadAsStringAsync(ct);
        if (!run.IsSuccessStatusCode)
            return Problem(detail: runTxt, statusCode: (int)run.StatusCode);

        using var runDoc = JsonDocument.Parse(runTxt);
        if (!runDoc.RootElement.TryGetProperty("id", out var runIdEl))
            return Problem(detail: $"Unexpected run response: {runTxt}", statusCode: 502);
        var runId = runIdEl.GetString();

        // 4) Poll for completion (with timeout)
        var deadline = DateTime.UtcNow.AddSeconds(45);
        while (true)
        {
            ct.ThrowIfCancellationRequested();
            await Task.Delay(350, ct);

            var st = await http.GetAsync($"v1/threads/{threadId}/runs/{runId}", ct);
            var stTxt = await st.Content.ReadAsStringAsync(ct);
            if (!st.IsSuccessStatusCode)
                return Problem(detail: stTxt, statusCode: (int)st.StatusCode);

            using var stDoc = JsonDocument.Parse(stTxt);
            var status = stDoc.RootElement.GetProperty("status").GetString();
            if (status == "completed") break;
            if (status == "failed" || status == "cancelled")
                return Problem(detail: $"Run {status}: {stTxt}", statusCode: 502);

            if (DateTime.UtcNow > deadline)
                return Problem(detail: "Run timed out waiting for completion.", statusCode: 504);
        }

        // 5) Read latest assistant message
        var msgs = await http.GetAsync($"v1/threads/{threadId}/messages?limit=1", ct);
        var msgsTxt = await msgs.Content.ReadAsStringAsync(ct);
        if (!msgs.IsSuccessStatusCode)
            return Problem(detail: msgsTxt, statusCode: (int)msgs.StatusCode);

        using var msgsDoc = JsonDocument.Parse(msgsTxt);
        var reply = ExtractText(msgsDoc.RootElement) ?? string.Empty;

        return Ok(new { reply, threadId });
    }

    // Robustly extract text from Assistants v2 message payload
    private static string? ExtractText(JsonElement root)
    {
        // root.data[0].content[*] where type == "text"
        if (!root.TryGetProperty("data", out var data) || data.GetArrayLength() == 0)
            return null;

        var content = data[0].GetProperty("content");
        for (int i = 0; i < content.GetArrayLength(); i++)
        {
            var item = content[i];
            if (item.TryGetProperty("type", out var t) && t.GetString() == "text")
            {
                if (item.TryGetProperty("text", out var textObj))
                    return textObj.GetProperty("value").GetString();
            }
        }
        // Fallback to first text-like shape if schema changes
        try { return content[0].GetProperty("text").GetProperty("value").GetString(); } catch { }
        return null;
    }
}

public record ChatRequest(string Message, string? ThreadId);
