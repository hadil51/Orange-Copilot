import { useEffect, useState, useCallback } from 'react'
import { api, CANDIDATE_FORM_URL } from '../api/n8n'
import CandidateDetail from '../components/CandidateDetail'

export default function CandidatesPage() {
  const [offers, setOffers] = useState([])
  const [selectedOfferId, setSelectedOfferId] = useState('')
  const [topN, setTopN] = useState(10)
  const [candidates, setCandidates] = useState([])
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    api
      .listOffers()
      .then((data) => {
        const list = Array.isArray(data) ? data : [data]
        setOffers(list)
        if (list.length > 0) setSelectedOfferId(list[0].id)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingOffers(false))
  }, [])

  const fetchTopCandidates = useCallback(async () => {
    if (!selectedOfferId) return
    setLoadingCandidates(true)
    setError(null)
    try {
      const data = await api.topCandidates(selectedOfferId, topN)
      setCandidates(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err.message)
      setCandidates([])
    } finally {
      setLoadingCandidates(false)
    }
  }, [selectedOfferId, topN])

  useEffect(() => {
    fetchTopCandidates()
  }, [fetchTopCandidates])

  function copyFormLink() {
    navigator.clipboard.writeText(CANDIDATE_FORM_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="page-header">
        <h1>Candidats</h1>
        <p>Partage le lien de candidature, suis le classement des profils reçus.</p>
      </div>

      <div className="form-card">
        <div className="form-row">
          <label>Lien de candidature à partager</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={CANDIDATE_FORM_URL} />
            <button className="btn btn-primary" onClick={copyFormLink} type="button">
              {copied ? 'Copié ✓' : 'Copier'}
            </button>
          </div>
        </div>
      </div>

      {loadingOffers && <p className="state-message">Chargement des offres…</p>}

      {!loadingOffers && offers.length === 0 && (
        <p className="state-message">Aucune offre publiée — crée une offre d’abord.</p>
      )}

      {!loadingOffers && offers.length > 0 && (
        <div className="form-card">
          <div className="form-row">
            <label htmlFor="offer-select">Offre</label>
            <select
              id="offer-select"
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
            >
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="top-n">Nombre de candidats à afficher</label>
            <input
              id="top-n"
              type="number"
              min="1"
              max="50"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value) || 10)}
            />
          </div>
        </div>
      )}

      {loadingCandidates && <p className="state-message">Chargement du classement…</p>}
      {error && <p className="state-message error">{error}</p>}

      {!loadingCandidates && !error && candidates.length === 0 && selectedOfferId && (
        <p className="state-message">Aucun candidat scoré pour cette offre pour l’instant.</p>
      )}

      {!loadingCandidates && !error && candidates.length > 0 && (
        <div className="offer-list">
          {candidates.map((c, idx) => {
            const isOpen = expandedId === c.candidate_id
            return (
              <div key={c.candidate_id || idx}>
                <div
                  className="offer-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedId(isOpen ? null : c.candidate_id)}
                >
                  <div className="offer-card-top">
                    <h3>
                      #{idx + 1} — {c.full_name}
                    </h3>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {c.status === 'contacted' && (
                        <span
                          className="stat-card-pill"
                          style={{ color: 'var(--success)', background: 'var(--success-soft)' }}
                        >
                          Contacté ✓
                        </span>
                      )}
                      <span className="status-badge">{Math.round(c.score)} / 100</span>
                    </div>
                  </div>
                  <p className="dept">{c.email}</p>
                  {c.justification && <p>{c.justification}</p>}
                </div>
                {isOpen && c.candidate_id && <CandidateDetail candidateId={c.candidate_id} />}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}