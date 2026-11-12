---
title: "Độ đo khoảng cách"
summary: "Một hàm cho biết hai điểm cách nhau bao xa, thỏa ba điều kiện: không âm, đối xứng và bất đẳng thức tam giác. Euclid, Manhattan và Chebyshev là ba trường hợp của khoảng cách Minkowski."
course: khai-niem
type: concept
tags: [distance, metric, foundations, clustering, computer-vision]
level: beginner
status: reviewed
prerequisites: [nen-tang/vector-va-ma-tran]
usedIn: [thi-giac-may-tinh/quan-he-giua-cac-diem-anh, thuat-toan/k-means]
related: [thuat-toan/tim-kiem-theo-chieu-rong-bfs]
order: 20
---

## Định nghĩa một câu

**Độ đo khoảng cách** (distance metric) là một hàm $D(p, q)$ cho ra một con số không âm cho biết hai điểm cách nhau bao xa. Hàm đó phải thỏa ba điều kiện: chỉ bằng 0 khi hai điểm trùng nhau, đối xứng, và đi vòng qua điểm thứ ba không bao giờ ngắn hơn đi thẳng.

## Trực giác

Hỏi "từ nhà tới trường bao xa?" thì câu trả lời phụ thuộc vào **cách bạn di chuyển**:

- **Chim bay** thẳng một đường: khoảng cách **Euclid**.
- **Taxi** trong khu phố bàn cờ, chỉ chạy ngang hoặc dọc theo các con đường: khoảng cách **Manhattan**, còn gọi là city-block. Trong xử lý ảnh, đây là $D_4$.
- **Quân vua** trong cờ vua, mỗi bước đi được sang 8 ô xung quanh, kể cả ô chéo: khoảng cách **Chebyshev**, còn gọi là chessboard. Trong xử lý ảnh, đây là $D_8$.

Cùng hai điểm $(0, 0)$ và $(3, 4)$, ba cách đo cho ba con số khác nhau: chim bay 5, taxi 7, quân vua 4. Không cách nào "đúng" hơn; mỗi cách hợp với một bài toán.

Hình dạng tập các điểm cách tâm **không quá $r$** cũng khác nhau: Euclid cho hình tròn, Manhattan cho hình thoi, Chebyshev cho hình vuông.

## Công thức

### Ba điều kiện của một độ đo khoảng cách

Với mọi điểm $p, q, z$:

$$
\begin{aligned}
&D(p, q) \ge 0, \quad D(p, q) = 0 \iff p = q \\
&D(p, q) = D(q, p) \\
&D(p, z) \le D(p, q) + D(q, z)
\end{aligned}
$$

Điều kiện cuối là **bất đẳng thức tam giác**.

### Họ Minkowski

Với hai vector $p = (p_1, \dots, p_d)$ và $q = (q_1, \dots, q_d)$, khoảng cách Minkowski bậc $r \ge 1$ là:

$$
D_r(p, q) = \left( \sum_{i=1}^{d} |p_i - q_i|^r \right)^{1/r}
$$

| $r$ | Tên | Công thức trong 2 chiều, $p = (x, y)$, $q = (s, t)$ | Ký hiệu trong xử lý ảnh |
| --- | --- | --- | --- |
| 1 | Manhattan, city-block | $\lvert x - s \rvert + \lvert y - t \rvert$ | $D_4$ |
| 2 | Euclid | $\sqrt{(x - s)^2 + (y - t)^2}$ | $D_e$ |
| $\infty$ | Chebyshev, chessboard | $\max(\lvert x - s \rvert, \lvert y - t \rvert)$ | $D_8$ |

Với mọi cặp điểm luôn có $D_\infty \le D_2 \le D_1$, tức là $D_8 \le D_e \le D_4$.

## Ví dụ và phản ví dụ

**Ví dụ (đều là độ đo khoảng cách):**

- Euclid, Manhattan, Chebyshev: thỏa đủ ba điều kiện.
- $D_m$ trong xử lý ảnh (độ dài m-đường đi ngắn nhất), và nói chung **số bước ít nhất trên một đồ thị liên thông** (tìm bằng [BFS](../../thuat-toan/tim-kiem-theo-chieu-rong-bfs/)): cũng thỏa đủ ba điều kiện.
- Khoảng cách Hamming giữa hai chuỗi cùng độ dài (số vị trí khác nhau).

**Phản ví dụ 1: "khoảng cách cosin" không phải độ đo khoảng cách.** Nó được định nghĩa là $1 - \cos\theta$, với $\theta$ là góc giữa hai vector, hay dùng để so độ giống nhau của văn bản. Lấy $a = (1, 0)$, $b = (1, 1)$, $c = (0, 1)$:

- $D(a, c) = 1$, vì $a$ và $c$ vuông góc.
- $D(a, b) + D(b, c) \approx 0{,}293 + 0{,}293 = 0{,}586$.

Đi vòng qua $b$ lại **ngắn hơn** đi thẳng, nên bất đẳng thức tam giác bị vi phạm. Khoảng cách cosin vẫn rất hữu ích, nhưng các thuật toán dựa vào bất đẳng thức tam giác (như một số cấu trúc tìm kiếm láng giềng) không dùng được với nó.

**Phản ví dụ 2: không vi phạm định nghĩa, nhưng cho kết quả vô nghĩa.** Đo Euclid giữa những người được mô tả bằng (tuổi, thu nhập theo đồng/tháng). Thu nhập lớn hơn tuổi hàng triệu lần, nên khoảng cách gần như chỉ phản ánh thu nhập. Người 25 tuổi sẽ được coi là "giống" người 60 tuổi có thu nhập gần bằng, hơn là giống người 26 tuổi. Xem phần code bên dưới.

## Dấu hiệu nhận biết

Cần dừng lại suy nghĩ về độ đo khoảng cách khi:

- Kết quả phân cụm hoặc tìm láng giềng gần nhất (K-means, k-NN) **chỉ bám theo một đặc trưng**: thường do các đặc trưng có đơn vị lệch nhau.
- Đi trên lưới (ảnh, bản đồ ô) mà kết quả "lạ": có thể đang dùng Euclid trong khi chuyển động thật chỉ cho phép đi ngang dọc (nên dùng $D_4$), hoặc được đi chéo (nên dùng $D_8$).
- Dùng một hàm "khoảng cách" lấy từ thư viện mà không chắc nó có thỏa bất đẳng thức tam giác không, như cosin hay các độ đo dựa trên tương quan.

## Cách xử lý hoặc đo lường

- **Chọn độ đo theo cách di chuyển hoặc theo ý nghĩa dữ liệu:** Euclid cho không gian liên tục "đẳng hướng"; Manhattan khi các trục độc lập, hoặc khi muốn bớt nhạy với một trục lệch lớn; Chebyshev khi chỉ quan tâm sai lệch lớn nhất.
- **Chuẩn hóa đặc trưng** trước khi đo nếu các trục có đơn vị khác nhau. Ví dụ dùng z-score: trừ trung bình, chia độ lệch chuẩn của từng cột.
- **Dùng hàm có sẵn** để tránh lỗi: `scipy.spatial.distance` (`euclidean`, `cityblock`, `chebyshev`, `minkowski`, `cosine`) và `scipy.spatial.distance.cdist` để tính cả ma trận khoảng cách.

```python
import numpy as np
from scipy.spatial import distance

def minkowski(p, q, r):
    d = np.abs(np.asarray(p, float) - np.asarray(q, float))
    return d.max() if r == np.inf else (d ** r).sum() ** (1 / r)

p, q = (0, 0), (3, 4)
for r, name in [(1, "Manhattan / D4"), (2, "Euclid"), (np.inf, "Chebyshev / D8")]:
    print(f"{name:15s} {minkowski(p, q, r)}")
print(distance.cityblock(p, q), distance.euclidean(p, q), distance.chebyshev(p, q))

# Phản ví dụ 1: khoảng cách cosin không thỏa bất đẳng thức tam giác
a, b, c = (1, 0), (1, 1), (0, 1)
d = distance.cosine
print(round(d(a, c), 3), round(d(a, b) + d(b, c), 3))

# Phản ví dụ 2: đơn vị lệch nhau làm Euclid bị thu nhập "lấn át"
X = np.array([[25, 10_000_000],    # tuổi, thu nhập (đồng/tháng)
              [60, 10_500_000],
              [26, 12_000_000],
              [40, 25_000_000],
              [35, 18_000_000]], dtype=float)
print(distance.euclidean(X[0], X[1]), distance.euclidean(X[0], X[2]))
Z = (X - X.mean(axis=0)) / X.std(axis=0)      # chuẩn hóa z-score theo từng cột
print(round(distance.euclidean(Z[0], Z[1]), 2), round(distance.euclidean(Z[0], Z[2]), 2))
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2, SciPy 1.13.1):

```text
Manhattan / D4  7.0
Euclid          5.0
Chebyshev / D8  4.0
7 5.0 4
1.0 0.586
500000.001225 2000000.00000025
2.76 0.36
```

- Hàm tự viết khớp với SciPy.
- Trước khi chuẩn hóa, người 0 (25 tuổi) "gần" người 1 (60 tuổi) hơn người 2 (26 tuổi). Sau khi chuẩn hóa thì ngược lại, đúng với trực giác hơn.

## Khái niệm liên quan

- [Quan hệ giữa các điểm ảnh](../../thi-giac-may-tinh/quan-he-giua-cac-diem-anh/): $D_e$, $D_4$, $D_8$, $D_m$ trên lưới điểm ảnh.
- [K-means](../../thuat-toan/k-means/): gán điểm vào tâm gần nhất theo khoảng cách Euclid, nên rất nhạy với việc chuẩn hóa.
- [Tìm kiếm theo chiều rộng (BFS)](../../thuat-toan/tim-kiem-theo-chieu-rong-bfs/): khoảng cách trên đồ thị bằng số bước ít nhất.
- [Vector và ma trận](../../nen-tang/vector-va-ma-tran/): chuẩn (norm) của vector; khoảng cách Minkowski bậc $r$ chính là chuẩn $L_r$ của hiệu hai vector.

## Câu hỏi tự kiểm tra

1. Quân vua cần ít nhất bao nhiêu nước để đi từ ô $(0, 0)$ tới ô $(5, 2)$? Ứng với khoảng cách nào?
2. Vì sao luôn có $D_8 \le D_4$?
3. Trước khi chạy K-means trên dữ liệu (chiều cao tính bằng mét, cân nặng tính bằng gam), bạn cần làm gì? Vì sao?

<details>
<summary>Đáp án</summary>

1. $\max(5, 2) = 5$ nước. Đó là khoảng cách Chebyshev, tức $D_8$: mỗi nước đi chéo giảm được cả hai hiệu tọa độ cùng lúc.
2. $D_8$ là số lớn hơn trong hai số không âm $|x - s|$ và $|y - t|$, còn $D_4$ là tổng của hai số đó. Tổng của hai số không âm luôn lớn hơn hoặc bằng số lớn nhất trong chúng.
3. Chuẩn hóa từng đặc trưng, ví dụ bằng z-score. Cân nặng tính bằng gam có giá trị cỡ hàng chục nghìn, còn chiều cao tính bằng mét chỉ cỡ 1 đến 2. Nếu không chuẩn hóa, khoảng cách Euclid gần như chỉ phản ánh cân nặng và chiều cao bị bỏ qua.

</details>

## Cần kiểm tra lại

- Ví dụ thu nhập và tuổi là dữ liệu mình tự đặt để minh họa, không phải số liệu thật.
- Khoảng cách cosin trong SciPy định nghĩa là $1 - \cos\theta$. Một số tài liệu khác dùng định nghĩa khác (ví dụ khoảng cách góc $\theta / \pi$, thỏa bất đẳng thức tam giác). Khi đọc paper cần xem định nghĩa cụ thể.
