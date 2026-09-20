const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  let data;
  
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      if (!text || text.trim() === '') {
        throw new Error(`Server returned empty response (Status ${res.status}). Please make sure backend server is running.`);
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
    throw new Error(`Failed to parse backend response. Please check that backend server is running.`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data;
}

// AUTH API CALLS
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await handleResponse(res);
  if (data.token) setAuthToken(data.token);
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data.token) setAuthToken(data.token);
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders()
  });
  const data = await handleResponse(res);
  return data.user;
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

// CONTENT API CALLS (ISOLATED BY AUTH TOKEN)
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse(res);
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`, { headers: getHeaders() });
  const data = await handleResponse(res);
  return data.documents || [];
}

export async function fetchTopics(docId) {
  const url = docId ? `${API_BASE}/topics?doc_id=${docId}` : `${API_BASE}/topics`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function fetchFlashcards(docId, count, difficulty) {
  let url = `${API_BASE}/flashcards`;
  const params = [];
  if (docId) params.push(`doc_id=${docId}`);
  if (count) params.push(`count=${count}`);
  if (difficulty) params.push(`difficulty=${encodeURIComponent(difficulty)}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function updateFlashcardStatus(cardId, status) {
  const res = await fetch(`${API_BASE}/flashcards/${cardId}/status`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

export async function fetchQuiz(docId, count, difficulty) {
  let url = `${API_BASE}/quiz`;
  const params = [];
  if (docId) params.push(`doc_id=${docId}`);
  if (count) params.push(`count=${count}`);
  if (difficulty) params.push(`difficulty=${encodeURIComponent(difficulty)}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function generateMoreContent(docId) {
  const res = await fetch(`${API_BASE}/generate-more`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ doc_id: docId })
  });
  return handleResponse(res);
}

export async function submitQuiz(docId, answers) {
  const res = await fetch(`${API_BASE}/quiz/submit`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ doc_id: docId, answers }),
  });
  return handleResponse(res);
}

export async function fetchProgress(docId) {
  const url = docId ? `${API_BASE}/progress?doc_id=${docId}` : `${API_BASE}/progress`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}

export async function fetchWeakTopics(docId) {
  const url = docId ? `${API_BASE}/weak-topics?doc_id=${docId}` : `${API_BASE}/weak-topics`;
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
}
