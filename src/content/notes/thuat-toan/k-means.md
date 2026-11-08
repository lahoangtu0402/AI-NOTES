---
title: K-means
summary: Thuật toán gom dữ liệu thành k cụm bằng cách lặp lại hai bước đơn giản, gán điểm vào tâm gần nhất rồi dời tâm về trung bình cụm.
course: thuat-toan
type: algorithm
tags: [clustering, unsupervised]
level: beginner
status: draft
prerequisites: [nen-tang/vector-va-ma-tran]
related: [khai-niem/overfitting]
order: 10
---

## Bài toán

- **Đầu vào:** $n$ điểm dữ liệu $x_1, \dots, x_n \in \mathbb{R}^d$ và số cụm $k$.
- **Đầu ra:** nhãn cụm cho từng điểm và $k$ tâm cụm $\mu_1, \dots, \mu_k$.

Đây là học **không giám sát**: dữ liệu không có nhãn sẵn.

## Trực giác

Hình dung $k$ cái ghim đặt lên bản đồ, mỗi điểm dữ liệu thuộc về ghim gần nó nhất. Sau khi chia xong, mỗi ghim dời về trung tâm của nhóm điểm vừa thuộc về nó. Chia lại, dời lại, đến khi không còn gì thay đổi.

## Thuật toán (Lloyd)

1. Chọn $k$ điểm bất kỳ làm tâm ban đầu.
2. **Gán:** mỗi điểm vào cụm có tâm gần nhất (khoảng cách Euclid).
3. **Cập nhật:** mỗi tâm trở thành trung bình của các điểm trong cụm.
4. Lặp bước 2 và 3 đến khi nhãn không đổi (hoặc đạt số vòng lặp tối đa).

Mục tiêu mà thuật toán giảm dần là tổng bình phương khoảng cách tới tâm (inertia):

$$
J = \sum_{j=1}^{k} \sum_{x \in C_j} \lVert x - \mu_j \rVert^2
$$

Mỗi vòng lặp không làm $J$ tăng, nên thuật toán luôn dừng, nhưng chỉ đảm bảo tới một **cực tiểu địa phương**.

## Độ phức tạp và giả định

- Mỗi vòng lặp tốn $O(n \cdot k \cdot d)$ thời gian.
- Giả định cụm có dạng gần tròn, kích thước tương đương nhau. Với cụm hình dài, hình lưỡi liềm hoặc có nhiều điểm ngoại lai, K-means cho kết quả kém.
- Phải biết trước $k$. Có thể thử nhiều giá trị và so sánh bằng phương pháp khuỷu tay (elbow) hoặc hệ số silhouette.

## Cài đặt từ đầu bằng NumPy

```python
import numpy as np

def kmeans_once(X, k, n_iter=100, rng=None):
    rng = rng or np.random.default_rng()
    centroids = X[rng.choice(len(X), size=k, replace=False)]
    for _ in range(n_iter):
        # khoảng cách bình phương từ mỗi điểm tới mỗi tâm, dạng (n, k)
        d2 = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)
        labels = d2.argmin(axis=1)
        new = np.array([
            X[labels == j].mean(axis=0) if np.any(labels == j) else centroids[j]
            for j in range(k)
        ])
        if np.allclose(new, centroids):
            break
        centroids = new
    d2 = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)
    labels = d2.argmin(axis=1)
    inertia = d2[np.arange(len(X)), labels].sum()
    return labels, centroids, inertia

def kmeans(X, k, n_init=10, seed=0):
    """Chạy nhiều lần từ các tâm ban đầu khác nhau, giữ kết quả có inertia thấp nhất."""
    rng = np.random.default_rng(seed)
    best = None
    for _ in range(n_init):
        result = kmeans_once(X, k, rng=rng)
        if best is None or result[2] < best[2]:
            best = result
    return best

# Dữ liệu mẫu: 3 đám điểm tách bạch
rng = np.random.default_rng(1)
X = np.vstack([rng.normal(c, 0.5, size=(50, 2)) for c in [(0, 0), (5, 5), (0, 5)]])

labels, centroids, inertia = kmeans(X, k=3)
print(np.bincount(labels), round(inertia, 1))

# Quan sát tính nhạy với khởi tạo: 6 lần chạy đơn lẻ
for seed in range(6):
    *_, J = kmeans_once(X, 3, rng=np.random.default_rng(seed))
    print(seed, round(J, 1))
```

Khi chạy thử, có 4 trong 6 lần chạy đơn lẻ rơi vào cực tiểu địa phương với inertia khoảng 692 đến 704 (một cụm thật bị tách đôi, hai cụm thật bị gộp), còn 2 lần tìm ra lời giải đúng với inertia 62,9. Hàm `kmeans` với `n_init=10` luôn chọn được lời giải 62,9. Đây là lý do thư viện thường chạy lặp nhiều lần.

So sánh với thư viện: `sklearn.cluster.KMeans(n_clusters=3, n_init=10)` nên cho cùng inertia (tức thuộc tính `inertia_`) trên dữ liệu này.

## Biến thể và thuật toán thay thế

- **K-means++**: chọn tâm ban đầu rải xa nhau, giảm hẳn nguy cơ khởi tạo tồi (Arthur và Vassilvitskii, 2007).
- **Mini-batch K-means**: cập nhật bằng từng mẻ nhỏ cho dữ liệu lớn.
- **DBSCAN**: cụm theo mật độ, không cần biết $k$, xử lý được hình dạng bất kỳ.
- **Gaussian Mixture Model**: gán mềm (xác suất thuộc từng cụm) thay vì gán cứng.

## Được dùng ở đâu

- Nén màu ảnh (gom màu điểm ảnh thành $k$ màu đại diện).
- Phân khúc khách hàng hoặc người dùng mạng xã hội theo hành vi.
- Tạo "từ điển" đặc trưng trong các phương pháp thị giác máy tính truyền thống.

## Nguồn

- Lloyd, S. (1982). *Least squares quantization in PCM.* IEEE Transactions on Information Theory (bản thảo lưu hành từ 1957).
- Arthur, D., Vassilvitskii, S. (2007). *k-means++: the advantages of careful seeding.* SODA.
