const API_BASE = import.meta.env.VITE_API_URL || "";

export async function predictDisease(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let detail = "Prediction failed";
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error("API unavailable");
  return response.json();
}
