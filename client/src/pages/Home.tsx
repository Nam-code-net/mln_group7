import { GameProvider } from '@/contexts/GameContext';
import { GameBoard } from '@/components/GameBoard';
import { GameControls } from '@/components/GameControls';
import { GameOverScreen } from '@/components/GameOverScreen';
import { EventsPanel } from '@/components/EventsPanel';
import { BuildingCompletionDialog } from '@/components/BuildingCompletionDialog';
import { PlayerSetup } from '@/components/PlayerSetup';
import { JoinGame } from '@/components/JoinGame';
import { useGame } from '@/contexts/GameContext';

function HomeContent() {
  const { gameState } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">♟️ Builder Chess: Labor Grid</h1>
          <p className="text-slate-300 text-lg">
            Mô phỏng lao động sản xuất trong thời đại AI - Dựa trên lý luận Mác
          </p>
          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
            {gameState.players.length > 0 && (
              <div className="flex items-center gap-4 flex-wrap">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg border-2 ${
                      gameState.currentPlayerId === player.id
                        ? 'border-yellow-400 bg-yellow-900 bg-opacity-30'
                        : 'border-slate-600 bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${player.color}`} />
                    <span className="text-sm font-semibold">
                      {player.name}
                      {gameState.currentPlayerId === player.id && ' 👑'}
                    </span>
                    <span className="text-xs text-slate-400">({player.score} điểm)</span>
                  </div>
                ))}
              </div>
            )}
            {gameState.gamePhase === 'playing' && gameState.players.length < 15 && (
              <JoinGame />
            )}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-7xl mx-auto p-6">
        {gameState.gamePhase === 'setup' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlayerSetup />
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-2xl font-bold mb-4">📖 Hướng dẫn</h2>
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Thêm người chơi bằng cách nhập tên và chọn màu. Mỗi người chơi sẽ có lượt chơi riêng.
                </p>
                <p>
                  Bạn có thể bắt đầu game với bất kỳ số lượng người chơi nào (tối đa 15 người).
                </p>
                <p className="text-xs text-slate-400">
                  💡 Tip: Bạn có thể bắt đầu game ngay mà không cần thêm người chơi, hoặc thêm tối đa 15 người chơi.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Events Panel - Moved to top for better visibility */}
            <div className="mb-6">
              <EventsPanel />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Game Board - Main Column */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">Bàn cờ xây dựng</h2>
                  <div className="bg-slate-900 p-4 rounded overflow-x-auto">
                    <GameBoard />
                  </div>
                </div>
              </div>

              {/* Sidebar - Controls and Info */}
              <div className="space-y-4">
                <GameControls />
              </div>
            </div>
          </>
        )}

        {gameState.gamePhase === 'playing' && (
          <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">📖 Hướng dẫn chơi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-bold mb-2 text-blue-400">Mục tiêu</h3>
                <p className="text-slate-300">
                  Tối đa hóa giá trị xã hội bằng cách cân bằng giữa công nhân con người (sáng tạo) và AI Workers (nhanh).
                  Người thắng không phải xây nhiều nhất, mà tạo ra giá trị cao nhất.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-blue-400">Công nhân</h3>
                <p className="text-slate-300">
                  👷 Con người: Chậm nhưng thích ứng với sự cố. 🤖 AI: Nhanh gấp đôi nhưng không xử lý được sự cố.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-blue-400">Công trình</h3>
                <p className="text-slate-300">
                  🏠 Nhà ở (nhanh, ít điểm), 🏭 Nhà máy (trung bình), 🧠 Trung tâm AI (khó, nhiều điểm)
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-blue-400">Sự kiện</h3>
                <p className="text-slate-300">
                  Các sự kiện ngẫu nhiên xảy ra để phản ánh sự biến đổi bản chất của lao động - công nhân và AI phản ứng khác nhau.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Game Over Screen */}
      <GameOverScreen />
      
      {/* Building Completion Dialog */}
      <BuildingCompletionDialog />
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  );
}
