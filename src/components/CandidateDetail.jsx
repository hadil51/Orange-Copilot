import { useState } from 'react'
import { api } from '../api/n8n'

const RECOMMENDATION_LABELS = {
  shortlist: { text: 'À convoquer', color: 'var(--success)', bg: 'var(--success-soft)' },
  reject: { text: 'À refuser', color: 'var(--danger)', bg: 'var(--danger-soft)' },
  review: { text: 'À revoir', color: 'var(--accent)', bg: 'var(--accent-soft)' },
}

export default function CandidateDetail({ candidateId }) {
  const [recommendation, setRecommendation] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const data = await api.generateRecommendation(candidateId)
      setRecommendation(data)
      setSubject(data.email_subject || '')
      setBody(data.email_body || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    setSending(true)
    setError(null)
    try {
      await api.sendEmail(recommendation.id, subject, body)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="form-card" style={{ marginTop: 10, marginBottom: 0 }}>
      {!recommendation && !loading && (
        <button className="btn btn-primary" onClick={handleGenerate} type="button">
          Générer la recommandation
        </button>
      )}

      {loading && <p className="state-message">Génération en cours…</p>}
      {error && <p className="state-message error">{error}</p>}

      {recommendation && !sent && (
        <>
          <div className="form-row">
            <label>Recommandation IA</label>
            <span
              className="stat-card-pill"
              style={{
                color: RECOMMENDATION_LABELS[recommendation.recommendation]?.color,
                background: RECOMMENDATION_LABELS[recommendation.recommendation]?.bg,
              }}
            >
              {RECOMMENDATION_LABELS[recommendation.recommendation]?.text || recommendation.recommendation}
            </span>
            <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-soft)' }}>
              {recommendation.recommendation_note}
            </p>
          </div>

          <div className="form-row">
            <label htmlFor={`subject-${candidateId}`}>Sujet de l’email</label>
            <input id={`subject-${candidateId}`} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <div className="form-row">
            <label htmlFor={`body-${candidateId}`}>Corps de l’email (modifiable avant envoi)</label>
            <textarea
              id={`body-${candidateId}`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ minHeight: 180 }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleSend} disabled={sending} type="button">
            {sending ? 'Envoi en cours…' : 'Approuver et envoyer'}
          </button>
        </>
      )}

      {sent && (
        <p className="state-message" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
          Email envoyé ✓
        </p>
      )}
    </div>
  )
}
