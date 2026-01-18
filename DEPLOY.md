# Hướng dẫn Deploy

## Đẩy code lên GitHub

Code đã được commit sẵn. Bạn chỉ cần push lên GitHub:

```bash
git push -u origin main
```

Nếu gặp lỗi authentication, bạn có thể:
1. Sử dụng Personal Access Token thay vì password
2. Hoặc cấu hình SSH key

## Kích hoạt GitHub Pages

1. Vào repository trên GitHub: https://github.com/xuankien2k/gem-talent-project
2. Vào **Settings** > **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**
4. GitHub Actions sẽ tự động build và deploy khi bạn push code lên branch `main`

## Kiểm tra deployment

Sau khi push code và GitHub Actions chạy xong, bạn có thể truy cập:
- **GitHub Pages URL**: https://xuankien2k.github.io/gem-talent-project/

## Chạy local

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build local

```bash
npm run build
```

## Chạy tests

```bash
npm test
```
