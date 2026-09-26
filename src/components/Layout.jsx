import { NavLink, Outlet } from 'react-router-dom'

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--sidebar-text)',
        margin: '18px 10px 6px',
      }}
    >
      {children}
    </p>
  )
}

export default function Layout() {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <p className="sidebar-brand">HR Platform</p>

        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>

        <SectionLabel>Recrutement</SectionLabel>
        <NavLink to="/offres" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Offres
        </NavLink>
        <NavLink to="/candidats" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Candidats
        </NavLink>
        <NavLink to="/chat-rh" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Chat RH
        </NavLink>

        <SectionLabel>Achats</SectionLabel>
        <NavLink to="/assistant-achat" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Assistant d’achat
        </NavLink>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
