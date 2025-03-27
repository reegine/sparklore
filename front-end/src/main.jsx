import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/home.jsx'
import Charmbar from './pages/charmbar.jsx'
import GiftSets from './pages/gift_sets.jsx'
import Angklets from './pages/angklets.jsx'
import Rings from './pages/rings.jsx'
import Earrings from './pages/earrings.jsx'
import Bracelets from './pages/bracelets.jsx'
import Necklaces from './pages/necklaces.jsx'


import NotFound from './pages/not_found.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {path:"/", element: <Home/>},
  {path:"/charmbar", element: <Charmbar/>},
  {path:"/giftsets", element: <GiftSets/>},
  {path:"/angklets", element: <Angklets/>},
  {path:"/rings", element: <Rings/>},
  {path:"/earrings", element: <Earrings/>},
  {path:"/bracelets", element: <Bracelets/>},
  {path:"/necklaces", element: <Necklaces/>},
  // {path:"/Bracelets", element: <Bracelets/>},
  // {path:"/Bracelets", element: <Bracelets/>},

  {path:"*", element: <NotFound/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
