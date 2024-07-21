import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MetronomeSong from './MetronomeSong.tsx'
import Transfer from './ImportUrl.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/metronome/song/:id',
    element: <MetronomeSong />,
  },
  { path: '/transfer', element: <Transfer /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
