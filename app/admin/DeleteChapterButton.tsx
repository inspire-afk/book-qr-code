"use client";

import { Trash2 } from "lucide-react";
import { deleteChapter } from "./actions";
import { useState } from "react";

export const DeleteChapterButton = ({ chapterId, gradeId }: { chapterId: string; gradeId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this chapter? This will also delete the associated quiz.")) return;
    setLoading(true);
    try {
      await deleteChapter(chapterId, gradeId);
    } catch (err) {
      alert("Error deleting chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
};
