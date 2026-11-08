---
title: Độ đo trung tâm
summary: 'Ba cách đo "ai quan trọng" trong một mạng: độ trung tâm bậc, độ gần và độ trung gian, thử trên mạng câu lạc bộ karate của Zachary.'
course: phan-tich-mang-xa-hoi
type: lecture
tags: [graph, centrality, networkx]
level: beginner
status: draft
source: _sources/phan-tich-mang-xa-hoi/lectures/tuan02-do-do-trung-tam.pdf
sourceTitle: Slide tuần 2, độ đo trung tâm (ví dụ minh họa)
prerequisites: []
related: [thuat-toan/pagerank]
order: 10
---

## Mục tiêu

Hiểu ba độ đo trung tâm cơ bản, biết mỗi độ đo trả lời câu hỏi nào, và tính được chúng bằng NetworkX.

## Trực giác

"Quan trọng" có nhiều nghĩa. Trong một nhóm bạn:

- Người **quen nhiều người nhất** là quan trọng theo nghĩa số kết nối.
- Người **gần mọi người nhất** truyền tin đến cả nhóm nhanh nhất.
- Người **đứng giữa** các nhóm nhỏ, nếu họ biến mất thì nhóm bị tách ra.

Ba ý trên tương ứng ba độ đo. Không có độ đo "đúng": chọn độ đo theo câu hỏi bạn muốn trả lời.

## Công thức

Xét đồ thị vô hướng, liên thông, có $n$ đỉnh.

**Độ trung tâm bậc** (degree centrality), tỉ lệ đỉnh khác mà $v$ nối trực tiếp tới:

$$
C_D(v) = \frac{\deg(v)}{n-1}
$$

**Độ trung tâm gần** (closeness centrality), nghịch đảo của khoảng cách trung bình tới mọi đỉnh khác, với $d(v,u)$ là độ dài đường đi ngắn nhất:

$$
C_C(v) = \frac{n-1}{\sum_{u \neq v} d(v,u)}
$$

**Độ trung tâm trung gian** (betweenness centrality), mức độ $v$ nằm trên đường đi ngắn nhất giữa các cặp đỉnh khác, với $\sigma_{st}$ là số đường đi ngắn nhất từ $s$ đến $t$ và $\sigma_{st}(v)$ là số đường trong đó đi qua $v$:

$$
C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}
$$

(NetworkX chuẩn hóa giá trị này để nằm trong khoảng từ 0 đến 1.)

## Code

```python
import networkx as nx

G = nx.karate_club_graph()   # 34 đỉnh, 78 cạnh
print(G.number_of_nodes(), G.number_of_edges())

measures = {
    "degree": nx.degree_centrality(G),
    "closeness": nx.closeness_centrality(G),
    "betweenness": nx.betweenness_centrality(G),
}

for name, values in measures.items():
    top3 = sorted(values.items(), key=lambda kv: -kv[1])[:3]
    print(name, [(node, round(v, 3)) for node, v in top3])
```

Khi chạy với NetworkX 3.7, ba đỉnh đứng đầu của từng độ đo là:

| Độ đo | Hạng 1 | Hạng 2 | Hạng 3 |
| --- | --- | --- | --- |
| Bậc | đỉnh 33 (0,515) | đỉnh 0 (0,485) | đỉnh 32 (0,364) |
| Gần | đỉnh 0 (0,569) | đỉnh 2 (0,559) | đỉnh 33 (0,550) |
| Trung gian | đỉnh 0 (0,438) | đỉnh 33 (0,304) | đỉnh 32 (0,145) |

Hai đỉnh 0 và 33 là hai người đứng đầu hai phe sau này tách nhóm trong câu lạc bộ, nên chúng đứng đầu hầu hết các bảng. Điểm thú vị: theo độ trung gian, đỉnh 0 vượt xa đỉnh 33.

## Lỗi thường gặp

- Dùng độ gần trên đồ thị **không liên thông**: khoảng cách vô hạn làm công thức vô nghĩa. Hãy tính trên từng thành phần liên thông.
- Đọc giá trị tuyệt đối thay vì thứ hạng. Giữa hai mạng khác kích thước, so sánh thứ hạng tin cậy hơn.
- Dùng độ đo bậc cho đồ thị có hướng mà không phân biệt bậc vào và bậc ra.

## Bài tập

1. Tính tay ba độ đo cho đồ thị hình sao có 5 đỉnh (một đỉnh giữa, bốn đỉnh lá). Đỉnh nào lớn nhất ở mỗi độ đo?
2. Tìm một mạng nhỏ mà đỉnh có độ trung gian cao nhưng bậc thấp.
3. Đọc bài [PageRank](../../thuat-toan/pagerank/) và so sánh với độ đo bậc: khác nhau ở đâu?

## Tài liệu tham khảo

- Newman, M. *Networks*, chương về các độ đo trung tâm.
- Zachary, W. W. (1977). *An information flow model for conflict and fission in small groups.* Journal of Anthropological Research.
