# Number Input Component Demo

Một component input number với các tính năng validation và UI đẹp mắt sử dụng React và TailwindCSS.

**Repository:** [https://github.com/xuankien2k/gem-talent-project](https://github.com/xuankien2k/gem-talent-project)

**Live Demo:** [GitHub Pages](https://xuankien2k.github.io/gem-talent-project/) (sau khi deploy)

## Tính năng

### Unit Selection
- Hỗ trợ 2 đơn vị: **%** (phần trăm) và **px** (pixels)
- Giá trị mặc định: **%**

### Value Stepper
- Cho phép nhập số nguyên và số thập phân
- Tự động thay thế dấu phẩy thành dấu chấm (VD: 12,3 → 12.3)
- Tự động loại bỏ ký tự không hợp lệ khi blur:
  - `123a` → `123`
  - `12a3` → `12`
  - `a123` → `123`
  - `12.4.5` → Giá trị hợp lệ gần nhất
- Tự động đặt về 0 nếu nhập < 0 khi blur

### Validation cho % mode
- Tự động revert về giá trị hợp lệ trước đó nếu nhập > 100 khi blur
- Disable button "-" khi giá trị = 0
- Disable button "+" khi giá trị = 100
- Hiển thị tooltip khi hover vào button bị disable
- Tự động cập nhật về 100 khi chuyển từ px sang % và giá trị hiện tại > 100

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Cấu trúc dự án

```
src/
  ├── components/
  │   ├── NumberInput.jsx      # Component chính
  │   └── NumberInput.test.jsx  # Unit tests
  ├── App.jsx                   # File demo
  └── main.jsx                  # Entry point
```

## Deployment

### GitHub Pages (Đã cấu hình sẵn)

Repository đã được cấu hình với GitHub Actions để tự động deploy lên GitHub Pages.

1. Push code lên repository:
```bash
git push -u origin main
```

2. Vào Settings > Pages trong GitHub repository
3. Chọn Source: "GitHub Actions"
4. Code sẽ tự động build và deploy khi push lên branch `main`

**Lưu ý:** Base path đã được cấu hình là `/gem-talent-project/` trong `vite.config.js`

### Netlify

1. Kết nối repository với Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

1. Cài đặt Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Vitest** - Testing framework
- **Testing Library** - React testing utilities

## License

MIT
