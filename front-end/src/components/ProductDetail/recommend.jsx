import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import product5 from "../../assets/default/charmbar_product5.png";
import product6 from "../../assets/default/charmbar_product6.png";
import product7 from "../../assets/default/charmbar_product7.png";
import product8 from "../../assets/default/charmbar_product8.png";

// Sample recommendations
const recommend = [
    { img: product5, text: "Beautiful Bracelet", price: 19999 },
    { img: product6, text: "Trendy Bracelet", price: 22999 },
    { img: product8, text: "Unique Bracelet", price: 25999 },
    { img: product7, text: "Fashionable Bracelet", price: 17999 },
    { img: product8, text: "Unique Bracelet", price: 25999 },
];

const Recommend = ({ setBaseImage }) => {
    const recommendRef = useRef(null);

    const scroll = (direction) => {
        const scrollByAmount = 260; // Adjust scroll amount as needed
        if (recommendRef.current) {
            recommendRef.current.scrollBy({
                left: direction === "left" ? -scrollByAmount : scrollByAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="bg-[#fdf9f0] ">
            <div className="max-w-7xl mx-auto py-[5rem]">
                <h2 className="text-2xl font-serif font-semibold mb-[2rem]">YOU MIGHT ALSO LIKE...</h2>
                <div className="relative mb-10">
                    <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2">
                        <ChevronLeft size={28} />
                    </button>
                    <div ref={recommendRef} className="flex gap-4 overflow-x-auto ml-12 mr-12 pb-2 no-scrollbar">
                        {recommend.map((item, i) => (
                            <div key={i} onClick={() => setBaseImage(item.img)} className="relative group min-w-[15rem] cursor-pointer hover:scale-105 transition-transform">
                                <img src={item.img} alt={item.text} className="w-[15rem] h-[15rem] object-cover shadow-md rounded" />
                                <div className="absolute inset-0 bg-[#f5f5dc] opacity-0 group-hover:opacity-80 flex flex-col justify-center items-center transition-opacity">
                                    <span className="text-lg font-bold">{item.text}</span>
                                    <span className="text-sm">Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2">
                        <ChevronRight size={28} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Recommend;