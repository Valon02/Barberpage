"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getIdTokenResult,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdTokenResult(user);
        const role = token.claims.role;

        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdTokenResult(cred.user);
      const role = token.claims.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError("Fel inloggningsuppgifter. Försök igen.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">Logga In</h1>
        <form onSubmit={handleLogin}>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block font-semibold">Lösenord</label>
          <input
            type="password"
            className="block w-full mt-1 mb-3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-400 text-sm mt-2 mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-bold py-2 px-4 rounded-lg shadow-lg"
          >
            Logga In
          </button>

          <p className="mt-4 text-center text-sm">
            Har du inget konto?{" "}
            <span
              className="text-blue-400 underline cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Skapa ett här
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
