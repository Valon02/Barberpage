"use client";
import { useState } from "react";
import { setUserRole } from "@/utils/api";

export default function AdminRoleSetter() {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("admin");
  const [status, setStatus] = useState("");

  const handleSetRole = async () => {
    try {
      await setUserRole(uid, role);
      setStatus("✅ Rollen uppdaterad!");
    } catch (err) {
      setStatus("❌ Misslyckades att sätta rollen.");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Sätt roll för användare</h1>
      <input
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="Användarens UID"
        className="p-2 rounded bg-gray-800 text-white mb-2 block w-full"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white mb-4 block w-full"
      >
        <option value="admin">Admin</option>
        <option value="kund">Kund</option>
        <option value="frisör">Frisör</option>
      </select>
      <button
        onClick={handleSetRole}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Uppdatera roll
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
