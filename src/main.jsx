import React, { Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage.jsx'
import './styles.css'

const FollowUpPage = lazy(() => import('./pages/FollowUpPage.jsx'))

function App() {
  const [page, setPage] = useState(() => window.location.hash === '#missing-you' ? 2 : 1)

  useEffect(() => {
    const onHash = () => setPage(window.location.hash === '#missing-you' ? 2 : 1)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const goToSecondPage = () => {
    window.location.hash = 'missing-you'
  }

  return (
    <Suspense fallback={<div className="loading-screen">💗</div>}>
      {page === 1 ? <HomePage onContinue={goToSecondPage} /> : <FollowUpPage />}
    </Suspense>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
