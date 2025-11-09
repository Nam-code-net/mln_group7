import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const PLAYER_COLORS = [
  { name: 'Xanh dương', value: 'bg-blue-500', border: 'border-blue-400' },
  { name: 'Đỏ', value: 'bg-red-500', border: 'border-red-400' },
  { name: 'Xanh lá', value: 'bg-green-500', border: 'border-green-400' },
  { name: 'Vàng', value: 'bg-yellow-500', border: 'border-yellow-400' },
  { name: 'Tím', value: 'bg-purple-500', border: 'border-purple-400' },
  { name: 'Cam', value: 'bg-orange-500', border: 'border-orange-400' },
  { name: 'Hồng', value: 'bg-pink-500', border: 'border-pink-400' },
  { name: 'Xanh ngọc', value: 'bg-cyan-500', border: 'border-cyan-400' },
  { name: 'Xanh đậm', value: 'bg-indigo-500', border: 'border-indigo-400' },
  { name: 'Nâu', value: 'bg-amber-500', border: 'border-amber-400' },
  { name: 'Xanh lá đậm', value: 'bg-emerald-500', border: 'border-emerald-400' },
  { name: 'Đỏ đậm', value: 'bg-rose-500', border: 'border-rose-400' },
  { name: 'Xanh nhạt', value: 'bg-sky-500', border: 'border-sky-400' },
  { name: 'Vàng đậm', value: 'bg-lime-500', border: 'border-lime-400' },
  { name: 'Tím đậm', value: 'bg-violet-500', border: 'border-violet-400' },
];

export function JoinGame() {
  const { gameState, addPlayer } = useGame();
  const [open, setOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].value);

  const handleJoin = () => {
    if (playerName.trim() && gameState.players.length < 15) {
      // Check if name already exists
      const nameExists = gameState.players.some(p => p.name.toLowerCase() === playerName.trim().toLowerCase());
      if (nameExists) {
        alert('Tên này đã được sử dụng! Vui lòng chọn tên khác.');
        return;
      }

      addPlayer(playerName.trim(), selectedColor);
      setPlayerName('');
      setOpen(false);
      
      // Auto-select next available color
      const usedColors = gameState.players.map(p => p.color);
      const nextColor = PLAYER_COLORS.find(c => !usedColors.includes(c.value)) || PLAYER_COLORS[0];
      setSelectedColor(nextColor.value);
    }
  };

  const availableColors = PLAYER_COLORS.filter(c => !gameState.players.some(p => p.color === c.value));

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
        disabled={gameState.players.length >= 15}
      >
        ➕ Tham gia game ({gameState.players.length}/15)
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">🎮 Tham gia game</DialogTitle>
            <DialogDescription className="text-slate-300">
              Nhập tên của bạn để tham gia vào game
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Tên của bạn
              </label>
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoin();
                  }
                }}
                placeholder="Nhập tên của bạn..."
                className="bg-slate-700 border-slate-600 text-white"
                maxLength={20}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Chọn màu của bạn
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                {PLAYER_COLORS.map((color) => {
                  const isUsed = gameState.players.some(p => p.color === color.value);
                  const isSelected = selectedColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() => !isUsed && setSelectedColor(color.value)}
                      disabled={isUsed}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${color.border} ring-2 ring-white`
                          : 'border-slate-600'
                      } ${isUsed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
                      title={isUsed ? 'Đã được sử dụng' : color.name}
                    >
                      <div className={`w-full h-6 rounded ${color.value}`} />
                      <div className="text-[10px] text-slate-400 mt-1 truncate">{color.name}</div>
                    </button>
                  );
                })}
              </div>
              {availableColors.length === 0 && (
                <p className="text-xs text-red-400 mt-2">⚠️ Tất cả màu đã được sử dụng</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleJoin}
                disabled={!playerName.trim() || gameState.players.length >= 15 || availableColors.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                ✅ Tham gia
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Hủy
              </Button>
            </div>

            {gameState.players.length >= 15 && (
              <p className="text-xs text-red-400 text-center">
                ⚠️ Đã đạt tối đa 15 người chơi
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

