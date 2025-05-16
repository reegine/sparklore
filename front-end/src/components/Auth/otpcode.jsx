// src/pages/CodeVerificationPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CodeVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59 * 60); // 59 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value.slice(0, 1);
    setCode(newCode);

    // Auto-focus next input
    if (e.target.value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      // handle verification logic
      alert(`Verifying code: ${fullCode}`);
      // navigate("/home"); // after verification
    }
  };

  const formatTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf9f2]">
      <div className="bg-[#fdf9f2] border border-[#f3e6c7] rounded-md px-10 py-8 text-center shadow-sm w-full max-w-md">
        <h2 className="text-lg md:text-xl font-medium text-[#2d2d2d] tracking-wide mb-2">
          We’ve sent you a code!
        </h2>
        <p className="text-sm text-gray-500 mb-6">Please check your email!</p>

        <div className="flex justify-center gap-4 mb-4">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              className="w-12 h-12 border border-gray-400 rounded-md text-center text-lg outline-none"
              value={digit}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        </div>

        <p className="text-sm text-[#2d2d2d] mb-6">
          Code expires in <span className="font-medium">{formatTime()}</span>
        </p>

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-[#e8d49c] text-[#2d2d2d] font-medium rounded hover:opacity-90 transition mb-3"
        >
          Verify
        </button>

        <button
          onClick={() => {
            alert("Code sent again!");
            setTimer(59 * 60);
          }}
          className="w-full py-3 border border-[#e8d49c] text-[#2d2d2d] font-medium rounded hover:bg-[#f7f1df] transition"
        >
          Send Again
        </button>
      </div>
    </div>
  );
};

export default CodeVerificationPage;
