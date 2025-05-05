"use client";

import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";


export default function PhoneLogin({
  onLogin,
}: {
  onLogin: (user: any) => void;
}) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirm, setConfirm] = useState<any>(null);

  const sendCode = async () => {
    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirm(confirmation);
      alert("Kod skickad via SMS!");
    } catch (err) {
      console.error(err);
      alert("Fel vid inloggning. Kontrollera numret.");
    }
  };

  const verifyCode = async () => {
    try {
      const result = await confirm.confirm(otp);
      onLogin(result.user);
    } catch (err) {
      console.error(err);
      alert("Fel kod.");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded mt-4">
      {!confirm ? (
        <>
          <label className="block mb-2 text-sm">Telefonnummer</label>
          <input
            type="tel"
            placeholder="+46701234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 rounded bg-gray-900 text-white w-full mb-3"
          />
          <button
            onClick={sendCode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Skicka kod
          </button>
        </>
      ) : (
        <>
          <label className="block mb-2 text-sm">SMS-kod</label>
          <input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 rounded bg-gray-900 text-white w-full mb-3"
          />
          <button
            onClick={verifyCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Verifiera kod
          </button>
        </>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
}
