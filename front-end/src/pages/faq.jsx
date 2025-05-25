import FaqRefund from '../components/faq.jsx';
import Footer from '../components/footer.jsx'
import NavBar from '../components/Home/navbar.jsx'
import ScrollToTop from '../components/ProductDetail/ScrollToTop.jsx';


export default function FaqRefundPage() {
    return (
      <>
        <ScrollToTop />
        <NavBar/>
        <FaqRefund/>
        <Footer />
      </>
    )
  }