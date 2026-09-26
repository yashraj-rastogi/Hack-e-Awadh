import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onError?: (err: string) => void;
  active: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, onError, active }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'finbuddy-qr-reader';
  const isMountedRef = useRef(true);
  const lastScannedTime = useRef<number>(0);

  useEffect(() => {
    isMountedRef.current = true;

    async function startScanner() {
      if (!active) return;

      try {
        setErrorMessage(null);
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(containerId);
        }

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setHasPermission(false);
          setErrorMessage('No camera detected on this device.');
          onError?.('No camera detected on this device.');
          return;
        }

        setHasPermission(true);

        const config = {
          fps: 15,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.333,
        };

        await scannerRef.current.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            const now = Date.now();
            if (now - lastScannedTime.current < 1500) return;
            lastScannedTime.current = now;

            soundFX.playScanBeep();
            onScan(decodedText);
          },
          () => {}
        );

        if (isMountedRef.current) {
          setIsScanning(true);
        }
      } catch (err: unknown) {
        console.warn('Camera start error:', err);
        const msg = err instanceof Error ? err.message : 'Camera access was blocked or is unavailable.';
        setHasPermission(false);
        setErrorMessage(msg);
        onError?.(msg);
      }
    }

    startScanner();

    return () => {
      isMountedRef.current = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch((e) => console.warn('Scanner stop error:', e));
      }
    };
  }, [active, onScan, onError]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-[#E0E6ED] shadow-[0_2px_8px_rgba(0,46,110,0.08)]">
      {/* HTML5 QR Camera Container */}
      <div id={containerId} className="w-full min-h-[250px] max-h-[340px] object-cover" />

      {/* Paytm-Inspired Cyan Viewfinder Overlay (Section 14: #00BAF2) */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          <div className="relative w-64 h-40 rounded-xl border-2 border-[#00BAF2] shadow-[0_0_20px_rgba(0,186,242,0.35)] bg-[#00BAF2]/10 overflow-hidden">
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00BAF2]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00BAF2]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00BAF2]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00BAF2]" />

            {/* Moving Paytm Blue Laser Scan Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00BAF2] to-transparent animate-paytm-scan shadow-[0_0_8px_#00BAF2]" />
          </div>

          <div className="mt-4 px-3.5 py-1.5 rounded-full bg-[#002E6E]/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <Camera className="w-3.5 h-3.5 text-[#00BAF2] animate-pulse" />
            <span>Point camera at product barcode</span>
          </div>
        </div>
      )}

      {/* Camera Error / Permission Fallback */}
      {hasPermission === false && (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[240px] bg-white">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-[#FD5C63] flex items-center justify-center mb-3 border border-rose-100">
            <CameraOff className="w-6 h-6" />
          </div>
          <h3 className="text-[#002E6E] font-bold text-sm mb-1">Camera Permission Required</h3>
          <p className="text-[#6B7A90] text-xs max-w-xs mb-4">
            {errorMessage || 'Camera access was blocked. Please allow camera permissions to scan barcodes.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-[#002E6E] hover:bg-[#001D47] text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Camera Access</span>
          </button>
        </div>
      )}
    </div>
  );
};
