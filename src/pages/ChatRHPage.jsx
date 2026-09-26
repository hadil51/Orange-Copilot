import { useState } from 'react'
import { api } from '../api/n8n'

export default function ChatRHPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAsk(e) {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    setAnswer(null)
    try {
      const text = await api.askQuestion(question)
      setAnswer(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Chat RH</h1>
        <p>Pose une question libre sur les candidats (ex. « quels candidats ont de l’expérience en IA ? »).</p>
      </div>

      <form className="form-card" onSubmit={handleAsk}>
        <div className="form-row">
          <label htmlFor="question">Ta question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Quels candidats ont 3+ ans d'expérience en réseaux ?"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Recherche en cours…' : 'Poser la question'}
        </button>
      </form>

      {error && <p className="state-message error">{error}</p>}

      {answer && (
        <div className="offer-card">
          <h3>Réponse</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
        </div>
      )}
    </>
  )
}
