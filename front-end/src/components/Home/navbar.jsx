import { Link, NavLink } from "react-router-dom";
import { Search, User, ShoppingBag, Menu } from "lucide-react";
import logo from "../../assets/logo/sparklore_logo.png";
import { useState,useEffect } from "react";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const navItems = [
    { name: "Charm Bar", path: "/charmbar" },
    { name: "Necklaces", path: "/necklaces" },
    { name: "Bracelets", path: "/bracelets" },
    { name: "Earrings", path: "/earrings" },
    { name: "Rings", path: "/rings" },
    { name: "Anklets", path: "/anklets" },
    { name: "Gift Sets", path: "/giftsets" },
  ];

  useEffect(() => {
    // Set isInitialLoad to false after the component mounts
    setIsInitialLoad(false);
  }, []);

  return (
    <div className="bg-[#fdfaf3] shadow-md">
      {/* Desktop Layout (unchanged from your original) */}
      <div className="hidden md:block">
        <nav className="px-[9rem] pb-[2rem] pt-[1rem] flex items-center justify-between ">
          {/* Left Section - Language Toggle */}
          <div className="flex items-center">
            <button className="flex items-center border rounded-full text-xs font-medium">
              <span className="px-3 py-1 bg-white rounded-l-full">EN</span>
              <span className="px-3 py-1 bg-[#e6d4a5] rounded-r-full">ID</span>
            </button>
          </div>

          {/* Center Section - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/">
              <img src={logo} alt="Sparklore Logo" className="h-[7rem] object-contain" />
            </Link>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center gap-6 text-gray-700">
            <Search className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
            <ShoppingBag className="w-5 h-5 cursor-pointer" />
          </div>
        </nav>

        {/* Bottom Navigation Links */}
        <div className="px-6 pb-[1rem] pt-[0.1rem]">
            <ul className="flex justify-center md:gap-6 lg:gap-30 uppercase text-xs md:text-lg font-semibold tracking-wider text-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `pb-2 hover:text-[#b87777] hover:border-b hover:border-[#b87777] transition-colors duration-300 ${
                      isInitialLoad || !isActive ? "text-gray-800" : "text-[#b87777] font-bold border-b-2 border-[#b87777]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <nav className="px-4 py-4 flex items-center justify-between">
          {/* Logo - Left side */}
          <Link to="/">
            <img 
              src={logo} 
              alt="Sparklore Logo" 
              className="h-12 object-contain" 
            />
          </Link>

          {/* Icons - Right side */}
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
            <ShoppingBag className="w-5 h-5 cursor-pointer" />
            <Menu 
              className="w-6 h-6 cursor-pointer" 
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </nav>
      </div>

      {/* Mobile Drawer (appears from right) */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-500/30">
          <div 
            className="absolute right-0 h-full w-4/5 max-w-xs bg-[#fdfaf3] p-4 shadow-lg"
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <div className="flex justify-between items-center mb-8">
              <button className="flex items-center border rounded-full text-xs font-medium">
                <span className="px-3 py-1 bg-white rounded-l-full">EN</span>
                <span className="px-3 py-1 bg-[#e6d4a5] rounded-r-full">ID</span>
              </button>
              <button 
                className="text-gray-700 text-2xl"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <ul className="space-y-4 uppercase text-base font-semibold">
              {navItems.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block py-2 hover:text-[#b87777] ${
                        isActive ? "text-[#b87777]" : "text-gray-800"
                      }`
                    }
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default NavBar;