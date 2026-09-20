const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload document');
  }
  return data;
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch documents');
  return data.documents || [];
}

export async function fetchTopics(docId) {
  const url = docId ? `${API_BASE}/topics?doc_id=${docId}` : `${API_BASE}/topics`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch topics');
  return data;
}

export async function fetchFlashcards(docId) {
  const url = docId ? `${API_BASE}/flashcards?doc_id=${docId}` : `${API_BASE}/flashcards`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch flashcards');
  return data;
}

export async function fetchQuiz(docId) {
  const url = docId ? `${API_BASE}/quiz?doc_id=${docId}` : `${API_BASE}/quiz`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch quiz questions');
  return data;
}

export async function submitQuiz(docId, answers) {
  const res = await fetch(`${API_BASE}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_id: docId, answers }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit quiz');
  return data;
}

export async function fetchProgress(docId) {
  const url = docId ? `${API_BASE}/progress?doc_id=${docId}` : `${API_BASE}/progress`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
  return data;
}

export async function fetchWeakTopics(docId) {
  const url = docId ? `${API_BASE}/weak-topics?doc_id=${docId}` : `${API_BASE}/weak-topics`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch weak topics');
  return data;
}
