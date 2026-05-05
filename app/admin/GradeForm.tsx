"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createGrade } from "./actions";

export const GradeForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createGrade(formData);
      setIsOpen(false);
    } catch (err) {
      alert("Error creating grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
      >
        <Plus className="h-5 w-5" />
        New Grade
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center overflow-y-auto p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-8 relative my-auto animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Create New Grade</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Grade Number</label>
                <input
                  name="grade"
                  type="number"
                  required
                  placeholder="e.g. 8"
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Science & Technology"
                  className="w-full bg-white border border-border rounded-xl px-4 py-3 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all shadow-sm"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all mt-4"
              >
                {loading ? "Creating..." : "Create Grade"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
