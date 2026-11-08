---
title: Cách đọc một bài báo khoa học
summary: Quy trình đọc ba lượt của Keshav và mẫu ghi chú sáu mục để ghi lại mỗi bài báo.
course: phuong-phap-nghien-cuu
type: guide
tags: [paper, research-skill]
level: beginner
status: draft
related: [thi-giac-may-tinh/resnet]
order: 10
---

## Vì sao cần quy trình

Một bài báo không đọc từ đầu đến cuối như sách. Nếu đọc kỹ ngay từ đầu, bạn mất hàng giờ cho một bài có thể không liên quan. Quy trình ba lượt giúp quyết định **có đáng đọc sâu hay không** trước khi bỏ công.

## Ba lượt đọc

Theo S. Keshav, *How to Read a Paper* (ACM SIGCOMM Computer Communication Review, 2007):

**Lượt 1, đọc lướt (khoảng 5 đến 10 phút).** Đọc tiêu đề, tóm tắt, phần mở đầu, tiêu đề các mục, phần kết luận và lướt qua danh sách tài liệu tham khảo. Mục tiêu: bài này nói về gì, thuộc loại nào, có đáng đọc tiếp không.

**Lượt 2, đọc nắm nội dung (tối đa khoảng một giờ).** Đọc kỹ hơn nhưng bỏ qua chứng minh chi tiết. Chú ý các hình vẽ, bảng, trục của biểu đồ. Đánh dấu tài liệu tham khảo quan trọng chưa đọc. Mục tiêu: tóm tắt được ý chính và bằng chứng cho người khác.

**Lượt 3, đọc để tái hiện (vài giờ với người mới).** Đặt mình vào vị trí tác giả, tự dựng lại giả định và phương pháp, so với bài gốc để tìm điểm khác. Mục tiêu: thấy cả điểm mạnh lẫn điểm yếu, và biết cách tự cài đặt lại.

## Mẫu ghi chú sáu mục

Mỗi bài báo một trang theo mẫu này (xem ví dụ ở [ResNet](../../thi-giac-may-tinh/resnet/)):

1. **Vấn đề:** bài giải quyết gì, vì sao đáng quan tâm.
2. **Ý tưởng chính:** hai đến ba câu bằng lời của bạn.
3. **Phương pháp:** mô hình, dữ liệu, thước đo.
4. **Kết quả chính:** kèm con số và so với cái gì.
5. **Hạn chế và câu hỏi mở:** những gì bài chưa làm được hoặc chưa kiểm chứng.
6. **Tái hiện:** đã thử chạy lại chưa, kết quả ra sao.

## Câu hỏi nên tự hỏi khi đọc

- Điểm so sánh (baseline) có công bằng không? Cùng dữ liệu, cùng ngân sách tính toán?
- Kết quả có kèm khoảng dao động (nhiều lần chạy, nhiều hạt giống ngẫu nhiên) hay chỉ một con số?
- Mỗi thành phần đề xuất có thí nghiệm cắt bỏ (ablation) chứng minh nó thật sự cần thiết không?
- Có mã nguồn và dữ liệu để chạy lại không?

## Lời khuyên

- Ghi chú bằng lời của bạn, không chép lại câu của tác giả. Nếu không diễn đạt lại được, bạn chưa hiểu.
- Đọc tóm tắt kèm phần hình vẽ trước, rồi mới quyết định đọc phần còn lại.
- Giữ file PDF trong Zotero hoặc thư mục `_sources/`, trên web chỉ đặt liên kết arXiv hoặc DOI.
