# Builder Chess: Labor Grid - Game Design Document

## Concept Overview

**Builder Chess: Labor Grid** is a strategic turn-based game that simulates labor production in the AI era, grounded in Marxist labor theory. Players must balance human workers and AI workers to construct buildings on an 8x8 grid, with the goal of maximizing "social value" rather than just productivity.

## Core Theme: Marxist Labor Theory

The game demonstrates key concepts from Marxist economic theory through gameplay mechanics:

### Concrete vs. Abstract Labor
- **Concrete Labor**: Each worker type (human or AI) performs specific, tangible work (building houses, factories, AI centers)
- **Abstract Labor**: The game converts all labor into standardized "units of labor time" for calculation of value

### Surplus Value & Exploitation
- Efficient organization of human workers generates surplus value (extra points)
- AI automation is fast but creates no new value, only replicates existing value
- The game rewards players who balance productivity with value creation

### Alienation of Labor
- AI workers are "alienated" - they cannot adapt to environmental changes
- Human workers maintain adaptability and creativity
- Random events demonstrate how different labor types respond to crisis

## Game Mechanics

### Board & Tiles
- **8x8 grid** with three tile types:
  - Empty tiles: Available for construction or worker placement
  - Resource tiles: Stone (gray), Iron (orange), Data (blue) - scattered randomly
  - Building tiles: Under construction or completed

### Worker Types

#### Human Workers (👷)
- **Speed**: 1x (slow)
- **Adaptability**: 0.8 (high)
- **Cost**: 5 resources
- **Special**: Gain +0.2 productivity when environment changes; can handle unexpected situations

#### AI Workers (🤖)
- **Speed**: 2x (fast)
- **Adaptability**: 0.2 (low)
- **Cost**: 15 resources
- **Special**: Lose -0.3 productivity when environment changes; rigid and inflexible

### Building Types

#### House (🏠)
- **Base Time**: 3 turns
- **Base Value**: 10 points
- **Complexity**: 1
- **Resources**: Stone (5), Iron (2)

#### Factory (🏭)
- **Base Time**: 6 turns
- **Base Value**: 25 points
- **Complexity**: 2
- **Resources**: Stone (10), Iron (8), Data (3)

#### AI Center (🧠)
- **Base Time**: 10 turns
- **Base Value**: 50 points
- **Complexity**: 3
- **Resources**: Stone (15), Iron (12), Data (10)

### Scoring System

**Social Value** = (Building Value) + (Surplus Value) - (AI Penalty)

#### Components:
1. **Building Value**: Sum of completed building values
2. **Surplus Value**: Bonus from efficient human worker organization
   - +2 points per human worker (reflects creative potential)
   - Multiplier: +1x if creativity > labor cost × 2
3. **AI Penalty**: -5 points per AI worker if AI count > human count × 2
   - Reflects that pure automation reduces social value

#### Tracking Metrics:
- **Productivity**: Complexity of completed buildings
- **Creativity**: Measure of human worker contribution
- **Labor Cost**: Total resources spent on workers

### Random Events (20% chance per turn)

#### Material Shortage (⚠️)
- **Effect**: -5 stone resources
- **Impact**: Affects both worker types equally
- **Strategy**: Forces resource management decisions

#### Environment Change (🌍)
- **Effect**: Human workers +0.2 productivity, AI workers -0.3 productivity
- **Impact**: Demonstrates human adaptability vs. AI rigidity
- **Strategy**: Rewards having human workers for crisis management

#### Technology Upgrade (⚡)
- **Effect**: AI workers +0.3 productivity, -3 data resources
- **Impact**: AI becomes temporarily more valuable
- **Strategy**: Creates short-term advantage for AI-heavy strategies

#### Strike (✊)
- **Effect**: Human workers stop working but gain +1.2 productivity afterward
- **Impact**: Temporary setback with long-term benefit
- **Strategy**: Represents worker agency and recovery

## Win Conditions & Game Flow

### Game Phases
1. **Setup**: Player can hire workers and plan initial strategy
2. **Playing**: Turn-based gameplay (30 turns maximum)
3. **Game Over**: Triggered when turn limit reached

### Victory Evaluation
Players are ranked by final social value:
- **⭐⭐⭐⭐⭐ (150+)**: Xuất sắc - Perfect balance of human creativity and productivity
- **⭐⭐⭐⭐ (100-149)**: Tuyệt vời - Excellent social value generation
- **⭐⭐⭐ (50-99)**: Tốt - Good balance achieved
- **⭐⭐ (20-49)**: Bình thường - Basic strategy worked
- **⭐ (<20)**: Cần cải thiện - Strategy needs improvement

## Philosophical Messages

### Post-Game Analysis
The game generates contextual messages based on player strategy:

1. **AI-Heavy Strategy** (AI > 70% of workforce, low value per worker):
   > "Bạn đã đạt năng suất cao, nhưng giá trị xã hội thấp – máy móc giúp bạn nhanh hơn, nhưng không tạo giá trị mới."
   
   *Translation: You achieved high productivity, but low social value – machines help you go faster, but don't create new value.*

2. **Human-Focused Strategy** (High creativity, creativity > labor cost × 2):
   > "Bạn tổ chức lao động con người hợp lý – năng suất vừa phải, nhưng giá trị thặng dư cao. Đây là sức sáng tạo của lao động sống."
   
   *Translation: You organized human labor well – moderate productivity, but high surplus value. This is the creative power of living labor.*

3. **High Value Achievement** (Social value > 100):
   > "Người lao động sáng tạo là nguồn giá trị lớn nhất – không một AI nào có thể thay thế."
   
   *Translation: Creative workers are the greatest source of value – no AI can replace them.*

### Vietnamese Context Message
Every game ends with:
> "Trong thời đại AI, Việt Nam cần phát triển nguồn nhân lực sáng tạo, có kỹ năng và tri thức – để làm chủ công nghệ, chứ không bị công nghệ thay thế."

*Translation: In the AI era, Vietnam needs to develop creative human resources with skills and knowledge – to master technology, not be replaced by it.*

## Educational Value

### Marxist Theory Integration
- **Concrete vs. Abstract Labor**: Demonstrated through worker type mechanics
- **Surplus Value**: Shown through bonus points from efficient organization
- **Alienation**: AI workers cannot adapt (alienated from creative problem-solving)
- **Labor as Source of Value**: Human creativity generates more value than pure automation

### Vietnamese Labor Context
- Emphasizes the importance of human skill development
- Warns against over-reliance on automation
- Promotes creative, knowledge-based labor as the path forward

## UI/UX Design

### Color Scheme
- **Dark Theme**: Slate-900 to slate-800 background (professional, serious tone)
- **Accent Colors**:
  - Purple/Blue: Game controls and human workers
  - Red: AI workers and warnings
  - Yellow/Gold: Buildings and rewards
  - Orange/Green: Resources and positive feedback

### Layout
- **Left Column (2/3 width)**: Game board with 8x8 grid
- **Right Column (1/3 width)**: Control panels
  - Game phase and turn counter
  - Worker management
  - Building construction
  - Resource display
  - Statistics
  - Events panel
  - Instructions

### Visual Feedback
- **Selected tiles**: Cyan ring with shadow
- **Selected workers**: Yellow ring
- **Building progress**: Colored progress bar (red → yellow → green)
- **Worker status**: Visual indicators for productivity and work status

## Technical Implementation

### Frontend Stack
- **React 19**: Component-based UI
- **TypeScript**: Type-safe game logic
- **Tailwind CSS 4**: Styling and responsive design
- **shadcn/ui**: Pre-built UI components

### Game State Management
- **React Context**: Global game state
- **Custom Hooks**: Game logic and calculations
- **Immutable Updates**: Functional state updates

### Key Files
- `client/src/types/game.ts`: Game type definitions
- `client/src/lib/gameEngine.ts`: Core game logic
- `client/src/contexts/GameContext.tsx`: State management
- `client/src/components/GameBoard.tsx`: Board rendering
- `client/src/components/GameControls.tsx`: Player controls
- `client/src/components/GameOverScreen.tsx`: End-game screen
- `client/src/components/EventsPanel.tsx`: Event display

## Balance & Difficulty

### Starting Resources
- Stone: 20
- Iron: 15
- Data: 10

### Difficulty Factors
- **Turn Limit**: 30 turns (moderate difficulty)
- **Event Frequency**: 20% per turn (creates unpredictability)
- **Resource Scarcity**: Limited initial resources encourage strategic choices
- **Worker Cost**: Expensive workers require careful planning

### Strategy Depth
- **Early Game**: Decide between human and AI workers
- **Mid Game**: Manage events and adapt strategy
- **Late Game**: Optimize remaining turns for maximum value

## Future Enhancements

- Sound effects for events and building completion
- Difficulty levels (Easy, Normal, Hard)
- Multiplayer mode for comparing strategies
- Leaderboard for high scores
- Tutorial mode with guided gameplay
- More building types and worker specializations
- Procedurally generated maps
- Campaign mode with story elements
