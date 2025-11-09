import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function GameOverScreen() {
  const { gameState, gameOver, resetGame, philosophicalMessage } = useGame();

  if (!gameOver) return null;

  const humanWorkers = gameState.workers.filter((w) => w.type === 'human').length;
  const aiWorkers = gameState.workers.filter((w) => w.type === 'ai').length;
  const buildingsCompleted = gameState.buildings.filter((b) => b.completed).length;
  const totalBuildings = gameState.buildings.length;

  // Calculate rating based on social value
  let rating = '⭐';
  if (gameState.socialValue >= 150) {
    rating = '⭐⭐⭐⭐⭐ Xuất sắc!';
  } else if (gameState.socialValue >= 100) {
    rating = '⭐⭐⭐⭐ Tuyệt vời!';
  } else if (gameState.socialValue >= 50) {
    rating = '⭐⭐⭐ Tốt';
  } else if (gameState.socialValue >= 20) {
    rating = '⭐⭐ Bình thường';
  } else {
    rating = '⭐ Cần cải thiện';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-500 text-white p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-yellow-400">🎮 Trò chơi kết thúc!</h2>
          <p className="text-2xl font-bold text-yellow-300">{rating}</p>
        </div>

        {/* Main Score */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg border-2 border-purple-400 text-center space-y-2">
          <p className="text-sm text-purple-200">Giá trị xã hội cuối cùng</p>
          <p className="text-5xl font-bold text-yellow-300">{gameState.socialValue}</p>
          <p className="text-xs text-purple-100">
            Năng suất: {gameState.productivity} | Sáng tạo: {gameState.creativity} | Chi phí: {gameState.laborCost}
          </p>
        </div>

        {/* Game Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
            <p className="text-xs text-slate-400 mb-2">👥 Công nhân</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-blue-400">👷 Con người:</span> <span className="font-bold text-lg">{humanWorkers}</span>
              </p>
              <p className="text-sm">
                <span className="text-red-400">🤖 AI:</span> <span className="font-bold text-lg">{aiWorkers}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
            <p className="text-xs text-slate-400 mb-2">🏗️ Công trình</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-yellow-400">Hoàn thành:</span> <span className="font-bold text-lg">{buildingsCompleted}/{totalBuildings}</span>
              </p>
              <p className="text-sm">
                <span className="text-slate-400">Tỷ lệ:</span> <span className="font-bold text-lg">{totalBuildings > 0 ? Math.round((buildingsCompleted / totalBuildings) * 100) : 0}%</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
            <p className="text-xs text-slate-400 mb-2">📊 Hiệu suất</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-green-400">Năng suất:</span> <span className="font-bold text-lg">{gameState.productivity}</span>
              </p>
              <p className="text-sm">
                <span className="text-purple-400">Sáng tạo:</span> <span className="font-bold text-lg">{gameState.creativity}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
            <p className="text-xs text-slate-400 mb-2">⏱️ Thời gian</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-cyan-400">Tổng lượt:</span> <span className="font-bold text-lg">{gameState.turn}/30</span>
              </p>
              <p className="text-sm">
                <span className="text-slate-400">Sự kiện:</span> <span className="font-bold text-lg">{gameState.events.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Philosophical Message */}
        <div className="bg-blue-900 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-sm font-bold text-blue-300 mb-2">💭 Bài học triết học</p>
          <p className="text-sm italic text-blue-100 leading-relaxed">{philosophicalMessage}</p>
        </div>

        {/* Vietnamese Context */}
        <div className="bg-green-900 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-sm font-bold text-green-300 mb-2">🇻🇳 Bối cảnh Việt Nam</p>
          <p className="text-sm text-green-100 leading-relaxed">
            Trong thời đại AI, Việt Nam cần phát triển nguồn nhân lực sáng tạo, có kỹ năng và tri thức – để làm chủ công nghệ, chứ không bị công nghệ thay thế. Người lao động sáng tạo là nguồn giá trị lớn nhất.
          </p>
        </div>

        {/* Analysis */}
        <div className="bg-slate-700 p-4 rounded-lg border-2 border-slate-600">
          <p className="text-sm font-bold text-slate-300 mb-3">📈 Phân tích chiến lược</p>
          <div className="text-xs text-slate-300 space-y-2">
            {aiWorkers > humanWorkers * 2 ? (
              <p className="text-red-300">
                ⚠️ Bạn sử dụng quá nhiều AI Workers so với công nhân con người. Mặc dù năng suất cao, nhưng giá trị xã hội bị giảm vì thiếu sáng tạo.
              </p>
            ) : null}
            {gameState.creativity > gameState.laborCost * 2 ? (
              <p className="text-green-300">
                ✅ Bạn đã tổ chức lao động con người rất hợp lý! Giá trị thặng dư cao, phản ánh sức sáng tạo của lao động sống.
              </p>
            ) : null}
            {buildingsCompleted === totalBuildings && totalBuildings > 0 ? (
              <p className="text-blue-300">
                🎯 Bạn hoàn thành tất cả công trình! Điều này cho thấy khả năng tổ chức và quản lý tài nguyên tốt.
              </p>
            ) : null}
            {gameState.events.length > 5 ? (
              <p className="text-yellow-300">
                🌊 Bạn đã trải qua nhiều sự kiện ngẫu nhiên. Khả năng thích ứng của bạn đã được kiểm chứng!
              </p>
            ) : null}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={resetGame} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6">
            🔄 Chơi lại
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold text-lg py-6"
            variant="outline"
          >
            🏠 Quay lại trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
}
