"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface CalendarPickerProps {
  singleDate: string;
  singleTime: string;
  barber: string;
  copyFromDate: string;
  copyToDate: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onBarberChange: (barber: string) => void;
  onAddSlot: () => void;
  onCopyChangeFrom: (date: string) => void;
  onCopyChangeTo: (date: string) => void;
  onCopySlots: () => void;
  onCreateBulk: () => void;
}

export default function CalendarPicker({
  singleDate,
  singleTime,
  barber,
  copyFromDate,
  copyToDate,
  onDateChange,
  onTimeChange,
  onBarberChange,
  onAddSlot,
  onCopyChangeFrom,
  onCopyChangeTo,
  onCopySlots,
  onCreateBulk,
}: CalendarPickerProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          value={singleDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <input
          type="time"
          value={singleTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <select
          value={barber}
          onChange={(e) => onBarberChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        >
          <option value="fadezbydrizz">FadezbyDrizz</option>
          <option value="blizzfades">Blizz Fades</option>
        </select>
        <Button onClick={onAddSlot} className="bg-blue-600 hover:bg-blue-700">
          Lägg till tid
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={copyFromDate}
          onChange={(e) => onCopyChangeFrom(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <input
          type="date"
          value={copyToDate}
          onChange={(e) => onCopyChangeTo(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <Button onClick={onCopySlots} className="bg-purple-600 hover:bg-purple-700">
          Kopiera tider
        </Button>
      </div>

      <div className="text-right">
        <Button onClick={onCreateBulk} className="bg-green-600 hover:bg-green-700 text-white">
          Skapa tider 09–17 (Mån–Lör)
        </Button>
      </div>
    </div>
  );
}
