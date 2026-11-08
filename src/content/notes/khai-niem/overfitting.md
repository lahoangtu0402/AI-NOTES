---
title: Quá khớp (overfitting)
summary: Mô hình học thuộc cả nhiễu của dữ liệu huấn luyện nên kém trên dữ liệu mới. Cách nhận biết và cách xử lý.
course: khai-niem
type: concept
tags: [generalization, evaluation]
level: beginner
status: draft
usedIn: [thi-giac-may-tinh/resnet]
order: 10
---

## Định nghĩa một câu

Quá khớp xảy ra khi mô hình đạt kết quả tốt trên dữ liệu huấn luyện nhưng **tệ hơn rõ rệt** trên dữ liệu chưa từng thấy.

## Trực giác

Một học sinh học thuộc đáp án của đề năm ngoái sẽ làm đúng đề cũ nhưng sai đề mới. Mô hình quá khớp cũng vậy: nó ghi nhớ từng mẫu, kể cả phần nhiễu ngẫu nhiên, thay vì nắm quy luật chung.

## Ví dụ bằng số

Khớp đa thức bậc khác nhau vào 15 điểm của đường $\sin(2\pi x)$ cộng nhiễu, rồi đo sai số bình phương trung bình (MSE) trên tập huấn luyện và trên 500 điểm kiểm tra mới:

```python
import numpy as np

rng = np.random.default_rng(0)
f = lambda x: np.sin(2 * np.pi * x)

x_tr = rng.uniform(0, 1, 15)
y_tr = f(x_tr) + rng.normal(0, 0.2, x_tr.size)
x_te = rng.uniform(0, 1, 500)
y_te = f(x_te) + rng.normal(0, 0.2, x_te.size)

for deg in (1, 3, 9, 14):
    coef = np.polyfit(x_tr, y_tr, deg)
    mse = lambda x, y: np.mean((np.polyval(coef, x) - y) ** 2)
    print(deg, round(mse(x_tr, y_tr), 4), round(mse(x_te, y_te), 4))
```

| Bậc | MSE huấn luyện | MSE kiểm tra | Chẩn đoán |
| --- | --- | --- | --- |
| 1 | 0,147 | 0,363 | Chưa khớp (quá đơn giản) |
| 3 | 0,017 | 0,043 | Vừa phải |
| 9 | 0,010 | 0,895 | Quá khớp |
| 14 | gần 0 | khoảng $1{,}9 \times 10^{8}$ | Quá khớp nặng |

Bậc 14 với 15 điểm đi qua đúng mọi điểm huấn luyện, nên sai số huấn luyện bằng 0 nhưng đường cong dao động dữ dội giữa các điểm. Khi chạy, NumPy có thể in cảnh báo `RankWarning` vì bài toán thiếu điều kiện.

## Dấu hiệu nhận biết

- Sai số huấn luyện tiếp tục giảm, còn sai số kiểm định (validation) ngừng giảm rồi tăng lên.
- Khoảng cách giữa hai đường sai số mở rộng dần.

Nếu cả hai sai số đều cao thì đó là **chưa khớp** (underfitting), hướng xử lý ngược lại: mô hình cần mạnh hơn.

## Cách xử lý

- **Thêm dữ liệu**, hoặc tăng cường dữ liệu (data augmentation) với ảnh.
- **Giảm độ phức tạp** của mô hình (ít tham số, cây nông hơn).
- **Điều chuẩn (regularization)**: thêm phạt vào hàm mất mát, ví dụ L2:

$$
J(w) = L(w) + \lambda \lVert w \rVert_2^2
$$

- **Dropout** với mạng nơ-ron: ngẫu nhiên tắt một số nơ-ron khi huấn luyện.
- **Dừng sớm (early stopping)**: dừng huấn luyện khi sai số kiểm định bắt đầu tăng.
- **Đánh giá đúng cách**: chia train, validation, test; không chỉnh siêu tham số dựa trên tập test.

## Lưu ý quan trọng

Không phải mọi kết quả kém của mạng sâu đều là quá khớp. Trong bài báo ResNet, mạng sâu hơn có lỗi **huấn luyện cao hơn**, tức là vấn đề tối ưu hóa chứ không phải quá khớp. Xem [ResNet](../../thi-giac-may-tinh/resnet/).

## Khái niệm liên quan

- Đánh đổi thiên lệch và phương sai (bias-variance tradeoff).
- Rò rỉ dữ liệu (data leakage): làm kết quả kiểm tra đẹp một cách giả tạo.
