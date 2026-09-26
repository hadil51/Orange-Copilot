/**
 * Point d'entrée unique vers n8n.
 * Si un jour l'URL de base change (déploiement, autre port...),
 * c'est le SEUL endroit à modifier.
 */
const N8N_BASE_URL = 'http://localhost:5678/webhook'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Erreur n8n (${res.status}) : ${text || res.statusText}`)
  }
  return res.json()
}

export const api = {
  // --- Offres ---
  createOffer: (payload) =>
    fetch(`${N8N_BASE_URL}/offer-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  listOffers: () =>
    fetch(`${N8N_BASE_URL}/offer-list`, { method: 'GET' }).then(handleResponse),

  // --- Candidats ---
  topCandidates: (offerId, topN = 10) =>
    fetch(`${N8N_BASE_URL}/top-candidates?offer_id=${encodeURIComponent(offerId)}&top_n=${topN}`, {
      method: 'GET',
    }).then(handleResponse),

  // --- Chat RH (RAG) ---
  askQuestion: (question) =>
    fetch(`${N8N_BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    }).then((res) => {
      if (!res.ok) throw new Error(`Erreur n8n (${res.status})`)
      return res.text() // le webhook /ask renvoie du texte brut, pas du JSON
    }),

  // --- Dashboard ---
  dashboardStats: () =>
    fetch(`${N8N_BASE_URL}/dashboard-stats`, { method: 'GET' }).then(handleResponse),

  // --- Recommandation & Email ---
  generateRecommendation: (candidateId) =>
    fetch(`${N8N_BASE_URL}/generate-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_id: candidateId }),
    }).then(handleResponse),

  sendEmail: (recommendationId, emailSubject, emailBody) =>
    fetch(`${N8N_BASE_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recommendation_id: recommendationId,
        email_subject: emailSubject,
        email_body: emailBody,
      }),
    }).then(handleResponse),

  // --- Purchase Assistant ---
  askPurchaseAssistant: (query) =>
    fetch(`${N8N_BASE_URL}/purchase-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then(handleResponse),
}

// URL du formulaire de candidature, à partager (LinkedIn, etc.)
export const CANDIDATE_FORM_URL = `${N8N_BASE_URL}/candidate-form`
