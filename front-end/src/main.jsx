import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/home.jsx'
import Charmbar from './pages/charmbar.jsx'
import GiftSets from './pages/gift_sets.jsx'
import Anklets from './pages/anklets.jsx'
import Rings from './pages/rings.jsx'
import Earrings from './pages/earrings.jsx'
import Bracelets from './pages/bracelets.jsx'
import Necklaces from './pages/necklaces.jsx'
import DetailPage from './pages/detail_page';


import NotFound from './pages/not_found.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {path:"/", element: <Home/>},
  {path:"/charmbar", element: <Charmbar/>},
  {path:"/giftsets", element: <GiftSets/>},
  {path:"/anklets", element: <Anklets/>},
  {path:"/rings", element: <Rings/>},
  {path:"/earrings", element: <Earrings/>},
  {path:"/bracelets", element: <Bracelets/>},
  {path:"/necklaces", element: <Necklaces/>},
  {path:"/products/:productId", element: <DetailPage />},
  // {path:"/Bracelets", element: <Bracelets/>},

  {path:"*", element: <NotFound/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
