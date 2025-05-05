// frontend/utils/api.ts

export async function registerUser(email: string, password: string) {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function setUserRole(uid: string, role: string) {
  const res = await fetch("http://localhost:5000/api/set-role", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, role }),
  });

  if (!res.ok) {
    throw new Error("Misslyckades att sätta rollen.");
  }

  return res.text();
}

export async function fetchBookings() {
  const res = await fetch("http://localhost:5000/api/bookings");
  return res.json();
}