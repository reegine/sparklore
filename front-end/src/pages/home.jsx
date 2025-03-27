import NavBar from '../components/navbar.jsx'
import MovingBanner from '../components/moving_banner.jsx'
import BannerHome from '../components/banner_image_home.jsx'
import HomePart1 from '../components/home_pt1.jsx'
import HomePart2 from '../components/home_pt2.jsx'
import HomePart3 from '../components/home_pt3.jsx'
import Features from '../components/home_pt4.jsx'
import VideoCarousel from '../components/home_pt5.jsx'
import Reviews from '../components/home_pt6.jsx'
import JewelryGallery from '../components/home_pt7.jsx'
import Footer from '../components/footer.jsx'


export default function Home() {
  return (
    <>
        <NavBar />
        <MovingBanner />
        <BannerHome/>
        <HomePart1/>
        <HomePart2/>
        <HomePart3/>
        <Features/>
        <VideoCarousel/>
        <Reviews/>
        <JewelryGallery/>
        <Footer />
    </>
  )
}