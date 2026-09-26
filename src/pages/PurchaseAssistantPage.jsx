import { useState } from 'react'
import { api } from '../api/n8n'

export default function PurchaseAssistantPage() {
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setOptions(null)
    try {
      const data = await api.askPurchaseAssistant(query)
      setOptions(data.options || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Assistant d’achat</h1>
        <p>Décris ce que tu cherches, l’IA compare des options réelles pour toi.</p>
      </div>

      <form className="form-card" onSubmit={handleSearch}>
        <div className="form-row">
          <label htmlFor="query">Ce que tu cherches</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Un laptop pour le développement, budget 1500 TND"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Recherche en cours…' : 'Rechercher les meilleures options'}
        </button>
      </form>

      {error && <p className="state-message error">{error}</p>}

      {options && options.length === 0 && (
        <p className="state-message">Aucune option trouvée, essaie de reformuler ta demande.</p>
      )}

      {options && options.length > 0 && (
        <div className="offer-list">
          {options.map((opt, idx) => (
            <div className="offer-card" key={idx}>
              <div className="offer-card-top">
                <h3>{opt.name}</h3>
                <span className="status-badge">{opt.price}</span>
              </div>
              <p>
                <strong style={{ color: 'var(--success)' }}>+ </strong>
                {opt.pros}
              </p>
              <p>
                <strong style={{ color: 'var(--danger)' }}>− </strong>
                {opt.cons}
              </p>
              {opt.source_url && (
                <a
                  href={opt.source_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: 'var(--accent)' }}
                >
                  Voir la source
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
