import React, { useRef, useState, useEffect } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  maxHeight = '85vh',
}) => {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const cleanupMouseRef = useRef<(() => void) | null>(null);

  // Clean up dangling window listeners if component unmounts during a drag
  useEffect(() => {
    return () => { cleanupMouseRef.current?.(); };
  }, []);

  // Reset drag offset whenever sheet opens
  useEffect(() => {
    if (open) setDragY(0);
  }, [open]);

  // --- Touch events ---
  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setDragY(delta); // only allow dragging down
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 120) {
      onClose();
    } else {
      setDragY(0); // snap back
    }
  };

  // --- Mouse events (for desktop / browser testing) ---
  const onMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
    setIsDragging(true);

    const onMouseMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY.current;
      if (delta > 0) setDragY(delta);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setDragY(prev => {
        if (prev > 120) { onClose(); return 0; }
        return 0;
      });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      cleanupMouseRef.current = null;
    };

    cleanupMouseRef.current = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl flex flex-col shadow-2xl overflow-hidden"
        style={{
          maxHeight,
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — only this area initiates drag */}
        <div
          className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        {children}
      </div>
    </div>
  );
};
