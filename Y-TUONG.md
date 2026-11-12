# Sổ tay AI

Website ghi chú học tập về **Trí tuệ nhân tạo (AI)** và **Khoa học dữ liệu**, viết dần theo từng môn học trong chương trình Thạc sĩ Công nghệ thông tin.

Trang xuất bản: <https://lahoangtu0402.github.io/AI-NOTES/>

> Hướng dẫn chạy, thêm bài và triển khai nằm ở [HUONG-DAN.md](HUONG-DAN.md). File này chỉ nói về **ý tưởng và cách tổ chức**.

---

## 1. Ý tưởng

Tôi là lập trình viên fullstack, đang học Thạc sĩ CNTT, chưa có nhiều kinh nghiệm làm nghiên cứu AI. Hiện đang học Computer Vision, Social Network và một số thuật toán cơ bản.

Thay vì ghi chú rời rạc trong file Word hay PDF, tôi dựng một website để:

- **Học bằng cách viết lại**: tóm tắt, chỉnh sửa bài giảng bằng lời của mình, tự cài đặt thuật toán rồi mới đăng.
- **Ôn lại dễ dàng**: mọi thứ nằm một chỗ, có tìm kiếm, có nhãn `draft`/`reviewed` để biết bài nào cần xem lại.
- **Mở rộng liên tục**: thêm môn mới, thuật toán mới, khái niệm mới mà không phải sửa cấu trúc cũ.
- **Chia sẻ cho người sau**: người mới đọc được từ cơ bản, theo đúng thứ tự "học gì trước, học gì sau".

Cách làm này gọi là **digital garden**: trang ghi chú được trồng dần và chăm sóc liên tục, chứ không phải một sản phẩm hoàn chỉnh một lần.

## 2. Nguyên tắc

1. **Nội dung quan trọng hơn code.** Mục đích là học, nên website giữ đơn giản nhất có thể: file Markdown trong Git, tự build và deploy. Chưa cần đăng nhập, cơ sở dữ liệu hay hệ thống quiz.
2. **Viết bằng lời của mình.** Không chép nguyên văn sách hay bài giảng. Không diễn đạt lại được nghĩa là chưa hiểu.
3. **Tách "nguồn gốc" khỏi "kiến thức đã chế biến".** File gốc giữ riêng và không công khai, trên web chỉ có bản tóm tắt trỏ về nguồn.
4. **Viết một lần, liên kết nhiều nơi.** Một thuật toán dùng ở nhiều môn chỉ có một trang chuẩn.
5. **Tái lập được.** Code chạy được, thí nghiệm có repo riêng, có hạt giống ngẫu nhiên và danh sách thư viện.
6. **Thuật ngữ tiếng Anh giữ trong ngoặc.** Viết tiếng Việt để hiểu sâu, nhưng bài báo đều bằng tiếng Anh nên cần quen thuật ngữ gốc.

## 3. Cấu trúc nội dung

Có hai trục cắt ngang nhau.

**Trục môn học** (theo học kỳ):

- Thị giác máy tính và nhận dạng mẫu
- Phân tích mạng xã hội
- Các môn sẽ học tiếp: thêm một file môn và một thư mục bài viết

**Trục thư viện dùng chung** (không thuộc môn nào):

| Thư viện | Chứa gì |
| --- | --- |
| Nền tảng | Đại số tuyến tính, xác suất thống kê, Python/NumPy |
| Thuật toán | K-means, PageRank, DBSCAN... mỗi thuật toán một trang chuẩn |
| Khái niệm | Quá khớp, đánh giá mô hình, rò rỉ dữ liệu... |
| Phương pháp nghiên cứu | Cách đọc paper, thiết kế thí nghiệm, ablation, tái lập kết quả |

**Quy tắc quyết định để ở đâu:**

- Dùng ở từ hai môn trở lên, hoặc là nền tảng: để trong thư viện.
- Chỉ có nghĩa trong một môn (ví dụ Non-Maximum Suppression của object detection): để trong môn đó.
- Phân vân: để trong môn trước, khi môn thứ hai cần dùng thì chuyển ra thư viện và sửa liên kết.

**Các cách nối bài với nhau** (khai báo ở đầu mỗi bài):

- `prerequisites`: nên học gì trước.
- `usedIn`: thuật toán/khái niệm này được dùng ở bài nào.
- `related`: xem thêm.
- `tags`: thẻ cắt ngang các môn, ví dụ bài CNN và bài GNN cùng thẻ `deep-learning`.

## 4. Các loại tài liệu và cách xử lý

Mỗi môn thường có năm loại tài liệu. File gốc giữ trong `_sources/` (bị Git bỏ qua, không lên web). Trên web chỉ đăng bản đã chế biến.

| Loại | File gốc | Trên web | Công khai? |
| --- | --- | --- | --- |
| Bài giảng | Slide, PDF | Mỗi buổi một trang tóm tắt theo template, viết lại theo cách hiểu của mình | Có |
| Bài báo nghiên cứu | PDF (giữ trong Zotero hoặc `_sources/`) | Ghi chú đọc paper, kèm liên kết arXiv/DOI, không đăng file PDF | Có |
| Báo cáo cá nhân (chủ đề A, B) | Bản nộp | Bản chắt lọc: bài toán, phương pháp, kết quả, bài học, liên kết repo | Mặc định riêng tư, chỉ đăng khi giảng viên cho phép |
| Bài kiểm tra | Đề và bài làm | Ghi chú "rà soát lỗi": sai ở khái niệm nào, hiểu nhầm gì, cách sửa. Không đăng đề hay đáp án | Riêng tư hoặc chỉ ghi chú rà soát |
| Thuật toán, khái niệm | Không có | Trang chuẩn viết một lần, các môn liên kết tới | Có |

**Vì sao tách như vậy:** slide và bài giảng thuộc quyền giảng viên và nhà trường. Báo cáo và bài kiểm tra công khai có thể bị chép hoặc bị phần mềm kiểm tra đạo văn đánh dấu về sau, hoặc ảnh hưởng nếu định gửi đi hội nghị, tạp chí.

## 5. Template bài viết

**Bài giảng:** mục tiêu → trực giác → công thức → code tối giản → lỗi thường gặp → bài tập → tài liệu tham khảo.

**Thuật toán:** bài toán (đầu vào/đầu ra) → trực giác → thuật toán → độ phức tạp và giả định → cài đặt từ đầu bằng NumPy rồi so với scikit-learn → biến thể → được dùng ở đâu → nguồn gốc.

**Khái niệm:** định nghĩa một câu → trực giác → ví dụ và phản ví dụ → dấu hiệu nhận biết → cách xử lý → khái niệm liên quan.

**Đọc paper** (kỹ năng cốt lõi cho luận văn): vấn đề → ý tưởng chính (bằng lời của mình) → phương pháp, dữ liệu, thước đo → kết quả và hạn chế → câu hỏi còn mở → đã tái hiện chưa.

Mỗi bài có nhãn trạng thái: **`draft`** (chưa đối chiếu lại với tài liệu gốc) và **`reviewed`** (đã rà soát).

## 6. Quy trình làm việc

**Khi học một buổi mới hoặc thêm tài liệu:**

1. Lưu file gốc vào `_sources/<mã-môn>/...`.
2. Tạo bài từ template (`npm run new -- lecture <mã-môn> "Tên bài"`).
3. Nhờ AI tóm tắt theo template, hoặc tự viết phần trực giác trước.
4. **Đối chiếu với file gốc** (công thức, số liệu), sửa bằng lời của mình, rồi mới đổi sang `reviewed`.
5. Tách thuật toán/khái niệm xuất hiện trong bài thành trang riêng ở thư viện, bài giảng chỉ liên kết tới.

**Khi thêm một thuật toán mới:** viết trực giác trước → tự cài đặt từ đầu → so kết quả với thư viện → thêm liên kết hai chiều với các bài liên quan. Bước tự cài đặt là bước lộ ra chỗ mình hiểu chưa chắc.

**Nhịp gợi ý:** mỗi tuần một bài kiến thức và một ghi chú paper; cuối tháng quay lại ôn và sửa các bài còn `draft`.

## 7. Giao diện

Tham khảo cảm giác của một trang học liệu dạng thẻ: **tông màu ấm, thẻ môn học, chế độ sáng/tối, hình minh họa phong cách clay** (đồ vật 3D mềm) kèm một linh vật cú.

Trang có: trang chủ với hero và thống kê, sidebar "Danh mục", tìm kiếm bằng phím `/`, mục lục từng bài, công thức toán, code tô màu theo giao diện sáng/tối, ngày cập nhật lấy từ lịch sử Git, dùng được trên điện thoại.

## 8. Công nghệ

| Phần | Công cụ |
| --- | --- |
| Khung site | [Astro](https://astro.build), nội dung viết bằng Markdown |
| Công thức | KaTeX (`remark-math` và `rehype-katex`) |
| Tìm kiếm | Pagefind (tạo chỉ mục lúc build) |
| Hình minh họa | SVG tự vẽ, không cần file ảnh |
| Triển khai | GitHub Pages qua GitHub Actions |

## 9. Hiện trạng và lộ trình

**Đã có:**

- Khung site hoàn chỉnh, giao diện sáng/tối, tìm kiếm, công thức, deploy tự động.
- Cấu trúc môn học và thư viện dùng chung, thẻ, liên kết giữa các bài.
- 7 template và lệnh tạo bài/môn mới.
- 10 bài mẫu (8 công khai, 2 riêng tư): tích chập và pooling, ResNet, độ đo trung tâm, K-means, PageRank, quá khớp, vector và ma trận, cách đọc paper, cùng khung báo cáo và rà soát kiểm tra.

**Dự định, chưa làm:**

- [ ] Trang **Lộ trình học** cắt qua nhiều môn (ví dụ "từ con số 0 đến CNN", "phân tích mạng xã hội bằng ML", "đọc paper lần đầu").
- [ ] Mục **Dự án và thí nghiệm**, kèm repo thí nghiệm riêng (notebook, `requirements.txt`).
- [ ] **Demo tương tác**: chạy Python ngay trên trình duyệt (Pyodide), chạy mô hình nhỏ (TensorFlow.js, ONNX Runtime Web, transformers.js), nhúng Gradio/Streamlit từ Hugging Face Spaces, trực quan hóa đồ thị bằng D3.js hoặc Cytoscape.js cho phần Social Network.
- [ ] Quản lý tài liệu tham khảo bằng Zotero/BibTeX để viết luận văn đỡ vất vả.
- [ ] Bình luận bằng Giscus (GitHub Discussions), nếu muốn người đọc góp ý.
- [ ] Thêm các môn và thuật toán mới theo tiến độ học thực tế.

**Cố ý chưa làm:** đăng nhập, cơ sở dữ liệu, hệ thống quiz và lưu tiến độ học. Chỉ thêm nếu sau này thật sự cần.

## 10. Lưu ý về bản quyền và liêm chính học thuật

- Không đưa slide, PDF bài giảng, bài báo có bản quyền lên repo công khai.
- Không đăng đề kiểm tra hay đáp án.
- Hỏi giảng viên trước khi công khai báo cáo cá nhân.
- Ghi rõ nguồn mọi nội dung tham khảo, diễn đạt lại bằng lời của mình.
- Bản tóm tắt do AI viết có thể thiếu ý hoặc sai công thức, luôn đối chiếu với tài liệu gốc trước khi chuyển sang `reviewed`.
