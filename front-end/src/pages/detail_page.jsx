import { useParams } from 'react-router-dom';
import Footer from '../components/footer.jsx';
import NavBar from '../components/Home/navbar.jsx';
import ProductDetail from '../components/ProductDetail/product_detail.jsx';
import InfoAccordion from '../components/ProductDetail/dropdown.jsx';
import Recommend from '../components/ProductDetail/recommend.jsx';
import Features from '../components/Home/home_pt4.jsx'
import VideoCarousel from '../components/Home/home_pt5.jsx'
import Reviews from '../components/Home/home_pt6.jsx'
import JewelryGallery from '../components/Home/home_pt7.jsx'

export default function DetailPage() {
  const { productId } = useParams();
  
  return (
    <>
        <NavBar/>
        <ProductDetail productId={productId} />
        <InfoAccordion/>
        <Recommend/>
        <Features/>
        <VideoCarousel/>
        <Reviews/>
        <JewelryGallery/>
        <Footer />
    </>
  );
}