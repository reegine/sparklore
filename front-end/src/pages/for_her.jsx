import Footer from '../components/footer.jsx'
import NavBar_ForHer from '../components/ForHer/navbar_forher.jsx'
import ProductGrid from '../components/NewArrival/product_filter.jsx'
import ScrollToTop from '../components/ProductDetail/ScrollToTop.jsx';


export default function ForHim() {
    return (
      <>
        <ScrollToTop />
        <NavBar_ForHer/>
        <ProductGrid/>
        <Footer />
      </>
    )
  }