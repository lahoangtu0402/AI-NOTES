---
title: "Tìm kiếm theo chiều rộng (BFS)"
summary: "Duyệt đồ thị theo từng lớp, từ gần ra xa, bằng một hàng đợi. Nhờ vậy BFS tìm được đường đi ít bước nhất trên đồ thị không trọng số: lưới điểm ảnh, mê cung, mạng quen biết."
course: thuat-toan
type: algorithm
tags: [graph, search, shortest-path, connectivity]
level: beginner
status: reviewed
prerequisites: []
usedIn: [thi-giac-may-tinh/quan-he-giua-cac-diem-anh, thuat-toan/gan-nhan-thanh-phan-lien-thong]
related: [phan-tich-mang-xa-hoi/do-do-trung-tam]
order: 30
---

## Bài toán

- **Đầu vào:** một đồ thị và một đỉnh xuất phát $s$.
- **Đầu ra:**
  - Danh sách mọi đỉnh **đi tới được** từ $s$.
  - Với mỗi đỉnh đó, **số bước ít nhất** để đi từ $s$ tới.
  - Một cách lần ngược để dựng lại đường đi ngắn nhất.

### Các thuật ngữ cần biết trước

- **Đồ thị** (graph): một tập các "điểm" gọi là **đỉnh** (vertex, node), và các "dây nối" giữa từng cặp đỉnh gọi là **cạnh** (edge). Đồ thị không phải biểu đồ cột hay đường; nó chỉ là "ai nối với ai".
- **Đỉnh kề** (neighbor): hai đỉnh có một cạnh nối trực tiếp với nhau.
- **Đồ thị không trọng số** (unweighted graph): mọi cạnh được coi là dài như nhau, đi qua một cạnh tính là **1 bước**.
- **Hàng đợi** (queue): một danh sách mà phần tử nào **vào trước thì ra trước**, giống hàng người xếp mua vé. Chỉ có hai thao tác: thêm vào **cuối** hàng, và lấy ra ở **đầu** hàng.

Nhiều thứ quen thuộc có thể xem là đồ thị:

| Ví dụ | Đỉnh là | Cạnh là |
| --- | --- | --- |
| Mạng xã hội | Một người | Hai người là bạn bè |
| Ảnh số | Một điểm ảnh | Hai điểm ảnh liền kề (4, 8 hoặc m-liền kề) |
| Mê cung | Một ô trống | Hai ô trống sát nhau |

## Trực giác

**Hòn đá ném xuống mặt hồ.** Sóng lan ra thành từng vòng tròn. Vòng thứ nhất chạm những chỗ cách 1 bước, vòng thứ hai chạm những chỗ cách 2 bước, và cứ thế. Sóng không bao giờ "nhảy cóc" tới vòng 3 khi vòng 2 chưa xong.

BFS (Breadth-First Search, tìm kiếm theo chiều rộng) làm đúng như vậy. Nó thăm **hết** các đỉnh cách 1 bước, rồi mới tới các đỉnh cách 2 bước, rồi 3 bước...

Hệ quả quan trọng: **lần đầu tiên** sóng chạm tới một đỉnh cũng chính là lúc nó đi bằng **đường ngắn nhất**. Đó là lý do BFS tìm được đường ít bước nhất.

Để giữ đúng thứ tự "gần trước, xa sau", BFS dùng một **hàng đợi**. Ai được phát hiện trước thì được xử lý trước, giống như xếp hàng.

## Thuật toán

1. **Khởi đầu:** ghi khoảng cách của $s$ là 0, đánh dấu $s$ là "đã thấy", và đưa $s$ vào hàng đợi.
2. **Lặp lại khi hàng đợi chưa rỗng:**
   1. Lấy ra đỉnh $u$ ở **đầu** hàng đợi.
   2. Xét lần lượt từng đỉnh kề $v$ của $u$. Nếu $v$ **chưa được thấy**:
      - ghi khoảng cách của $v$ bằng khoảng cách của $u$ cộng 1;
      - ghi "cha của $v$ là $u$", tức là "tôi tới $v$ từ $u$";
      - đánh dấu $v$ là "đã thấy" và đưa $v$ vào **cuối** hàng đợi.
3. **Dựng đường đi** tới một đỉnh $t$: bắt đầu từ $t$, đi ngược theo "cha" cho tới khi gặp $s$, rồi đảo ngược danh sách vừa thu được.

**Vì sao cần từng bước:**

- **Kiểm tra "chưa được thấy".** Nếu bỏ, các đỉnh sẽ được thêm vào hàng đợi nhiều lần. Trên đồ thị có vòng, thuật toán thậm chí **chạy mãi không dừng**, vì cứ đi vòng tròn.
- **Đánh dấu ngay khi đưa vào hàng đợi** (chứ không đợi tới lúc lấy ra). Nếu đợi, cùng một đỉnh có thể bị nhiều đỉnh khác đưa vào hàng đợi trước khi kịp được đánh dấu, gây lãng phí.
- **Ghi "cha".** Nếu bỏ, ta vẫn biết khoảng cách nhưng không biết **đường đi cụ thể**.
- **Dùng hàng đợi** (vào trước ra trước). Nếu thay bằng "vào sau ra trước" (ngăn xếp), thuật toán đi sâu theo một nhánh trước. Kết quả là DFS, và không còn đảm bảo đường ngắn nhất.

## Chạy tay từng bước

Mạng quen biết gồm 7 người. Hà không quen ai.

```text
An ───── Bình
│          │
Chi ──── Dũng ──── Giang
│
Em                         Hà
```

Chạy BFS từ **An**. Khi xét các đỉnh kề, ta theo đúng thứ tự trong danh sách bạn bè ở phần code bên dưới.

| Bước | Lấy ra khỏi hàng đợi | Phát hiện mới (khoảng cách) | Bỏ qua vì đã thấy | Hàng đợi sau bước |
| --- | --- | --- | --- | --- |
| 0 | (khởi đầu) | An = 0 | | [An] |
| 1 | An | Bình = 1, Chi = 1 | | [Bình, Chi] |
| 2 | Bình | Dũng = 2 | An | [Chi, Dũng] |
| 3 | Chi | Em = 2 | An, Dũng | [Dũng, Em] |
| 4 | Dũng | Giang = 3 | Bình, Chi | [Em, Giang] |
| 5 | Em | | Chi | [Giang] |
| 6 | Giang | | Dũng | [] |

Hàng đợi rỗng, thuật toán dừng. Một số điều đọc được từ bảng:

- **Lớp 1** (Bình, Chi) được xử lý hết trước **lớp 2** (Dũng, Em), rồi mới tới **lớp 3** (Giang). Đúng như sóng lan.
- Ở bước 3, Chi cũng nối tới Dũng, nhưng Dũng **đã được thấy** từ bước 2 với khoảng cách 2. Ta bỏ qua, vì đi qua Chi cũng không ngắn hơn.
- **Đường từ An tới Giang:** cha của Giang là Dũng, cha của Dũng là Bình, cha của Bình là An. Đảo ngược ta được An → Bình → Dũng → Giang, gồm 3 bước.
- **Hà không bao giờ xuất hiện**, nghĩa là Hà **không liên thông** với An: không có đường quen biết nào nối hai người.

Bảng này đã được kiểm lại bằng chính đoạn code bên dưới.

## Vì sao thuật toán cho kết quả đúng

Ý chính nằm ở **thứ tự trong hàng đợi**:

1. Ban đầu hàng đợi chỉ có $s$ (lớp 0).
2. Khi xử lý các đỉnh lớp $k$, ta chỉ thêm vào **cuối** hàng các đỉnh lớp $k + 1$.
3. Vì vậy hàng đợi luôn có dạng: vài đỉnh lớp $k$ ở đầu, theo sau là vài đỉnh lớp $k + 1$. Không bao giờ có chuyện một đỉnh lớp $k + 2$ chen lên trước đỉnh lớp $k$.

Giả sử một đỉnh $v$ có đường ngắn nhất dài 3 bước. Mọi đỉnh cách $s$ 2 bước đều được xử lý **trước** mọi đỉnh cách 3 bước. Một trong các đỉnh cách 2 bước đó nối với $v$, nên $v$ được phát hiện với khoảng cách $2 + 1 = 3$. Nó không thể bị phát hiện sớm hơn bằng một đường dài hơn, vì các đỉnh xa hơn chưa tới lượt xử lý. Và vì có đánh dấu "đã thấy", khoảng cách đúng này không bao giờ bị ghi đè.

## Độ phức tạp và giả định

**Ký hiệu $O(\cdot)$** (đọc là "O lớn") cho biết thời gian chạy **tăng theo kích thước đầu vào như thế nào**, bỏ qua các hằng số. Ví dụ, "$O(n)$" nghĩa là đầu vào gấp đôi thì thời gian cũng khoảng gấp đôi.

- **Thời gian: $O(V + E)$**, với $V$ là số đỉnh và $E$ là số cạnh. Lý do: mỗi đỉnh vào hàng đợi đúng một lần, và mỗi cạnh được nhìn tới tối đa hai lần (một lần từ mỗi đầu). Nói cách khác, BFS chỉ "đi qua" đồ thị một lượt.
  - **Ví dụ cụ thể:** ảnh $1000 \times 1000$ có $10^6$ điểm ảnh (đỉnh). Với 8-liền kề, mỗi điểm có tối đa 8 cạnh, nên tổng cộng khoảng $8 \times 10^6$ lần kiểm tra. Khi mình chạy thử bằng Python thuần, loang hết ảnh toàn số 1 như vậy mất khoảng 2,4 giây (một lần đo trên máy Mac).
- **Bộ nhớ: $O(V)$**, để lưu khoảng cách, cha và hàng đợi.
- **Giả định:** mọi cạnh **dài như nhau**. Nếu cạnh có độ dài khác nhau (ví dụ đường đi tính bằng km), BFS **không** còn cho đường ngắn nhất, vì đường ít cạnh chưa chắc ngắn nhất. Khi đó dùng thuật toán Dijkstra.

## Cài đặt từ đầu

```python
from collections import deque

def bfs(neighbors, start):
    """neighbors(u) trả về các đỉnh kề với u. Trả về khoảng cách (số bước) và đỉnh cha."""
    dist, parent = {start: 0}, {start: None}   # bước 1: khởi đầu
    queue = deque([start])
    while queue:                                # bước 2: lặp khi hàng đợi chưa rỗng
        u = queue.popleft()                     # 2.1: lấy đỉnh ở đầu hàng
        for v in neighbors(u):                  # 2.2: xét từng đỉnh kề
            if v not in dist:                   #      chưa được thấy?
                dist[v] = dist[u] + 1           #      khoảng cách = của u + 1
                parent[v] = u                   #      tôi tới v từ u
                queue.append(v)                 #      xếp v vào cuối hàng
    return dist, parent

def path_to(parent, goal):
    """Bước 3: lần ngược theo 'cha' rồi đảo ngược."""
    if goal not in parent:
        return None                             # không đi tới được
    path = []
    while goal is not None:
        path.append(goal)
        goal = parent[goal]
    return path[::-1]

# Ví dụ 1: mạng quen biết (đồ thị vô hướng)
friends = {
    "An": ["Bình", "Chi"], "Bình": ["An", "Dũng"], "Chi": ["An", "Dũng", "Em"],
    "Dũng": ["Bình", "Chi", "Giang"], "Em": ["Chi"], "Giang": ["Dũng"], "Hà": [],
}
dist, parent = bfs(lambda u: friends[u], "An")
print(dist)
print(path_to(parent, "Giang"), path_to(parent, "Hà"))

# Ví dụ 2: mê cung trên lưới, 0 = đi được, 1 = tường; đi 4 hướng
maze = ["0010",
        "0110",
        "0000",
        "1100"]
H, W = len(maze), len(maze[0])
def grid_neighbors(p):
    y, x = p
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and maze[ny][nx] == "0":
            yield (ny, nx)
dist, parent = bfs(grid_neighbors, (0, 0))
print(dist[(0, 3)], path_to(parent, (0, 3)))
```

Kết quả (đã chạy thử với Python 3.9.6):

```text
{'An': 0, 'Bình': 1, 'Chi': 1, 'Dũng': 2, 'Em': 2, 'Giang': 3}
['An', 'Bình', 'Dũng', 'Giang'] None
7 [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (2, 3), (1, 3), (0, 3)]
```

Kết quả cho thấy:

- Dòng 1 khớp với cột "khoảng cách" trong bảng chạy tay. Hà không có trong `dist`, đúng là không đi tới được.
- Dòng 2: đường tới Giang đúng như ta lần ngược bằng tay; đường tới Hà là `None`.
- Dòng 3: hàm `bfs` **không thay đổi gì** mà vẫn giải được mê cung. Chỉ cần đổi hàm `neighbors`. Ô $(0, 3)$ chỉ cách điểm xuất phát 3 cột, nhưng bị tường chắn nên phải đi vòng qua hàng 2, mất 7 bước.

```text
Mê cung                  Khoảng cách BFS tới từng ô
(S = xuất phát,          (# = tường)
 G = đích, # = tường)
S . # G                  0 1 # 7
. # # .                  1 # # 6
. . . .                  2 3 4 5
# # . .                  # # 5 6
```

Các ô có cùng con số tạo thành một "vòng sóng". Đường ngắn nhất tới G đi qua các ô 0, 1, 2, 3, 4, 5, 6, 7 dọc theo cột trái, hàng 2 rồi cột phải. Hình này đã được kiểm lại bằng code.

**So với thư viện:** trên cùng mạng quen biết, `networkx.single_source_shortest_path_length(G, "An")` cho đúng từ điển khoảng cách như trên (đã kiểm với NetworkX 3.2.1).

## Lỗi hiểu nhầm thường gặp

- **"BFS tìm đường ngắn nhất trên mọi bản đồ."** Sai. BFS chỉ tối thiểu **số cạnh**. Nếu các cạnh dài khác nhau thì phải dùng Dijkstra. Cách nhận ra: đề bài có "khoảng cách", "chi phí", "thời gian" khác nhau trên từng cạnh.
- **"Đánh dấu đã thăm khi lấy ra cũng được."** Kết quả khoảng cách vẫn đúng, nhưng một đỉnh có thể vào hàng đợi nhiều lần, tốn bộ nhớ và thời gian. Đánh dấu ngay khi **đưa vào** là cách chuẩn.
- **Dùng `list.pop(0)` thay cho `deque.popleft()`.** Kết quả đúng, nhưng `pop(0)` trên list phải dịch chuyển mọi phần tử còn lại, nên rất chậm khi hàng đợi dài. `deque` lấy ra ở đầu ngay lập tức.
- **"BFS và DFS chỉ khác nhau về tốc độ."** Không. Cả hai đều thăm hết các đỉnh đi tới được, nhưng chỉ BFS đảm bảo **đường ngắn nhất**. DFS hợp với việc khác, ví dụ kiểm tra có đường hay không, hoặc tìm chu trình.
- **Quên đồ thị có thể không liên thông.** Sau khi chạy BFS, các đỉnh không có trong `dist` là các đỉnh **không đi tới được**. Đó không phải lỗi; đó là một kết quả có ý nghĩa.

## Biến thể và thuật toán thay thế

- **DFS** (Depth-First Search, tìm kiếm theo chiều sâu): dùng ngăn xếp thay cho hàng đợi, đi sâu hết một nhánh rồi mới quay lui. Vẫn tìm được mọi đỉnh liên thông, nhưng **không** đảm bảo đường ngắn nhất.
- **Dijkstra:** mở rộng BFS cho đồ thị có độ dài cạnh khác nhau (không âm). Thay hàng đợi thường bằng **hàng đợi ưu tiên**: luôn lấy ra đỉnh có khoảng cách tạm thời nhỏ nhất.
- **BFS hai phía** (bidirectional BFS): loang đồng thời từ điểm đầu và điểm cuối, gặp nhau ở giữa. Nhanh hơn nhiều trên đồ thị lớn.
- **Loang** (flood fill): BFS hoặc DFS trên lưới điểm ảnh để tô một vùng liền nhau, như công cụ "thùng sơn" trong phần mềm vẽ.

## Được dùng ở đâu

- **Thị giác máy tính:**
  - Tìm đường đi và kiểm tra liên thông giữa hai điểm ảnh ([Quan hệ giữa các điểm ảnh](../../thi-giac-may-tinh/quan-he-giua-cac-diem-anh/)).
  - Gán nhãn từng vùng bằng cách loang ([Gán nhãn thành phần liên thông](../../thuat-toan/gan-nhan-thanh-phan-lien-thong/)).
- **Phân tích mạng xã hội:**
  - Khoảng cách giữa hai người tính bằng số bước quen biết.
  - Độ đo **trung tâm gần** (closeness centrality) cần khoảng cách ngắn nhất từ một người tới mọi người khác. Trên mạng không trọng số, khoảng cách đó tính bằng BFS ([Độ đo trung tâm](../../phan-tich-mang-xa-hoi/do-do-trung-tam/)).
- **Trò chơi và robot:** tìm đường trên bản đồ dạng ô.

## Tóm tắt để nhớ

- BFS = **sóng lan trên mặt hồ**: thăm hết lớp gần rồi mới tới lớp xa.
- Công cụ duy nhất là một **hàng đợi**: vào trước, ra trước.
- **Lần đầu chạm tới** một đỉnh = đã đi bằng **đường ít bước nhất**.
- Ghi "cha" để **lần ngược** ra đường đi; đỉnh không bao giờ được chạm tới = **không liên thông**.
- Chỉ đúng khi mọi cạnh **dài như nhau**; cạnh dài khác nhau thì dùng Dijkstra.

Câu ghi nhớ: *"Hàng đợi giữ thứ tự, sóng lan giữ khoảng cách."*

## Câu hỏi tự kiểm tra

1. **Tính tay:** chạy BFS trên mạng quen biết ở trên, nhưng bắt đầu từ **Em**. Ghi khoảng cách tới từng người và đường đi từ Em tới Giang.
2. **Vì sao:** nếu thay hàng đợi bằng ngăn xếp, thuật toán còn tìm được đường ngắn nhất không? Vì sao?
3. **Vì sao:** vì sao phải đánh dấu "đã thấy" ngay khi đưa đỉnh **vào** hàng đợi, thay vì khi lấy **ra**?
4. **Vận dụng:** trên bản đồ có các con đường dài 1 km, 5 km và 10 km, bạn dùng BFS để tìm đường ngắn nhất (theo km) có được không?
5. **Vận dụng:** trên ảnh $1000 \times 1000$ điểm, BFS theo 8-liền kề xét tối đa khoảng bao nhiêu cạnh? Có nhanh không?

<details>
<summary>Đáp án</summary>

1. Thứ tự lấy ra: Em, Chi, An, Dũng, Bình, Giang. Khoảng cách: Em = 0, Chi = 1, An = 2, Dũng = 2, Bình = 3, Giang = 3. Hà vẫn không đi tới được. Vì danh sách bạn của Chi là (An, Dũng, Em), An vào hàng đợi trước Dũng; khi xử lý An thì Bình được phát hiện với khoảng cách 3. Đường từ Em tới Giang: Em → Chi → Dũng → Giang, gồm 3 bước.
2. Không. Thay bằng ngăn xếp thì thành DFS: đỉnh vào sau được xử lý trước, nên thuật toán lao sâu theo một nhánh. Nó có thể chạm tới một đỉnh lần đầu bằng một đường vòng dài, và vì đã đánh dấu "đã thấy" nên không sửa lại được. Khi đó `dist` không còn là số bước ít nhất.
3. Nếu đánh dấu khi lấy ra, trong lúc một đỉnh còn nằm chờ trong hàng đợi, các đỉnh khác vẫn coi nó là "chưa thấy" và thêm nó vào hàng lần nữa. Khoảng cách cuối cùng vẫn đúng, nhưng tốn thời gian và bộ nhớ, và `parent` có thể bị ghi đè. Đánh dấu ngay khi đưa vào đảm bảo mỗi đỉnh vào hàng đợi đúng một lần.
4. Không. BFS chỉ đếm **số cạnh**. Một đường qua 2 đoạn 10 km (2 cạnh, 20 km) sẽ được BFS coi là ngắn hơn đường qua 3 đoạn 1 km (3 cạnh, 3 km). Phải dùng Dijkstra.
5. Có $10^6$ đỉnh, mỗi đỉnh xét tối đa 8 lân cận, tức khoảng $8 \times 10^6$ lần kiểm tra. Độ phức tạp tuyến tính nên về lý thuyết là nhanh. Nhưng vòng lặp Python thuần vẫn chậm: khi mình chạy thử loang 8-liền kề trên ảnh $1000 \times 1000$ toàn số 1 (hàm `label_bfs` ở trang [Gán nhãn thành phần liên thông](../../thuat-toan/gan-nhan-thanh-phan-lien-thong/)), mất khoảng 2,4 giây. Thư viện viết bằng C nhanh hơn khoảng 70 đến 100 lần (xem phép đo ở trang đó).

</details>

## Nguồn

- Moore, E. F. (1959). *The shortest path through a maze.* Proceedings of the International Symposium on the Theory of Switching.
- Lee, C. Y. (1961). *An algorithm for path connections and its applications.* IRE Transactions on Electronic Computers.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*, chương về các thuật toán cơ bản trên đồ thị.

## Cần kiểm tra lại

- Thông tin xuất bản của hai bài báo gốc (Moore 1959, Lee 1961) viết theo trí nhớ của mình, chưa đối chiếu với bản gốc.
- Thời gian 2,4 giây là một lần đo trên một máy Mac, chỉ để tham khảo độ lớn. Con số sẽ khác trên máy khác.
