import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';

export function EventsPanel() {
  const { gameState } = useGame();

  // Get the last 5 events
  const recentEvents = gameState.events.slice(-5).reverse();

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'material_shortage':
        return '⚠️';
      case 'environment_change':
        return '🌍';
      case 'tech_upgrade':
        return '⚡';
      case 'strike':
        return '✊';
      default:
        return '📢';
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'material_shortage':
        return 'border-red-500 bg-red-900 bg-opacity-30';
      case 'environment_change':
        return 'border-green-500 bg-green-900 bg-opacity-30';
      case 'tech_upgrade':
        return 'border-blue-500 bg-blue-900 bg-opacity-30';
      case 'strike':
        return 'border-yellow-500 bg-yellow-900 bg-opacity-30';
      default:
        return 'border-slate-500 bg-slate-900 bg-opacity-30';
    }
  };

  return (
    <Card className="p-4 bg-slate-700 border-slate-600">
      <h3 className="font-bold mb-3 text-orange-300 text-lg">📢 Sự kiện gần đây</h3>
      {recentEvents.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Chưa có sự kiện nào xảy ra</p>
      ) : (
        <div className="space-y-2">
          {recentEvents.map((event) => {
            const isActive = event.endTurn && gameState.turn < event.endTurn;
            const turnsRemaining = event.endTurn ? Math.max(0, event.endTurn - gameState.turn) : 0;
            
            return (
              <div
                key={event.id}
                className={`flex gap-2 p-3 rounded border-2 ${getEventColor(event.type)} transition-all hover:shadow-md`}
              >
                <span className="text-2xl flex-shrink-0">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-100 mb-1">{event.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-slate-400">Lượt {event.turn}</p>
                      {event.duration && (
                        <p className="text-xs text-slate-300">
                          ⏱️ Ảnh hưởng: {event.duration} lượt
                          {isActive && turnsRemaining > 0 && (
                            <span className="ml-1 text-yellow-400 font-semibold">
                              (Còn {turnsRemaining} lượt)
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    {event.effects && (
                      <div className="mt-2 pt-2 border-t border-slate-600">
                        <p className="text-xs font-semibold text-slate-300 mb-1">📋 Ảnh hưởng:</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{event.effects}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Summary */}
      {gameState.events.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <p className="text-xs text-slate-400 mb-2">📊 Thống kê sự kiện</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 p-2 rounded">
              <p className="text-slate-400">Tổng sự kiện:</p>
              <p className="font-bold text-slate-200">{gameState.events.length}</p>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <p className="text-slate-400">Loại sự kiện:</p>
              <p className="font-bold text-slate-200">
                {new Set(gameState.events.map((e) => e.type)).size}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
