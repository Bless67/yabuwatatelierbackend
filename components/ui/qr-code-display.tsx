"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {  FiDownload } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";

interface QRCodeDisplayProps {
  qrCode: string | null | undefined;
  productName: string;
  productId: number;
}

export default function QRCodeDisplay({
  qrCode,
  productName,
  productId,
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    if (!qrCode) return;

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `${productName}-qr-${productId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!qrCode) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#1a4d3e] hover:bg-[#f5f1e8]"
          title="View QR Code"
        >
          <BsQrCode size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <div className="flex flex-col items-center gap-4 py-4">
          <h2 className="text-lg font-semibold text-[#1a4d3e]">
            {productName} - QR Code
          </h2>
          <div className="relative w-64 h-64 bg-[#f5f1e8] rounded-lg p-4">
            <Image
              src={qrCode}
              alt={`QR Code for ${productName}`}
              fill
              className="object-contain p-2"
            />
          </div>
          <p className="text-sm text-[#2d5a52] text-center">
            Scan this QR code to view the product
          </p>
          <Button
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="w-full bg-[#b8a876] hover:bg-[#a89860] text-[#1a4d3e] font-semibold"
          >
            <FiDownload className="mr-2" size={16} />
            {isDownloading ? "Downloading..." : "Download QR Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
