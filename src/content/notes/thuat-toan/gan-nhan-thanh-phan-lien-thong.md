---
title: "Gán nhãn thành phần liên thông"
summary: "Đánh số từng cụm điểm ảnh liền nhau (1, 2, 3...) để đếm và tách vật thể: thuật toán hai lần quét với bảng nhãn tương đương, hoặc loang bằng BFS."
course: thuat-toan
type: algorithm
tags: [connected-components, connectivity, image-processing, graph, union-find]
level: beginner
status: draft
prerequisites: [thuat-toan/tim-kiem-theo-chieu-rong-bfs]
usedIn: [thi-giac-may-tinh/quan-he-giua-cac-diem-anh]
related: [phan-tich-mang-xa-hoi/do-do-trung-tam]
order: 40
---

## Bài toán

- **Đầu vào:**
  - Một ảnh nhị phân $H \times W$ (cao $H$ hàng, rộng $W$ cột), trong đó 1 là điểm thuộc vật và 0 là nền.
  - Một lựa chọn: dùng **4-liền kề** hay **8-liền kề**.
- **Đầu ra:**
  - Một **ảnh nhãn** cùng kích thước: nền mang số 0, mỗi cụm điểm liền nhau mang một số riêng $1, 2, \dots, n$.
  - Số cụm $n$, tức là số vật trong ảnh.

```text
Ảnh vào          Ảnh nhãn ra (4-liền kề)
1 1 0 0          1 1 0 0
1 0 0 1          1 0 0 2
0 0 1 1          0 0 2 2       -> có 2 vật
```

Tên tiếng Anh: connected-component labeling (CCL).

### Các thuật ngữ cần biết trước

- **Liền kề** (adjacency): hai điểm ảnh cùng bằng 1 và nằm sát nhau. Với **4-liền kề**, "sát nhau" là trên, dưới, trái, phải. Với **8-liền kề**, tính thêm 4 ô chéo.
- **Thành phần liên thông** (connected component): một nhóm điểm bằng 1 mà từ điểm nào cũng đi được tới điểm khác trong nhóm, mỗi bước đi sang một điểm liền kề. Ta gọi ngắn là một **cụm**, và mỗi cụm là một vật.
- **Nhãn** (label): con số ta ghi lên mỗi điểm để biết nó thuộc cụm nào.

Định nghĩa đầy đủ và ví dụ tính tay nằm ở bài [Quan hệ giữa các điểm ảnh](../../thi-giac-may-tinh/quan-he-giua-cac-diem-anh/).

## Trực giác

**Đếm đồng xu trên bàn.** Bạn chụp ảnh mấy đồng xu trên nền đen, rồi biến thành ảnh trắng đen. Mắt người nhìn là biết có bao nhiêu đồng. Máy tính thì chỉ thấy hàng vạn số 0 và 1. Nó cần một cách để biết **điểm trắng nào thuộc cùng một đồng xu**.

**Cách 1: đọc như đọc sách (hai lần quét).** Bạn cầm bút đi qua từng hàng, từ trái sang phải.

- Gặp một điểm trắng mà điểm **phía trên** và điểm **bên trái** đều chưa có tên: đặt một tên mới.
- Gặp một điểm trắng nằm sát một điểm đã có tên: dùng lại tên đó.

Rắc rối nằm ở **vật hình chữ U**. Hai cạnh của chữ U được gặp trước, ở hai chỗ khác nhau, nên được đặt hai tên khác nhau, ví dụ "1" và "2". Tới đáy chữ U bạn mới thấy hai cạnh nối với nhau. Lúc đó bạn **ghi vào sổ: "1 và 2 là một"**. Đọc hết ảnh, bạn đi thêm một lượt nữa để sửa mọi tên "2" thành "1".

**Cách 2: đổ sơn.** Gặp một điểm trắng chưa có tên, bạn đổ một xô sơn màu mới vào đó. Sơn tự loang ra hết cụm, vì nó chỉ chảy sang các điểm trắng liền kề. Xong thì tìm điểm trắng chưa có màu tiếp theo, đổ xô sơn màu khác. Cách "loang" này chính là [BFS](../../thuat-toan/tim-kiem-theo-chieu-rong-bfs/) trên lưới điểm ảnh.

## Thuật toán

### Cách 1: hai lần quét (two-pass)

**Lần quét 1**, từ trái sang phải, từ trên xuống dưới. Tại mỗi điểm $p$ bằng 1:

1. Nhìn các lân cận **đã đi qua rồi**:
   - với 4-liền kề: lân cận **trên** và lân cận **trái**;
   - với 8-liền kề: thêm hai ô chéo phía trên (trên-trái, trên-phải).
2. Nếu không lân cận nào có nhãn: gán cho $p$ một **nhãn mới**.
3. Nếu có lân cận đã có nhãn: gán cho $p$ **nhãn nhỏ nhất** trong số đó, và ghi vào sổ rằng **tất cả các nhãn đó là một** (gọi là "tương đương").

**Lần quét 2.** Đi lại toàn ảnh. Thay mỗi nhãn bằng **nhãn đại diện** của nhóm tương đương chứa nó, rồi đánh số lại cho liên tục $1, 2, \dots, n$.

**Vì sao cần từng bước:**

- **Chỉ nhìn trên và trái?** Vì đang quét theo thứ tự đọc sách, lân cận dưới và phải **chưa được đi qua**, nên chưa có nhãn để nhìn. Mối nối với chúng không bị mất: khi tới lượt điểm bên dưới, $p$ sẽ là lân cận "trên" của điểm đó.
- **Ghi sổ tương đương?** Nếu bỏ, vật hình chữ U bị đếm thành 2 vật.
- **Lần quét 2?** Lần quét 1 chỉ **ghi nhận** rằng hai nhãn là một, chưa **sửa** các điểm đã gán trước đó. Lần quét 2 mới thực sự sửa.

### "Cuốn sổ" tương đương: cấu trúc union-find

Cuốn sổ ghi "nhãn nào là một với nhãn nào" được cài đặt bằng một cấu trúc rất gọn tên là **union-find** (hợp và tìm, còn gọi là disjoint-set). Hình dung như sau:

- Mỗi nhãn **chỉ tay** vào một nhãn khác, hoặc vào chính nó.
- Nhãn chỉ tay vào chính nó là **trưởng nhóm**.
- **Tìm** (find): muốn biết nhãn $a$ thuộc nhóm nào, đi theo hướng chỉ tay cho tới khi gặp trưởng nhóm.
- **Hợp** (union): muốn ghi "nhóm của $a$ và nhóm của $b$ là một", cho trưởng nhóm này chỉ tay vào trưởng nhóm kia.

Trong code, "chỉ tay" là một mảng `parent`, với `parent[a]` là nhãn mà $a$ chỉ vào.

Một mẹo nhỏ giúp chạy nhanh hơn là **nén đường đi** (path compression): sau mỗi lần tìm, cho mọi nhãn trên đường đi chỉ thẳng vào trưởng nhóm, để lần sau khỏi đi vòng.

### Cách 2: loang bằng BFS (flood fill)

1. Duyệt ảnh theo thứ tự đọc sách.
2. Gặp một điểm bằng 1 mà chưa có nhãn: tăng bộ đếm $n$ thêm 1, rồi chạy BFS từ điểm đó, gán nhãn $n$ cho mọi điểm loang tới được.
3. Khi duyệt xong ảnh, $n$ là số cụm.

## Chạy tay từng bước

Ảnh $5 \times 3$, dùng **4-liền kề**. Tọa độ viết $(x, y)$, với $x$ là cột và $y$ là hàng.

```text
     x=0 1 2
y=0    1 0 1
y=1    1 0 1
y=2    1 1 1      <- đáy chữ U
y=3    0 0 0
y=4    1 1 0      <- một vật riêng
```

**Lần quét 1** (chỉ liệt kê các điểm bằng 1; $r$ là nhãn lân cận trên, $t$ là nhãn lân cận trái, 0 nghĩa là không có nhãn):

| Điểm | $r$ | $t$ | Quyết định | Sổ tương đương (ai chỉ vào ai) |
| --- | --- | --- | --- | --- |
| $(0, 0)$ | 0 | 0 | Nhãn mới **1** | 1→1 |
| $(2, 0)$ | 0 | 0 | Nhãn mới **2** | 1→1, 2→2 |
| $(0, 1)$ | 1 | 0 | Lấy nhãn 1 | không đổi |
| $(2, 1)$ | 2 | 0 | Lấy nhãn 2 | không đổi |
| $(0, 2)$ | 1 | 0 | Lấy nhãn 1 | không đổi |
| $(1, 2)$ | 0 | 1 | Lấy nhãn 1 | không đổi |
| $(2, 2)$ | 2 | 1 | Lấy nhãn nhỏ hơn là 1, **ghi "2 là một với 1"** | 1→1, **2→1** |
| $(0, 4)$ | 0 | 0 | Nhãn mới **3** | 1→1, 2→1, 3→3 |
| $(1, 4)$ | 0 | 3 | Lấy nhãn 3 | không đổi |

Ảnh nhãn sau lần quét 1, và sau lần quét 2:

```text
Sau lần quét 1        Sau lần quét 2
1 0 2                 1 0 1
1 0 2                 1 0 1
1 1 1                 1 1 1
0 0 0                 0 0 0
3 3 0                 2 2 0
```

Lần quét 2 làm hai việc:

- Nhãn 2 chỉ vào 1, nên mọi số 2 được thay bằng 1.
- Trưởng nhóm còn lại là 1 và 3; đánh số lại liên tục thành 1 và 2.

Kết quả: ảnh có **2 vật**. Bảng này đã được kiểm lại bằng code.

## Vì sao thuật toán cho kết quả đúng

Cần chứng tỏ hai điều.

**1. Hai điểm cùng một cụm luôn nhận cùng nhãn cuối.** Lấy hai điểm liền kề bất kỳ, cả hai bằng 1. Điểm nào được quét **sau** sẽ thấy điểm kia là lân cận trên hoặc trái của nó, nên hai nhãn của chúng bị ghi là tương đương. Hai điểm cùng cụm thì nối được bằng một chuỗi các cặp liền kề như vậy, nên mọi nhãn trên chuỗi đều được gộp về cùng một nhóm. Lần quét 2 thay tất cả bằng cùng một nhãn đại diện.

**2. Hai điểm khác cụm không bao giờ bị gộp nhầm.** Thuật toán chỉ gộp nhãn khi hai điểm **thật sự liền kề**. Hai cụm khác nhau thì không có cặp điểm liền kề nào nối chúng, nên không có lý do gì để gộp.

Với cách BFS, lý lẽ còn đơn giản hơn: BFS từ một điểm thăm **đúng** mọi điểm đi tới được, tức là đúng cụm chứa nó, không thiếu không thừa.

## Độ phức tạp và giả định

**Ký hiệu $O(\cdot)$** (đọc là "O lớn") cho biết thời gian chạy tăng theo kích thước đầu vào như thế nào. "$O(H \cdot W)$" nghĩa là: số điểm ảnh gấp đôi thì thời gian khoảng gấp đôi.

- **Thời gian:** cả hai cách đều khoảng $O(H \cdot W)$.
  - Cách hai lần quét đi qua ảnh 2 lượt, mỗi điểm nhìn 2 hoặc 4 lân cận. Phần union-find tốn thêm một chút, nhưng nhờ nén đường đi, chi phí này gần như không đáng kể.
  - Cách BFS: mỗi điểm vào hàng đợi đúng một lần.
  - **Ví dụ cụ thể:** ảnh $512 \times 512$ có $262\,144$ điểm, tức là cỡ vài trăm nghìn đến một triệu phép kiểm tra.
- **Bộ nhớ:** ảnh nhãn cùng kích thước ảnh gốc. Cách hai lần quét cần thêm cuốn sổ tương đương (số mục bằng số nhãn tạm). Cách BFS cần hàng đợi; nếu một vật phủ gần cả ảnh, hàng đợi có thể chứa rất nhiều điểm.
- **Khi nào hỏng:**
  - **Chọn sai loại liền kề.** Hai vật chạm nhau ở góc là 2 vật theo 4-liền kề, nhưng chỉ là 1 vật theo 8-liền kề.
  - **Ảnh nhị phân nhiều nhiễu.** Mỗi chấm nhiễu trắng thành một "vật" riêng. Cần lọc nhiễu trước, hoặc bỏ các cụm quá nhỏ.
  - **Quên lần quét 2:** vật hình chữ U bị đếm thành hai.

## Cài đặt từ đầu

```python
import numpy as np
from collections import deque

# Các lân cận "đã đi qua" khi quét trái -> phải, trên -> dưới, dạng (dy, dx)
PREV = {4: [(-1, 0), (0, -1)],                       # trên, trái
        8: [(-1, -1), (-1, 0), (-1, 1), (0, -1)]}    # thêm 2 ô chéo phía trên

def label_two_pass(img, connectivity=4):
    H, W = img.shape
    lab = np.zeros((H, W), dtype=int)
    parent = [0]                                  # "sổ": parent[i] là nhãn mà i chỉ tay vào

    def find(a):                                  # tìm trưởng nhóm của a
        root = a
        while parent[root] != root:
            root = parent[root]
        while parent[a] != root:                  # nén đường đi: chỉ thẳng vào trưởng nhóm
            parent[a], a = root, parent[a]
        return root

    for y in range(H):                            # LẦN QUÉT 1
        for x in range(W):
            if not img[y, x]:
                continue                          # nền: bỏ qua
            nbs = [lab[y + dy, x + dx] for dy, dx in PREV[connectivity]
                   if y + dy >= 0 and 0 <= x + dx < W and lab[y + dy, x + dx]]
            if not nbs:
                parent.append(len(parent))        # nhãn mới, tự chỉ vào chính nó
                lab[y, x] = len(parent) - 1
            else:
                m = min(find(n) for n in nbs)     # lấy nhãn nhỏ nhất
                lab[y, x] = m
                for n in nbs:                     # ghi sổ: các nhãn gặp nhau là một
                    parent[find(n)] = m

    roots = {}
    for y in range(H):                            # LẦN QUÉT 2
        for x in range(W):
            if lab[y, x]:                         # thay bằng trưởng nhóm, đánh số lại 1, 2, ...
                lab[y, x] = roots.setdefault(find(lab[y, x]), len(roots) + 1)
    return lab, len(roots)

def label_bfs(img, connectivity=4):
    H, W = img.shape
    steps = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    if connectivity == 8:
        steps += [(-1, -1), (-1, 1), (1, -1), (1, 1)]
    lab = np.zeros((H, W), dtype=int)
    n = 0
    for y in range(H):
        for x in range(W):
            if img[y, x] and not lab[y, x]:       # điểm trắng chưa có màu: đổ xô sơn mới
                n += 1
                lab[y, x] = n
                queue = deque([(y, x)])
                while queue:                      # sơn loang ra toàn bộ cụm
                    cy, cx = queue.popleft()
                    for dy, dx in steps:
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < H and 0 <= nx < W and img[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n
                            queue.append((ny, nx))
    return lab, n

# Ví dụ trong phần "Chạy tay từng bước"
u_shape = np.array([[1, 0, 1],
                    [1, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0],
                    [1, 1, 0]])
print(label_two_pass(u_shape, 4))

# Cùng một ảnh, đổi loại liền kề thì số vật thay đổi
img = np.array([[1, 1, 0, 1, 0],
                [0, 1, 0, 1, 0],
                [1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1],
                [1, 0, 1, 1, 0]])
for c in (4, 8):
    lab, n = label_two_pass(img, c)
    print(f"{c}-liên thông: {n} thành phần")
    print(lab)
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2):

```text
(array([[1, 0, 1],
       [1, 0, 1],
       [1, 1, 1],
       [0, 0, 0],
       [2, 2, 0]]), 2)
4-liên thông: 4 thành phần
[[1 1 0 1 0]
 [0 1 0 1 0]
 [1 1 1 1 0]
 [0 0 0 0 2]
 [3 0 4 4 0]]
8-liên thông: 2 thành phần
[[1 1 0 1 0]
 [0 1 0 1 0]
 [1 1 1 1 0]
 [0 0 0 0 1]
 [2 0 1 1 0]]
```

Kết quả cho thấy:

- Dòng đầu khớp với bảng chạy tay: chữ U thành **một** vật, cụm ở hàng cuối là vật thứ hai.
- Với ảnh thứ hai, đổi từ 4 sang 8-liền kề thì số vật giảm từ 4 xuống 2. Lý do là điểm $(4, 3)$ (cột 4, hàng 3) chỉ chạm chữ U ở **góc**. Theo 4-liền kề nó là vật riêng; theo 8-liền kề nó được gộp vào chữ U. Cụm $(2, 4), (3, 4)$ ở hàng cuối cũng chạm điểm đó ở góc nên bị gộp theo.

**So với thư viện:** mình chạy cả hai hàm trên 200 ảnh ngẫu nhiên kích thước $20 \times 30$ và so với `scipy.ndimage.label`. Với 4-liền kề dùng `structure` mặc định của SciPy, với 8-liền kề dùng `structure=np.ones((3, 3))`. Kết quả **khớp hoàn toàn**, cả số thành phần lẫn từng nhãn (SciPy 1.13.1).

**Tốc độ** trên ảnh ngẫu nhiên $512 \times 512$, 4-liền kề, một lần chạy trên máy Mac:

| Cách | Thời gian |
| --- | --- |
| `label_two_pass` (Python thuần) | khoảng 0,25 giây |
| `label_bfs` (Python thuần) | khoảng 0,15 giây |
| `scipy.ndimage.label` (viết bằng C) | khoảng 0,002 giây |

Bài học: tự viết để hiểu, còn khi dùng thật thì gọi thư viện.

## Lỗi hiểu nhầm thường gặp

- **"Một lần quét là đủ, cứ gặp lân cận có nhãn thì lấy nhãn đó."** Sai với vật hình chữ U hoặc chữ V: hai nhánh mang hai nhãn khác nhau. Cách nhận ra: số vật đếm được lớn hơn số vật nhìn thấy bằng mắt.
- **"Ghi sổ tương đương xong là các điểm tự đổi nhãn."** Không. Sổ chỉ ghi "1 và 2 là một"; các điểm đã gán nhãn 2 vẫn mang số 2 cho tới **lần quét 2**.
- **Gộp nhãn bằng cách ghi thẳng `parent[n] = m`** thay vì `parent[find(n)] = m`. Nếu $n$ không phải trưởng nhóm, chỉ nhãn $n$ được nối, còn trưởng nhóm cũ của nó vẫn đứng riêng, nên một phần cụm bị tách ra.
- **Dùng 8-liền kề nhưng chỉ xét trên và trái.** Hai ô chéo phía trên bị bỏ sót, nên kết quả thực chất vẫn là 4-liền kề.
- **"Nhãn phải liên tục và theo thứ tự xuất hiện."** Không bắt buộc về mặt ý nghĩa: nhãn chỉ để phân biệt các cụm. Đánh số lại ở lần quét 2 chỉ cho dễ đọc và dễ đếm.

## Biến thể và thuật toán thay thế

- **8-liền kề:** chỉ cần mở rộng tập lân cận "đã đi qua", như biến `PREV` ở trên.
- **Gán nhãn theo DFS:** giống BFS nhưng dùng ngăn xếp. Nếu viết bằng đệ quy, dễ tràn ngăn xếp khi vật lớn, vì Python giới hạn độ sâu đệ quy.
- **Thuật toán một lần quét** và các bản tối ưu cho phần cứng: OpenCV cài sẵn trong `cv2.connectedComponents` và `cv2.connectedComponentsWithStats`. Hàm có đuôi `WithStats` trả thêm diện tích, khung bao và tâm của từng vật, rất tiện để đếm và đo vật.
- **Thành phần liên thông trên đồ thị:** cùng ý tưởng, chạy BFS hoặc union-find trên danh sách cạnh (`networkx.connected_components`).

## Được dùng ở đâu

- **Thị giác máy tính:**
  - Đếm và tách vật thể sau khi phân ngưỡng ảnh thành trắng đen.
  - Bỏ các đốm nhiễu nhỏ (xóa cụm có ít điểm).
  - Đo diện tích, vị trí từng vật.

  Định nghĩa và ví dụ tính tay nằm ở bài [Quan hệ giữa các điểm ảnh](../../thi-giac-may-tinh/quan-he-giua-cac-diem-anh/).
- **Phân tích mạng xã hội:** tìm các nhóm người không có đường quen biết nào với nhau. Nhiều độ đo như [độ đo trung tâm](../../phan-tich-mang-xa-hoi/do-do-trung-tam/) thường được tính riêng trên thành phần liên thông lớn nhất.

## Tóm tắt để nhớ

- Mục tiêu: **mỗi cụm điểm liền nhau một con số**, để đếm và tách vật.
- Hai lần quét = **đặt tên tạm khi đọc**, **ghi sổ khi phát hiện hai tên là một**, rồi **sửa tên ở lượt đọc thứ hai**.
- Chỉ nhìn **trên và trái**, vì dưới và phải chưa được đọc tới.
- Cuốn sổ là **union-find**: mỗi nhãn chỉ tay về trưởng nhóm.
- Cách khác: **đổ sơn** (BFS) từ mỗi điểm chưa có màu.
- Kết quả **phụ thuộc vào 4 hay 8-liền kề**, nên phải chọn trước.

Câu ghi nhớ: *"Chữ U dạy ta cần lượt quét thứ hai."*

## Câu hỏi tự kiểm tra

1. **Tính tay:** gán nhãn ảnh sau theo 4-liền kề và theo 8-liền kề. Mỗi cách đếm được mấy vật?

   ```text
   1 1 0 0 1
   0 1 0 1 1
   0 1 1 1 0
   1 0 0 0 1
   ```
2. **Vì sao:** trong lần quét 1 với 4-liền kề, vì sao chỉ cần xét lân cận **trên** và **trái**?
3. **Tính tay:** vẽ một vật mà lần quét 1 tạo ra **ba** nhãn tạm cho cùng một vật.
4. **Vận dụng:** ảnh chụp 10 đồng xu, nhưng sau khi gán nhãn máy đếm được 57 vật. Nguyên nhân có thể là gì, và sửa thế nào?
5. **Vận dụng:** khi nào nên dùng 4-liền kề, khi nào nên dùng 8-liền kề để đếm vật?

<details>
<summary>Đáp án</summary>

1. Theo **4-liền kề: 3 vật.**
   - Vật lớn gồm $(0,0), (1,0), (1,1), (1,2), (2,2), (3,2), (3,1), (4,1), (4,0)$, nối thành hình chữ U ngược.
   - Điểm $(0, 3)$ ở góc dưới trái đứng riêng.
   - Điểm $(4, 3)$ ở góc dưới phải đứng riêng; nó chỉ chạm $(3, 2)$ ở góc.

   Theo **8-liền kề: 1 vật.** Điểm $(0, 3)$ chạm chéo $(1, 2)$, và điểm $(4, 3)$ chạm chéo $(3, 2)$. Cả hai đều thuộc vật lớn, nên toàn ảnh chỉ còn một vật.

   Đáp án đã kiểm bằng `label_two_pass`.
2. Vì quét theo thứ tự đọc sách, lân cận dưới và phải **chưa được đi qua** nên chưa có nhãn. Mối nối với chúng vẫn được ghi nhận, chỉ là muộn hơn: khi tới lượt điểm bên dưới hoặc bên phải, $p$ là lân cận trên hoặc trái của điểm đó.
3. Ví dụ chiếc lược ba răng, dạng chữ "Ш":

   ```text
   1 0 1 0 1
   1 0 1 0 1
   1 1 1 1 1
   ```

   Ở hàng đầu, ba răng nhận ba nhãn tạm 1, 2, 3 vì chưa có lân cận nào có nhãn. Tới hàng đáy, ba nhãn lần lượt được ghi là tương đương.
4. Nhiều khả năng ảnh nhị phân có **nhiễu**: các chấm trắng lẻ tẻ trên nền, mỗi chấm thành một "vật". Cũng có thể ngưỡng chọn chưa tốt làm một đồng xu bị vỡ thành nhiều mảnh. Cách sửa: lọc nhiễu trước khi phân ngưỡng (ví dụ lọc trung vị), chọn ngưỡng tốt hơn, và sau khi gán nhãn thì bỏ các cụm có diện tích quá nhỏ.
5. Không có đáp án chung; tùy hình dạng vật thật. Nét chữ mảnh hoặc đường kẻ chéo dễ bị "đứt" nếu dùng 4-liền kề, nên 8-liền kề phù hợp hơn. Khi các vật nằm rất sát nhau và chỉ chạm ở góc do nhiễu, 4-liền kề tránh gộp nhầm. Điều quan trọng là chọn trước và ghi rõ trong báo cáo.

</details>

## Nguồn

- Rosenfeld, A., Pfaltz, J. L. (1966). *Sequential operations in digital picture processing.* Journal of the ACM. Bài báo gốc của thuật toán hai lần quét.
- Tarjan, R. E. (1975). *Efficiency of a good but not linear set union algorithm.* Journal of the ACM. Phân tích cấu trúc union-find.
- Tài liệu SciPy: `scipy.ndimage.label`. Tài liệu OpenCV: `cv2.connectedComponents`.

## Cần kiểm tra lại

- Thông tin xuất bản của hai bài báo ở mục Nguồn viết theo trí nhớ của mình, chưa đối chiếu với bản gốc.
- Bảng tốc độ là một lần đo trên một máy, chỉ để thấy độ lớn chênh lệch; không phải phép đo chuẩn.
- Code tự viết dùng union-find có nén đường đi nhưng **chưa** hợp theo hạng (union by rank). Kết quả vẫn đúng; chỉ khác về độ phức tạp lý thuyết.
