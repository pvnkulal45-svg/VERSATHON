const API_BASE = '/api';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  let data;
  
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      if (!text || text.trim() === '') {
        throw new Error(`Server returned empty response (Status ${res.status}). Please make sure python3 backend/app.py is running.`);
      }
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server error (${res.status}). Please make sure backend is running on http://127.0.0.1:5001.`);
      }
    }
  } catch (err) {
    if (err.message && err.message.includes('Server')) {
      throw err;
    }
    throw new Error(`Failed to parse backend response. Please check that python3 backend/app.py is running.`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(res);
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  const data = await handleResponse(res);
  return data.documents || [];
}

export async function fetchTopics(docId) {
  const url = docId ? `${API_BASE}/topics?doc_id=${docId}` : `${API_BASE}/topics`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchFlashcards(docId) {
  const url = docId ? `${API_BASE}/flashcards?doc_id=${docId}` : `${API_BASE}/flashcards`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchQuiz(docId) {
  const url = docId ? `${API_BASE}/quiz?doc_id=${docId}` : `${API_BASE}/quiz`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function submitQuiz(docId, answers) {
  const res = await fetch(`${API_BASE}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_id: docId, answers }),
  });
  return handleResponse(res);
}

export async function fetchProgress(docId) {
  const url = docId ? `${API_BASE}/progress?doc_id=${docId}` : `${API_BASE}/progress`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchWeakTopics(docId) {
  const url = docId ? `${API_BASE}/weak-topics?doc_id=${docId}` : `${API_BASE}/weak-topics`;
  const res = await fetch(url);
  return handleResponse(res);
}
