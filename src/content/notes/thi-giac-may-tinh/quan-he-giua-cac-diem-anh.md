---
title: "Quan hệ giữa các điểm ảnh"
summary: "Lân cận, liền kề (4, 8, m), đường đi, liên thông, vùng và biên, gán nhãn thành phần liên thông, và ba cách đo khoảng cách giữa hai điểm ảnh."
course: thi-giac-may-tinh
type: lecture
tags: [computer-vision, image-processing, connectivity, connected-components, distance]
level: beginner
status: reviewed
source: _sources/thi-giac-may-tinh/Buoi1.pdf
sourceTitle: "Slide Buổi 1, Chương 1: Mối quan hệ cơ bản giữa các điểm ảnh (trang 68–91)"
lecturer: TS. Phùng Thế Bảo
prerequisites: [thi-giac-may-tinh/tong-quan-thi-giac-may-tinh-va-anh-so]
related: [thuat-toan/gan-nhan-thanh-phan-lien-thong, thuat-toan/tim-kiem-theo-chieu-rong-bfs, khai-niem/do-do-khoang-cach]
order: 2
---

## Mục tiêu

Sau bài này bạn có thể:

- Liệt kê tay các lân cận $N_4$, $N_D$, $N_8$ của một điểm ảnh, và xác định hai điểm có **4-liền kề**, **8-liền kề** hay **m-liền kề** hay không.
- Tìm đường đi giữa hai điểm, kiểm tra hai điểm có **liên thông** không, và **gán nhãn** các thành phần liên thông bằng thuật toán hai lần quét.
- Tính khoảng cách Euclid, $D_4$, $D_8$ giữa hai điểm ảnh, và biết mỗi loại cho ra "hình tròn" có dạng gì.

## Trực giác

Hãy tưởng tượng một **lớp học xếp bàn thành lưới**, mỗi bạn ngồi đúng một ô. Mỗi bạn là một điểm ảnh, và mặc áo trắng (giá trị 1) hoặc áo đen (giá trị 0).

- **Lân cận** là những ai ngồi sát bạn. Nếu chỉ tính trước, sau, trái, phải thì có 4 người. Nếu tính thêm 4 người ngồi chéo thì có 8 người.
- **Liền kề** chặt hơn lân cận một chút: hai bạn phải ngồi sát nhau **và** cùng "đội", ví dụ cùng mặc áo trắng.
- **Đường đi** là cách chuyền một tờ giấy từ bạn A tới bạn B, mỗi lần chỉ chuyền cho người cùng đội ngồi sát mình.
- **Liên thông**: A và B liên thông nếu tờ giấy đi được từ A tới B. Cả nhóm các bạn chuyền giấy được cho nhau là một **thành phần liên thông**, tức là một "cụm" trong ảnh.
- **Biên** là những bạn trong nhóm ngồi ở rìa, có ít nhất một người bên cạnh không thuộc nhóm.

Vì sao cần những khái niệm này? Muốn **đếm số đồng xu** trên một ảnh đen trắng, máy tính phải biết điểm ảnh nào "dính" với điểm nào để gom thành từng đồng xu. Muốn **vẽ viền** một vật thể thì phải biết điểm nào là biên. Đây là nền tảng của phân đoạn ảnh và nhận dạng ở các chương sau.

**Ba cách đo khoảng cách**, nghĩ theo cách di chuyển:

- **Euclid**: đường chim bay, đo bằng thước thẳng.
- **$D_4$ (city-block)**: taxi chạy trong khu phố bàn cờ, chỉ được đi ngang hoặc dọc.
- **$D_8$ (chessboard)**: quân vua trong cờ vua, mỗi bước đi được sang cả 8 ô xung quanh, kể cả ô chéo.

## Quy ước tọa độ

Slide dùng quy ước sau, và mọi ví dụ trong bài này theo đúng quy ước đó:

- Điểm ảnh $p$ có tọa độ $(x, y)$, cấp xám là $f(x, y)$.
- $x$ là **cột** (trục ngang), $y$ là **hàng** (trục dọc), gốc $(0, 0)$ ở góc trên bên trái.
- Chữ thường $p, q, z$ dùng để đặt tên cho các điểm.

Khi viết code bằng NumPy, giá trị của điểm $(x, y)$ là `img[y, x]`, vì NumPy truy cập theo hàng trước, cột sau.

## Công thức

### Lân cận của một điểm ảnh

Cho điểm $p = (x, y)$:

| Tên | Ký hiệu | Các điểm |
| --- | --- | --- |
| 4-lân cận (ngang, dọc) | $N_4(p)$ | $(x+1, y),\ (x-1, y),\ (x, y+1),\ (x, y-1)$ |
| Lân cận chéo | $N_D(p)$ | $(x+1, y+1),\ (x+1, y-1),\ (x-1, y+1),\ (x-1, y-1)$ |
| 8-lân cận | $N_8(p)$ | $N_4(p) \cup N_D(p)$, tức là cả 8 điểm trên |

```text
 N4(p)        ND(p)        N8(p)
 . X .        X . X        X X X
 X p X        . p .        X p X
 . X .        X . X        X X X
```

Nếu $p$ nằm ở mép ảnh, một số lân cận sẽ rơi ra ngoài ảnh và bị bỏ qua.

### Tính liền kề

Gọi $V$ là **tập các giá trị cấp xám ta quan tâm**. Với ảnh nhị phân, thường chọn $V = \{1\}$. Với ảnh xám, $V$ có thể là một khoảng, ví dụ các mức từ 100 đến 120.

Hai điểm $p$ và $q$ **đều có giá trị thuộc $V$**. Khi đó:

- **4-liền kề** (4-adjacency): $q \in N_4(p)$.
- **8-liền kề** (8-adjacency): $q \in N_8(p)$.
- **m-liền kề** (mixed adjacency, liền kề hỗn hợp): thỏa một trong hai điều kiện
  - $q \in N_4(p)$, hoặc
  - $q \in N_D(p)$ **và** trong $N_4(p) \cap N_4(q)$ không có điểm nào có giá trị thuộc $V$.

**Vì sao cần m-liền kề?** 8-liền kề có thể tạo ra **nhiều đường nối thừa** giữa hai điểm. Xét lưới $3 \times 3$ với $V = \{1\}$ (ví dụ ở trang 76 của slide), $p$ là điểm giữa:

```text
0 1 1
0 1 0
0 0 1
```

Theo 8-liền kề, $p$ nối với điểm trên $(1, 0)$, điểm góc trên phải $(2, 0)$ và điểm góc dưới phải $(2, 2)$. Nhưng $p$ cũng đi được tới $(2, 0)$ **gián tiếp** qua $(1, 0)$. Thành ra có hai đường từ $p$ tới góc trên phải, tạo thành một "vòng" nhỏ không mong muốn.

m-liền kề cắt bỏ cạnh chéo $p \to (2, 0)$, vì đã có $(1, 0)$ là 4-lân cận chung thuộc $V$. Kết quả là $p$ chỉ m-liền kề với $(1, 0)$ và $(2, 2)$, và mỗi cặp điểm chỉ còn **một cách nối duy nhất**. Ý chính: **chỉ đi chéo khi không có đường vuông góc nào thay thế**.

**Ví dụ.** Lưới ở trang 75 của slide, $V = \{1\}$, $p = (2, 2)$ là ô ở giữa:

```text
     x=0 1 2 3 4
y=0    1 0 1 1 0
y=1    0 1 0 1 0
y=2    0 0 1 1 0
y=3    1 1 0 0 1
y=4    1 1 0 0 1
```

| Loại liền kề | Các điểm liền kề với $p$ | Giải thích |
| --- | --- | --- |
| 4-liền kề | $(3, 2)$ | Trong 4 điểm ngang dọc chỉ có $(3, 2)$ bằng 1 |
| 8-liền kề | $(3, 2), (1, 1), (3, 1), (1, 3)$ | Thêm 3 điểm chéo bằng 1 |
| m-liền kề | $(3, 2), (1, 1), (1, 3)$ | Bỏ $(3, 1)$, vì 4-lân cận chung của $p$ và $(3, 1)$ là $(3, 2)$, mà điểm này đã bằng 1 |

**Liền kề giữa hai tập.** Hai tập điểm ảnh $S_1$ và $S_2$ liền kề nhau nếu có ít nhất một điểm trong $S_1$ liền kề với một điểm trong $S_2$. Tùy loại liền kề được dùng, ta nói $S_1$ và $S_2$ là 4-, 8- hay m-liền kề.

### Đường đi

Một **đường đi** (path) từ $p = (x, y)$ tới $q = (s, t)$ là một dãy các điểm ảnh **khác nhau**

$$
(x_0, y_0),\ (x_1, y_1),\ \dots,\ (x_n, y_n)
$$

trong đó $(x_0, y_0) = (x, y)$, $(x_n, y_n) = (s, t)$, và mỗi điểm liền kề với điểm ngay trước nó: $(x_i, y_i)$ liền kề với $(x_{i-1}, y_{i-1})$ với $1 \le i \le n$.

- $n$ là **độ dài** của đường đi, tức là số bước, không phải số điểm.
- Nếu điểm đầu trùng điểm cuối, $(x_0, y_0) = (x_n, y_n)$, ta có **đường đi đóng** (closed path), hay chu trình.
- Tùy loại liền kề mà ta có 4-đường đi, 8-đường đi hay m-đường đi.

**Ví dụ** (trang 79 của slide), $V = \{1\}$:

```text
     x=0 1 2 3 4 5 6 7
y=0    1 0 0 0 1 0 1 0
y=1    1 1 1 1 1 1 0 1
y=2    1 1 0 0 0 1 1 0
y=3    0 1 1 1 0 1 0 1
y=4    1 1 0 1 1 1 0 0
y=5    1 1 0 0 1 0 1 0
```

- **4-đường đi** từ $p = (1, 1)$ tới $q = (5, 4)$: đi ngang hàng $y = 1$ tới cột 5, rồi đi xuống. Cụ thể là $(1,1) \to (2,1) \to (3,1) \to (4,1) \to (5,1) \to (5,2) \to (5,3) \to (5,4)$, độ dài 7.
- **8-đường đi** từ $p = (6, 0)$ tới $q = (1, 5)$: $(6,0) \to (7,1) \to (6,2) \to (5,3) \to (4,4) \to (3,4) \to (2,3) \to (1,4) \to (1,5)$, độ dài 8. Đây là một đường ngắn nhất do code bên dưới tìm ra; có thể còn đường khác cùng độ dài. Với 4-liền kề thì **không có** đường nào giữa hai điểm này, vì $(6, 0)$ không có 4-lân cận nào bằng 1.

### Liên thông, vùng và biên

- **Liên thông** (connected): cho tập điểm ảnh $S$, hai điểm $p, q \in S$ liên thông nếu có một đường đi từ $p$ tới $q$ mà mọi điểm trên đường đều nằm trong $S$.
- **Thành phần liên thông** (connected component): với $p \in S$, tập mọi điểm của $S$ liên thông với $p$ là một thành phần liên thông.
- **Tập liên thông**: $S$ chỉ có đúng một thành phần liên thông.
- **Vùng** (region): một tập con $R$ của ảnh được gọi là vùng nếu $R$ là tập liên thông.
- **Biên** (boundary) của vùng $R$: các điểm **thuộc $R$** có ít nhất một lân cận **không thuộc $R$**. Nếu $R$ là toàn bộ ảnh thì biên là hàng đầu, hàng cuối, cột đầu và cột cuối của ảnh.

Nhìn theo góc độ đồ thị cho dễ nhớ: mỗi điểm ảnh thuộc $V$ là một **đỉnh**, mỗi cặp liền kề là một **cạnh**. Khi đó "thành phần liên thông của ảnh" chính là "thành phần liên thông của đồ thị", cùng khái niệm sẽ gặp lại ở môn Phân tích mạng xã hội.

### Gán nhãn thành phần liên thông (4-liền kề)

Mục tiêu: gán cho mỗi "cụm" điểm ảnh một số hiệu riêng (1, 2, 3...) để đếm và tách từng vật thể. Đây là thuật toán **hai lần quét** (two-pass connected-component labeling).

> Trang chuẩn của thuật toán, gồm code tự cài đặt cho cả 4 và 8-liền kề, cách loang bằng BFS, so sánh với SciPy và độ phức tạp: [Gán nhãn thành phần liên thông](../../thuat-toan/gan-nhan-thanh-phan-lien-thong/). Phần dưới đây chỉ giữ cách làm theo slide và ví dụ tính tay.

**Lần quét 1.** Duyệt ảnh từ trái sang phải, từ trên xuống dưới. Tại điểm đang xét $p$, gọi $r$ là lân cận **phía trên** và $t$ là lân cận **bên trái**. Hai điểm này đã được xét trước nên đã có nhãn, nếu chúng thuộc $V$.

```text
. r .
t p
```

- Nếu $p \notin V$: bỏ qua.
- Nếu $p \in V$:
  - $r$ và $t$ đều không thuộc $V$: gán cho $p$ một **nhãn mới**.
  - Chỉ một trong hai thuộc $V$: $p$ lấy nhãn của điểm đó.
  - Cả hai thuộc $V$ và **cùng nhãn**: $p$ lấy nhãn đó.
  - Cả hai thuộc $V$ nhưng **khác nhãn**: $p$ lấy một trong hai nhãn, và ghi nhận rằng hai nhãn đó **tương đương** (chúng thuộc cùng một cụm, được nối với nhau qua $p$).

**Lần quét 2.** Thay mỗi nhãn bằng một nhãn đại diện chung cho cả nhóm nhãn tương đương với nó.

Lần quét 1 chưa đủ, vì một cụm hình chữ U sẽ được bắt đầu bằng hai nhãn khác nhau ở hai nhánh, đến đáy chữ U mới phát hiện ra hai nhánh là một. Ví dụ dưới đây cho thấy đúng điều đó: nhánh phải bắt đầu với nhãn 2, đến hàng thứ ba mới "gặp" nhánh trái mang nhãn 1.

```text
Ảnh (V = {1})     Sau lần quét 1     Sau lần quét 2
1 1 0 1           1 1 0 2            1 1 0 1
0 1 0 1           0 1 0 2            0 1 0 1
1 1 1 1           3 1 1 1            1 1 1 1
0 0 0 0           0 0 0 0            0 0 0 0
1 0 1 1           4 0 5 5            2 0 3 3
```

Kết quả cuối: ảnh có **3 thành phần liên thông** theo 4-liền kề.

### Độ đo khoảng cách

Cho các điểm $p = (x, y)$, $q = (s, t)$, $z = (u, v)$. Một hàm $D$ được gọi là **hàm khoảng cách** (distance metric) nếu thỏa ba tính chất:

$$
\begin{aligned}
&\text{(a)}\quad D(p, q) \ge 0, \quad D(p, q) = 0 \iff p = q \\
&\text{(b)}\quad D(p, q) = D(q, p) \\
&\text{(c)}\quad D(p, z) \le D(p, q) + D(q, z)
\end{aligned}
$$

Tính chất (c) là **bất đẳng thức tam giác**: đi vòng qua một điểm trung gian không bao giờ ngắn hơn đi thẳng.

> Ba khoảng cách dưới đây là trường hợp riêng của khoảng cách Minkowski, dùng chung cho cả học máy (K-means, k-NN). Xem thêm phản ví dụ và lưu ý về chuẩn hóa dữ liệu ở trang [Độ đo khoảng cách](../../khai-niem/do-do-khoang-cach/).

**Khoảng cách Euclid** (Euclidean distance):

$$
D_e(p, q) = \sqrt{(x - s)^2 + (y - t)^2}
$$

Các điểm có $D_e \le r$ tạo thành một **hình tròn** tâm $(x, y)$.

**Khoảng cách khối $D_4$** (city-block distance):

$$
D_4(p, q) = |x - s| + |y - t|
$$

Các điểm có $D_4 \le r$ tạo thành một **hình thoi**. Các điểm có $D_4 = 1$ chính là $N_4(p)$.

**Khoảng cách bàn cờ $D_8$** (chessboard distance):

$$
D_8(p, q) = \max\big(|x - s|,\ |y - t|\big)
$$

Các điểm có $D_8 \le r$ tạo thành một **hình vuông**. Các điểm có $D_8 = 1$ chính là $N_8(p)$.

```text
D4 tới tâm (<= 2 là hình thoi)    D8 tới tâm (<= 2 là hình vuông)
4 3 2 3 4                         2 2 2 2 2
3 2 1 2 3                         2 1 1 1 2
2 1 0 1 2                         2 1 0 1 2
3 2 1 2 3                         2 1 1 1 2
4 3 2 3 4                         2 2 2 2 2
```

Ví dụ: với $p = (0, 0)$, $q = (3, 4)$, ta có $D_e = 5$, $D_4 = 7$, $D_8 = 4$. Luôn có $D_8 \le D_e \le D_4$.

Ba khoảng cách trên **chỉ phụ thuộc tọa độ**, không quan tâm giá trị điểm ảnh.

**Khoảng cách $D_m$** thì khác: $D_m(p, q)$ là **độ dài m-đường đi ngắn nhất** giữa $p$ và $q$, nên nó phụ thuộc vào giá trị của các điểm nằm giữa. Ví dụ, với $V = \{1\}$ và $p$, $p_2$, $p_4$ luôn bằng 1:

```text
      p3  p4
  p1  p2
  p
```

| $p_1$ | $p_3$ | m-đường đi ngắn nhất từ $p$ tới $p_4$ | $D_m$ |
| --- | --- | --- | --- |
| 0 | 0 | $p \to p_2 \to p_4$ | 2 |
| 1 | 0 | $p \to p_1 \to p_2 \to p_4$ | 3 |
| 0 | 1 | $p \to p_2 \to p_3 \to p_4$ | 3 |
| 1 | 1 | $p \to p_1 \to p_2 \to p_3 \to p_4$ | 4 |

Khi $p_1 = 1$, bước chéo $p \to p_2$ bị cấm vì đã có đường vuông góc qua $p_1$. Tương tự với $p_3$ và bước chéo $p_2 \to p_4$.

## Code tối giản

Phần 1: lân cận, ba loại liền kề, và tìm đường đi ngắn nhất bằng tìm kiếm theo chiều rộng (Breadth-First Search, BFS). Giải thích vì sao BFS cho đường ngắn nhất nằm ở trang [Tìm kiếm theo chiều rộng (BFS)](../../thuat-toan/tim-kiem-theo-chieu-rong-bfs/).

```python
import numpy as np
from collections import deque

# Quy ước của slide: điểm (x, y) với x = cột, y = hàng.
# NumPy truy cập theo [hàng, cột] nên giá trị của điểm (x, y) là img[y, x].

def N4(x, y): return [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
def ND(x, y): return [(x + 1, y + 1), (x + 1, y - 1), (x - 1, y + 1), (x - 1, y - 1)]
def N8(x, y): return N4(x, y) + ND(x, y)

def in_V(img, p, V):
    x, y = p
    return 0 <= y < img.shape[0] and 0 <= x < img.shape[1] and img[y, x] in V

def adjacent(img, p, q, V, kind):
    """kind = 4, 8 hoặc 'm'."""
    if not (in_V(img, p, V) and in_V(img, q, V)):
        return False
    if kind == 4:
        return q in N4(*p)
    if kind == 8:
        return q in N8(*p)
    # m-liền kề: 4-lân cận, hoặc chéo nhưng không có "đường tắt" 4-lân cận chung thuộc V
    if q in N4(*p):
        return True
    common = set(N4(*p)) & set(N4(*q))
    return q in ND(*p) and not any(in_V(img, c, V) for c in common)

def shortest_path(img, p, q, V, kind):
    """Tìm đường đi ngắn nhất bằng BFS. Trả về None nếu p, q không liên thông."""
    prev, queue = {p: None}, deque([p])
    while queue:
        cur = queue.popleft()
        if cur == q:
            path = []
            while cur is not None:
                path.append(cur)
                cur = prev[cur]
            return path[::-1]
        for nb in N8(*cur):
            if nb not in prev and adjacent(img, cur, nb, V, kind):
                prev[nb] = cur
                queue.append(nb)
    return None

img = np.array([[1, 0, 1, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 1, 1, 0],
                [1, 1, 0, 0, 1],
                [1, 1, 0, 0, 1]])
p, V = (2, 2), {1}
for kind in (4, 8, 'm'):
    print(kind, [q for q in N8(*p) if adjacent(img, p, q, V, kind)])

path = shortest_path(img, (1, 1), (0, 4), V, 8)
print("8-đường đi:", path, "độ dài", len(path) - 1)
print("4-đường đi:", shortest_path(img, (1, 1), (0, 4), V, 4))
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2):

```text
4 [(3, 2)]
8 [(3, 2), (3, 1), (1, 3), (1, 1)]
m [(3, 2), (1, 3), (1, 1)]
8-đường đi: [(1, 1), (2, 2), (1, 3), (0, 4)] độ dài 3
4-đường đi: None
```

Ba dòng đầu khớp với bảng ví dụ ở trên. Hai dòng cuối cho thấy cùng hai điểm có thể **liên thông theo 8-liền kề nhưng không liên thông theo 4-liền kề**.

Phần 2: ba độ đo khoảng cách. Code gán nhãn thành phần liên thông nằm ở [trang chuẩn của thuật toán](../../thuat-toan/gan-nhan-thanh-phan-lien-thong/).

```python
import numpy as np

# Ba độ đo khoảng cách giữa p = (x, y) và q = (s, t)
p, q = (0, 0), (3, 4)
De = np.hypot(q[0] - p[0], q[1] - p[1])
D4 = abs(q[0] - p[0]) + abs(q[1] - p[1])
D8 = max(abs(q[0] - p[0]), abs(q[1] - p[1]))
print(De, D4, D8)

# Các điểm có khoảng cách <= 2 tới tâm: D4 cho hình thoi, D8 cho hình vuông
ys, xs = np.mgrid[-2:3, -2:3]
print(np.abs(xs) + np.abs(ys))
print(np.maximum(np.abs(xs), np.abs(ys)))
```

Kết quả (đã chạy thử):

```text
5.0 7 4
[[4 3 2 3 4]
 [3 2 1 2 3]
 [2 1 0 1 2]
 [3 2 1 2 3]
 [4 3 2 3 4]]
[[2 2 2 2 2]
 [2 1 1 1 2]
 [2 1 0 1 2]
 [2 1 1 1 2]
 [2 2 2 2 2]]
```

Bảng gán nhãn qua hai lần quét ở phần Công thức có thể tự kiểm lại bằng hàm `label_two_pass` ở trang thuật toán. Trong thực tế, bạn sẽ dùng hàm có sẵn như `scipy.ndimage.label` hoặc `cv2.connectedComponents` thay vì tự viết.

## Lỗi thường gặp

- **Đảo $x$ và $y$.** Slide viết $(x, y)$ với $x$ là cột, còn NumPy viết `img[hàng, cột]`. Viết nhầm `img[x, y]` vẫn chạy, nhưng lấy sai điểm. Gặp ví dụ trong sách khác, hãy kiểm tra quy ước trước, vì có sách lại dùng $x$ cho hàng.
- **Quên kiểm tra cả hai điểm thuộc $V$.** Hai điểm ngồi cạnh nhau nhưng một điểm bằng 0 thì không liền kề, dù chúng vẫn là lân cận của nhau. **Lân cận** chỉ nói về vị trí; **liền kề** nói về vị trí **và** giá trị.
- **Nhầm độ dài đường đi với số điểm.** Đường đi qua $n + 1$ điểm có độ dài $n$.
- **Áp dụng m-liền kề cho cặp ngang dọc.** Điều kiện "không có 4-lân cận chung thuộc $V$" chỉ áp dụng cho cặp **chéo**. Cặp ngang dọc luôn m-liền kề nếu cả hai thuộc $V$.
- **Chỉ quét một lần khi gán nhãn.** Các vật thể hình chữ U hoặc chữ V sẽ bị đếm thành nhiều vật. Phải có bước gộp nhãn tương đương.
- **Kết quả đếm vật thể khác nhau giữa 4 và 8-liền kề.** Hai điểm chỉ chạm nhau ở góc là **hai** vật theo 4-liền kề nhưng **một** vật theo 8-liền kề. Hãy chọn loại liền kề trước khi đếm và ghi rõ trong báo cáo.

## Bài tập

1. Cho lưới ở trang 71 của slide, $V = \{1\}$, $p = (2, 2)$:

   ```text
        x=0 1 2 3 4
   y=0    1 0 1 1 0
   y=1    0 1 0 1 0
   y=2    0 1 1 1 0
   y=3    1 1 0 0 1
   y=4    1 1 0 0 1
   ```

   Tìm các điểm 4-liền kề, 8-liền kề và m-liền kề với $p$. So sánh với ví dụ trong bài: lưới này chỉ khác một ô, nhưng kết quả m-liền kề thay đổi thế nào?
2. Tính $D_e$, $D_4$, $D_8$ giữa $p = (2, 7)$ và $q = (5, 3)$.
3. Trong lưới của bài tập 1, có bao nhiêu thành phần liên thông theo 4-liền kề? Theo 8-liền kề?
4. Giải thích bằng lời vì sao luôn có $D_8(p, q) \le D_4(p, q)$.
5. Tự viết hàm gán nhãn theo 8-liền kề. Gợi ý: ngoài lân cận trên và lân cận trái, cần xét thêm hai lân cận chéo phía trên. Đối chiếu với hàm `label_two_pass(img, connectivity=8)` ở trang [Gán nhãn thành phần liên thông](../../thuat-toan/gan-nhan-thanh-phan-lien-thong/).

<details>
<summary>Gợi ý đáp án bài 1 đến 4</summary>

1. 4-liền kề: $(1, 2)$ và $(3, 2)$. 8-liền kề: $(1, 1), (1, 2), (1, 3), (3, 1), (3, 2)$; kết quả 4 và 8 khớp với slide trang 71, 73. m-liền kề: chỉ còn $(1, 2)$ và $(3, 2)$ (do mình tự tính bằng code, slide không có đáp án cho lưới này). Cả ba điểm chéo đều bị loại vì luôn có $(1, 2)$ hoặc $(3, 2)$ làm "đường vuông góc thay thế".
2. $|x - s| = 3$, $|y - t| = 4$, nên $D_e = 5$, $D_4 = 7$, $D_8 = 4$.
3. Theo 4-liền kề: 3 thành phần. Gồm cụm lớn ở giữa và bên trái (chứa $(1,1)$, $(2,2)$, $(3,0)$...), điểm $(0, 0)$ đứng riêng, và cụm $(4, 3), (4, 4)$ ở góc dưới phải. Theo 8-liền kề: chỉ còn 1 thành phần, vì $(0, 0)$ nối chéo được với $(1, 1)$, và $(4, 3)$ nối chéo được với $(3, 2)$. Đáp án đã kiểm bằng code (slide không có bài này).
4. $D_8$ là số lớn hơn trong hai số $|x - s|$ và $|y - t|$, còn $D_4$ là tổng của hai số đó. Hai số đều không âm nên tổng luôn lớn hơn hoặc bằng số lớn nhất.

</details>

## Câu hỏi tự kiểm tra

Trả lời bằng lời của mình trước, rồi mới mở đáp án.

1. **Lân cận** và **liền kề** khác nhau ở điểm nào? Cho một ví dụ hai điểm là lân cận nhưng không liền kề.
2. Vẽ một lưới $3 \times 3$ mà 8-liền kề tạo ra **hai** đường nối giữa hai điểm, còn m-liền kề chỉ để lại **một**.
3. Vì sao thuật toán gán nhãn cần lần quét thứ hai? Vẽ một hình mà chỉ quét một lần sẽ đếm sai.
4. Hai điểm ảnh bằng 1 chỉ chạm nhau ở góc, xung quanh toàn số 0. Theo 4-liền kề và theo 8-liền kề thì đếm được mấy vật?
5. $D_4$, $D_8$ chỉ phụ thuộc tọa độ, còn $D_m$ phụ thuộc thêm vào điều gì? Vì sao?

<details>
<summary>Đáp án</summary>

1. **Lân cận** chỉ nói về **vị trí**: $q$ nằm sát $p$. **Liền kề** đòi hỏi thêm về **giá trị**: cả $p$ và $q$ đều thuộc tập $V$. Ví dụ: với $V = \{1\}$, điểm $p$ bằng 1 và điểm ngay bên phải bằng 0. Hai điểm là 4-lân cận của nhau nhưng không liền kề.
2. Dùng lại lưới ở trang 76 của slide, $V = \{1\}$:

   ```text
   0 1 1
   0 1 0
   0 0 1
   ```

   Theo 8-liền kề, điểm giữa nối với góc trên phải theo hai đường: đi chéo trực tiếp, hoặc đi qua điểm trên. Theo m-liền kề, cạnh chéo bị bỏ vì điểm trên là 4-lân cận chung thuộc $V$, nên chỉ còn đường qua điểm trên.
3. Lần quét 1 chỉ nhìn lân cận trên và trái, nên hai nhánh của một vật hình chữ U được đặt hai nhãn khác nhau trước khi thuật toán "thấy" chúng nối nhau ở đáy. Lần quét 2 gộp các nhãn tương đương thành một. Ví dụ đơn giản nhất là chữ U:

   ```text
   1 0 1
   1 0 1
   1 1 1
   ```

   Ở hàng đầu, nhánh trái nhận nhãn 1 và nhánh phải nhận nhãn 2, vì lúc đó hai nhánh chưa có lân cận nào đã gán nhãn. Tới hàng cuối, hai nhãn gặp nhau và được ghi là tương đương. Nếu dừng sau lần quét 1, ảnh bị đếm thành 2 vật thay vì 1.
4. Theo 4-liền kề: **2 vật**, vì hai điểm chéo nhau không phải 4-lân cận. Theo 8-liền kề: **1 vật**.
5. $D_m$ là độ dài **m-đường đi ngắn nhất**, mà đường đi chỉ được đi qua các điểm có giá trị thuộc $V$ và phải theo luật m-liền kề. Vì vậy $D_m$ phụ thuộc vào **giá trị các điểm ảnh** nằm giữa $p$ và $q$, như bảng $p_1$, $p_3$ ở trên cho thấy. Nếu không có m-đường đi nào thì $D_m$ không xác định.

</details>

## Tài liệu tham khảo

- Slide bài giảng môn *Thị giác máy tính và nhận dạng mẫu*, Buổi 1, Chương 1, phần "Mối quan hệ cơ bản giữa các điểm ảnh" (tài liệu gốc, không công khai).
- R. C. Gonzalez, R. E. Woods. *Digital Image Processing*, phần quan hệ cơ bản giữa các điểm ảnh (slide không nêu phiên bản và năm).

## Cần kiểm tra lại

- **Công thức $D_8$ trong slide bị chép nhầm.** Trang 90 ghi $D_8(p, q) = |x - s| + |y - t|$, giống hệt $D_4$. Bảng minh họa ngay bên cạnh lại là hình vuông, khớp với $D_8 = \max(|x - s|, |y - t|)$. Trong bài mình dùng công thức max. Trang 90 cũng còn hai chỗ chép từ trang $D_4$: "hình thoi" (đúng ra là hình vuông) và "$D_8 = 1$ là 4-lân cận" (đúng ra là 8-lân cận).
- **Danh sách $N_8(p)$ ở trang 70 thiếu hai điểm** $(x+1, y+1)$ và $(x+1, y-1)$; slide chỉ liệt kê 6 điểm. Định nghĩa "$N_8 = N_4 \cup N_D$" thì vẫn đúng.
- **Ví dụ liên thông ở trang 82.** Slide nói $p = (1, 1)$ và $q = (2, 3)$ **không** liên thông theo 4-liền kề. Với lưới trích được từ slide, code của mình lại tìm được một 4-đường đi: $(1,1) \to (0,1) \to (0,2) \to (0,3) \to (0,4) \to (1,4) \to (2,4) \to (2,3)$. Có thể slide chỉ xét một tập con $S$ (phần được tô màu trong hình) chứ không phải toàn bộ lưới. Cần xem lại hình gốc hoặc hỏi giảng viên.
- **Ví dụ m-liền kề ở trang 71, 73 và trang 75 dùng hai lưới khác nhau** (khác nhau ở ô $(1, 2)$). Bài viết dùng lưới trang 75 làm ví dụ chính và đưa lưới trang 71 vào bài tập. Kết quả của slide đã được kiểm lại bằng code và đều khớp.
- **Ví dụ $D_m$ ở trang 91** chỉ có sơ đồ vị trí $p, p_1, \dots, p_4$, không đọc được giá trị cụ thể. Bảng bốn trường hợp trong bài là ví dụ quen thuộc theo sơ đồ này (theo sách Gonzalez & Woods), đã kiểm bằng code, nhưng cần đối chiếu với bài giảng trên lớp.
- **Định nghĩa biên** (trang 85) không nói "lân cận" là 4 hay 8-lân cận. Hai cách chọn cho ra biên khác nhau. Tài liệu không nêu.
- **Ví dụ gán nhãn ở trang 86** bị lỗi khi trích chữ từ PDF nên mình không dùng; ví dụ trong bài là do mình tự đặt.
