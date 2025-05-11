"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface Slot {
  id: string;
  time: string;
}

interface CalendarPickerProps {
  singleDate: string;
  startTime: string;
  endTime: string;
  barber: string;
  copyFromDate: string;
  copyToDate: string;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onBarberChange: (barber: string) => void;
  onCreateSmartSlots: () => void;
  onCopyChangeFrom: (date: string) => void;
  onCopyChangeTo: (date: string) => void;
  onCopySlots: () => void;
  existingSlots?: Slot[];
  onDeleteSlot?: (slotId: string) => void;
}

export default function CalendarPicker({
  singleDate,
  startTime,
  endTime,
  barber,
  copyFromDate,
  copyToDate,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onBarberChange,
  onCreateSmartSlots,
  onCopyChangeFrom,
  onCopyChangeTo,
  onCopySlots,
  existingSlots = [],
  onDeleteSlot,
}: CalendarPickerProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      {/* Smart tid-skapande */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          value={singleDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="bg-gray-700 p-2 rounded text-white border border-gray-600"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
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
      </div>

      <div className="text-right">
        <Button
          onClick={onCreateSmartSlots}
          className="bg-green-600 hover:bg-green-700"
        >
          Skapa tider för valt datum
        </Button>
      </div>

      {/* Existerande tider för valt datum */}
      {existingSlots.length > 0 && (
        <div className="bg-gray-900 p-4 rounded mt-4 space-y-2">
          <h3 className="text-sm text-gray-400 mb-2">
            Utlagda tider för {singleDate}:
          </h3>
          <ul className="space-y-1 max-h-48 overflow-auto">
            {existingSlots
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded"
                >
                  <span>{slot.time}</span>
                  {onDeleteSlot && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteSlot(slot.id)}
                    >
                      Ta bort
                    </Button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Kopiera tider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
        <Button
          onClick={onCopySlots}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Kopiera tider
        </Button>
      </div>
    </div>
  );
}
