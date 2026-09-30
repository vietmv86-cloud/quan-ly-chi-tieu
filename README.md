# 🌸 CHI TIÊU GIA ĐÌNH

Sổ ghi thu chi gia đình mỗi ngày — chạy hoàn toàn trong trình duyệt, không cần máy chủ, không cần đăng nhập. Dữ liệu lưu ngay trên máy của bạn (localStorage).

## Tính năng
- Ghi thu / chi theo nhóm lớn và mục con (có sẵn nhóm mẫu: Ăn uống, Nhà ở tiện ích, Đi lại, Con cái, Mua sắm/giải trí...).
- Tự thêm, đổi tên, đổi biểu tượng, xóa nhóm và mục con.
- Sổ ghi chép theo ngày, tổng thu/chi/còn lại chỉnh sửa nhanh.
- Tìm kiếm theo nội dung, theo khoảng ngày, theo khoảng số tiền — không giới hạn tháng.
- Báo cáo theo tuần / tháng / năm, biểu đồ tròn theo nhóm và so sánh thu–chi.
- Nhắc nhở chi tiêu hợp lý cuối mỗi tháng.
- Sao lưu: tự động lưu bản theo ngày trong máy, xuất file `.json`, sao chép mã để dán vào Ghi chú/Zalo, và nhập lại từ file cũ.
- Cài được như một app (PWA): thêm ra màn hình chính, mở được cả khi không có mạng.

## Cấu trúc mã nguồn
```
├── index.html        Trang chính
├── css/style.css      Toàn bộ giao diện
├── js/app.js          Toàn bộ logic (thêm/sửa/xóa, báo cáo, tìm kiếm, sao lưu)
├── manifest.json      Khai báo PWA (tên, icon, màu)
├── sw.js              Service worker — cho phép mở khi không có mạng
├── icons/             Icon app các cỡ
├── LICENSE            Giấy phép MIT
└── .gitignore
```
Không có bước build nào cả — đây là web thuần (HTML/CSS/JS), mở thẳng `index.html` cũng chạy được.

## Đưa lên GitHub
```bash
git init
git add .
git commit -m "Chi tieu gia dinh"
git branch -M main
git remote add origin https://github.com/<ten-ban>/<ten-repo>.git
git push -u origin main
```

## Chạy miễn phí trên các nền tảng

### GitHub Pages (đơn giản nhất, cùng chỗ với repo)
1. Vào repo trên GitHub → **Settings → Pages**.
2. Ở **Source**, chọn nhánh `main`, thư mục `/ (root)` → **Save**.
3. Sau khoảng 1 phút, trang sẽ chạy ở `https://<ten-ban>.github.io/<ten-repo>/`.

### Netlify
1. Đăng nhập [netlify.com](https://www.netlify.com) bằng GitHub.
2. **Add new site → Import an existing project** → chọn repo này.
3. Build command: để trống. Publish directory: `.` (thư mục gốc).
4. Bấm **Deploy**.

### Vercel
1. Đăng nhập [vercel.com](https://vercel.com) bằng GitHub.
2. **Add New → Project** → chọn repo này.
3. Framework Preset chọn **Other**, Build Command và Output Directory để trống.
4. Bấm **Deploy**.

### Cloudflare Pages
1. Đăng nhập [pages.cloudflare.com](https://pages.cloudflare.com) bằng GitHub.
2. **Create a project → Connect to Git** → chọn repo này.
3. Build command để trống, Build output directory để `/`.
4. Bấm **Save and Deploy**.

Cả bốn nơi trên đều có gói miễn phí đủ dùng cho một trang tĩnh như thế này, và đều tự cấp HTTPS.

## Dùng như app trên điện thoại
- **iPhone (Safari):** mở link → nút Chia sẻ → **Thêm vào Màn hình chính**.
- **Android (Chrome):** mở link → menu ⋮ → **Thêm vào màn hình chính** / **Cài đặt ứng dụng**.

## Về dữ liệu — điều quan trọng cần biết
- Dữ liệu lưu trong **localStorage của trình duyệt, theo từng tên miền**. Nghĩa là:
  - Dữ liệu trên bản Claude Artifact (claude.ai) và dữ liệu trên bản bạn tự host (GitHub Pages...) là **hai nơi lưu riêng biệt**, không tự đồng bộ.
  - Xóa dữ liệu duyệt web (Safari/Chrome) của đúng trang đó sẽ mất dữ liệu; đổi trình duyệt hoặc đổi máy cũng không thấy dữ liệu cũ.
- Vì vậy hãy dùng các cách sao lưu có sẵn trong tab **Sao lưu**:
  - **Lưu file** — xuất ra file `.json`, cất vào iCloud Drive/Google Drive.
  - **Gửi mã sao lưu** — dán vào Ghi chú, Zalo, email của chính bạn.
  - **Khôi phục** — dán lại mã, hoặc chọn file `.json` để lấy lại dữ liệu (kể cả trên máy/trình duyệt khác).
- Riêng mục **"Lưu lên tài khoản Claude"** chỉ hoạt động khi mở app dưới dạng Artifact trong Claude — bản tự host trên GitHub Pages/Netlify/Vercel sẽ không dùng được mục này (ba cách sao lưu còn lại vẫn hoạt động bình thường).

## Tuỳ biến
- Đổi tên nhóm/mục con, thêm biểu tượng: vào tab **Mục** trong app, không cần sửa mã nguồn.
- Muốn đổi màu chủ đạo hoặc phông chữ: sửa các biến `:root{...}` ở đầu file `css/style.css`.
- Muốn đổi tên hiển thị / icon khi cài ra màn hình chính: sửa `manifest.json` và các file trong `icons/`.
