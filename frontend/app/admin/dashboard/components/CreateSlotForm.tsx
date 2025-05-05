"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onCreate: (slot: { date: string; time: string; barber: string }) => void;
}

export default function CreateSlotForm({ onCreate }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [barber, setBarber] = useState("fadezbydrizz");

  const handleSubmit = () => {
    if (!date || !time) return;
    onCreate({ date, time, barber });
    setDate("");
    setTime("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-gray-800 p-2 rounded text-white border border-gray-700"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="bg-gray-800 p-2 rounded text-white border border-gray-700"
      />
      <select
        value={barber}
        onChange={(e) => setBarber(e.target.value)}
        className="bg-gray-800 p-2 rounded text-white border border-gray-700"
      >
        <option value="fadezbydrizz">FadezbyDrizz</option>
        <option value="blizzfades">Blizz Fades</option>
      </select>
      <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
        Lägg till tid
      </Button>
    </div>
  );
}
