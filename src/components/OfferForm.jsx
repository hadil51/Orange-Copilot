import { useState } from 'react'
import { api } from '../api/n8n'

export default function OfferForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    required_skills: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await api.createOffer(form)
      setForm({ title: '', department: '', description: '', required_skills: '' })
      onCreated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="title">Titre du poste</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Développeur Backend"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="department">Département</label>
        <input
          id="department"
          value={form.department}
          onChange={(e) => updateField('department', e.target.value)}
          placeholder="IT"
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Description du poste</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Décrit les missions, responsabilités et contexte du poste"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="skills">Compétences requises</label>
        <input
          id="skills"
          value={form.required_skills}
          onChange={(e) => updateField('required_skills', e.target.value)}
          placeholder="Python, PostgreSQL, API REST"
        />
      </div>

      {error && <p className="state-message error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Publication…' : 'Publier l’offre'}
      </button>
    </form>
  )
}
