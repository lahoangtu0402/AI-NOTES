---
title: "ResNet: học phần dư để huấn luyện mạng rất sâu"
summary: Ghi chú đọc bài báo Deep Residual Learning for Image Recognition. Kết nối tắt giúp mạng hàng trăm lớp huấn luyện được.
course: thi-giac-may-tinh
type: paper
tags: [cnn, residual, paper]
level: intermediate
status: draft
paperUrl: https://arxiv.org/abs/1512.03385
paperAuthors: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
paperYear: 2016
prerequisites: [thi-giac-may-tinh/tich-chap-va-pooling, khai-niem/overfitting]
order: 20
---

> Đây là ghi chú theo [mẫu đọc paper](../../phuong-phap-nghien-cuu/cach-doc-mot-paper/): vấn đề, ý tưởng, thực nghiệm, hạn chế, câu hỏi mở.

## Vấn đề

Mạng sâu hơn thường biểu diễn tốt hơn, nhưng khi tăng độ sâu một cách đơn giản (xếp chồng thêm lớp), độ chính xác lại **giảm** sau một ngưỡng. Tác giả gọi đây là **degradation problem**.

Điểm đáng chú ý: lỗi giảm cả trên **tập huấn luyện**, nên đây không phải quá khớp (xem [Quá khớp](../../khai-niem/overfitting/)). Nghĩa là một mạng sâu hơn, về lý thuyết có thể bắt chước mạng nông bằng cách để các lớp thừa làm "không làm gì", nhưng bộ tối ưu không tìm được lời giải đó.

## Ý tưởng chính

Thay vì bắt một nhóm lớp học thẳng ánh xạ mong muốn $\mathcal{H}(x)$, ta cho nhóm lớp học **phần dư**:

$$
\mathcal{F}(x) := \mathcal{H}(x) - x, \qquad y = \mathcal{F}(x) + x
$$

Phép cộng $+x$ là **kết nối tắt** (shortcut/skip connection), đưa đầu vào đi thẳng sang đầu ra. Nếu ánh xạ tối ưu gần với "giữ nguyên", ta chỉ cần đẩy $\mathcal{F}(x)$ về 0, dễ hơn nhiều so với học lại phép đồng nhất bằng một chồng lớp phi tuyến.

## Phương pháp

- Một **khối dư** gồm hai lớp tích chập $3 \times 3$ (bản cơ bản) kèm kết nối tắt. Với mạng sâu hơn (50, 101, 152 lớp) dùng khối **bottleneck**: $1 \times 1$ giảm chiều, $3 \times 3$, rồi $1 \times 1$ tăng chiều lại.
- Khi số kênh hoặc kích thước thay đổi, kết nối tắt dùng phép chiếu (ví dụ tích chập $1 \times 1$) để hai nhánh cùng dạng trước khi cộng.
- Các phiên bản chuẩn: ResNet-18, 34, 50, 101, 152.
- Dữ liệu và thước đo: ImageNet (phân loại ảnh, lỗi top-5) và CIFAR-10, ngoài ra có thử nghiệm phát hiện đối tượng và phân đoạn trên COCO.

## Kết quả chính

- Với mạng thường (không kết nối tắt), 34 lớp tệ hơn 18 lớp. Với ResNet, 34 lớp tốt hơn 18 lớp: vấn đề suy giảm biến mất.
- Một tập hợp (ensemble) các ResNet đạt lỗi top-5 3,57% trên tập kiểm tra ImageNet và thắng cuộc thi phân loại ILSVRC 2015.
- Trên CIFAR-10, nhóm tác giả huấn luyện thành công cả mạng trên 1000 lớp, dù mạng quá sâu như vậy cho kết quả không tốt hơn mạng 110 lớp.

## Hạn chế và câu hỏi còn mở

- Bài báo chứng minh bằng thực nghiệm là chính; **vì sao** kết nối tắt giúp tối ưu dễ hơn vẫn được nhiều nghiên cứu sau đó phân tích tiếp (về dòng gradient, về cảnh quan hàm mất mát).
- Tăng độ sâu có lợi suy giảm dần: từ 110 lên 1202 lớp trên CIFAR-10 không cải thiện.
- Tự hỏi: nếu kết nối tắt cộng đơn giản là đủ, các biến thể (nhân, cổng, nối kênh) đem lại gì thêm?

## Tái hiện

Chưa thực hiện. Việc nên làm đầu tiên: huấn luyện ResNet-18 và một mạng thường cùng độ sâu trên CIFAR-10, vẽ hai đường lỗi huấn luyện cạnh nhau.

## Tài liệu tham khảo

- He, K., Zhang, X., Ren, S., Sun, J. *Deep Residual Learning for Image Recognition.* CVPR 2016. [arXiv:1512.03385](https://arxiv.org/abs/1512.03385)
