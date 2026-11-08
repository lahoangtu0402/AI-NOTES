---
title: PageRank
summary: Xếp hạng đỉnh của một đồ thị có hướng theo ý tưởng "được nhiều đỉnh quan trọng trỏ tới thì quan trọng", tính bằng phép lặp lũy thừa.
course: thuat-toan
type: algorithm
tags: [graph, ranking, linear-algebra]
level: intermediate
status: draft
prerequisites: [nen-tang/vector-va-ma-tran]
usedIn: [phan-tich-mang-xa-hoi/do-do-trung-tam]
order: 20
---

## Bài toán

- **Đầu vào:** đồ thị có hướng gồm $N$ đỉnh (ví dụ các trang web, cạnh là liên kết).
- **Đầu ra:** một điểm $PR(i) \geq 0$ cho mỗi đỉnh, tổng các điểm bằng 1.

## Trực giác

Hình dung một người lướt web ngẫu nhiên. Ở mỗi trang, với xác suất $d$ họ bấm một liên kết bất kỳ trên trang, với xác suất $1-d$ họ nhảy sang một trang hoàn toàn ngẫu nhiên. **PageRank của một trang là tỉ lệ thời gian người đó ở trang ấy** nếu lướt rất lâu.

Một trang có điểm cao khi nhiều trang khác trỏ tới nó, và các trang trỏ tới nó cũng có điểm cao.

## Công thức

$$
PR(i) = \frac{1-d}{N} + d \sum_{j \to i} \frac{PR(j)}{L(j)}
$$

Trong đó $L(j)$ là số liên kết đi ra của $j$ và $d$ là hệ số "đi theo liên kết" (thường chọn $d = 0{,}85$).

Dạng ma trận: gọi $P$ là ma trận chuyển (hàng $j$ chia đều xác suất cho các trang mà $j$ trỏ tới), và $r$ là vector điểm. Điểm số là nghiệm đứng yên của:

$$
r = d\, P^{\top} r + \frac{1-d}{N}\mathbf{1}
$$

Ta tìm nghiệm bằng **phép lặp lũy thừa**: bắt đầu với $r$ đều, áp dụng công thức trên nhiều lần đến khi $r$ gần như không đổi. Với $0 < d < 1$ phép lặp luôn hội tụ.

**Trang cụt** (không có liên kết ra) được xử lý bằng cách coi như nó trỏ đều tới mọi trang.

## Cài đặt

```python
import numpy as np

def pagerank(adj, d=0.85, tol=1e-10, max_iter=200):
    """adj[i, j] = 1 nếu trang i có liên kết tới trang j."""
    n = adj.shape[0]
    out = adj.sum(axis=1, keepdims=True)
    # hàng toàn 0 (trang cụt): chia đều cho mọi trang
    P = np.where(out > 0, adj / np.where(out == 0, 1, out), 1.0 / n)
    r = np.full(n, 1.0 / n)
    for _ in range(max_iter):
        r_new = d * (P.T @ r) + (1 - d) / n
        if np.abs(r_new - r).sum() < tol:
            return r_new
        r = r_new
    return r

# 4 trang: A->B, A->C, B->C, C->A, D->C
adj = np.array([
    [0, 1, 1, 0],   # A
    [0, 0, 1, 0],   # B
    [1, 0, 0, 0],   # C
    [0, 0, 1, 0],   # D
], dtype=float)

print(np.round(pagerank(adj), 4))
```

Kết quả xấp xỉ $(0{,}37;\ 0{,}20;\ 0{,}39;\ 0{,}04)$ cho A, B, C, D. C cao nhất vì cả A, B, D đều trỏ tới. D thấp nhất, đúng bằng $(1-d)/N = 0{,}0375$, vì không trang nào trỏ tới D nên D chỉ nhận được phần "nhảy ngẫu nhiên".

Kiểm tra chéo với thư viện: dựng `nx.DiGraph([(0,1),(0,2),(1,2),(2,0),(3,2)])` rồi gọi `nx.pagerank(G, alpha=0.85)`, kết quả trùng đến 3 chữ số thập phân.

## Độ phức tạp

Mỗi vòng lặp tốn $O(M)$ với $M$ là số cạnh nếu dùng ma trận thưa. Số vòng cần thiết giảm khi $d$ nhỏ. Bản dùng ma trận đặc ở trên chỉ phù hợp đồ thị nhỏ.

## Khác gì với độ đo bậc?

Độ trung tâm bậc chỉ đếm số liên kết đến. PageRank còn tính **ai** trỏ tới: một liên kết từ trang quan trọng nặng hơn nhiều liên kết từ trang vô danh. Xem thêm [Độ đo trung tâm](../../phan-tich-mang-xa-hoi/do-do-trung-tam/).

## Nguồn

- Page, L., Brin, S., Motwani, R., Winograd, T. *The PageRank Citation Ranking: Bringing Order to the Web.* Stanford InfoLab technical report, 1999.
- Brin, S., Page, L. (1998). *The anatomy of a large-scale hypertextual web search engine.* WWW7.
