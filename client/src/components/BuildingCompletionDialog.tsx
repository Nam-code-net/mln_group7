import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BuildingCompletionMessage, BUILDING_SPECS } from '@/types/game';

export function BuildingCompletionDialog() {
  const { gameState } = useGame();
  const [open, setOpen] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState<BuildingCompletionMessage | null>(null);
  const [shownMessages, setShownMessages] = React.useState<Set<string>>(new Set());

  // Khi có thông điệp mới, hiển thị dialog (chỉ 1 lần cho mỗi message)
  React.useEffect(() => {
    if (gameState.completionMessages.length > 0) {
      const latestMessage = gameState.completionMessages[gameState.completionMessages.length - 1];
      
      // Chỉ hiển thị nếu chưa hiển thị message này
      if (!shownMessages.has(latestMessage.buildingId)) {
        setCurrentMessage(latestMessage);
        setOpen(true);
        setShownMessages(prev => new Set([...prev, latestMessage.buildingId]));
      }
    }
  }, [gameState.completionMessages, shownMessages]);

  if (!currentMessage) return null;

  const spec = BUILDING_SPECS[currentMessage.buildingType];
  const buildingIcon = currentMessage.buildingType === 'house' ? '🏠' : 
                       currentMessage.buildingType === 'factory' ? '🏭' : '🧠';

  // Parse markdown-like formatting
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('🏗️ **') && trimmedLine.endsWith('**')) {
        const content = trimmedLine.replace('🏗️ **', '').replace('**', '');
        return (
          <h3 key={idx} className="text-xl font-bold text-yellow-400 mb-2">
            {content}
          </h3>
        );
      }
      if (trimmedLine.startsWith('⚠️ **') || trimmedLine.startsWith('✅ **') || trimmedLine.startsWith('⚖️ **')) {
        const icon = trimmedLine.substring(0, 2);
        const content = trimmedLine.substring(3).replace('**', '').replace('**', '');
        return (
          <h4 key={idx} className={`text-lg font-bold mt-4 mb-2 ${
            icon === '⚠️' ? 'text-red-400' : icon === '✅' ? 'text-green-400' : 'text-blue-400'
          }`}>
            {icon} {content}
          </h4>
        );
      }
      if (trimmedLine.startsWith('📚 **') || trimmedLine.startsWith('💡 **')) {
        const icon = trimmedLine.substring(0, 2);
        const content = trimmedLine.substring(4).replace('**', '').replace('**', '');
        return (
          <p key={idx} className={`text-sm mt-2 ${
            icon === '📚' ? 'text-purple-300' : 'text-cyan-300'
          }`}>
            <strong>{icon} {content}</strong>
          </p>
        );
      }
      if (trimmedLine === '') {
        return <br key={idx} />;
      }
      return (
        <p key={idx} className="text-sm text-slate-300 mt-1">
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-yellow-500 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-yellow-400">
            <span className="text-4xl">{buildingIcon}</span>
            <div>
              <div className="font-bold">{spec.name} Hoàn Thành!</div>
              <div className="text-sm font-normal text-slate-400">
                Lượt {currentMessage.turn} | 👷 {currentMessage.workerStats.humanWorkers} | 🤖 {currentMessage.workerStats.aiWorkers}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Phân tích theo lý luận Mác về lao động và giá trị
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-2 p-4 bg-slate-900 bg-opacity-50 rounded-lg border border-slate-700">
          {formatMessage(currentMessage.message)}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => setOpen(false)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
          >
            Đã hiểu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

