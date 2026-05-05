"use client";

import { useState } from "react";
import { QrCode, Download, Loader2 } from "lucide-react";
import { generateQRCode } from "@/lib/qr";

interface GenerateQRButtonProps {
  path: string;
  fileName: string;
}

export const GenerateQRButton = ({ path, fileName }: GenerateQRButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const qrDataUrl = await generateQRCode(path);
      if (qrDataUrl) {
        const link = document.createElement("a");
        link.href = qrDataUrl;
        link.download = `QR-${fileName.replace(/\s+/g, "-").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Failed to generate/download QR", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:border-border/50 transition-all font-bold text-sm"
      title="Generate & Download QR Code"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <QrCode className="h-4 w-4" />
      )}
      Download QR
    </button>
  );
};
