import banner from "../assets/default/banner_home.jpeg";

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
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
            Jewellery That Tells Your Story
          </h1>
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed">
            Create, customize, and cherish—crafted just for you. SparkLore
            brings your unique style to life, one charm at a time.
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
