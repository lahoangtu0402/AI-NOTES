# Sổ tay AI

Website ghi chú học tập về AI và Khoa học dữ liệu, dựng bằng [Astro](https://astro.build). Bạn viết bài bằng Markdown, site tự dựng thành trang web có sidebar theo môn, tìm kiếm, công thức toán, giao diện sáng/tối.

## Chạy thử

Cần Node.js 22 trở lên.

```bash
npm install
npm run dev        # xem tại http://localhost:4321, hiện cả bài private
npm run build      # dựng bản xuất bản vào thư mục dist/ và tạo chỉ mục tìm kiếm
npm run preview    # xem bản dựng, dùng để thử chức năng tìm kiếm
```

Chức năng tìm kiếm (phím `/`) chỉ hoạt động sau `npm run build`, vì chỉ mục được tạo lúc build.

## Cấu trúc

```
_sources/                  file gốc (slide, PDF, báo cáo, đề thi): KHÔNG lên Git, KHÔNG lên web
templates/                 mẫu cho từng loại bài
scripts/new.mjs            lệnh tạo bài và môn mới
src/
├── config.ts              tên site, tiêu đề trang chủ, học kỳ hiện tại
├── content/
│   ├── courses/           mỗi môn / thư viện một file .md (tên file = mã môn)
│   └── notes/<mã-môn>/    các bài viết của môn đó
├── components/            icon clay, linh vật cú, hình hero, thẻ bài viết
├── layouts/Base.astro     khung trang: thanh trên, sidebar, tìm kiếm, đổi giao diện
├── pages/                 trang chủ, trang môn, trang bài, thẻ
└── styles/global.css      toàn bộ màu sắc và giao diện
```

Có hai loại "môn":

- `kind: course`: môn học theo học kỳ (Thị giác máy tính, Phân tích mạng xã hội...).
- `kind: library`: thư viện dùng chung (Thuật toán, Khái niệm, Nền tảng, Phương pháp nghiên cứu). Một thuật toán dùng ở nhiều môn thì viết **một lần** ở đây và liên kết tới.

## Thêm nội dung

### Thêm một môn học mới

```bash
npm run new -- course nlp "Xử lý ngôn ngữ tự nhiên"
```

Lệnh tạo `src/content/courses/nlp.md` và thư mục bài viết. Mở file ra chỉnh mô tả, `icon` và tên ngắn `short` (hiện trong sidebar). Icon có sẵn: `vision`, `network`, `algorithm`, `concept`, `research`, `math`, `code`, `data`.

### Thêm một bài viết

```bash
npm run new -- lecture   thi-giac-may-tinh "Phát hiện đối tượng"
npm run new -- paper     thi-giac-may-tinh "Vision Transformer"
npm run new -- algorithm thuat-toan        "DBSCAN"
npm run new -- concept   khai-niem         "Rò rỉ dữ liệu"
```

Loại bài: `lecture` (bài giảng), `paper` (bài báo), `report` (báo cáo), `exam` (ôn tập kiểm tra), `algorithm` (thuật toán), `concept` (khái niệm), `guide` (hướng dẫn). Mỗi loại có template riêng trong `templates/`, sửa template để hợp với cách bạn học.

### Các trường ở đầu bài (frontmatter)

| Trường | Ý nghĩa |
| --- | --- |
| `title`, `summary` | Tiêu đề và tóm tắt 1 đến 2 câu (hiện trên thẻ, trong kết quả tìm kiếm) |
| `course` | Mã môn, trùng tên file trong `src/content/courses/` |
| `type` | Loại bài (xem trên) |
| `level` | `beginner`, `intermediate`, `advanced` |
| `status` | `draft` (hiện cảnh báo "bản nháp") hoặc `reviewed` |
| `visibility` | `public` hoặc `private`. Bài `private` chỉ thấy khi `npm run dev`, **không có** trong bản build |
| `source`, `sourceTitle`, `lecturer` | Truy vết về file gốc trong `_sources/` |
| `paperUrl`, `paperAuthors`, `paperYear` | Với bài báo: liên kết arXiv hoặc DOI, không đăng file PDF |
| `prerequisites` | Bài nên học trước, ví dụ `[nen-tang/vector-va-ma-tran]` |
| `usedIn`, `related` | Bài có dùng nội dung này, và bài nên xem thêm |
| `tags` | Thẻ cắt ngang các môn, ví dụ `[cnn, graph]` |
| `order` | Thứ tự trong môn (số nhỏ đứng trước) |
| `updated` | Ghi đè ngày cập nhật (`2026-11-08`); mặc định lấy từ lịch sử Git |

Giá trị có dấu hai chấm `:` phải đặt trong dấu ngoặc kép, ví dụ `summary: "Ba cách đo: bậc, gần, trung gian"`. Nếu không YAML sẽ báo lỗi khi build.

Mã bài trong `prerequisites`, `usedIn`, `related` có dạng `ma-mon/ten-file` (không có đuôi `.md`). Nếu gõ sai, lệnh build in cảnh báo.

### Liên kết giữa các bài trong nội dung

Dùng đường dẫn **tương đối** để vẫn đúng khi deploy vào thư mục con:

```markdown
Xem [Quá khớp](../../khai-niem/overfitting/).
```

Từ bài ở `/ma-mon/ten-bai/`, `../../` đưa về gốc site.

### Công thức và code

- Công thức: `$a^2 + b^2$` trong dòng, hoặc khối `$$ ... $$` (KaTeX).
- Code: khối ba dấu huyền kèm tên ngôn ngữ, tự tô màu sáng/tối.

## Quy trình khi nhờ AI tóm tắt tài liệu

1. Lưu file gốc vào `_sources/<mã-môn>/...`.
2. Tạo bài bằng `npm run new`, rồi nhờ AI điền nội dung theo template (đính kèm file gốc).
3. **Đối chiếu bản tóm tắt với file gốc** (công thức, số liệu), sửa lại bằng lời của bạn, rồi mới đổi `status: reviewed`.
4. Báo cáo cá nhân và bài kiểm tra: để `visibility: private`. Chỉ đổi sang `public` khi giảng viên cho phép, và với bài kiểm tra thì chỉ đăng ghi chú rà soát lỗi, không đăng đề hay đáp án.

## Đổi giao diện

- Màu sắc: sửa các biến ở đầu `src/styles/global.css` (`:root` cho chế độ sáng, `:root[data-theme='dark']` cho chế độ tối). Nhớ sửa cả khối `@media (prefers-color-scheme: dark)` bên dưới cho khớp.
- Tên site, tiêu đề trang chủ, học kỳ: `src/config.ts`.
- Hình minh họa: các file SVG trong `src/components/` (`HeroDesk.astro`, `Owl.astro`, `CourseIcon.astro`). Muốn dùng ảnh riêng, thay phần `<svg>` bằng thẻ `<img>`.

## Triển khai lên GitHub Pages

1. Tạo repo trên GitHub rồi đẩy mã nguồn lên nhánh `main`.
2. Vào **Settings → Pages**, ở mục **Source** chọn **GitHub Actions**.
3. Mỗi lần push, workflow `.github/workflows/deploy.yml` tự build và xuất bản tại `https://<tên-bạn>.github.io/<tên-repo>/`.

Workflow đã đặt sẵn `SITE_URL` và `BASE_PATH` theo tên repo. Nếu dùng tên miền riêng hoặc repo dạng `<tên-bạn>.github.io`, đặt `BASE_PATH: /`.

> `_sources/` đã nằm trong `.gitignore`, nên file gốc không bị đẩy lên. Hãy chạy `git status` trước lần push đầu tiên để chắc chắn.

## Xử lý sự cố

- **Build báo `Nested mappings are not allowed`**: có giá trị chứa `: ` chưa đặt trong ngoặc kép (xem phần frontmatter).
- **Build báo `course "..." nhưng không có file tương ứng`**: trường `course` của bài không trùng tên file trong `src/content/courses/`.
- **Tìm kiếm báo "Chưa có chỉ mục"**: chạy `npm run build` rồi `npm run preview`; chế độ `npm run dev` không có chỉ mục.
- **Ngày cập nhật hiện sai hoặc bằng ngày build**: repo chưa có commit cho file đó, hoặc workflow thiếu `fetch-depth: 0`. Có thể ghi đè bằng trường `updated`.
