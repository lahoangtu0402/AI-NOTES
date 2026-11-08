---
title: Vector và ma trận
summary: "Tối thiểu về đại số tuyến tính để đọc được các bài học máy: vector, tích vô hướng, nhân ma trận và vector riêng."
course: nen-tang
type: concept
tags: [linear-algebra, foundations]
level: beginner
status: draft
order: 10
---

## Vì sao cần

Gần như mọi thuật toán trong các môn khác đều viết bằng vector và ma trận: một ảnh là ma trận, một mẫu dữ liệu là vector, một lớp mạng nơ-ron là phép nhân ma trận.

## Vector và tích vô hướng

Vector $x \in \mathbb{R}^d$ là danh sách $d$ số. Độ dài (chuẩn Euclid) và tích vô hướng:

$$
\lVert x \rVert = \sqrt{\sum_i x_i^2}, \qquad x \cdot y = \sum_i x_i y_i = \lVert x \rVert \lVert y \rVert \cos\theta
$$

Tích vô hướng lớn nghĩa là hai vector cùng hướng. Đó là nền tảng của độ tương tự cosine và của phép "nhân và cộng" trong tích chập.

## Nhân ma trận

Nhân ma trận $A$ kích thước $m \times n$ với $B$ kích thước $n \times p$ cho ma trận $C$ kích thước $m \times p$:

$$
C_{ij} = \sum_{k=1}^{n} A_{ik} B_{kj}
$$

Quy tắc dễ nhớ: **hai số ở giữa phải bằng nhau** và biến mất, còn lại hai số ngoài. Mỗi phần tử của $C$ là tích vô hướng của một hàng của $A$ với một cột của $B$.

```python
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])        # 2x3
B = np.array([[1, 0],
              [0, 1],
              [1, 1]])           # 3x2
print(A @ B)                     # 2x2: [[4 5], [10 11]]
```

## Vector riêng

Vector $v \neq 0$ là vector riêng của ma trận vuông $A$ nếu phép nhân chỉ co giãn nó chứ không đổi hướng:

$$
A v = \lambda v
$$

$\lambda$ là giá trị riêng tương ứng. Khái niệm này xuất hiện trong PCA, trong phân tích đồ thị và trong thuật toán [PageRank](../../thuat-toan/pagerank/) (điểm PageRank là một vector riêng ứng với giá trị riêng 1 của ma trận chuyển).

## Bài tập

1. Tính tay $A B$ ở ví dụ trên và đối chiếu với kết quả của NumPy.
2. $A$ kích thước $3 \times 4$, $B$ kích thước $4 \times 2$. $AB$ có kích thước gì? $BA$ có tính được không?
