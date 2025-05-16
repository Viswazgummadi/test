// src/features/gym/components/SetInputRow.tsx
import React from "react";
import type { GymSet } from "../../../types/Gym";
import "./SetInputRow.css";

interface SetInputRowProps {
  set: GymSet;
  index: number;
  onSetChange: (
    index: number,
    field: keyof Omit<GymSet, "id">,
    value: number
  ) => void;
  onDeleteSet: (index: number) => void;
}

const SetInputRow: React.FC<SetInputRowProps> = ({
  set,
  index,
  onSetChange,
  onDeleteSet,
}) => {
  return (
    <div className="set-input-row">
      <span>Set {index + 1}:</span>
      <input
        type="number"
        placeholder="Reps"
        value={set.reps === 0 && !set.weight ? "" : set.reps} // Show placeholder if 0 and no weight
        onChange={(e) =>
          onSetChange(index, "reps", parseInt(e.target.value) || 0)
        }
        min="0"
      />
      <span>x</span>
      <input
        type="number"
        placeholder="Weight (kg/lb)"
        value={set.weight === 0 && !set.reps ? "" : set.weight} // Show placeholder if 0 and no reps
        onChange={(e) =>
          onSetChange(index, "weight", parseFloat(e.target.value) || 0)
        }
        min="0"
        step="0.1"
      />
      <button onClick={() => onDeleteSet(index)} className="delete-set-btn">
        ✕
      </button>
    </div>
  );
};

export default SetInputRow;
