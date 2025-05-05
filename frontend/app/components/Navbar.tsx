"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdTokenResult(user);
        setUser({ ...user, role: token.claims.role });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <img
          src="/profilepic.png"
          alt="FadezByDrizz Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
        FadezByDrizz
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/booking" className="hover:text-purple-400">
          Boka
        </Link>
        <Link href="/#behandlingar" className="hover:text-purple-400">
          Behandlingar
        </Link>
        <Link href="/#kontakt" className="hover:text-purple-400">
          Kontakt
        </Link>

        {user?.role === "admin" && (
          <Link href="/admin/dashboard" className="hover:text-green-400">
            Admin
          </Link>
        )}

        {!user ? (
          <>
            <Link href="/login" className="hover:text-blue-400">
              Logga in
            </Link>
            <Link href="/register" className="hover:text-blue-400">
              Skapa konto
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
          >
            Logga ut
          </button>
        )}
      </div>
    </nav>
  );
}
