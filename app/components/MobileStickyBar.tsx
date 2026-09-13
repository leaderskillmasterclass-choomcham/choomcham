import { Zap, MessageSquare, PhoneCall } from "lucide-react";

interface MobileStickyBarProps {
  onStartQuiz: () => void;
  onContact: () => void;
}

export function MobileStickyBar({ onStartQuiz, onContact }: MobileStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/90 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(64,68,165,0.08)] md:hidden">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          onClick={onStartQuiz}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full text-sm shadow-md active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>เช็ก Zombie องค์กร</span>
        </button>

        <button
          onClick={onContact}
          className="flex items-center justify-center gap-1.5 py-3 px-4 bg-purple-50 text-purple-900 border border-purple-200 font-medium rounded-full text-sm hover:bg-purple-100 active:scale-95 transition-all"
        >
          <PhoneCall className="w-4 h-4 text-purple-600" />
          <span>ปรึกษาทีม</span>
        </button>
      </div>
    </div>
  );
}
