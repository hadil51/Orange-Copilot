import { useEffect, useState } from 'react'
import { api } from '../api/n8n'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .dashboardStats()
      .then((data) => setStats(Array.isArray(data) ? data[0] : data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Vue d’ensemble de l’activité de recrutement en temps réel.</p>
      </div>

      {loading && <p className="state-message">Chargement des statistiques…</p>}
      {error && <p className="state-message error">{error}</p>}

      {!loading && !error && stats && (
        <div className="stat-grid">
          <div className="stat-card dark">
            <p className="stat-card-label">Candidatures reçues</p>
            <p className="stat-card-value">{stats.total_candidates}</p>
            <span className="stat-card-pill">
              {stats.candidates_scored} analysées
            </span>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Offres actives</p>
            <p className="stat-card-value">{stats.open_offers}</p>
            <span className="stat-card-pill">{stats.total_offers} au total</span>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Score moyen</p>
            <p className="stat-card-value">
              {stats.average_score != null ? `${stats.average_score}` : '—'}
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-soft)' }}> /100</span>
            </p>
            <span className="stat-card-pill">Sur tous les candidats scorés</span>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">Profils forts (≥ 70)</p>
            <p className="stat-card-value">{stats.strong_matches}</p>
            <span className="stat-card-pill">Prêts pour entretien</span>
          </div>

          <div className="stat-card">
            <p className="stat-card-label">En attente d’analyse</p>
            <p className="stat-card-value">{stats.candidates_new}</p>
            <span className="stat-card-pill">Statut « nouveau »</span>
          </div>
        </div>
      )}
    </>
  )
}
