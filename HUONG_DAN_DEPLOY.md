# 🚀 Hướng dẫn Deploy lên GitHub và Vercel

## Bước 1: Chuẩn bị GitHub Repository

### 1.1. Tạo repository mới trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click vào dấu **+** ở góc trên bên phải → chọn **New repository**
3. Điền thông tin:
   - **Repository name**: `builder-chess` (hoặc tên bạn muốn)
   - **Description**: "Builder Chess: Labor Grid - Game mô phỏng lao động sản xuất"
   - Chọn **Public** (để deploy miễn phí trên Vercel)
   - **KHÔNG** tích vào "Add a README file" (vì bạn đã có code)
4. Click **Create repository**

### 1.2. Khởi tạo Git và push code lên GitHub

Mở terminal/PowerShell trong thư mục project và chạy các lệnh sau:

```bash
# Kiểm tra xem đã có git chưa
git status

# Nếu chưa có git, khởi tạo
git init

# Thêm tất cả files vào staging
git add .

# Commit code
git commit -m "Initial commit: Builder Chess game"

# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Đổi tên branch chính thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Lưu ý**: 
- Thay `YOUR_USERNAME` bằng username GitHub của bạn
- Thay `YOUR_REPO_NAME` bằng tên repository bạn vừa tạo
- Nếu GitHub yêu cầu authentication, bạn có thể:
  - Sử dụng Personal Access Token (Settings → Developer settings → Personal access tokens)
  - Hoặc sử dụng GitHub Desktop

## Bước 2: Deploy lên Vercel

### 2.1. Tạo tài khoản Vercel

1. Truy cập [Vercel](https://vercel.com)
2. Click **Sign Up** và đăng ký bằng GitHub (dễ nhất)
3. Authorize Vercel truy cập GitHub của bạn

### 2.2. Import Project từ GitHub

1. Sau khi đăng nhập Vercel, click **Add New...** → **Project**
2. Chọn repository `builder-chess` vừa push lên GitHub
3. Click **Import**

### 2.3. Cấu hình Build Settings

Vercel sẽ tự động detect Vite, nhưng bạn cần kiểm tra:

**Framework Preset**: Vite (tự động)

**Root Directory**: `./` (hoặc để trống)

**Build Command**: 
```
pnpm build
```

**Output Directory**: 
```
dist/public
```

**Install Command**:
```
pnpm install
```

### 2.4. Environment Variables (nếu cần)

Nếu project có biến môi trường, thêm vào:
- Settings → Environment Variables
- Thêm các biến cần thiết

### 2.5. Deploy

1. Click **Deploy**
2. Chờ quá trình build hoàn tất (thường 2-5 phút)
3. Sau khi deploy xong, bạn sẽ nhận được link như: `https://your-project.vercel.app`

## Bước 3: Cấu hình tùy chọn (Optional)

### 3.1. Custom Domain (nếu có)

1. Vào Project Settings → Domains
2. Thêm domain của bạn
3. Làm theo hướng dẫn để cấu hình DNS

### 3.2. Auto Deploy

Mặc định, Vercel sẽ tự động deploy mỗi khi bạn push code lên GitHub branch `main`.

## Bước 4: Kiểm tra và Test

1. Truy cập link Vercel đã cung cấp
2. Test các tính năng:
   - Thêm người chơi
   - Bắt đầu game
   - Tham gia game (Join Game)
   - Chơi game

## Troubleshooting

### Lỗi Build Failed

**Nguyên nhân**: 
- Thiếu dependencies
- Build command sai
- Output directory sai

**Giải pháp**:
1. Kiểm tra `package.json` có đầy đủ dependencies
2. Kiểm tra Build Command và Output Directory trong Vercel settings
3. Xem logs trong Vercel để biết lỗi cụ thể

### Lỗi 404 khi truy cập

**Nguyên nhân**: 
- Routing không đúng
- Output directory sai

**Giải pháp**:
1. Tạo file `vercel.json` (xem bên dưới)
2. Kiểm tra Output Directory là `dist/public`

### Lỗi Module not found

**Nguyên nhân**: 
- Dependencies chưa được install
- Path alias không đúng

**Giải pháp**:
1. Đảm bảo `pnpm install` chạy thành công
2. Kiểm tra `vite.config.ts` có cấu hình alias đúng

## File vercel.json (nếu cần)

Nếu gặp vấn đề với routing, tạo file `vercel.json` ở root:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/public",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Lưu ý quan trọng

1. **Public Repository**: Vercel miễn phí yêu cầu repository phải public
2. **Build Time**: Build lần đầu có thể mất 3-5 phút
3. **Auto Deploy**: Mỗi lần push lên `main` branch sẽ tự động deploy
4. **Preview Deployments**: Vercel tự động tạo preview cho mỗi Pull Request

## Cập nhật code sau này

Sau khi đã deploy, mỗi khi muốn cập nhật:

```bash
# Sửa code
# ...

# Commit và push
git add .
git commit -m "Update: mô tả thay đổi"
git push origin main
```

Vercel sẽ tự động deploy bản mới!

## Link hữu ích

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Guide](https://docs.github.com/en/get-started)

---

**Chúc bạn deploy thành công! 🎉**

