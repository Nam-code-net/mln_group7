# Phân Tích Ảnh Hưởng của Sự Kiện "Đình Công" đến Game

## Sự Kiện: Đình Công (Strike) ✊

### Mô Tả:
"Đình công! Công nhân nghỉ tạm thời nhưng tinh thần cao hơn."

### Ảnh Hưởng Hiện Tại:

#### 1. **Đối với Công Nhân Con Người (👷)**
- **Dừng làm việc**: `isWorking = false`
  - Công nhân ngừng làm việc trên công trình
  - Công nhân không tiếp tục xây dựng trong lượt này
  
- **Tăng năng suất**: `productivity = 1.2` (từ 1.0 lên 1.2)
  - Năng suất tăng 20%
  - Khi công nhân quay lại làm việc, họ sẽ làm việc nhanh hơn

#### 2. **Đối với AI Workers (🤖)**
- **Không bị ảnh hưởng**: AI workers tiếp tục làm việc bình thường
- Năng suất không thay đổi

### Vấn Đề Hiện Tại:

#### 1. **Logic Xây Dựng**
Hiện tại, logic `updateBuildingProgress` chỉ kiểm tra `assignedWorkers` (công nhân được gán), không kiểm tra `isWorking`. Điều này có nghĩa là:
- Công nhân vẫn được tính vào tiến độ xây dựng ngay cả khi `isWorking = false`
- Sự kiện đình công không thực sự dừng việc xây dựng

#### 2. **Ảnh Hưởng Thực Tế**
- Công nhân vẫn tiếp tục xây dựng trong lượt đình công
- Chỉ có năng suất tăng lên 1.2x
- Không có tác động tiêu cực thực sự

### Đề Xuất Cải Thiện:

#### 1. **Sửa Logic Xây Dựng**
Cần kiểm tra `isWorking` trong `updateBuildingProgress`:
```typescript
const assignedWorkers = state.workers.filter((w) =>
  building.assignedWorkers.includes(w.id) && w.isWorking
);
```

#### 2. **Thêm Ảnh Hưởng Rõ Ràng Hơn**
- Công nhân thực sự dừng làm việc trong lượt đình công
- Công nhân quay lại làm việc với năng suất cao hơn (1.2x) ở lượt sau
- Có thể thêm thông báo rõ ràng hơn về việc công nhân đang đình công

#### 3. **Thêm Hiệu Ứng Visual**
- Hiển thị trạng thái "Đình công" trên công nhân
- Có thể thêm icon hoặc màu sắc để phân biệt

### Ảnh Hưởng Tổng Thể:

#### Tích Cực:
- ✅ Năng suất tăng 20% sau đình công
- ✅ Thể hiện sự thích ứng của công nhân con người

#### Tiêu Cực:
- ❌ Công nhân dừng làm việc (nếu logic được sửa đúng)
- ❌ Tiến độ xây dựng bị chậm lại trong lượt đình công

#### So Sánh với AI:
- AI không bị ảnh hưởng bởi đình công
- Điều này minh họa rõ ràng sự khác biệt giữa lao động con người và AI
- Công nhân con người có thể đình công để đòi quyền lợi, AI thì không

### Kết Luận:

Sự kiện "Đình công" minh họa rõ ràng:
1. **Lao động con người có quyền đình công** - Đây là đặc điểm của lao động sống
2. **Sau đình công, tinh thần cao hơn** - Phản ánh việc đấu tranh đòi quyền lợi
3. **AI không bị ảnh hưởng** - Máy móc không có quyền đình công

Tuy nhiên, cần sửa logic để sự kiện thực sự ảnh hưởng đến tiến độ xây dựng.

