import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { AssetDetail } from './pages/AssetDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/asset/:type/:symbol" element={<AssetDetail />} />
    </Routes>
  )
}

export default App
