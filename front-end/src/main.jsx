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
import DetailPageCharm from './pages/detail_page_charm';
import Login from './pages/login.jsx';
import OTPCode from './pages/otpcode.jsx';

import NotFound from './pages/not_found.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Checkout from './pages/checkout.jsx'
import FinalCheckoutPage from './pages/final_checkout.jsx'
import TrackingOrder from './pages/tracking_order.jsx'
import NewArrival from './pages/new_arrival.jsx'
import Search from './pages/search.jsx'

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
  {path:"/products-charm/:productId", element: <DetailPageCharm />},
  {path:"/login", element: <Login />},
  {path:"/verify", element: <OTPCode />},
  {path:"/checkout", element: <Checkout />},
  {path:"/checkout/payment", element: <FinalCheckoutPage />},
  {path:"/track-order", element: <TrackingOrder />},
  {path:"/new-arrival", element: <NewArrival />},
  {path:"/search", element: <Search />},



  // {path:"/Bracelets", element: <Bracelets/>},

  {path:"*", element: <NotFound/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
