import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, WorkerType, BuildingType } from '@/types/game';
import {
  initializeGame,
  addWorker,
  addPlayer,
  assignWorkerToBuilding,
  assignWorkerToMining,
  unassignWorkerFromMining,
  createBuilding,
  processTurn,
  checkGameEnd,
  getPhilosophicalMessage,
  sellBuilding,
} from '@/lib/gameEngine';

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  nextTurn: () => void;
  addWorker: (type: WorkerType, x: number, y: number) => void;
  addPlayer: (name: string, color: string) => void;
  createBuilding: (type: BuildingType, x: number, y: number) => void;
  assignWorkerToBuilding: (workerId: string, buildingId: string) => void;
  assignWorkerToMining: (workerId: string, x: number, y: number) => void;
  unassignWorkerFromMining: (workerId: string) => void;
  sellBuilding: (buildingId: string) => void;
  selectWorker: (workerId: string | null) => void;
  selectTile: (x: number, y: number) => void;
  resetGame: () => void;
  gameOver: boolean;
  philosophicalMessage: string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initializeGame(8));
  const [gameOver, setGameOver] = useState(false);

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: 'playing',
    }));
  }, []);

  const nextTurn = useCallback(() => {
    setGameState((prev) => {
      const updated = processTurn(prev);
      if (checkGameEnd(updated)) {
        setGameOver(true);
      }
      return updated;
    });
  }, []);

  const handleAddWorker = useCallback((type: WorkerType, x: number, y: number) => {
    setGameState((prev) => addWorker(prev, type, x, y));
  }, []);

  const handleAddPlayer = useCallback((name: string, color: string) => {
    setGameState((prev) => addPlayer(prev, name, color));
  }, []);

  const handleCreateBuilding = useCallback((type: BuildingType, x: number, y: number) => {
    setGameState((prev) => createBuilding(prev, type, x, y));
  }, []);

  const handleAssignWorkerToBuilding = useCallback((workerId: string, buildingId: string) => {
    setGameState((prev) => assignWorkerToBuilding(prev, workerId, buildingId));
  }, []);

  const handleAssignWorkerToMining = useCallback((workerId: string, x: number, y: number) => {
    setGameState((prev) => assignWorkerToMining(prev, workerId, x, y));
  }, []);

  const handleUnassignWorkerFromMining = useCallback((workerId: string) => {
    setGameState((prev) => unassignWorkerFromMining(prev, workerId));
  }, []);

  const handleSellBuilding = useCallback((buildingId: string) => {
    setGameState((prev) => sellBuilding(prev, buildingId));
  }, []);

  const selectWorker = useCallback((workerId: string | null) => {
    setGameState((prev) => ({
      ...prev,
      selectedWorker: workerId,
    }));
  }, []);

  const selectTile = useCallback((x: number, y: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedTile: { x, y },
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeGame(8));
    setGameOver(false);
  }, []);

  const philosophicalMessage = getPhilosophicalMessage(gameState);

  const value: GameContextType = {
    gameState,
    startGame,
    nextTurn,
    addWorker: handleAddWorker,
    addPlayer: handleAddPlayer,
    createBuilding: handleCreateBuilding,
    assignWorkerToBuilding: handleAssignWorkerToBuilding,
    assignWorkerToMining: handleAssignWorkerToMining,
    unassignWorkerFromMining: handleUnassignWorkerFromMining,
    sellBuilding: handleSellBuilding,
    selectWorker,
    selectTile,
    resetGame,
    gameOver,
    philosophicalMessage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
