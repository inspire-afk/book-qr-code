import QRCode from "qrcode"

export const generateQRCode = async (path: string) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://hunarho-book.vercel.app"
      : "http://localhost:3000"
  const url = `${baseUrl}${path}`
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 1000,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
    return qrDataUrl
  } catch (err) {
    console.error("QR Code generation error:", err)
    return ""
  }
}
