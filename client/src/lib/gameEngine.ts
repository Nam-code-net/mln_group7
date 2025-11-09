import {
  GameState,
  Tile,
  Worker,
  Building,
  GameEvent,
  WorkerType,
  BuildingType,
  ResourceType,
  Player,
  BUILDING_SPECS,
  WORKER_SPECS,
} from '@/types/game';

// Initialize a new game
export function initializeGame(boardSize: number = 8): GameState {
  const board: Tile[][] = [];
  const workers: Worker[] = [];
  const buildings: Building[] = [];

  // Create empty board
  for (let y = 0; y < boardSize; y++) {
    board[y] = [];
    for (let x = 0; x < boardSize; x++) {
      board[y][x] = {
        id: `tile-${x}-${y}`,
        x,
        y,
        type: 'empty',
      };
    }
  }

  // Add some initial resources randomly
  for (let i = 0; i < Math.floor(boardSize * boardSize * 0.15); i++) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    const resourceTypes: ResourceType[] = ['stone', 'iron', 'data'];
    const resource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    if (board[y][x].type === 'empty') {
      board[y][x].type = 'resource';
      board[y][x].resource = resource;
    }
  }

  return {
    board,
    workers,
    buildings,
    resources: { stone: 20, iron: 15, data: 10 },
    cost: 50, // Bắt đầu với 50 chi phí
    turn: 0,
    gamePhase: 'setup',
    socialValue: 0,
    productivity: 0,
    creativity: 0,
    laborCost: 0,
    selectedWorker: null,
    selectedTile: null,
    events: [],
    completionMessages: [],
    players: [],
    currentPlayerId: null,
  };
}

// Add a player to the game
export function addPlayer(state: GameState, name: string, color: string): GameState {
  const player: Player = {
    id: `player-${Date.now()}-${Math.random()}`,
    name,
    color,
    score: 0,
  };

  const updatedPlayers = [...state.players, player];
  
  // Set first player as current if no current player
  const currentPlayerId = state.currentPlayerId || (updatedPlayers.length > 0 ? updatedPlayers[0].id : null);

  return {
    ...state,
    players: updatedPlayers,
    currentPlayerId,
  };
}

// Add a worker to the game
export function addWorker(
  state: GameState,
  type: WorkerType,
  x: number,
  y: number
): GameState {
  // Chi phí thuê công nhân = 0 (miễn phí)
  // Chi phí thực tế tính theo lượt khi gán vào công trình

  // Check if tile is available (empty or resource, but not building)
  const tile = state.board[y]?.[x];
  if (!tile || tile.type === 'building') {
    return state; // Can't place on building
  }

  // Check if there's already a worker on this tile
  if (state.workers.some((w) => w.x === x && w.y === y)) {
    return state; // Tile already occupied
  }

  const worker: Worker = {
    id: `worker-${Date.now()}-${Math.random()}`,
    type,
    x,
    y,
    productivity: 1,
    isWorking: false,
  };

  // Không trừ chi phí khi thuê công nhân
  // Chi phí sẽ được trừ khi gán công nhân vào công trình (tính theo lượt)
  return {
    ...state,
    workers: [...state.workers, worker],
  };
}

// Assign worker to build a building
export function assignWorkerToBuilding(
  state: GameState,
  workerId: string,
  buildingId: string
): GameState {
  const worker = state.workers.find((w) => w.id === workerId);
  const building = state.buildings.find((b) => b.id === buildingId);

  if (!worker || !building || worker.isWorking || building.completed || building.sold) return state;

  // Chi phí thuê công nhân = số lượt cần thiết để xây công trình
  // Ví dụ: Nhà ở (2 lượt) → chi phí = 2💰
  // Nhà máy (3 lượt) → chi phí = 3💰
  // Trung tâm AI (5 lượt) → chi phí = 5💰
  const spec = BUILDING_SPECS[building.type];
  const workerCost = spec.baseTime; // Chi phí = số lượt cần thiết

  // Kiểm tra đủ chi phí
  if (state.cost < workerCost) {
    return state; // Can't afford
  }

  const updatedWorkers = state.workers.map((w) => {
    if (w.id === workerId) {
      return {
        ...w,
        isWorking: true,
        isMining: false, // Dừng khai thác khi xây dựng
        currentTask: buildingId,
        x: building.x,
        y: building.y,
      };
    }
    return w;
  });

  const updatedBuildings = state.buildings.map((b) => {
    if (b.id === buildingId) {
      return {
        ...b,
        assignedWorkers: [...b.assignedWorkers, workerId],
      };
    }
    return b;
  });

  return {
    ...state,
    workers: updatedWorkers,
    buildings: updatedBuildings,
    cost: state.cost - workerCost, // Trừ chi phí khi gán công nhân vào công trình
  };
}

// Assign worker to mine resource
export function assignWorkerToMining(
  state: GameState,
  workerId: string,
  x: number,
  y: number
): GameState {
  const worker = state.workers.find((w) => w.id === workerId);
  const tile = state.board[y]?.[x];

  if (!worker || !tile || tile.type !== 'resource' || !tile.resource) {
    return state; // Can't mine if not a resource tile
  }

  // Không thể khai thác nếu đang làm việc khác (trừ khi đang khai thác ở chỗ khác)
  if (worker.isWorking && !worker.isMining) {
    return state; // Can't mine if working on building
  }

  const updatedWorkers = state.workers.map((w) => {
    if (w.id === workerId) {
      return {
        ...w,
        isMining: true,
        isWorking: false, // Không làm việc xây dựng khi đang khai thác
        currentTask: `resource-${x}-${y}`, // Đánh dấu đang khai thác ở đâu
        x: x,
        y: y,
      };
    }
    return w;
  });

  return {
    ...state,
    workers: updatedWorkers,
  };
}

// Unassign worker from mining (stop mining)
export function unassignWorkerFromMining(
  state: GameState,
  workerId: string
): GameState {
  const worker = state.workers.find((w) => w.id === workerId);

  if (!worker || !worker.isMining) {
    return state; // Can't unassign if not mining
  }

  const updatedWorkers = state.workers.map((w) => {
    if (w.id === workerId) {
      return {
        ...w,
        isMining: false,
        currentTask: undefined, // Clear mining task
        // Keep position, worker stays where they are
      };
    }
    return w;
  });

  return {
    ...state,
    workers: updatedWorkers,
  };
}

// Create a new building
export function createBuilding(
  state: GameState,
  type: BuildingType,
  x: number,
  y: number
): GameState {
  const tile = state.board[y]?.[x];
  if (!tile || tile.type !== 'empty') return state;

  const spec = BUILDING_SPECS[type];

  // Ensure we have enough resources to start construction
  const hasEnoughResources = Object.entries(spec.requiredResources).every(([resourceType, amount]) => {
    return state.resources[resourceType as ResourceType] >= amount;
  });

  if (!hasEnoughResources) {
    return state;
  }

  const building: Building = {
    id: `building-${Date.now()}-${Math.random()}`,
    type,
    x,
    y,
    progress: 0,
    requiredTime: spec.baseTime,
    assignedWorkers: [],
    completed: false,
    sold: false,
  };

  const updatedBoard = state.board.map((row, ry) =>
    row.map((tile, rx) => {
      if (rx === x && ry === y) {
        return { ...tile, type: 'building' as const, building };
      }
      return tile;
    })
  );

  const updatedResources = { ...state.resources };
  Object.entries(spec.requiredResources).forEach(([resourceType, amount]) => {
    updatedResources[resourceType as ResourceType] = Math.max(
      0,
      updatedResources[resourceType as ResourceType] - amount
    );
  });

  return {
    ...state,
    buildings: [...state.buildings, building],
    resources: updatedResources,
    board: updatedBoard,
  };
}

// Process a game turn
export function processTurn(state: GameState): GameState {
  if (state.gamePhase !== 'playing') return state;

  let updatedState = { ...state, turn: state.turn + 1 };

  // Collect resources from resource tiles where workers are standing
  updatedState = collectResourcesFromTiles(updatedState);

  // Update building progress
  updatedState = updateBuildingProgress(updatedState);

  // Trigger random events (tăng xác suất lên 30% để dễ thấy sự kiện hơn)
  if (Math.random() < 0.3) {
    // 30% chance of event per turn
    updatedState = triggerRandomEvent(updatedState);
  }

  // Recalculate social value
  updatedState = calculateSocialValue(updatedState);

  return updatedState;
}

// Collect resources from resource tiles where workers are mining
function collectResourcesFromTiles(state: GameState): GameState {
  const updatedResources = { ...state.resources };
  const updatedBoard = state.board.map((row) => row.map((tile) => ({ ...tile })));
  let totalCostChange = 0; // Thay đổi chi phí (trả công nhân -1, thu được từ tài nguyên)

  // Chỉ thu thập từ công nhân đang khai thác (isMining = true)
  for (const worker of state.workers) {
    if (!worker.isMining) continue; // Chỉ thu thập từ công nhân đang khai thác
    
    const tile = state.board[worker.y]?.[worker.x];
    if (tile && tile.type === 'resource' && tile.resource) {
      // Worker collects resource from this tile
      // Mỗi công nhân thu được 2 tài nguyên trong 1 lượt
      const resourceType = tile.resource;
      updatedResources[resourceType] = (updatedResources[resourceType] || 0) + 2; // Thu được 2 tài nguyên
      
      // Trả chi phí 1 cho công nhân khi thu thập (chi phí = 1)
      totalCostChange -= 1; // Trừ 1 chi phí để trả công nhân
      
      // Remove resource from tile after collection (optional - can keep it for continuous collection)
      // For now, we'll keep the resource tile so it can be collected multiple times
      // If you want one-time collection, uncomment the next lines:
      // updatedBoard[worker.y][worker.x] = {
      //   ...tile,
      //   type: 'empty' as const,
      //   resource: undefined,
      // };
    }
  }

  return {
    ...state,
    resources: updatedResources,
    cost: state.cost + totalCostChange, // Trả chi phí cho công nhân (mỗi công nhân = -1)
    board: updatedBoard,
  };
}

// Get philosophical message when building is completed
function getBuildingCompletionMessage(
  building: Building,
  assignedWorkers: Worker[],
  turn: number
): string {
  const humanWorkers = assignedWorkers.filter((w) => w.type === 'human').length;
  const aiWorkers = assignedWorkers.filter((w) => w.type === 'ai').length;
  const spec = BUILDING_SPECS[building.type];
  
  // Phân tích theo lý luận Mác
  if (aiWorkers > humanWorkers * 2) {
    // Quá nhiều AI
    return `🏗️ **${spec.name} hoàn thành!**\n\n` +
           `⚠️ **Phân tích theo lý luận Mác:**\n` +
           `Công trình này được xây dựng chủ yếu bởi AI. Mặc dù nhanh chóng, nhưng giá trị thực sự được tạo ra từ đâu?\n\n` +
           `📚 **Lý luận Mác:** Lao động sống (con người) là nguồn gốc duy nhất của giá trị. Máy móc chỉ chuyển giá trị cũ, không tạo giá trị mới.\n\n` +
           `💡 **Bài học:** Trong thời đại AI, Việt Nam cần phát triển nguồn nhân lực sáng tạo - những người có thể làm chủ công nghệ, không bị công nghệ thay thế.`;
  } else if (humanWorkers > 0 && humanWorkers >= aiWorkers) {
    // Cân bằng hoặc ưu tiên con người
    const creativityBonus = humanWorkers * 2;
    return `🏗️ **${spec.name} hoàn thành!**\n\n` +
           `✅ **Phân tích theo lý luận Mác:**\n` +
           `Công trình này được xây dựng với sự tổ chức lao động con người hợp lý. Đây chính là sức sáng tạo của lao động sống!\n\n` +
           `📚 **Lý luận Mác:** Lao động cụ thể của con người tạo ra giá trị sử dụng, còn lao động trừu tượng tạo ra giá trị trao đổi. Giá trị thặng dư được tạo ra từ lao động sống.\n\n` +
           `💡 **Bài học:** Phát triển nguồn nhân lực chất lượng cao là chìa khóa để Việt Nam làm chủ công nghệ trong thời đại 4.0. Sáng tạo của con người (+${creativityBonus} điểm) là nguồn giá trị lớn nhất.`;
  } else {
    // Hỗn hợp
    return `🏗️ **${spec.name} hoàn thành!**\n\n` +
           `⚖️ **Phân tích theo lý luận Mác:**\n` +
           `Công trình này được xây dựng với sự kết hợp giữa lao động con người và AI. Cần cân bằng để tối đa hóa giá trị xã hội.\n\n` +
           `📚 **Lý luận Mác:** Máy móc có thể tăng năng suất, nhưng chỉ lao động sống mới tạo ra giá trị mới. Giá trị thặng dư đến từ lao động không được trả công đầy đủ.\n\n` +
           `💡 **Bài học:** Việt Nam cần phát triển nguồn nhân lực có kỹ năng cao để làm chủ công nghệ, không phải bị công nghệ thay thế.`;
  }
}

// Update building progress based on assigned workers
function updateBuildingProgress(state: GameState): GameState {
  const newCompletionMessages: BuildingCompletionMessage[] = [];
  let updatedCost = state.cost;
  
  const updatedBuildings = state.buildings.map((building) => {
    if (building.completed) return building;

    // Chỉ tính công nhân đang làm việc (isWorking = true)
    // Nếu công nhân đang đình công (isWorking = false), họ không làm việc
    const assignedWorkers = state.workers.filter((w) =>
      building.assignedWorkers.includes(w.id) && w.isWorking
    );

    if (assignedWorkers.length === 0) return building;

    // Tính tổng buildSpeed của tất cả công nhân
    // Ví dụ: 1 công nhân (buildSpeed=1) + 1 AI (buildSpeed=2) = 3
    // Nhà ở cần baseTime=5 lượt với tổng buildSpeed=3 (1 công nhân + 1 AI)
    // Mỗi lượt tăng: 100% / 5 = 20% với tổng buildSpeed=3
    // Nếu có nhiều công nhân hơn, tổng buildSpeed tăng → tiến độ tăng nhanh hơn
    let totalBuildSpeed = 0;
    for (const worker of assignedWorkers) {
      const spec = WORKER_SPECS[worker.type];
      totalBuildSpeed += spec.buildSpeed * worker.productivity;
    }

    // Tính tiến độ tăng mỗi lượt
    // Công thức: progressPerTurn = (totalBuildSpeed / baseBuildSpeed) * (100% / baseTime)
    // baseBuildSpeed = 3 (1 công nhân + 1 AI) cho nhà ở
    // Ví dụ: Nhà ở (baseTime=5), với 1 công nhân (1) + 1 AI (2) = 3
    // Mỗi lượt tăng: (3 / 3) * (100 / 5) = 20%
    // Với 2 công nhân (2) + 2 AI (4) = 6
    // Mỗi lượt tăng: (6 / 3) * (100 / 5) = 40% (hoàn thành trong 3 lượt)
    // Với 3 công nhân (3) + 3 AI (6) = 9
    // Mỗi lượt tăng: (9 / 3) * (100 / 5) = 60% (hoàn thành trong 2 lượt)
    const baseBuildSpeed = 3; // 1 công nhân (1) + 1 AI (2) = 3
    const progressPerTurn = (totalBuildSpeed / baseBuildSpeed) * (100 / building.requiredTime);
    
    const newProgress = Math.min(
      100,
      building.progress + progressPerTurn
    );

    const wasCompleted = building.completed;
    const isNowCompleted = newProgress >= 100;

    // Nếu công trình vừa hoàn thành, tạo thông điệp triết học và trả chi phí cho công nhân
    if (!wasCompleted && isNowCompleted) {
      const message = getBuildingCompletionMessage(building, assignedWorkers, state.turn);
      newCompletionMessages.push({
        buildingId: building.id,
        buildingType: building.type,
        message,
        turn: state.turn,
        workerStats: {
          humanWorkers: assignedWorkers.filter((w) => w.type === 'human').length,
          aiWorkers: assignedWorkers.filter((w) => w.type === 'ai').length,
        },
      });

      // Trả chi phí cho công nhân sau khi hoàn thành công trình
      // Mỗi công nhân được trả 1 chi phí, mỗi AI được trả 2 chi phí
      for (const worker of assignedWorkers) {
        const spec = WORKER_SPECS[worker.type];
        if (worker.type === 'human') {
          updatedCost += 1; // Trả 1 chi phí cho công nhân con người
        } else {
          updatedCost += 2; // Trả 2 chi phí cho AI worker
        }
      }
    }

    return {
      ...building,
      progress: newProgress,
      completed: isNowCompleted,
    };
  });

  // Update board to reflect building changes
  const updatedBoard = state.board.map((row) =>
    row.map((tile) => {
      if (tile.type === 'building' && tile.building) {
        const updatedBuilding = updatedBuildings.find((b) => b.id === tile.building!.id);
        if (updatedBuilding) {
          return {
            ...tile,
            building: updatedBuilding,
          };
        }
      }
      return tile;
    })
  );

  return {
    ...state,
    buildings: updatedBuildings,
    board: updatedBoard,
    completionMessages: [...state.completionMessages, ...newCompletionMessages],
    cost: updatedCost,
  };
}

// Trigger a random event
function triggerRandomEvent(state: GameState): GameState {
  const eventTypes = ['material_shortage', 'environment_change', 'tech_upgrade', 'strike'] as const;
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

  const event: GameEvent = {
    id: `event-${Date.now()}-${Math.random()}`,
    type: eventType,
    turn: state.turn,
    description: getEventDescription(eventType),
  };

  let updatedState = {
    ...state,
    events: [...state.events, event],
  };

  // Apply event effects
  switch (eventType) {
    case 'material_shortage':
      updatedState = {
        ...updatedState,
        resources: {
          ...updatedState.resources,
          stone: Math.max(0, updatedState.resources.stone - 5),
        },
      };
      break;

    case 'environment_change':
      // AI workers suffer, human workers adapt
      updatedState = {
        ...updatedState,
        workers: updatedState.workers.map((w) => {
          if (w.type === 'ai') {
            return { ...w, productivity: Math.max(0.5, w.productivity - 0.3) };
          } else {
            return { ...w, productivity: Math.min(1.5, w.productivity + 0.2) };
          }
        }),
      };
      break;

    case 'tech_upgrade':
      // AI workers get boosted
      updatedState = {
        ...updatedState,
        workers: updatedState.workers.map((w) => {
          if (w.type === 'ai') {
            return { ...w, productivity: Math.min(1.5, w.productivity + 0.3) };
          }
          return w;
        }),
        resources: {
          ...updatedState.resources,
          data: Math.max(0, updatedState.resources.data - 3),
        },
      };
      break;

    case 'strike':
      // Human workers take a break but recover
      updatedState = {
        ...updatedState,
        workers: updatedState.workers.map((w) => {
          if (w.type === 'human') {
            return { ...w, isWorking: false, productivity: 1.2 };
          }
          return w;
        }),
      };
      break;
  }

  return updatedState;
}

// Get event description
function getEventDescription(eventType: string): string {
  const descriptions: Record<string, string> = {
    material_shortage: 'Thiếu nguyên liệu! Tài nguyên giảm.',
    environment_change: 'Môi trường thay đổi! Công nhân thích ứng, AI bị ảnh hưởng.',
    tech_upgrade: 'Cập nhật công nghệ! AI nâng cấp hiệu suất.',
    strike: 'Đình công! Công nhân nghỉ tạm thời nhưng tinh thần cao hơn.',
  };
  return descriptions[eventType] || 'Sự kiện xảy ra';
}

// Calculate social value
function calculateSocialValue(state: GameState): GameState {
  let socialValue = 0;
  let productivity = 0;
  let creativity = 0;
  let laborCost = 0;

  // Count completed buildings and their value
  for (const building of state.buildings) {
    if (building.completed) {
      const spec = BUILDING_SPECS[building.type];
      socialValue += spec.baseValue;
      productivity += spec.complexity;
      creativity += spec.complexity * 0.5;
    }
  }

  // Calculate labor cost (sum of all worker costs)
  for (const worker of state.workers) {
    const spec = WORKER_SPECS[worker.type];
    laborCost += spec.cost;
  }

  // Bonus for human worker organization
  const humanWorkers = state.workers.filter((w) => w.type === 'human').length;
  if (humanWorkers > 0) {
    creativity += humanWorkers * 2;
  }

  // Penalty for excessive AI usage
  const aiWorkers = state.workers.filter((w) => w.type === 'ai').length;
  if (aiWorkers > humanWorkers * 2) {
    socialValue = Math.max(0, socialValue - aiWorkers * 5);
  }

  return {
    ...state,
    socialValue,
    productivity,
    creativity,
    laborCost,
  };
}

// Sell a completed building to get cost back
export function sellBuilding(state: GameState, buildingId: string): GameState {
  const building = state.buildings.find((b) => b.id === buildingId);
  
  if (!building || !building.completed || building.sold) {
    return state; // Can't sell incomplete or already sold building
  }

  const spec = BUILDING_SPECS[building.type];
  
  // Calculate cost from building value (120% of base value để có lời)
  // Ví dụ: Nhà ở giá trị 10 → bán được 12 chi phí
  // Nhà máy giá trị 25 → bán được 30 chi phí
  // Trung tâm AI giá trị 50 → bán được 60 chi phí
  const costFromSale = Math.floor(spec.baseValue * 1.2);
  
  // Đánh dấu nhà đã bán (không xóa khỏi bàn cờ)
  const updatedBuildings = state.buildings.map((b) => {
    if (b.id === buildingId) {
      return {
        ...b,
        sold: true,
      };
    }
    return b;
  });

  // Update board to reflect sold status
  const updatedBoard = state.board.map((row) =>
    row.map((tile) => {
      if (tile.type === 'building' && tile.building?.id === buildingId) {
        return {
          ...tile,
          building: {
            ...tile.building,
            sold: true,
          },
        };
      }
      return tile;
    })
  );

  // Free workers assigned to this building
  const updatedWorkers = state.workers.map((worker) => {
    if (building.assignedWorkers.includes(worker.id)) {
      return {
        ...worker,
        isWorking: false,
        currentTask: undefined,
      };
    }
    return worker;
  });

  return {
    ...state,
    buildings: updatedBuildings,
    board: updatedBoard,
    workers: updatedWorkers,
    cost: state.cost + costFromSale,
  };
}

// Check if game should end
export function checkGameEnd(state: GameState): boolean {
  // Game ends after 30 turns or when certain conditions are met
  return state.turn >= 30;
}

// Get philosophical message based on gameplay
export function getPhilosophicalMessage(state: GameState): string {
  const aiRatio = state.workers.filter((w) => w.type === 'ai').length / Math.max(1, state.workers.length);
  const valuePerWorker = state.socialValue / Math.max(1, state.workers.length);

  if (aiRatio > 0.7 && valuePerWorker < 10) {
    return 'Bạn đã đạt năng suất cao, nhưng giá trị xã hội thấp – máy móc giúp bạn nhanh hơn, nhưng không tạo giá trị mới.';
  }

  if (state.creativity > state.laborCost * 2) {
    return 'Bạn tổ chức lao động con người hợp lý – năng suất vừa phải, nhưng giá trị thặng dư cao. Đây là sức sáng tạo của lao động sống.';
  }

  if (state.socialValue > 100) {
    return 'Người lao động sáng tạo là nguồn giá trị lớn nhất – không một AI nào có thể thay thế.';
  }

  return 'Trong thời đại AI, Việt Nam cần phát triển nguồn nhân lực sáng tạo, có kỹ năng và tri thức – để làm chủ công nghệ, chứ không bị công nghệ thay thế.';
}
