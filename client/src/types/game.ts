// Game board and tile types
export type TileType = 'empty' | 'resource' | 'building';
export type ResourceType = 'stone' | 'iron' | 'data';
export type BuildingType = 'house' | 'factory' | 'ai_center';
export type WorkerType = 'human' | 'ai';
export type EventType = 'material_shortage' | 'environment_change' | 'tech_upgrade' | 'strike';

// Game state interfaces
export interface Tile {
  id: string;
  x: number;
  y: number;
  type: TileType;
  resource?: ResourceType;
  building?: Building;
  worker?: Worker;
}

export interface Worker {
  id: string;
  type: WorkerType;
  x: number;
  y: number;
  productivity: number; // 1.0 = normal, >1.0 = boosted
  isWorking: boolean;
  currentTask?: string; // ID của công trình hoặc resource tile đang làm việc
  isMining?: boolean; // Đang khai thác tài nguyên hay không
}

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
  progress: number; // 0-100
  requiredTime: number; // base time to complete
  assignedWorkers: string[]; // worker IDs
  completed: boolean;
  sold: boolean; // Đã bán hay chưa
}

export interface BuildingCompletionMessage {
  buildingId: string;
  buildingType: BuildingType;
  message: string;
  turn: number;
  workerStats: {
    humanWorkers: number;
    aiWorkers: number;
  };
}

export interface GameState {
  board: Tile[][];
  workers: Worker[];
  buildings: Building[];
  resources: Record<ResourceType, number>;
  cost: number; // Chi phí (tiền chung) để thuê công nhân
  turn: number;
  gamePhase: 'setup' | 'playing' | 'gameover';
  socialValue: number;
  productivity: number;
  creativity: number;
  laborCost: number;
  selectedWorker: string | null;
  selectedTile: { x: number; y: number } | null;
  events: GameEvent[];
  completionMessages: BuildingCompletionMessage[]; // Thông điệp khi hoàn thành công trình
}

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  duration: number; // Số lượt ảnh hưởng
  endTurn: number; // Lượt kết thúc
  affectedWorkerType?: WorkerType;
  description: string;
  effects: string; // Mô tả chi tiết ảnh hưởng
}

export interface GameResult {
  socialValue: number;
  productivity: number;
  creativity: number;
  laborCost: number;
  philosophicalMessage: string;
  workerStats: {
    humanWorkersUsed: number;
    aiWorkersUsed: number;
    buildingsCompleted: number;
  };
}

// Building specifications
export const BUILDING_SPECS: Record<BuildingType, {
  name: string;
  baseTime: number;
  requiredResources: Record<ResourceType, number>;
  baseValue: number;
  complexity: number;
}> = {
  house: {
    name: 'Nhà ở',
    baseTime: 2, // Cần 2 lượt với 1 công nhân (buildSpeed=1) + 1 AI (buildSpeed=2) = 3 tổng buildSpeed
    requiredResources: { stone: 5, iron: 2, data: 0 },
    baseValue: 10,
    complexity: 1,
  },
  factory: {
    name: 'Nhà máy',
    baseTime: 3, // Cần 3 lượt - chi phí thuê công nhân = 3💰
    requiredResources: { stone: 10, iron: 8, data: 3 },
    baseValue: 25,
    complexity: 2,
  },
  ai_center: {
    name: 'Trung tâm AI',
    baseTime: 5, // Cần 5 lượt - chi phí thuê công nhân = 5💰
    requiredResources: { stone: 15, iron: 12, data: 10 },
    baseValue: 50,
    complexity: 3,
  },
};

// Worker specifications
export const WORKER_SPECS: Record<WorkerType, {
  name: string;
  speed: number; // tiles per turn
  buildSpeed: number; // progress per turn
  adaptability: number; // 0-1, ability to handle events
  cost: number; // Chi phí (tiền chung) để thuê
}> = {
  human: {
    name: 'Công nhân con người',
    speed: 1,
    buildSpeed: 1,
    adaptability: 0.8,
    cost: 0, // Chi phí thuê ban đầu = 0, chi phí thực tế tính theo lượt khi gán vào công trình
  },
  ai: {
    name: 'AI Worker',
    speed: 2,
    buildSpeed: 2,
    adaptability: 0.2,
    cost: 0, // Chi phí thuê ban đầu = 0, chi phí thực tế tính theo lượt khi gán vào công trình
  },
};
