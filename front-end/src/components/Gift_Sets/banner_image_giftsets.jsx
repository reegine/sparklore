import banner from "../../assets/default/navbar_giftsets_bg.jpg";

const BannerHome = () => {
  return (
    <>
      {/* Hero Section with Text Overlay */}
      <div className="relative w-full h-screen max-h-[20rem] md:max-h-[37rem]">
        {/* Background Image - Using your imported image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>{" "}
          {/* Overlay for better text visibility */}
        </div>

        {/* Text Content - Centered */}
        <div className="relative z-10 h-full flex flex-col items-start justify-center text-center px-4 text-white ps-[7rem]">
          <h1 className="text-2xl md:text-5xl mb-4 tracking-wider">
          Meaningful Gifts, Beautifully Wrapped
          </h1>
          <p className="text-lg md:text-3xl max-w-2xl leading-relaxed">
          Celebrate special moments with curated jewelry sets—thoughtful, timeless, and made to be cherished.
          </p>

          {/* <button className="mt-8 px-8 py-3 bg-[#b87777] hover:bg-[#9a5f5f] text-white font-medium rounded-full transition-colors duration-300">
            Start Creating
          </button> */}
        </div>
      </div>
    </>
  );
};

export default BannerHome;
