"use client";

import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte.");
      return;
    }

    if (!agreeTerms) {
      setError("Du måste godkänna villkoren.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // ✅ Sätt namn i profilen
      await updateProfile(user, { displayName: name });

      // ✅ Spara extra data i Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        createdAt: new Date(),
      });

      alert("Användare skapad!");
      router.push("/login");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("En användare med denna e-post finns redan.");
      } else {
        setError("Något gick fel, försök igen.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Skapa Konto</h1>
        <form onSubmit={handleRegister}>
          <label className="block font-semibold">Namn</label>
          <input
            type="text"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block font-semibold">Telefonnummer</label>
          <input
            type="tel"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label className="block font-semibold">Email</label>
          <input
            type="email"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block font-semibold">Lösenord</label>
          <input
            type="password"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block font-semibold">Bekräfta lösenord</label>
          <input
            type="password"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="mr-2 w-4 h-4"
            />
            <label className="text-sm">
              Jag godkänner{" "}
              <a href="#" className="text-blue-400 underline">
                användarvillkoren
              </a>
            </label>
          </div>

          {error && <p className="text-red-400 text-sm mt-3 mb-2">{error}</p>}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-bold py-2 px-4 rounded-lg shadow-lg"
          >
            Skapa konto
          </button>

          <p className="mt-4 text-center text-sm">
            Har du redan ett konto?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Logga in här
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
