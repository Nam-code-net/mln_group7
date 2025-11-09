import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

export function PlayerSetup() {
  const { gameState, addPlayer, startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0].value);

  const handleAddPlayer = () => {
    if (playerName.trim() && gameState.players.length < 15) {
      addPlayer(playerName.trim(), selectedColor);
      setPlayerName('');
      // Auto-select next available color
      const usedColors = gameState.players.map(p => p.color);
      const nextColor = PLAYER_COLORS.find(c => !usedColors.includes(c.value)) || PLAYER_COLORS[0];
      setSelectedColor(nextColor.value);
    }
  };

  const handleStartGame = () => {
    // Cho phép bắt đầu game với bất kỳ số lượng người chơi nào (kể cả 0)
    startGame();
  };

  const handleRemovePlayer = (playerId: string) => {
    // This would need to be added to GameContext
    // For now, we'll just show the UI
  };

  if (gameState.gamePhase !== 'setup') {
    return null;
  }

  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      <h2 className="text-2xl font-bold mb-4">👥 Thiết lập người chơi</h2>
      
      <div className="space-y-4">
        {/* Add Player Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Tên người chơi
            </label>
            <Input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddPlayer();
                }
              }}
              placeholder="Nhập tên người chơi..."
              className="bg-slate-700 border-slate-600 text-white"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Chọn màu
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
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
          </div>

          <Button
            onClick={handleAddPlayer}
            disabled={!playerName.trim() || gameState.players.length >= 15}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            ➕ Thêm người chơi ({gameState.players.length}/15)
          </Button>
        </div>

        {/* Players List */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          {gameState.players.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-3">Danh sách người chơi ({gameState.players.length}):</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gameState.players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      gameState.currentPlayerId === player.id
                        ? 'border-yellow-400 bg-yellow-900 bg-opacity-20'
                        : 'border-slate-600 bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${player.color}`} />
                      <div>
                        <div className="font-bold text-white">
                          {index + 1}. {player.name}
                          {gameState.currentPlayerId === player.id && (
                            <span className="ml-2 text-yellow-400">👑</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">Điểm: {player.score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            onClick={handleStartGame}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            🎮 Bắt đầu game {gameState.players.length > 0 && `(${gameState.players.length} người chơi)`}
          </Button>

          {gameState.players.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-2">
              💡 Bạn có thể bắt đầu game ngay hoặc thêm người chơi trước
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

