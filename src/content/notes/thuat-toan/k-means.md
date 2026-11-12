---
title: K-means
summary: "Gom dữ liệu thành k cụm bằng cách lặp lại hai bước đơn giản: gán mỗi điểm vào tâm gần nhất, rồi dời mỗi tâm về trung bình cụm của nó."
course: thuat-toan
type: algorithm
tags: [clustering, unsupervised]
level: beginner
status: draft
prerequisites: [nen-tang/vector-va-ma-tran, khai-niem/do-do-khoang-cach]
usedIn: []
related: [khai-niem/overfitting, khai-niem/do-do-khoang-cach, khai-niem/khong-gian-mau]
order: 10
---

## Bài toán

- **Đầu vào:**
  - $n$ điểm dữ liệu $x_1, \dots, x_n$, mỗi điểm là một danh sách $d$ con số (một **vector**).
  - Số cụm $k$ mà ta muốn chia.
- **Đầu ra:**
  - Mỗi điểm được gán một **nhãn cụm** từ 1 đến $k$.
  - $k$ **tâm cụm** $\mu_1, \dots, \mu_k$.

```text
Trước:  • • •          • •          Sau (k = 3):  1 1 1          2 2
          •    • •   •                             1    3 3   2
                 • •                                      3 3
```

### Các thuật ngữ cần biết trước

- **Điểm dữ liệu / vector:** một đối tượng được mô tả bằng vài con số. Ví dụ một khách hàng là (tuổi, số lần mua hàng), tức là $d = 2$. Một điểm ảnh màu là (R, G, B), tức là $d = 3$.
- **Cụm** (cluster): một nhóm điểm nằm gần nhau.
- **Tâm cụm** (centroid): một điểm "đại diện" cho cả cụm, nằm ở giữa cụm. Ký hiệu $\mu$ (đọc là "muy").
- **Khoảng cách Euclid:** khoảng cách "chim bay" giữa hai điểm, xem [Độ đo khoảng cách](../../khai-niem/do-do-khoang-cach/).
- **Học không giám sát** (unsupervised learning): dữ liệu **không có đáp án** sẵn. Không ai nói trước điểm nào thuộc nhóm nào; thuật toán phải tự tìm ra các nhóm.

## Trực giác

**Đặt k cái loa phát nhạc trên một bãi cỏ đông người.** Mỗi người đi về phía loa gần mình nhất. Sau đó, mỗi loa được dời tới **chính giữa đám đông** đang đứng quanh nó. Loa dời chỗ thì có người lại thấy loa khác gần hơn, nên họ đổi nhóm. Cứ thế lặp lại: mọi người chọn loa gần nhất, loa dời về giữa nhóm. Tới một lúc không ai muốn đổi nhóm nữa, các loa cũng đứng yên. Lúc đó ta có $k$ nhóm.

K-means chỉ có đúng **hai động tác lặp đi lặp lại**:

1. **Gán:** mỗi điểm chọn tâm gần nhất.
2. **Cập nhật:** mỗi tâm dời về trung bình của các điểm đã chọn nó.

## Thuật toán

Thuật toán này còn gọi là thuật toán Lloyd.

1. **Khởi tạo:** chọn ngẫu nhiên $k$ điểm dữ liệu làm tâm ban đầu.
2. **Gán:** với mỗi điểm, tính khoảng cách Euclid tới từng tâm, rồi gán điểm vào cụm có tâm gần nhất.
3. **Cập nhật:** với mỗi cụm, tính **trung bình cộng** tọa độ các điểm trong cụm, rồi dời tâm tới đó.
4. **Lặp lại** bước 2 và 3 cho tới khi các tâm không đổi nữa (hoặc đạt số vòng lặp tối đa).

**Vì sao cần từng bước:**

- **Khởi tạo bằng điểm dữ liệu thật.** Đảm bảo mỗi tâm ban đầu có ít nhất một điểm ở gần. Nếu đặt tâm ở chỗ trống hoàn toàn, có thể không điểm nào chọn nó, và cụm đó **rỗng**.
- **Bước gán.** Nếu bỏ, các tâm không biết mình đại diện cho ai.
- **Bước cập nhật.** Nếu bỏ, các tâm đứng yên ở chỗ ngẫu nhiên ban đầu và kết quả chỉ là "chia theo vài điểm chọn bừa".
- **Lặp lại.** Một vòng thường chưa đủ: tâm dời đi thì một số điểm lại gần tâm khác hơn và cần đổi cụm.
- **Điều kiện dừng.** Khi tâm không đổi, bước gán sẽ cho đúng kết quả cũ, nên lặp thêm cũng vô ích.

### Đại lượng mà K-means làm giảm

Để biết cách chia nào "tốt", ta đo **mức độ chật** của các cụm:

$$
J = \sum_{j=1}^{k} \sum_{x \in C_j} \lVert x - \mu_j \rVert^2
$$

Đọc thành lời: *với mỗi cụm $C_j$, lấy từng điểm $x$ trong cụm, tính bình phương khoảng cách từ $x$ tới tâm $\mu_j$; cộng tất cả lại.*

- $C_j$ là tập các điểm thuộc cụm $j$.
- $\lVert x - \mu_j \rVert$ là khoảng cách Euclid từ $x$ tới tâm $\mu_j$.
- $J$ nhỏ nghĩa là các điểm nằm sát tâm của cụm mình, tức là cụm "chặt".

$J$ còn được gọi là **inertia** (tên dùng trong scikit-learn) hoặc **tổng bình phương trong cụm** (within-cluster sum of squares).

## Chạy tay từng bước

Sáu điểm trên mặt phẳng, chia thành $k = 2$ cụm. Để dễ theo dõi, ta **cố tình** khởi tạo hai tâm rất tệ, ở hai điểm sát nhau là P1 và P2.

```text
y
5 |              P5  P6
4 |              P4
3 |
2 | P2
1 | P1  P3
  +----------------------- x
    1   2   3   4   5   6
```

P1 = (1, 1), P2 = (1, 2), P3 = (2, 1), P4 = (5, 4), P5 = (5, 5), P6 = (6, 5).

**Vòng 1.** Tâm 1 = (1, 1), tâm 2 = (1, 2).

| Điểm | Khoảng cách tới tâm 1 | Khoảng cách tới tâm 2 | Gán vào |
| --- | --- | --- | --- |
| P1 | 0 | 1 | 1 |
| P2 | 1 | 0 | 2 |
| P3 | 1 | 1,41 | 1 |
| P4 | 5 | 4,47 | 2 |
| P5 | 5,66 | 5 | 2 |
| P6 | 6,40 | 5,83 | 2 |

Cụm 1 = {P1, P3}, cụm 2 = {P2, P4, P5, P6}. Cụm 2 đang gộp nhầm P2 với nhóm ở xa.

Cập nhật tâm bằng trung bình cộng:

- Tâm 1 = trung bình của P1, P3 = $\left(\frac{1+2}{2}, \frac{1+1}{2}\right) = (1{,}5;\ 1)$.
- Tâm 2 = trung bình của P2, P4, P5, P6 = $\left(\frac{1+5+5+6}{4}, \frac{2+4+5+5}{4}\right) = (4{,}25;\ 4)$.

**Vòng 2.** Tâm 1 = (1,5; 1), tâm 2 = (4,25; 4).

| Điểm | Khoảng cách tới tâm 1 | Khoảng cách tới tâm 2 | Gán vào |
| --- | --- | --- | --- |
| P1 | 0,50 | 4,42 | 1 |
| P2 | 1,12 | 3,82 | **1** (đổi cụm) |
| P3 | 0,50 | 3,75 | 1 |
| P4 | 4,61 | 0,75 | 2 |
| P5 | 5,32 | 1,25 | 2 |
| P6 | 6,02 | 2,02 | 2 |

Tâm 2 đã dời về phía nhóm bên phải, nên P2 thấy tâm 1 gần hơn và đổi sang cụm 1. Cập nhật:

- Tâm 1 = trung bình của P1, P2, P3 = $\left(\frac{4}{3}, \frac{4}{3}\right) \approx (1{,}33;\ 1{,}33)$.
- Tâm 2 = trung bình của P4, P5, P6 = $\left(\frac{16}{3}, \frac{14}{3}\right) \approx (5{,}33;\ 4{,}67)$.

**Vòng 3.** Gán lại với tâm mới: không điểm nào đổi cụm, nên tâm cũng không đổi. **Dừng.**

**$J$ giảm dần qua từng bước:**

| Thời điểm | $J$ |
| --- | --- |
| Sau bước gán, vòng 1 | 80,00 |
| Sau bước cập nhật, vòng 1 | 21,25 |
| Sau bước gán, vòng 2 | 7,94 |
| Sau bước cập nhật, vòng 2 | 2,67 |
| Vòng 3 | 2,67 (không đổi, dừng) |

Mọi con số trong phần này đã được kiểm lại bằng code.

## Vì sao thuật toán cho kết quả đúng

"Đúng" ở đây có nghĩa: thuật toán **luôn dừng**, và mỗi bước đều làm các cụm **chặt hơn hoặc giữ nguyên**. Lý do nằm ở chỗ **cả hai bước đều không làm $J$ tăng**.

1. **Bước gán không làm $J$ tăng.** Mỗi điểm chọn tâm **gần nhất**, nên phần đóng góp của nó vào $J$ chỉ có thể nhỏ đi hoặc giữ nguyên.
2. **Bước cập nhật không làm $J$ tăng.** Với một nhóm điểm cố định, **trung bình cộng** chính là vị trí làm tổng bình phương khoảng cách nhỏ nhất. Ví dụ với ba số 1, 2, 6 (trung bình là 3):
   - đặt tâm ở 2: $1 + 0 + 16 = 17$;
   - đặt tâm ở 3: $4 + 1 + 9 = 14$, nhỏ nhất;
   - đặt tâm ở 4: $9 + 4 + 4 = 17$.
3. **Vì sao luôn dừng.** Có hữu hạn cách chia $n$ điểm thành $k$ nhóm. $J$ không bao giờ tăng, nên thuật toán không thể quay lại một cách chia cũ có $J$ lớn hơn. Sau hữu hạn bước nó phải dừng.

**Nhưng chú ý:** thuật toán chỉ đảm bảo dừng ở một cách chia mà **không cải thiện thêm được bằng hai bước trên**, gọi là **cực tiểu địa phương** (local minimum). Đó chưa chắc là cách chia tốt nhất có thể. Giống như leo xuống một thung lũng trong sương mù: bạn tới được đáy thung lũng gần nhất, nhưng không biết có thung lũng nào sâu hơn ở chỗ khác. Kết quả phụ thuộc vào **tâm khởi tạo**, như phần code bên dưới cho thấy.

## Độ phức tạp và giả định

**Ký hiệu $O(\cdot)$** (đọc là "O lớn") cho biết thời gian chạy tăng theo kích thước đầu vào như thế nào, bỏ qua các hằng số.

- **Thời gian mỗi vòng lặp: $O(n \cdot k \cdot d)$.** Bước gán tính khoảng cách từ $n$ điểm tới $k$ tâm, mỗi khoảng cách cần $d$ phép trừ và bình phương.
  - **Ví dụ cụ thể:** nén màu một ảnh $1000 \times 1000$ điểm ($n = 10^6$, $d = 3$ kênh màu) xuống $k = 16$ màu. Mỗi vòng cần khoảng $10^6 \times 16 \times 3 \approx 5 \times 10^7$ phép tính. Thường cần vài chục vòng.
- **Bộ nhớ:** lưu dữ liệu, nhãn và $k$ tâm. Code ở dưới còn tạo một bảng khoảng cách $n \times k$.
- **Giả định ngầm:**
  - Cụm có dạng **gần tròn** và kích thước tương đương nhau. Với cụm hình dài, hình lưỡi liềm, K-means chia sai.
  - Các đặc trưng cùng thang đo. Nếu một cột tính bằng triệu đồng và cột kia tính bằng tuổi, khoảng cách Euclid gần như chỉ phản ánh cột triệu đồng. Cần **chuẩn hóa** trước (xem [Độ đo khoảng cách](../../khai-niem/do-do-khoang-cach/)).
  - Phải **biết trước $k$**.
- **Khi nào hỏng:**
  - Khởi tạo xấu, rơi vào cực tiểu địa phương.
  - Có **điểm ngoại lai** (outlier, điểm nằm rất xa mọi điểm khác) kéo lệch tâm, vì trung bình cộng rất nhạy với giá trị cực đoan.

## Cài đặt từ đầu

```python
import numpy as np

def kmeans_once(X, k, n_iter=100, rng=None, init=None):
    """Chạy K-means một lần. init: tâm ban đầu (nếu muốn tự chọn)."""
    rng = rng or np.random.default_rng()
    # Bước 1: khởi tạo bằng k điểm dữ liệu ngẫu nhiên
    centroids = X[rng.choice(len(X), size=k, replace=False)] if init is None else init.copy()
    for _ in range(n_iter):
        # Bước 2 (gán): bình phương khoảng cách từ mỗi điểm tới mỗi tâm, bảng (n, k)
        d2 = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)
        labels = d2.argmin(axis=1)                      # chọn tâm gần nhất
        # Bước 3 (cập nhật): tâm mới = trung bình cụm; cụm rỗng thì giữ tâm cũ
        new = np.array([
            X[labels == j].mean(axis=0) if np.any(labels == j) else centroids[j]
            for j in range(k)
        ])
        if np.allclose(new, centroids):                # Bước 4: tâm không đổi thì dừng
            break
        centroids = new
    d2 = ((X[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)
    labels = d2.argmin(axis=1)
    J = d2[np.arange(len(X)), labels].sum()            # inertia
    return labels, centroids, J

def kmeans(X, k, n_init=10, seed=0):
    """Chạy nhiều lần từ các tâm ban đầu khác nhau, giữ kết quả có J nhỏ nhất."""
    rng = np.random.default_rng(seed)
    best = None
    for _ in range(n_init):
        result = kmeans_once(X, k, rng=rng)
        if best is None or result[2] < best[2]:
            best = result
    return best

# Ví dụ 1: đúng 6 điểm ở phần "Chạy tay từng bước", khởi tạo ở P1 và P2
P = np.array([[1, 1], [1, 2], [2, 1], [5, 4], [5, 5], [6, 5]], dtype=float)
labels, centroids, J = kmeans_once(P, 2, init=P[[0, 1]])
print(labels + 1, np.round(centroids, 2).tolist(), round(J, 2))

# Ví dụ 2: 150 điểm, 3 đám tách bạch
rng = np.random.default_rng(1)
X = np.vstack([rng.normal(c, 0.5, size=(50, 2)) for c in [(0, 0), (5, 5), (0, 5)]])
labels, centroids, J = kmeans(X, k=3)
print(np.bincount(labels), round(J, 1))

# Quan sát: kết quả phụ thuộc tâm khởi tạo (6 lần chạy đơn lẻ)
for seed in range(6):
    *_, J = kmeans_once(X, 3, rng=np.random.default_rng(seed))
    print(seed, round(J, 1))
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2):

```text
[1 1 1 2 2 2] [[1.33, 1.33], [5.33, 4.67]] 2.67
[50 50 50] 62.9
0 692.1
1 692.1
2 703.5
3 703.6
4 62.9
5 62.9
```

Kết quả cho thấy:

- **Dòng 1** khớp với bảng chạy tay: hai cụm {P1, P2, P3} và {P4, P5, P6}, tâm (1,33; 1,33) và (5,33; 4,67), $J = 2{,}67$.
- **Dòng 2:** hàm `kmeans` (chạy 10 lần, giữ lần tốt nhất) chia đúng 3 đám, mỗi đám 50 điểm, $J = 62{,}9$.
- **Sáu dòng cuối:** chạy đơn lẻ thì 4 trong 6 lần rơi vào **cực tiểu địa phương** ($J$ khoảng 692 đến 704). Ở các lần đó, một đám thật bị tách đôi, còn hai đám thật khác bị gộp làm một. Chỉ 2 lần tìm ra cách chia đúng ($J = 62{,}9$). Đây là lý do thư viện luôn chạy nhiều lần với tâm khởi tạo khác nhau.

**So với thư viện:** `sklearn.cluster.KMeans(n_clusters=3, n_init=10, random_state=0)` trên cùng dữ liệu cho `inertia_` bằng 62,9, khớp với hàm tự viết (đã kiểm với scikit-learn).

## Lỗi hiểu nhầm thường gặp

- **"K-means luôn tìm ra cách chia tốt nhất."** Sai. Nó chỉ dừng ở cực tiểu địa phương. Cách nhận ra: chạy lại với tâm khởi tạo khác mà ra kết quả khác. Luôn chạy nhiều lần (`n_init`).
- **"K-means tự tìm ra số cụm."** Không. $k$ do bạn chọn. Nếu chọn $k = 5$ cho dữ liệu chỉ có 3 nhóm thật, K-means vẫn vui vẻ chia ra 5 cụm.
- **"$J$ càng nhỏ thì $k$ càng đúng."** Sai. Tăng $k$ thì $J$ luôn giảm; với $k = n$ (mỗi điểm một cụm) thì $J = 0$. Muốn chọn $k$ phải dùng cách khác, như phương pháp khuỷu tay hay hệ số silhouette (xem phần Biến thể).
- **Quên chuẩn hóa dữ liệu.** Đặc trưng có số lớn (thu nhập) lấn át đặc trưng có số nhỏ (tuổi). Cách nhận ra: các cụm chỉ khác nhau theo một cột.
- **"Nhãn cụm có ý nghĩa thứ tự."** Không. "Cụm 1" và "cụm 2" chỉ là tên; chạy lại có thể bị đổi tên cho nhau mà cách chia vẫn y hệt.

## Biến thể và thuật toán thay thế

- **K-means++:** chọn tâm ban đầu **rải xa nhau** (điểm càng xa các tâm đã chọn thì càng dễ được chọn), giảm hẳn nguy cơ khởi tạo tồi (Arthur và Vassilvitskii, 2007). Đây là cách khởi tạo mặc định của scikit-learn.
- **Chọn $k$:**
  - **Phương pháp khuỷu tay** (elbow): vẽ $J$ theo $k$, chọn chỗ đường cong "gập" lại, nơi tăng $k$ thêm không còn giảm $J$ nhiều.
  - **Hệ số silhouette:** đo mỗi điểm gần cụm mình hơn cụm khác bao nhiêu.
- **Mini-batch K-means:** mỗi vòng chỉ dùng một nhóm nhỏ dữ liệu, chạy nhanh trên dữ liệu rất lớn.
- **DBSCAN:** gom cụm theo **mật độ**, không cần biết $k$, xử lý được cụm hình dạng bất kỳ và tự loại điểm ngoại lai.
- **Gaussian Mixture Model:** gán **mềm**, tức mỗi điểm có xác suất thuộc từng cụm, thay vì thuộc hẳn một cụm.

## Được dùng ở đâu

- **Nén màu ảnh** (color quantization): coi mỗi điểm ảnh là một điểm (R, G, B), gom thành $k$ màu đại diện, rồi thay mỗi điểm ảnh bằng màu tâm cụm của nó. Kết quả phụ thuộc vào [không gian màu](../../khai-niem/khong-gian-mau/) được dùng.
- **Phân khúc khách hàng** hoặc người dùng mạng xã hội theo hành vi.
- **Tạo "từ điển hình ảnh"** trong các phương pháp thị giác máy tính truyền thống: gom các mảnh ảnh nhỏ giống nhau thành "từ".

## Tóm tắt để nhớ

- **Hai động tác lặp lại:** *gán vào tâm gần nhất* rồi *dời tâm về trung bình*.
- **Cả hai động tác đều không làm $J$ tăng**, nên thuật toán luôn dừng.
- Dừng ở **cực tiểu địa phương**, không chắc tốt nhất, nên **chạy nhiều lần**.
- **$k$ phải chọn trước**, dữ liệu phải **chuẩn hóa**, cụm nên **gần tròn**.

Câu ghi nhớ: *"Người tìm loa gần nhất, loa dời về giữa đám đông."*

## Câu hỏi tự kiểm tra

1. **Tính tay:** với 6 điểm ở phần Chạy tay, khởi tạo hai tâm ở **P1 = (1, 1)** và **P6 = (6, 5)**. Sau vòng 1, cụm và tâm là gì? Cần mấy vòng để dừng?
2. **Vì sao:** vì sao bước cập nhật dùng **trung bình cộng** mà không dùng, chẳng hạn, điểm đầu tiên của cụm?
3. **Vì sao:** vì sao chạy K-means hai lần trên cùng dữ liệu có thể ra hai kết quả khác nhau?
4. **Vận dụng:** bạn gom 1000 khách hàng theo (tuổi, thu nhập tính bằng đồng) và thấy các cụm chỉ khác nhau về thu nhập. Chuyện gì đã xảy ra, và sửa thế nào?
5. **Vận dụng:** có nên dùng K-means để tách hai đám điểm hình **hai vòng tròn lồng nhau** (một vòng nhỏ nằm trong một vòng lớn)? Vì sao?

<details>
<summary>Đáp án</summary>

1. Với tâm (1, 1) và (6, 5): P1, P2, P3 gần tâm 1; P4, P5, P6 gần tâm 2 (ví dụ P4 = (5, 4) cách tâm 2 chỉ $\sqrt{2} \approx 1{,}41$). Cập nhật: tâm 1 = (4/3; 4/3) ≈ (1,33; 1,33), tâm 2 = (16/3; 14/3) ≈ (5,33; 4,67). Vòng 2 gán lại không ai đổi cụm, nên dừng. Tổng cộng **2 vòng**, so với 3 vòng khi khởi tạo tệ ở P1 và P2. Khởi tạo tốt giúp hội tụ nhanh hơn.
2. Vì trung bình cộng là vị trí làm **tổng bình phương khoảng cách nhỏ nhất** tới các điểm trong cụm. Chính điều này đảm bảo bước cập nhật không làm $J$ tăng, và thuật toán luôn dừng. Dùng một điểm bất kỳ trong cụm thì không có đảm bảo đó, và tâm có thể lệch hẳn về một phía.
3. Vì tâm ban đầu được chọn **ngẫu nhiên**, mà thuật toán chỉ đi xuống "thung lũng" gần chỗ xuất phát nhất (cực tiểu địa phương). Xuất phát khác nhau có thể dừng ở thung lũng khác nhau. Cách khắc phục: chạy nhiều lần, giữ kết quả có $J$ nhỏ nhất, và/hoặc dùng K-means++.
4. Thu nhập (hàng triệu) lớn hơn tuổi (vài chục) hàng chục nghìn lần, nên khoảng cách Euclid gần như chỉ phản ánh thu nhập; tuổi bị bỏ qua. Cần **chuẩn hóa** từng cột trước khi chạy, ví dụ bằng z-score (trừ trung bình, chia độ lệch chuẩn).
5. Không nên. K-means giả định cụm có dạng **gần tròn** và mỗi cụm có một "tâm" ở giữa. Hai vòng tròn lồng nhau có **cùng tâm**, nên K-means sẽ cắt đôi cả hai vòng thành hai nửa thay vì tách vòng trong khỏi vòng ngoài. Khi mình chạy thử với `sklearn.datasets.make_circles` (400 điểm), K-means chia 200 điểm vòng trong thành hai nửa 102 và 98 điểm. Chỉ số ARI (đo độ khớp với nhãn thật, 1 là khớp hoàn toàn, 0 là như đoán bừa) chỉ khoảng 0. Nên dùng DBSCAN hoặc phân cụm phổ (spectral clustering).

</details>

## Nguồn

- Lloyd, S. (1982). *Least squares quantization in PCM.* IEEE Transactions on Information Theory (bản thảo lưu hành từ 1957).
- MacQueen, J. (1967). *Some methods for classification and analysis of multivariate observations.* Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability. Bài báo đặt tên "k-means".
- Arthur, D., Vassilvitskii, S. (2007). *k-means++: the advantages of careful seeding.* SODA.

## Cần kiểm tra lại

- Thông tin xuất bản của ba bài báo ở mục Nguồn viết theo trí nhớ, chưa đối chiếu bản gốc.
- Ước lượng "vài chục vòng" cho bài toán nén màu là kinh nghiệm chung, chưa đo trên ảnh cụ thể.
- Số liệu ở câu hỏi 5 là một lần chạy với `make_circles(n_samples=400, factor=0.4, noise=0.03, random_state=0)` và `KMeans(2, n_init=10, random_state=0)`; đổi tham số thì con số sẽ khác, nhưng kết luận không đổi.
