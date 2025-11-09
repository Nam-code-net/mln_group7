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
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className={`flex gap-2 p-3 rounded border-2 ${getEventColor(event.type)} transition-all hover:shadow-md`}
            >
              <span className="text-2xl flex-shrink-0">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-100">{event.description}</p>
                <p className="text-xs text-slate-400">Lượt {event.turn}</p>
              </div>
            </div>
          ))}
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
