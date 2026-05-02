import QRCode from "qrcode";

export async function generateQRCode(productId: number): Promise<string> {
  try {
    // Generate QR code that points to the product page
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL }`;

    const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: "#1a4d3e",
        light: "#f5f1e8",
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}
