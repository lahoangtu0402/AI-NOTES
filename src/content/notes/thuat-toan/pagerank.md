---
title: PageRank
summary: "Xếp hạng các đỉnh của một đồ thị có hướng theo ý tưởng: được nhiều trang quan trọng trỏ tới thì quan trọng. Điểm số chính là tỉ lệ thời gian một người lướt web ngẫu nhiên dừng ở mỗi trang, tính bằng phép lặp."
course: thuat-toan
type: algorithm
tags: [graph, ranking, linear-algebra]
level: intermediate
status: draft
prerequisites: [nen-tang/vector-va-ma-tran, thuat-toan/tim-kiem-theo-chieu-rong-bfs]
usedIn: [phan-tich-mang-xa-hoi/do-do-trung-tam]
related: []
order: 20
---

## Bài toán

- **Đầu vào:** một **đồ thị có hướng** gồm $N$ đỉnh. Ví dụ: các trang web, với cạnh $j \to i$ nghĩa là trang $j$ có liên kết tới trang $i$.
- **Đầu ra:** một điểm số $PR(i) \ge 0$ cho mỗi đỉnh, tổng tất cả các điểm bằng 1. Điểm càng cao, đỉnh càng "quan trọng".

### Các thuật ngữ cần biết trước

- **Đồ thị có hướng** (directed graph): đồ thị mà mỗi cạnh có chiều, vẽ bằng mũi tên. "A trỏ tới B" không có nghĩa "B trỏ tới A". Trên web, trang của bạn có thể liên kết tới Wikipedia mà Wikipedia không liên kết lại.
- **Liên kết ra** (out-link) của một trang: các mũi tên đi **ra** từ trang đó. Ký hiệu $L(j)$ là **số** liên kết ra của trang $j$.
- **Trang cụt** (dangling node): trang không có liên kết ra nào.
- **Xác suất:** một con số từ 0 đến 1 cho biết một việc dễ xảy ra tới đâu; 0,85 nghĩa là "85 trên 100 lần".
- **Phép lặp** (iteration): áp dụng đi áp dụng lại cùng một công thức, mỗi lần dùng kết quả của lần trước.
- **Hội tụ** (convergence): sau nhiều lần lặp, kết quả gần như **không đổi** nữa.

## Trực giác

**Người lướt web ngẫu nhiên.** Tưởng tượng một người rất rảnh, lướt web mãi không nghỉ:

- Ở mỗi trang, **85% số lần** họ bấm một liên kết bất kỳ trên trang đó, mỗi liên kết có cơ hội như nhau.
- **15% số lần còn lại** họ chán, gõ một địa chỉ ngẫu nhiên và nhảy tới một trang bất kỳ trong toàn bộ web.

Sau rất lâu, đếm xem người đó **dành bao nhiêu phần thời gian ở mỗi trang**. Tỉ lệ đó chính là **PageRank**.

Vì sao điều này đo được "mức quan trọng"?

- Trang được **nhiều trang** trỏ tới thì người lướt hay bị dẫn tới đó.
- Trang được một trang **rất hay được ghé thăm** trỏ tới thì cũng hay được ghé thăm theo.
- Một trang trỏ tới **quá nhiều** trang thì mỗi liên kết của nó được bấm ít đi, nên mỗi "phiếu bầu" của nó nhẹ hơn.

Cách nghĩ thứ hai là **bỏ phiếu có trọng số**. Mỗi trang có một số "phiếu" bằng điểm của nó, và chia đều số phiếu đó cho các trang nó trỏ tới. Trang quan trọng thì phiếu nặng. Khác với cuộc bầu cử thường, ở đây **phiếu của ai nặng bao nhiêu lại phụ thuộc vào kết quả bầu**. Vì vậy phải tính bằng cách lặp, cho tới khi kết quả ổn định.

## Thuật toán

### Công thức

$$
PR(i) = \frac{1-d}{N} + d \sum_{j \to i} \frac{PR(j)}{L(j)}
$$

Giải thích từng ký hiệu:

- $PR(i)$: điểm của trang $i$.
- $N$: tổng số trang.
- $d$: **hệ số đi theo liên kết** (damping factor), thường chọn $d = 0{,}85$. Đây là xác suất người lướt bấm một liên kết thay vì nhảy ngẫu nhiên.
- $\sum_{j \to i}$: cộng qua mọi trang $j$ **có liên kết tới** $i$.
- $\frac{PR(j)}{L(j)}$: trang $j$ chia đều điểm của mình cho $L(j)$ trang mà nó trỏ tới; $i$ nhận một phần.

Đọc thành lời: *điểm của trang $i$ gồm hai phần. Phần nhỏ $\frac{1-d}{N}$ là "điểm an ủi" mà trang nào cũng có, do người lướt nhảy ngẫu nhiên tới. Phần chính là $d$ nhân tổng các phần điểm mà những trang trỏ tới $i$ chia cho nó.*

### Các bước

1. **Khởi tạo:** cho mọi trang điểm bằng nhau, $PR(i) = \frac{1}{N}$.
2. **Lặp:** dùng điểm của vòng trước, tính điểm mới cho **tất cả** các trang theo công thức trên.
3. **Dừng** khi điểm mới gần như bằng điểm cũ: tổng chênh lệch nhỏ hơn một ngưỡng rất nhỏ, ví dụ $10^{-10}$.
4. **Trang cụt:** coi như nó có liên kết tới **mọi** trang, tức chia đều điểm của nó cho tất cả.

**Vì sao cần từng bước:**

- **Khởi tạo đều.** Ta chưa biết trang nào quan trọng nên bắt đầu công bằng. Phần "Vì sao đúng" giải thích rằng điểm xuất phát **không ảnh hưởng** kết quả cuối.
- **Lặp nhiều lần.** Một vòng chỉ "truyền điểm" đi một bước liên kết. Muốn ảnh hưởng của những trang ở xa lan tới, cần nhiều vòng.
- **Phần nhảy ngẫu nhiên $(1-d)$.** Nếu bỏ (tức $d = 1$), một nhóm trang chỉ trỏ vào nhau, gọi là **bẫy nhện** (spider trap), sẽ "hút" hết điểm của cả đồ thị (ví dụ ở phần Cài đặt). Trang không ai trỏ tới cũng sẽ có điểm 0.
- **Xử lý trang cụt.** Nếu bỏ, điểm "chảy vào" trang cụt rồi biến mất, tổng điểm không còn bằng 1.

### Dạng ma trận (cho ai đã học đại số tuyến tính)

Gọi $r$ là **vector** điểm (danh sách $N$ con số $PR(1), \dots, PR(N)$) và $P$ là **ma trận chuyển** (transition matrix): ô ở hàng $j$, cột $i$ bằng $\frac{1}{L(j)}$ nếu $j$ trỏ tới $i$, ngược lại bằng 0. Mỗi hàng của $P$ cho biết người lướt đang ở trang $j$ sẽ đi tiếp tới đâu với xác suất bao nhiêu, nên tổng mỗi hàng bằng 1. Khi đó cả $N$ công thức ở trên gộp thành một:

$$
r = d\, P^{\top} r + \frac{1-d}{N}\mathbf{1}
$$

Trong đó $P^{\top}$ là ma trận chuyển vị của $P$, và $\mathbf{1}$ là vector toàn số 1. Phép lặp ở trên gọi là **phép lặp lũy thừa** (power iteration).

## Chạy tay từng bước

Bốn trang, năm liên kết:

```text
Liên kết:  A → B,  A → C,  B → C,  C → A,  D → C

          A
        ↙   ⇅          (⇅ nghĩa là có cả A → C và C → A)
      B ──▶ C ◀── D
```

| Trang | Trỏ tới | $L$ (số liên kết ra) | Được trỏ tới bởi |
| --- | --- | --- | --- |
| A | B, C | 2 | C |
| B | C | 1 | A |
| C | A | 1 | A, B, D |
| D | C | 1 | (không ai) |

Với $N = 4$ và $d = 0{,}85$, phần "điểm an ủi" là $\frac{1-d}{N} = \frac{0{,}15}{4} = 0{,}0375$. Bốn công thức cụ thể:

$$
\begin{aligned}
PR(A) &= 0{,}0375 + 0{,}85 \cdot \tfrac{PR(C)}{1} \\
PR(B) &= 0{,}0375 + 0{,}85 \cdot \tfrac{PR(A)}{2} \\
PR(C) &= 0{,}0375 + 0{,}85 \cdot \left( \tfrac{PR(A)}{2} + \tfrac{PR(B)}{1} + \tfrac{PR(D)}{1} \right) \\
PR(D) &= 0{,}0375
\end{aligned}
$$

**Vòng 0:** mọi trang có điểm $0{,}25$.

**Vòng 1:** thay điểm vòng 0 vào công thức.

- $PR(A) = 0{,}0375 + 0{,}85 \times 0{,}25 = 0{,}25$
- $PR(B) = 0{,}0375 + 0{,}85 \times 0{,}125 = 0{,}14375$
- $PR(C) = 0{,}0375 + 0{,}85 \times (0{,}125 + 0{,}25 + 0{,}25) = 0{,}0375 + 0{,}53125 = 0{,}56875$
- $PR(D) = 0{,}0375$

Kiểm tra: $0{,}25 + 0{,}14375 + 0{,}56875 + 0{,}0375 = 1$. Tổng vẫn bằng 1.

**Vòng 2:** thay điểm vòng 1 vào.

- $PR(A) = 0{,}0375 + 0{,}85 \times 0{,}56875 \approx 0{,}5209$. A tăng vọt vì C (đang có điểm cao) dồn toàn bộ phiếu cho A.
- $PR(B) = 0{,}0375 + 0{,}85 \times 0{,}125 = 0{,}14375$
- $PR(C) = 0{,}0375 + 0{,}85 \times (0{,}125 + 0{,}14375 + 0{,}0375) \approx 0{,}2978$. C giảm vì B và D có ít điểm hơn vòng trước.
- $PR(D) = 0{,}0375$

**Các vòng tiếp theo** (tính bằng code):

| Vòng | A | B | C | D | Chênh lệch so với kết quả cuối |
| --- | --- | --- | --- | --- | --- |
| 0 | 0,2500 | 0,2500 | 0,2500 | 0,2500 | 0,53 |
| 1 | 0,2500 | 0,1438 | 0,5688 | 0,0375 | 0,35 |
| 2 | 0,5209 | 0,1438 | 0,2978 | 0,0375 | 0,30 |
| 3 | 0,2906 | 0,2589 | 0,4130 | 0,0375 | 0,16 |
| 5 | 0,3885 | 0,2026 | 0,3714 | 0,0375 | 0,046 |
| 10 | 0,3751 | 0,1949 | 0,3925 | 0,0375 | 0,005 |
| 20 | 0,3725 | 0,1958 | 0,3942 | 0,0375 | 0,00002 |
| 50 | 0,3725 | 0,1958 | 0,3941 | 0,0375 | gần 0 |

Cột cuối là tổng chênh lệch tuyệt đối giữa điểm ở vòng đó và điểm cuối cùng.

Đọc kết quả:

- **C cao nhất** (0,394): ba trang A, B, D đều trỏ tới C.
- **A đứng thứ hai** (0,373) dù chỉ có **một** trang trỏ tới. Lý do: trang đó là C, trang quan trọng nhất, và C dồn **toàn bộ** phiếu cho A. Đây là điểm khác biệt cốt lõi giữa PageRank và việc chỉ đếm số liên kết tới.
- **D thấp nhất**, đúng bằng 0,0375: không ai trỏ tới D, nên D chỉ có "điểm an ủi".
- Điểm dao động qua lại vài vòng đầu, rồi **ổn định dần**. Đó là hội tụ.

Mọi con số trong phần này đã được kiểm lại bằng code.

## Vì sao thuật toán cho kết quả đúng

Cần trả lời ba câu hỏi.

**1. Tổng điểm có luôn bằng 1 không?** Có. Mỗi trang chia **toàn bộ** phần $d$ điểm của mình cho các trang khác: trang thường chia cho các trang nó trỏ tới, trang cụt chia cho mọi trang. Phần $1 - d$ còn lại được chia đều cho mọi trang. Điểm chỉ **di chuyển**, không sinh ra hay mất đi.

**2. Phép lặp có dừng ở một kết quả ổn định không, và có phụ thuộc điểm xuất phát không?** Hãy tưởng tượng chạy song song hai lần, với hai điểm xuất phát khác nhau.

- Phần "điểm an ủi" $\frac{1-d}{N}$ ở hai lần **giống hệt nhau**.
- Chỉ phần nhân với $d$ là phụ thuộc vào vòng trước.

Vì vậy mỗi vòng, **khoảng cách giữa hai lần chạy co lại còn nhiều nhất $d = 0{,}85$ lần**. Sau 50 vòng, nó còn nhiều nhất $0{,}85^{50} \approx 0{,}0003$ lần ban đầu. Hai lần chạy dần trùng nhau, nên chỉ có **một** kết quả cuối, bất kể xuất phát từ đâu. Bảng ở trên cho thấy chênh lệch còn giảm nhanh hơn mức đảm bảo này.

**3. Kết quả đó có đúng là "tỉ lệ thời gian của người lướt web" không?** Có. Công thức nói rằng: xác suất người lướt đang ở trang $i$ bằng xác suất họ nhảy ngẫu nhiên tới $i$, cộng xác suất họ đang ở một trang $j$ trỏ tới $i$ rồi bấm đúng liên kết đó. Khi tỉ lệ thời gian đã ổn định thì nó phải thỏa công thức này. Phần code bên dưới có một mô phỏng người lướt web thật, cho ra gần đúng các con số trong bảng.

## Độ phức tạp và giả định

**Ký hiệu $O(\cdot)$** (đọc là "O lớn") cho biết thời gian chạy tăng theo kích thước đầu vào như thế nào, bỏ qua các hằng số.

- **Thời gian mỗi vòng lặp: $O(M)$** nếu lưu đồ thị dạng **thưa** (chỉ lưu các liên kết có thật), với $M$ là số liên kết. Mỗi liên kết chuyển điểm đúng một lần mỗi vòng.
  - **Ví dụ:** đồ thị 1 triệu trang, 10 triệu liên kết, khoảng 50 vòng, tức là cỡ $5 \times 10^8$ phép tính. Máy tính thông thường làm được trong vài giây đến vài phút, tùy cách cài đặt.
- **Bộ nhớ:** $O(N + M)$ với cách lưu thưa.
- **Vì sao code dưới đây chỉ dùng được cho đồ thị nhỏ:** nó dùng ma trận **đặc** $N \times N$. Với 1 triệu trang, ma trận có $10^{12}$ ô, cần khoảng 8 TB bộ nhớ, trong khi hầu hết các ô bằng 0. Đồ thị lớn phải dùng ma trận thưa (`scipy.sparse`) hoặc thư viện đồ thị.
- **Số vòng cần thiết** phụ thuộc $d$: $d$ càng gần 1 thì càng cần nhiều vòng (vì sai số chỉ co lại còn $d$ lần mỗi vòng).

## Cài đặt từ đầu

```python
import numpy as np

def pagerank(adj, d=0.85, tol=1e-10, max_iter=200, show=0):
    """adj[i, j] = 1 nếu trang i có liên kết tới trang j. show: in điểm của vài vòng đầu."""
    n = adj.shape[0]
    out = adj.sum(axis=1, keepdims=True)                 # L(i): số liên kết ra của mỗi trang
    # Ma trận chuyển P: hàng i chia đều cho các trang i trỏ tới; trang cụt chia đều cho mọi trang
    P = np.where(out > 0, adj / np.where(out == 0, 1, out), 1.0 / n)
    r = np.full(n, 1.0 / n)                              # bước 1: điểm ban đầu chia đều
    for t in range(1, max_iter + 1):
        r_new = d * (P.T @ r) + (1 - d) / n              # bước 2: P.T @ r = tổng PR(j)/L(j) qua các j trỏ tới i
        if t <= show:
            print("vòng", t, np.round(r_new, 4))
        if np.abs(r_new - r).sum() < tol:                # bước 3: gần như không đổi thì dừng
            return r_new
        r = r_new
    return r

def random_surfer(adj, d=0.85, steps=100_000, seed=0):
    """Mô phỏng người lướt web ngẫu nhiên, trả về tỉ lệ thời gian ở mỗi trang."""
    rng = np.random.default_rng(seed)
    n = adj.shape[0]
    links = [np.flatnonzero(adj[i]) for i in range(n)]  # danh sách liên kết ra của mỗi trang
    visits = np.zeros(n)
    page = 0
    for _ in range(steps):
        if rng.random() < d and len(links[page]) > 0:
            page = rng.choice(links[page])               # 85%: bấm một liên kết bất kỳ
        else:
            page = rng.integers(n)                       # 15% (hoặc trang cụt): nhảy ngẫu nhiên
        visits[page] += 1
    return visits / steps

# 4 trang ở phần "Chạy tay": A->B, A->C, B->C, C->A, D->C
adj = np.array([
    [0, 1, 1, 0],   # A
    [0, 0, 1, 0],   # B
    [1, 0, 0, 0],   # C
    [0, 0, 1, 0],   # D
], dtype=float)

print("PageRank     ", np.round(pagerank(adj, show=2), 4))
print("Mô phỏng     ", np.round(random_surfer(adj), 4))

# Vì sao cần phần nhảy ngẫu nhiên: "bẫy nhện" A->B, B->C, C->C (C chỉ trỏ vào chính nó)
trap = np.array([[0, 1, 0], [0, 0, 1], [0, 0, 1]], dtype=float)
print("Bẫy, d = 1   ", np.round(pagerank(trap, d=1.0), 4))
print("Bẫy, d = 0.85", np.round(pagerank(trap, d=0.85), 4))
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2):

```text
vòng 1 [0.25   0.1438 0.5688 0.0375]
vòng 2 [0.5209 0.1438 0.2978 0.0375]
PageRank      [0.3725 0.1958 0.3941 0.0375]
Mô phỏng      [0.3715 0.1973 0.3938 0.0374]
Bẫy, d = 1    [0. 0. 1.]
Bẫy, d = 0.85 [0.05   0.0925 0.8575]
```

Kết quả cho thấy:

- **Hai dòng đầu** khớp với hai vòng tính tay.
- **PageRank và mô phỏng gần như trùng nhau.** Điểm PageRank đúng là tỉ lệ thời gian người lướt web ngẫu nhiên dừng ở mỗi trang. Mô phỏng chỉ chạy 100.000 bước nên còn lệch ở chữ số thứ ba.
- **Bẫy nhện:** với $d = 1$ (không bao giờ nhảy ngẫu nhiên), người lướt một khi vào C thì kẹt ở đó mãi, nên C hút **toàn bộ** điểm, còn A và B về 0. Với $d = 0{,}85$, người lướt vẫn thoát ra được, nên A và B giữ được chút điểm. Đây là lý do cần phần nhảy ngẫu nhiên.

**So với thư viện:** dựng `nx.DiGraph([(0,1),(0,2),(1,2),(2,0),(3,2)])` rồi gọi `nx.pagerank(G, alpha=0.85)`. Kết quả trùng với hàm tự viết tới 6 chữ số thập phân, kể cả khi biến D thành trang cụt (đã kiểm với NetworkX 3.2.1). Lưu ý NetworkX gọi hệ số $d$ là `alpha`.

## Lỗi hiểu nhầm thường gặp

- **"PageRank = số liên kết trỏ tới."** Sai. Đó là **độ trung tâm bậc vào** (in-degree). PageRank còn tính **ai** trỏ tới và **họ chia phiếu cho bao nhiêu trang**. Trong ví dụ, A chỉ có 1 liên kết tới nhưng đứng thứ hai.
- **"Trang trỏ đi nhiều thì được nhiều điểm."** Sai. Liên kết **ra** không cộng điểm cho chính trang đó; nó chỉ **chia** điểm của trang cho người khác. Trỏ đi càng nhiều thì mỗi phiếu càng nhẹ.
- **"$d$ là xác suất nhảy ngẫu nhiên."** Ngược lại: $d$ là xác suất **đi theo liên kết**; xác suất nhảy ngẫu nhiên là $1 - d$. NetworkX gọi $d$ là `alpha`, dễ gây nhầm.
- **"Kết quả phụ thuộc điểm khởi tạo."** Không. Với $0 < d < 1$, mọi điểm xuất phát đều dẫn tới cùng một kết quả; khởi tạo chỉ ảnh hưởng số vòng cần lặp.
- **Cập nhật tại chỗ trong cùng một vòng.** Nếu tính $PR(A)$ mới rồi dùng ngay giá trị đó để tính $PR(B)$ trong **cùng** vòng, ta đang làm một thuật toán khác. Nó vẫn có thể hội tụ, nhưng các bảng tính tay sẽ không khớp. Mỗi vòng phải dùng **toàn bộ** điểm của vòng trước.

## Biến thể và thuật toán thay thế

- **Personalized PageRank:** khi nhảy ngẫu nhiên, người lướt không nhảy tới trang bất kỳ mà quay về **một nhóm trang ưa thích**. Dùng để gợi ý "trang/người liên quan tới X".
- **HITS** (hubs and authorities): mỗi trang có hai điểm, "trang tốt để tham khảo" (authority) và "trang tổng hợp tốt" (hub), tính lặp qua lại.
- **Độ trung tâm vector riêng** (eigenvector centrality): ý tưởng tương tự nhưng không có phần nhảy ngẫu nhiên, dùng cho đồ thị vô hướng; xem [Độ đo trung tâm](../../phan-tich-mang-xa-hoi/do-do-trung-tam/).
- **Tính trực tiếp bằng đại số tuyến tính:** giải hệ phương trình tuyến tính $(I - dP^{\top})\, r = \frac{1-d}{N}\mathbf{1}$. Chính xác nhưng chỉ khả thi với đồ thị nhỏ.

## Được dùng ở đâu

- **Công cụ tìm kiếm:** xếp hạng trang web (ứng dụng gốc của Google).
- **Phân tích mạng xã hội:** tìm người có ảnh hưởng trên mạng theo dõi (ai được những người có ảnh hưởng theo dõi). Xem [Độ đo trung tâm](../../phan-tich-mang-xa-hoi/do-do-trung-tam/).
- **Mạng trích dẫn khoa học:** bài báo được các bài báo quan trọng trích dẫn thì quan trọng. Hữu ích khi bắt đầu tìm hiểu một lĩnh vực nghiên cứu mới.
- **Tóm tắt văn bản (TextRank):** coi mỗi câu là một đỉnh, nối các câu giống nhau, rồi chọn các câu có PageRank cao làm bản tóm tắt.

## Tóm tắt để nhớ

- PageRank = **tỉ lệ thời gian** một người lướt web ngẫu nhiên dừng ở mỗi trang.
- **85% bấm liên kết, 15% nhảy ngẫu nhiên**: phần nhảy giúp thoát "bẫy" và cho mọi trang chút điểm.
- Mỗi trang **chia đều** điểm của mình cho các trang nó trỏ tới: được trang quan trọng trỏ tới thì quan trọng.
- Tính bằng **lặp**: bắt đầu chia đều, áp công thức nhiều lần cho tới khi ổn định. Kết quả **không phụ thuộc** điểm xuất phát.
- Tổng điểm luôn bằng 1: điểm chỉ **di chuyển**, không sinh ra hay mất đi.

Câu ghi nhớ: *"Quan trọng là được người quan trọng nhắc tới."*

## Câu hỏi tự kiểm tra

1. **Tính tay:** đồ thị 3 trang: A → B, A → C, B → C, C → A, với $d = 0{,}85$. Bắt đầu từ điểm đều $\frac{1}{3}$, tính điểm sau **một** vòng lặp.
2. **Vì sao:** trong ví dụ 4 trang, A chỉ có một liên kết tới nhưng đứng thứ hai, cao hơn hẳn B. Giải thích bằng lời.
3. **Vì sao:** nếu đặt $d = 1$ thì chuyện gì xảy ra với trang D (không ai trỏ tới)? Với "bẫy nhện"?
4. **Vận dụng:** một trang web muốn tăng PageRank bằng cách tự tạo 1000 trang rác cùng trỏ vào nó. Cách này có tác dụng không? Vì sao phần "nhảy ngẫu nhiên" lại hạn chế được nó phần nào?
5. **Vận dụng:** bạn có đồ thị trích dẫn của 50 bài báo trong lĩnh vực mình đang nghiên cứu. Bạn dùng PageRank để làm gì, và mũi tên nên vẽ theo chiều nào?

<details>
<summary>Đáp án</summary>

1. $N = 3$, nên "điểm an ủi" là $\frac{0{,}15}{3} = 0{,}05$. A trỏ tới 2 trang ($L(A) = 2$); B và C mỗi trang trỏ tới 1 trang.
   - $PR(A) = 0{,}05 + 0{,}85 \times \frac{1/3}{1} \approx 0{,}3333$ (chỉ C trỏ tới A).
   - $PR(B) = 0{,}05 + 0{,}85 \times \frac{1/3}{2} \approx 0{,}1917$ (chỉ A trỏ tới B, và A chia đôi).
   - $PR(C) = 0{,}05 + 0{,}85 \times \left(\frac{1/3}{2} + \frac{1/3}{1}\right) = 0{,}05 + 0{,}425 = 0{,}475$.

   Tổng bằng 1. Lặp tiếp tới khi hội tụ được khoảng (0,388; 0,215; 0,397) (đã kiểm bằng code).
2. Trang trỏ tới A là C, trang có điểm cao nhất, và C chỉ có một liên kết ra nên dồn **toàn bộ** phiếu cho A. Còn B chỉ được A trỏ tới, mà A lại chia đôi phiếu cho B và C. Một phiếu nặng từ trang quan trọng có giá trị hơn nửa phiếu từ trang khác.
3. Với $d = 1$, "điểm an ủi" bằng 0. D không ai trỏ tới nên có điểm **0**. Với bẫy nhện (C chỉ trỏ vào chính nó), người lướt vào C rồi kẹt mãi, nên C hút **toàn bộ** điểm (kết quả code: A = 0, B = 0, C = 1). Đây là hai lý do cần $d < 1$.
4. Có tác dụng phần nào nhưng hạn chế. Mỗi trang rác **không ai trỏ tới**, nên nó chỉ có "điểm an ủi" rất nhỏ $\frac{1-d}{N}$, và chỉ chuyển được $d$ lần số đó sang trang đích. Với $N$ là cả tỉ trang, phần này cực nhỏ. Muốn tăng nhiều thì cần được **những trang có điểm cao thật** trỏ tới, điều khó làm giả hơn. Trên thực tế, các công cụ tìm kiếm còn có thêm biện pháp riêng để phát hiện mạng trang rác.
5. Dùng PageRank để tìm **các bài báo nền tảng**, nên đọc trước. Mũi tên vẽ từ bài **trích dẫn** tới bài **được trích dẫn**, tức "A trích dẫn B" thành A → B, giống "trang A liên kết tới trang B". Như vậy, bài được nhiều bài quan trọng trích dẫn sẽ có điểm cao.

</details>

## Nguồn

- Page, L., Brin, S., Motwani, R., Winograd, T. *The PageRank Citation Ranking: Bringing Order to the Web.* Stanford InfoLab technical report, 1999.
- Brin, S., Page, L. (1998). *The anatomy of a large-scale hypertextual web search engine.* WWW7.

## Cần kiểm tra lại

- Ước lượng "vài giây đến vài phút" cho đồ thị 1 triệu trang là ước lượng thô, chưa đo.
- Mệnh đề "khoảng cách giữa hai lần chạy co lại nhiều nhất $d$ lần mỗi vòng" đúng khi đo bằng tổng chênh lệch tuyệt đối (chuẩn $L_1$) và trang cụt được xử lý như trên. Trong bài chỉ giải thích bằng lời, chưa chứng minh.
- Câu 4 nói về cách các công cụ tìm kiếm chống trang rác chỉ ở mức chung; tài liệu không nêu chi tiết.
