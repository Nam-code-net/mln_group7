# Tính Toán Chi Phí Thuê Công Nhân

## Tình Huống Hiện Tại:

### Nhà ở:
- **Giá trị**: 10 điểm
- **Bán được**: 12💰 (120% giá trị)
- **Thời gian xây**: 5 lượt với 1 công nhân (buildSpeed=1) + 1 AI (buildSpeed=2) = tổng buildSpeed=3

### Chi Phí Thuê (Hiện Tại):
- **Công nhân**: 5💰 (một lần)
- **AI**: 15💰 (một lần)
- **Tổng**: 20💰

### Kết Quả:
- **Bán nhà**: 12💰
- **Chi phí thuê**: 20💰
- **Lỗ**: 12 - 20 = -8💰 ❌

## Vấn Đề:
Chi phí thuê công nhân quá cao so với giá trị bán nhà → Không có lời

## Giải Pháp:

### Phương Án 1: Giảm Chi Phí Thuê
- **Công nhân**: 3💰
- **AI**: 8💰
- **Tổng**: 11💰
- **Lời**: 12 - 11 = 1💰 ✅ (có lời nhỏ)

### Phương Án 2: Giảm Chi Phí Thuê Nhiều Hơn
- **Công nhân**: 2💰
- **AI**: 6💰
- **Tổng**: 8💰
- **Lời**: 12 - 8 = 4💰 ✅ (có lời tốt hơn)

### Phương Án 3: Tính Chi Phí Theo Lượt
- **Công nhân**: 1💰/lượt
- **AI**: 2💰/lượt
- **5 lượt**: (1 + 2) × 5 = 15💰
- **Lời**: 12 - 15 = -3💰 ❌ (vẫn lỗ)

## Khuyến Nghị:
Chọn **Phương Án 2**: Giảm chi phí thuê xuống 2💰 cho công nhân, 6💰 cho AI
- Đảm bảo có lời khi bán nhà
- Vẫn giữ được sự khác biệt giữa công nhân và AI
- Cân bằng hơn với giá trị công trình

