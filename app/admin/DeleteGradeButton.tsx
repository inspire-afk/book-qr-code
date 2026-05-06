"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteGrade } from "./actions";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

interface DeleteGradeButtonProps {
  gradeId: string;
  gradeName: string;
}

export const DeleteGradeButton = ({ gradeId, gradeName }: DeleteGradeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteGrade(gradeId);
      setIsOpen(false);
    } catch (err) {
      alert("Error deleting grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 p-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
      >
        <Trash2 className="h-5 w-5" />
        Delete
      </button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Grade"
        itemName={gradeName}
        loading={loading}
      />
    </>
  );
};
