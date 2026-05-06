"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Lock } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  loading?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  loading = false,
}: DeleteConfirmationModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    // The password is indoscotsglobalschool@123
    if (password === "indoscotsglobalschool@123") {
      onConfirm();
      setPassword("");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md glass-card p-8 space-y-6 pointer-events-auto shadow-2xl relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-red-500">{title}</h3>
                  <p className="text-muted-foreground text-sm">
                    You are about to delete <span className="font-bold text-foreground">"{itemName}"</span>. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    Enter Admin Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to confirm..."
                    className={`w-full rounded-xl border p-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                      error
                        ? "border-red-500 bg-red-50 ring-red-500/20"
                        : "border-border bg-secondary/50 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                  />
                  {error && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      Incorrect password. Please try again.
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading || !password}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
