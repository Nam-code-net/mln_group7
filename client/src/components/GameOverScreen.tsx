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
      <Card className="max-w-5xl w-full bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-500 text-white p-6 shadow-2xl">
        <div className="grid grid-cols-3 gap-5">
          {/* Left Column - Header & Score */}
          <div className="col-span-1 space-y-4">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-yellow-400">🎮 Trò chơi kết thúc!</h2>
              <p className="text-lg font-bold text-yellow-300">{rating}</p>
            </div>

            {/* Main Score */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg border-2 border-purple-400 text-center">
              <p className="text-sm text-purple-200">Giá trị xã hội</p>
              <p className="text-5xl font-bold text-yellow-300">{gameState.socialValue}</p>
              <p className="text-sm text-purple-100 mt-1.5">
                NS: {gameState.productivity} | ST: {gameState.creativity} | CP: {gameState.laborCost}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2.5">
              <Button onClick={resetGame} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base">
                🔄 Chơi lại
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 text-base"
                variant="outline"
              >
                🏠 Trang chủ
              </Button>
            </div>
          </div>

          {/* Middle Column - Statistics */}
          <div className="col-span-1 space-y-4">
            {/* Game Statistics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 mb-1.5">👥 Công nhân</p>
                <p className="text-sm">
                  <span className="text-blue-400">👷</span> <span className="font-bold text-base">{humanWorkers}</span>
                  <span className="text-red-400 ml-2">🤖</span> <span className="font-bold text-base">{aiWorkers}</span>
                </p>
              </div>

              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 mb-1.5">🏗️ Công trình</p>
                <p className="text-sm">
                  <span className="text-yellow-400">Hoàn thành:</span> <span className="font-bold text-base">{buildingsCompleted}/{totalBuildings}</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-400">Tỷ lệ:</span> <span className="font-bold text-base">{totalBuildings > 0 ? Math.round((buildingsCompleted / totalBuildings) * 100) : 0}%</span>
                </p>
              </div>

              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 mb-1.5">📊 Hiệu suất</p>
                <p className="text-sm">
                  <span className="text-green-400">NS:</span> <span className="font-bold text-base">{gameState.productivity}</span>
                </p>
                <p className="text-sm">
                  <span className="text-purple-400">ST:</span> <span className="font-bold text-base">{gameState.creativity}</span>
                </p>
              </div>

              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 mb-1.5">⏱️ Thời gian</p>
                <p className="text-sm">
                  <span className="text-cyan-400">Lượt:</span> <span className="font-bold text-base">{gameState.turn}/30</span>
                </p>
                <p className="text-sm">
                  <span className="text-slate-400">SK:</span> <span className="font-bold text-base">{gameState.events.length}</span>
                </p>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
              <p className="text-sm font-bold text-slate-300 mb-1.5">📈 Phân tích</p>
              <div className="text-sm text-slate-300 space-y-1.5">
                {aiWorkers > humanWorkers * 2 ? (
                  <p className="text-red-300">⚠️ Quá nhiều AI</p>
                ) : null}
                {gameState.creativity > gameState.laborCost * 2 ? (
                  <p className="text-green-300">✅ Tổ chức tốt</p>
                ) : null}
                {buildingsCompleted === totalBuildings && totalBuildings > 0 ? (
                  <p className="text-blue-300">🎯 Hoàn thành tất cả</p>
                ) : null}
                {gameState.events.length > 5 ? (
                  <p className="text-yellow-300">🌊 Nhiều sự kiện</p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column - Messages */}
          <div className="col-span-1 space-y-4">
            {/* Philosophical Message */}
            <div className="bg-blue-900 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm font-bold text-blue-300 mb-1.5">💭 Bài học</p>
              <p className="text-sm italic text-blue-100 leading-relaxed line-clamp-5">{philosophicalMessage}</p>
            </div>

            {/* Vietnamese Context */}
            <div className="bg-green-900 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-sm font-bold text-green-300 mb-1.5">🇻🇳 Việt Nam</p>
              <p className="text-sm text-green-100 leading-relaxed line-clamp-5">
                Phát triển nguồn nhân lực sáng tạo, có kỹ năng và tri thức – để làm chủ công nghệ, chứ không bị công nghệ thay thế.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
