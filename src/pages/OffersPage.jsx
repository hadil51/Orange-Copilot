import { useEffect, useState, useCallback } from 'react'
import { api } from '../api/n8n'
import OfferForm from '../components/OfferForm'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listOffers()
      // n8n peut renvoyer un objet unique ou un tableau selon le nombre de lignes
      setOffers(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return (
    <>
      <div className="page-header">
        <h1>Offres d’emploi</h1>
        <p>Publie une offre, elle sera immédiatement disponible pour le tri de candidatures.</p>
      </div>

      <OfferForm onCreated={fetchOffers} />

      {loading && <p className="state-message">Chargement des offres…</p>}
      {error && <p className="state-message error">{error}</p>}

      {!loading && !error && offers.length === 0 && (
        <p className="state-message">Aucune offre publiée pour l’instant.</p>
      )}

      {!loading && !error && offers.length > 0 && (
        <div className="offer-list">
          {offers.map((offer) => (
            <div className="offer-card" key={offer.id}>
              <div className="offer-card-top">
                <h3>{offer.title}</h3>
                <span className="status-badge">{offer.status}</span>
              </div>
              {offer.department && <p className="dept">{offer.department}</p>}
              <p>{offer.description}</p>
              {offer.required_skills && (
                <div className="skill-tags">
                  {offer.required_skills.split(',').map((skill) => (
                    <span className="skill-tag" key={skill.trim()}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
