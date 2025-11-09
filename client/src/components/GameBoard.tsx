import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Tile, ResourceType } from '@/types/game';
import { BUILDING_SPECS, WORKER_SPECS } from '@/types/game';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function GameBoard() {
  const { gameState, selectTile, selectWorker, assignWorkerToBuilding, assignWorkerToMining, unassignWorkerFromMining, sellBuilding } = useGame();
  const [hoveredTile, setHoveredTile] = React.useState<{ x: number; y: number } | null>(null);
  const prevResourcesRef = React.useRef<Record<ResourceType, number>>(gameState.resources);

  // Track resource changes and show notifications
  React.useEffect(() => {
    if (gameState.turn > 0) {
      const prev = prevResourcesRef.current;
      const current = gameState.resources;
      
      // Check each resource type for changes
      (['stone', 'iron', 'data'] as ResourceType[]).forEach((resourceType) => {
        const diff = current[resourceType] - prev[resourceType];
        if (diff > 0) {
          const icon = resourceType === 'stone' ? '🪨' : resourceType === 'iron' ? '⚙️' : '💾';
          const name = resourceType === 'stone' ? 'Đá' : resourceType === 'iron' ? 'Sắt' : 'Dữ liệu';
          toast.success(`${icon} +${diff} ${name}`, {
            description: `Tổng ${name}: ${current[resourceType]}`,
            duration: 2000,
          });
        }
      });
      
      prevResourcesRef.current = { ...current };
    }
  }, [gameState.turn, gameState.resources]);

  const handleTileClick = (x: number, y: number) => {
    if (gameState.selectedWorker) {
      const tile = gameState.board[y]?.[x];
      const worker = gameState.workers.find(w => w.id === gameState.selectedWorker);

      if (!worker) {
        selectTile(x, y);
        selectWorker(null);
        return;
      }

      // If clicking on a building, assign worker to build
      if (tile?.building && !worker.isWorking && !worker.isMining) {
        assignWorkerToBuilding(gameState.selectedWorker, tile.building.id);
        selectWorker(null);
        return;
      }

      // If clicking on a resource tile, assign worker to mine
      if (tile?.type === 'resource' && !worker.isWorking) {
        assignWorkerToMining(gameState.selectedWorker, x, y);
        selectWorker(null);
        return;
      }
    }
    selectTile(x, y);
    selectWorker(null);
  };

  const handleWorkerClick = (e: React.MouseEvent, workerId: string) => {
    e.stopPropagation();
    selectWorker(workerId);
  };

  const renderTile = (tile: Tile) => {
    let bgColor = 'bg-slate-600';
    let borderColor = 'border-slate-500';
    let content = null;

    // Determine tile background
    if (tile.type === 'resource') {
      const workersOnResource = gameState.workers.filter((w) => w.x === tile.x && w.y === tile.y && w.isMining);
      const isMining = workersOnResource.length > 0;

      if (tile.resource === 'stone') {
        bgColor = isMining
          ? 'bg-gradient-to-br from-gray-500 to-gray-700'
          : 'bg-gradient-to-br from-gray-400 to-gray-600';
        borderColor = isMining ? 'border-gray-400' : 'border-gray-500';
      } else if (tile.resource === 'iron') {
        bgColor = isMining
          ? 'bg-gradient-to-br from-orange-500 to-orange-700'
          : 'bg-gradient-to-br from-orange-400 to-orange-600';
        borderColor = isMining ? 'border-orange-400' : 'border-orange-500';
      } else {
        bgColor = isMining
          ? 'bg-gradient-to-br from-blue-500 to-blue-700'
          : 'bg-gradient-to-br from-blue-400 to-blue-600';
        borderColor = isMining ? 'border-blue-400' : 'border-blue-500';
      }
      content = (
        <div className="flex flex-col items-center justify-center h-full gap-1">
          <div className="text-2xl font-bold drop-shadow-lg">
            {tile.resource === 'stone' ? '🪨' : tile.resource === 'iron' ? '⚙️' : '💾'}
          </div>
          {isMining && (
            <div className="text-[9px] font-bold text-white bg-black bg-opacity-60 px-1.5 py-0.5 rounded">
              ⛏️ Đang khai thác
            </div>
          )}
        </div>
      );
    } else if (tile.type === 'building' && tile.building) {
      const isSold = tile.building.sold;
      if (isSold) {
        // Nhà đã bán - hiển thị với màu xám và nhãn "PAID"
        bgColor = 'bg-gradient-to-br from-gray-400 to-gray-600';
        borderColor = 'border-gray-500';
      } else {
        bgColor = 'bg-gradient-to-br from-yellow-300 to-yellow-600';
        borderColor = 'border-yellow-500';
      }
      const buildingSpec = BUILDING_SPECS[tile.building.type];
      const progressPercent = Math.round(tile.building.progress);
      const isCompleted = tile.building.completed;
      content = (
        <div className="flex flex-col items-center justify-center h-full gap-0.5 p-1 relative">
          {/* Percentage - placed at the top with clear background to avoid being covered */}
          {!isSold && (
            <div className={`text-[11px] font-bold ${isCompleted ? 'text-green-800' : 'text-gray-900'} drop-shadow-sm z-10 bg-white bg-opacity-90 px-1.5 py-0.5 rounded border border-gray-300`}>
              {isCompleted ? '✅ 100%' : `${progressPercent}%`}
            </div>
          )}
          {/* Building Icon */}
          <div className="text-xl drop-shadow-lg relative z-10">
            {tile.building.type === 'house' ? '🏠' : tile.building.type === 'factory' ? '🏭' : '🧠'}
            {isSold && (
              <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[8px] font-bold px-1 py-0.5 rounded border border-white z-20">
                PAID
              </div>
            )}
          </div>
          {!isSold && (
            <>
              {/* Progress Bar */}
              <div className="w-full max-w-[55px] h-2.5 bg-black bg-opacity-40 rounded-full overflow-hidden border border-black border-opacity-50">
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-600'
                      : progressPercent < 30
                        ? 'bg-red-500'
                        : progressPercent < 60
                          ? 'bg-orange-500'
                          : progressPercent < 90
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
              {/* Display number of working workers - smaller */}
              {!isCompleted && tile.building.assignedWorkers.length > 0 && (
                <div className="text-[9px] text-gray-800 font-semibold bg-white bg-opacity-70 px-1 rounded">
                  👷 {tile.building.assignedWorkers.filter(id =>
                    gameState.workers.find(w => w.id === id && w.isWorking)
                  ).length}
                </div>
              )}
            </>
          )}
          {isSold && (
            <div className="text-xs font-bold text-green-800 drop-shadow-sm bg-white bg-opacity-80 px-1 rounded">
              ✅ Đã bán
            </div>
          )}
        </div>
      );
    }

    // Render workers on tile
    const workersOnTile = gameState.workers.filter((w) => w.x === tile.x && w.y === tile.y);

    const isSelected = gameState.selectedTile?.x === tile.x && gameState.selectedTile?.y === tile.y;
    const isHovered = hoveredTile?.x === tile.x && hoveredTile?.y === tile.y;

    return (
      <div
        key={`tile-${tile.x}-${tile.y}`}
        className={`w-20 h-20 border-2 ${borderColor} ${bgColor} flex items-center justify-center cursor-pointer relative overflow-hidden transition-all ${
          isSelected ? 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-400' : ''
        } ${isHovered ? 'shadow-md' : ''}`}
        onClick={() => handleTileClick(tile.x, tile.y)}
        onMouseEnter={() => setHoveredTile({ x: tile.x, y: tile.y })}
        onMouseLeave={() => setHoveredTile(null)}
      >
        {content}

        {/* Render workers - placed at the bottom-right corner to avoid covering content */}
        {workersOnTile.length > 0 && (
          <div className="absolute bottom-0 right-0 flex items-center gap-0.5 p-0.5 flex-wrap-reverse max-w-[60%]">
            {workersOnTile.map((worker) => (
              <button
                key={worker.id}
                className={`w-6 h-6 rounded-full text-[10px] font-bold cursor-pointer transition-all shadow-lg flex items-center justify-center ${
                  worker.type === 'human'
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 border-2 border-blue-300'
                    : 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 border-2 border-red-300'
                } ${gameState.selectedWorker === worker.id ? 'ring-2 ring-yellow-300 scale-110' : ''}`}
                title={`${worker.type === 'human' ? 'Công nhân' : 'AI'} (Năng suất: ${worker.productivity.toFixed(1)}x)${worker.isWorking ? ' - Đang làm việc' : worker.isMining ? ' - Đang khai thác' : ' - Rảnh rỗi'}`}
                onClick={(e) => handleWorkerClick(e, worker.id)}
              >
                {worker.type === 'human' ? '👷' : '🤖'}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-1 bg-slate-900 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${gameState.board[0].length}, minmax(0, 1fr))` }}>
        {gameState.board.map((row) => row.map((tile) => renderTile(tile)))}
      </div>

      {/* Tile info */}
      {gameState.selectedTile && (
        <div className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-cyan-500 rounded-lg">
          <p className="text-sm font-bold text-cyan-300 mb-2">
            📍 Ô được chọn: ({gameState.selectedTile.x}, {gameState.selectedTile.y})
          </p>
          {gameState.board[gameState.selectedTile.y]?.[gameState.selectedTile.x] && (
            <div className="text-xs text-slate-300 space-y-1">
              {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].type === 'resource' && (
                <div className="space-y-1">
                  <p>
                    🪨 <strong>Tài nguyên:</strong>{' '}
                    {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].resource === 'stone'
                      ? 'Đá'
                      : gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].resource === 'iron'
                        ? 'Sắt'
                        : 'Dữ liệu'}
                  </p>
                  <p className="text-xs text-cyan-200 italic">
                    💡 Chọn công nhân rồi click vào ô này để gán khai thác. Mỗi lượt thu thập +2 tài nguyên và -1💰 chi phí
                  </p>
                  {(() => {
                    const workersMiningHere = gameState.workers.filter(
                      (w) => w.x === gameState.selectedTile.x && w.y === gameState.selectedTile.y && w.isMining
                    );
                    return (
                      <>
                        {gameState.selectedWorker && !gameState.workers.find((w) => w.id === gameState.selectedWorker)?.isMining && (
                          <Button
                            onClick={() => {
                              assignWorkerToMining(gameState.selectedWorker!, gameState.selectedTile!.x, gameState.selectedTile!.y);
                              selectWorker(null);
                            }}
                            className="w-full text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold mt-2"
                          >
                            ⛏️ Gán công nhân khai thác
                          </Button>
                        )}
                        {workersMiningHere.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-cyan-600 space-y-1">
                            <p className="text-xs text-cyan-200">
                              ⛏️ Đang khai thác: {workersMiningHere.length} công nhân
                            </p>
                            {workersMiningHere.map((worker) => (
                              <Button
                                key={worker.id}
                                onClick={() => {
                                  unassignWorkerFromMining(worker.id);
                                }}
                                className="w-full text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold"
                              >
                                ⛔ Ngừng khai thác ({worker.type === 'human' ? '👷' : '🤖'})
                              </Button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].type === 'building' && (
                <div className="space-y-2">
                  <p>
                    🏗️ <strong>Công trình:</strong>{' '}
                    {BUILDING_SPECS[gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building!.type].name}
                  </p>
                  {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building?.completed && !gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building?.sold && (
                    <div className="mt-2 pt-2 border-t border-cyan-600">
                      <p className="text-xs text-cyan-200 mb-2">
                        ✅ Công trình đã hoàn thành - Có thể bán để lấy chi phí
                      </p>
                      <Button
                        onClick={() => {
                          const building = gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building;
                          if (building) {
                            sellBuilding(building.id);
                            selectTile(null);
                          }
                        }}
                        className="w-full text-xs bg-green-600 hover:bg-green-700 text-white font-bold"
                      >
                        💰 Bán công trình (+{Math.floor(BUILDING_SPECS[gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building!.type].baseValue * 1.2)}💰)
                      </Button>
                    </div>
                  )}
                  {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].building?.sold && (
                    <div className="mt-2 pt-2 border-t border-green-600">
                      <p className="text-xs text-green-300 mb-2 font-bold">
                        ✅ Đã bán - Công trình đã được thanh toán
                      </p>
                    </div>
                  )}
                </div>
              )}
              {gameState.board[gameState.selectedTile.y][gameState.selectedTile.x].type === 'empty' && (
                <p>✨ <strong>Ô trống</strong> - Có thể xây dựng công trình ở đây</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Worker info */}
      {gameState.selectedWorker && (
        <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-800 border-2 border-blue-400 rounded-lg">
          {gameState.workers.find((w) => w.id === gameState.selectedWorker) && (
            <div className="text-sm space-y-2">
              <p className="font-bold text-blue-200">
                {gameState.workers.find((w) => w.id === gameState.selectedWorker)?.type === 'human'
                  ? '👷 Công nhân con người'
                  : '🤖 AI Worker'}
              </p>
              <div className="text-xs text-blue-100 space-y-1">
                <p>
                  📍 Vị trí: ({gameState.workers.find((w) => w.id === gameState.selectedWorker)?.x},{' '}
                  {gameState.workers.find((w) => w.id === gameState.selectedWorker)?.y})
                </p>
                <p>
                  ⚡ Năng suất:{' '}
                  {gameState.workers.find((w) => w.id === gameState.selectedWorker)?.productivity.toFixed(1)}x
                </p>
                <p>
                  💼 Trạng thái:{' '}
                  {gameState.workers.find((w) => w.id === gameState.selectedWorker)?.isWorking
                    ? '🔨 Đang làm việc'
                    : gameState.workers.find((w) => w.id === gameState.selectedWorker)?.isMining
                      ? '⛏️ Đang khai thác'
                      : '😴 Rảnh rỗi'}
                </p>
              </div>
              {gameState.workers.find((w) => w.id === gameState.selectedWorker)?.isMining && (
                <Button
                  onClick={() => {
                    unassignWorkerFromMining(gameState.selectedWorker!);
                  }}
                  className="w-full text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold mt-2"
                >
                  ⛔ Ngừng khai thác
                </Button>
              )}
              <p className="text-xs text-blue-300 mt-2 italic">
                💡 Chọn một công trình để xây dựng hoặc chọn ô tài nguyên để khai thác
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
