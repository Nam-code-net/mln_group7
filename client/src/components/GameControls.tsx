import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BUILDING_SPECS, WORKER_SPECS, ResourceType } from '@/types/game';

export function GameControls() {
  const { gameState, addWorker, createBuilding, nextTurn, startGame, resetGame } = useGame();

  const selectedTileData = gameState.selectedTile
    ? gameState.board[gameState.selectedTile.y]?.[gameState.selectedTile.x] ?? null
    : null;
  const selectedTileIsBuildable = Boolean(selectedTileData && selectedTileData.type === 'empty');
  // Chi phí thuê công nhân = 0 (miễn phí), chi phí thực tế tính khi gán vào công trình
  const canAffordHuman = true; // Luôn có thể thuê công nhân (miễn phí)
  const canAffordAI = true; // Luôn có thể thuê AI (miễn phí)

  const handleAddHumanWorker = () => {
    // Find an available tile (empty or resource, but not building)
    for (let y = 0; y < gameState.board.length; y++) {
      for (let x = 0; x < gameState.board[y].length; x++) {
        const tile = gameState.board[y][x];
        if ((tile.type === 'empty' || tile.type === 'resource') && 
            !gameState.workers.some((w) => w.x === x && w.y === y)) {
          addWorker('human', x, y);
          return;
        }
      }
    }
  };

  const handleAddAIWorker = () => {
    // Find an available tile (empty or resource, but not building)
    for (let y = 0; y < gameState.board.length; y++) {
      for (let x = 0; x < gameState.board[y].length; x++) {
        const tile = gameState.board[y][x];
        if ((tile.type === 'empty' || tile.type === 'resource') && 
            !gameState.workers.some((w) => w.x === x && w.y === y)) {
          addWorker('ai', x, y);
          return;
        }
      }
    }
  };

  const handleCreateBuilding = (buildingType: 'house' | 'factory' | 'ai_center') => {
    if (gameState.selectedTile) {
      createBuilding(buildingType, gameState.selectedTile.x, gameState.selectedTile.y);
    }
  };

  const humanWorkerSpec = WORKER_SPECS.human;
  const aiWorkerSpec = WORKER_SPECS.ai;

  return (
    <div className="flex flex-col gap-4">
      {/* Game Phase */}
      <Card className="p-4 bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500 text-white">
        <h3 className="font-bold mb-3 text-lg">⏱️ Trò chơi</h3>
        {gameState.gamePhase === 'setup' && (
          <Button onClick={startGame} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
            🎮 Bắt đầu trò chơi
          </Button>
        )}
        {gameState.gamePhase === 'playing' && (
          <div className="space-y-2">
            <div className="text-sm bg-purple-700 p-2 rounded">
              <span className="font-bold">Lượt hiện tại:</span> {gameState.turn}/30
            </div>
            <Button onClick={nextTurn} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
              ➡️ Lượt tiếp theo
            </Button>
          </div>
        )}
      </Card>

      {/* Worker Management */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="font-bold mb-3 text-blue-300 text-lg">👥 Quản lý công nhân</h3>
        <div className="space-y-3">
          <div className="border-2 border-blue-500 rounded-lg p-3 bg-blue-900 bg-opacity-30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-300">👷 Công nhân con người</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded font-bold">
                {gameState.workers.filter((w) => w.type === 'human').length}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              ⏱️ Chậm ({humanWorkerSpec.buildSpeed}x) | 🛡️ Thích ứng với sự cố
            </p>
            <div className="text-[11px] font-semibold flex items-center justify-between gap-2 text-slate-200">
              <span>💰 Chi phí thuê:</span>
              <span className="text-green-300 font-bold">
                Miễn phí (tính theo lượt khi gán vào công trình)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 italic mt-1">
              💡 Chi phí = số lượt cần thiết để xây công trình (Nhà: 2💰, Nhà máy: 3💰, AI: 5💰)
            </div>
            <Button
              onClick={handleAddHumanWorker}
              disabled={!canAffordHuman}
              className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold"
              variant="default"
            >
              + Thuê công nhân
            </Button>
          </div>

          <div className="border-2 border-red-500 rounded-lg p-3 bg-red-900 bg-opacity-30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-red-300">🤖 AI Worker</span>
              <span className="text-xs bg-red-600 px-2 py-1 rounded font-bold">
                {gameState.workers.filter((w) => w.type === 'ai').length}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              ⚡ Nhanh ({aiWorkerSpec.buildSpeed * 2}x) | ❌ Không xử lý sự cố
            </p>
            <div className="text-[11px] font-semibold flex items-center justify-between gap-2 text-slate-200">
              <span>💰 Chi phí thuê:</span>
              <span className="text-green-300 font-bold">
                Miễn phí (tính theo lượt khi gán vào công trình)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 italic mt-1">
              💡 Chi phí = số lượt cần thiết để xây công trình (Nhà: 2💰, Nhà máy: 3💰, AI: 5💰)
            </div>
            <Button
              onClick={handleAddAIWorker}
              disabled={!canAffordAI}
              className="w-full text-sm bg-red-600 hover:bg-red-700 text-white font-bold"
              variant="default"
            >
              + Thuê AI Worker
            </Button>
          </div>
        </div>
      </Card>

      {/* Building Management */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="font-bold mb-3 text-yellow-300 text-lg">🏗️ Xây dựng công trình</h3>
        <p className="text-xs text-slate-300 mb-3 bg-slate-800 p-2 rounded">
          {gameState.selectedTile
            ? `✅ Chọn ô (${gameState.selectedTile.x}, ${gameState.selectedTile.y})`
            : '❌ Chọn một ô trống để xây dựng'}
        </p>
        <div className="space-y-2">
          {Object.entries(BUILDING_SPECS).map(([key, spec]) => {
            const requiredResourcesEntries = Object.entries(spec.requiredResources) as [ResourceType, number][];
            const canAfford = requiredResourcesEntries.every(([resourceType, amount]) => gameState.resources[resourceType] >= amount);

            return (
              <div key={key} className="space-y-1">
            <Button
              onClick={() => handleCreateBuilding(key as 'house' | 'factory' | 'ai_center')}
                  disabled={!selectedTileIsBuildable || !canAfford}
                className="w-full text-sm justify-between bg-slate-600 hover:bg-slate-500 text-white font-bold disabled:opacity-50"
              variant="outline"
            >
              <span>
                {key === 'house' ? '🏠' : key === 'factory' ? '🏭' : '🧠'} {spec.name}
              </span>
              <span className="text-xs">{spec.baseTime}t</span>
            </Button>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300">
                  <div className="flex items-center justify-between bg-slate-800 px-2 py-1 rounded">
                    <span>🪨</span>
                    <span>
                      {spec.requiredResources.stone}{' '}
                      <span className="opacity-70">(Hiện: {gameState.resources.stone})</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800 px-2 py-1 rounded">
                    <span>⚙️</span>
                    <span>
                      {spec.requiredResources.iron}{' '}
                      <span className="opacity-70">(Hiện: {gameState.resources.iron})</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800 px-2 py-1 rounded">
                    <span>💾</span>
                    <span>
                      {spec.requiredResources.data}{' '}
                      <span className="opacity-70">(Hiện: {gameState.resources.data})</span>
                    </span>
                  </div>
              </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Resources */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="font-bold mb-3 text-green-300 text-lg">💎 Tài nguyên</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-lg border-2 border-yellow-500">
            <div className="text-2xl">💰</div>
            <div className="text-sm font-bold text-white">{gameState.cost}</div>
            <div className="text-xs text-yellow-100">Chi phí</div>
          </div>
          <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-3 rounded-lg border-2 border-gray-500">
            <div className="text-2xl">🪨</div>
            <div className="text-sm font-bold text-white">{gameState.resources.stone}</div>
            <div className="text-xs text-gray-200">Đá</div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-lg border-2 border-orange-500">
            <div className="text-2xl">⚙️</div>
            <div className="text-sm font-bold text-white">{gameState.resources.iron}</div>
            <div className="text-xs text-orange-100">Sắt</div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg border-2 border-blue-500">
            <div className="text-2xl">💾</div>
            <div className="text-sm font-bold text-white">{gameState.resources.data}</div>
            <div className="text-xs text-blue-100">Dữ liệu</div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="font-bold mb-3 text-cyan-300 text-lg">📊 Thống kê</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
            <span className="text-slate-300">💰 Giá trị xã hội:</span>
            <span className="font-bold text-yellow-400 text-lg">{gameState.socialValue}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
            <span className="text-slate-300">⚡ Năng suất:</span>
            <span className="font-bold text-green-400 text-lg">{gameState.productivity}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
            <span className="text-slate-300">🎨 Sáng tạo:</span>
            <span className="font-bold text-purple-400 text-lg">{gameState.creativity}</span>
          </div>
          <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
            <span className="text-slate-300">💸 Chi phí lao động:</span>
            <span className="font-bold text-red-400 text-lg">{gameState.laborCost}</span>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="font-bold mb-2 text-indigo-300 text-lg">📖 Cách chơi</h3>
        <div className="text-xs text-slate-300 space-y-2">
          <p>🚦 <strong>Bắt đầu:</strong> Nhấn <em>"Bắt đầu trò chơi"</em>, sau đó chọn ô trống để chuẩn bị xây dựng.</p>
          <p>1️⃣ <strong>Thuê công nhân</strong> - Miễn phí! Chi phí tính theo lượt khi gán vào công trình (Nhà: 2💰, Nhà máy: 3💰, AI: 5💰). Có thể đặt lên ô trống hoặc ô tài nguyên để thu thập.</p>
          <p>2️⃣ <strong>Thu thập tài nguyên</strong> - Đặt công nhân lên các ô 🪨⚙️💾 để tự động thu thập +1 tài nguyên và +1💰 chi phí mỗi lượt. Chỉ ô "✨ Ô trống" mới xây được.</p>
          <p>3️⃣ <strong>Xây công trình</strong> - Đảm bảo đủ 🪨/⚙️/💾 rồi chọn loại công trình. Tài nguyên sẽ bị trừ khi đặt móng.</p>
          <p>4️⃣ <strong>Gán công nhân</strong> - Bấm vào biểu tượng 👷/🤖 sau đó bấm vào công trình để họ bắt đầu xây.</p>
          <p>5️⃣ <strong>Lượt tiếp theo</strong> - Mỗi lượt cập nhật tiến độ, kích hoạt sự kiện ngẫu nhiên (20%) và tính lại điểm.</p>
          <p>🎯 <strong>Mục tiêu:</strong> Giữ cân bằng giữa năng suất và sáng tạo để giá trị xã hội cao nhất.</p>
          <p>💡 <strong>Mẹo nhanh:</strong> Dùng AI cho tiến độ ngắn hạn, nhưng cần đủ công nhân con người để tránh bị trừ điểm.</p>
        </div>
      </Card>
    </div>
  );
}
