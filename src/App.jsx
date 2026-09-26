import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import OffersPage from './pages/OffersPage'
import CandidatesPage from './pages/CandidatesPage'
import ChatRHPage from './pages/ChatRHPage'
import PurchaseAssistantPage from './pages/PurchaseAssistantPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/offres" element={<OffersPage />} />
          <Route path="/candidats" element={<CandidatesPage />} />
          <Route path="/chat-rh" element={<ChatRHPage />} />
          <Route path="/assistant-achat" element={<PurchaseAssistantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
