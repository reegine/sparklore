import Footer from '../components/footer.jsx'
import NavBar_GiftSets from '../components/Gift_Sets/navbar_giftsets.jsx'
import MovingBanner from '../components/moving_banner.jsx'
import BannerHome from '../components/Gift_Sets/banner_image_giftsets.jsx'
import HomePart1 from '../components/Gift_Sets/giftset_pt1.jsx'
import ValentinesPromo from '../components/Gift_Sets/giftset_pt2.jsx'
import Features from '../components/Home/home_pt4.jsx'
import VideoCarousel from '../components/Home/home_pt5.jsx'
import Reviews from '../components/Home/home_pt6.jsx'
import JewelryGallery from '../components/Home/home_pt7.jsx'

export default function GiftSets() {
    return (
      <>
          <NavBar_GiftSets/>
          <MovingBanner />
          <BannerHome/>
          <HomePart1/>
          <ValentinesPromo/>
          <Features/>
          <VideoCarousel/>
          <Reviews/>
          <JewelryGallery/>
          <Footer />
      </>
    )
  }