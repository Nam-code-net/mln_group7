# Builder Chess: Labor Grid

A strategic turn-based game that simulates labor production in the AI era, grounded in Marxist labor theory.

## 🎮 Game Overview

**Builder Chess: Labor Grid** challenges players to balance human workers and AI workers to construct buildings on an 8x8 grid. Unlike traditional strategy games, success is not measured by productivity alone, but by **social value** – the combination of productivity, creativity, and efficient labor organization.

The game demonstrates key concepts from Marxist economic theory:
- **Concrete vs. Abstract Labor**: Different worker types performing specific work
- **Surplus Value**: Rewards for efficient organization of human labor
- **Alienation**: AI workers cannot adapt to environmental changes
- **Labor as Value**: Human creativity generates more value than pure automation

## 🎯 Objective

Maximize **social value** by:
1. Hiring the right mix of human workers and AI workers
2. Constructing buildings efficiently
3. Managing resources strategically
4. Adapting to random events
5. Balancing productivity with value creation

**Remember**: The player with the highest social value wins, not the one who builds the most!

## 🕹️ How to Play

### Starting the Game
1. Click **"Bắt đầu trò chơi"** (Start Game) to begin
2. You start with: 20 Stone, 15 Iron, 10 Data

### Hiring Workers

**Human Workers (👷)**
- Cost: 5 resources
- Speed: 1x (slow)
- Adaptability: High (0.8)
- Benefit: +0.2 productivity when environment changes
- Best for: Long-term strategies, crisis management

**AI Workers (🤖)**
- Cost: 15 resources
- Speed: 2x (fast)
- Adaptability: Low (0.2)
- Weakness: -0.3 productivity when environment changes
- Best for: Short-term productivity boosts

### Building Structures

**House (🏠)** - 3 turns
- Value: 10 points
- Resources: Stone (5), Iron (2)
- Best for: Quick early points

**Factory (🏭)** - 6 turns
- Value: 25 points
- Resources: Stone (10), Iron (8), Data (3)
- Best for: Mid-game development

**AI Center (🧠)** - 10 turns
- Value: 50 points
- Resources: Stone (15), Iron (12), Data (10)
- Best for: High-value late-game strategy

### Gameplay Loop

1. **Hire Workers**: Choose human or AI workers
2. **Build**: Select an empty tile and choose a building type
3. **Assign**: Click a worker, then click a building to assign them
4. **Progress**: Click **"Lượt tiếp theo"** (Next Turn) to advance
5. **Events**: Random events may occur, affecting workers differently
6. **Repeat**: Continue until turn 30 or game ends

## 📊 Scoring System

### Social Value Calculation
```
Social Value = Building Value + Bonus - Penalties
```

**Building Value**: Sum of all completed buildings
- House: 10 points
- Factory: 25 points
- AI Center: 50 points

**Bonus**: Creativity from human worker organization
- +2 points per human worker
- +1x multiplier if creativity > labor cost × 2

**Penalties**: Excessive AI usage
- -5 points per AI worker if AI count > human count × 2

### Rankings
- ⭐⭐⭐⭐⭐ (150+): Xuất sắc - Excellent!
- ⭐⭐⭐⭐ (100-149): Tuyệt vời - Great!
- ⭐⭐⭐ (50-99): Tốt - Good
- ⭐⭐ (20-49): Bình thường - Fair
- ⭐ (<20): Cần cải thiện - Needs improvement

## 🌍 Random Events

Events occur with 20% probability each turn, affecting workers differently:

| Event | Effect | Human Impact | AI Impact |
|-------|--------|--------------|-----------|
| Material Shortage (⚠️) | -5 Stone | Normal | Normal |
| Environment Change (🌍) | Adaptation test | +0.2 productivity | -0.3 productivity |
| Tech Upgrade (⚡) | -3 Data | Normal | +0.3 productivity |
| Strike (✊) | Temporary stop | Stop work, +1.2 after | No effect |

## 💭 Philosophical Messages

The game teaches through gameplay:

### If you use mostly AI workers:
> "Bạn đã đạt năng suất cao, nhưng giá trị xã hội thấp – máy móc giúp bạn nhanh hơn, nhưng không tạo giá trị mới."
> 
> *You achieved high productivity, but low social value – machines help you go faster, but don't create new value.*

### If you balance human workers well:
> "Bạn tổ chức lao động con người hợp lý – năng suất vừa phải, nhưng giá trị thặng dư cao. Đây là sức sáng tạo của lao động sống."
> 
> *You organized human labor well – moderate productivity, but high surplus value. This is the creative power of living labor.*

### Vietnamese Context:
> "Trong thời đại AI, Việt Nam cần phát triển nguồn nhân lực sáng tạo, có kỹ năng và tri thức – để làm chủ công nghệ, chứ không bị công nghệ thay thế."
> 
> *In the AI era, Vietnam needs to develop creative human resources with skills and knowledge – to master technology, not be replaced by it.*

## 🎓 Educational Value

This game teaches:

1. **Marxist Labor Theory**
   - Concrete vs. abstract labor
   - Surplus value and exploitation
   - Alienation of labor
   - Labor as the source of value

2. **Economic Strategy**
   - Resource management
   - Cost-benefit analysis
   - Long-term planning
   - Risk management

3. **Vietnamese Context**
   - Importance of human skill development
   - Dangers of over-automation
   - Value of creative knowledge work

## 🛠️ Technical Details

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: React Context API
- **Game Engine**: Custom TypeScript logic

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### Performance
- Optimized for 8x8 grid
- Smooth 60fps gameplay
- Minimal memory footprint
- Works on desktop and tablet

## 📱 Controls

| Action | Control |
|--------|---------|
| Hire Worker | Click hire button |
| Select Tile | Click on grid tile |
| Select Worker | Click worker icon |
| Assign Worker | Select worker, click building |
| Next Turn | Click "Lượt tiếp theo" button |
| New Game | Click "Chơi lại" after game ends |

## 🎮 Strategy Tips

### Early Game (Turns 1-10)
- Start with human workers for adaptability
- Build houses for quick points
- Accumulate resources

### Mid Game (Turns 11-20)
- Mix human and AI workers strategically
- Build factories for better value
- Prepare for random events

### Late Game (Turns 21-30)
- Focus on high-value buildings (AI Centers)
- Manage events carefully
- Optimize final social value

### Winning Strategies

**Human-Focused**: Hire mostly human workers, build factories and houses, accumulate creativity points

**Balanced**: Mix workers, adapt to events, build diverse structures

**AI-Heavy**: Use AI for quick construction, but risk low social value

**Event-Adaptive**: Prepare for random events, use human workers for resilience

## 🔄 Game Loop

1. **Setup Phase**: Hire initial workers
2. **Playing Phase**: 30 turns of:
   - Hire workers
   - Build structures
   - Assign workers
   - Advance turn
   - Handle events
3. **Game Over**: Final score and philosophical message

## 📈 Metrics Tracking

The game tracks:
- **Social Value**: Primary score
- **Productivity**: Complexity of completed buildings
- **Creativity**: Human worker contribution
- **Labor Cost**: Total resources spent
- **Events**: Number and types of random events
- **Completion Rate**: Percentage of buildings completed

## 🌟 Features

✅ Turn-based strategy gameplay
✅ 8x8 dynamic game board
✅ Two worker types with different mechanics
✅ Three building types with varying complexity
✅ Random events system
✅ Marxist theory integration
✅ Vietnamese language support
✅ Philosophical end-game analysis
✅ Responsive UI design
✅ Real-time statistics tracking

## 📚 Learning Resources

### Marxist Labor Theory
- Concrete Labor: Specific, tangible work
- Abstract Labor: Standardized labor time
- Surplus Value: Value created beyond worker compensation
- Alienation: Disconnection from creative work

### Game Design
- Strategy games mechanics
- Resource management systems
- Educational game design
- Philosophical game narrative

## 🎬 Getting Started

1. Open the game in your browser
2. Click "Bắt đầu trò chơi" (Start Game)
3. Read the instructions panel
4. Hire your first workers
5. Build your first structure
6. Progress through 30 turns
7. See your final score and philosophical message
8. Play again to try different strategies!

## 💡 Tips for Success

- Balance is key: don't rely solely on AI workers
- Human workers provide adaptability for events
- Plan your building strategy early
- Manage resources carefully
- Adapt to random events
- Aim for high social value, not just productivity

## 🎯 Win Conditions

You win by achieving the highest **social value** possible. This requires:
1. Efficient worker organization
2. Strategic building placement
3. Effective resource management
4. Adaptation to random events
5. Balance between productivity and creativity

Remember: **Quantity ≠ Quality**. A few well-organized human workers can create more value than many AI workers!

---

**Builder Chess: Labor Grid** - Where strategy meets philosophy, and labor creates value.

*Mô phỏng lao động sản xuất trong thời đại AI - Dựa trên lý luận Mác*
