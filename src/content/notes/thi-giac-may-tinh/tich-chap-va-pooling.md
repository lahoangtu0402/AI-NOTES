---
title: Tích chập và pooling
summary: "Hai phép toán nền tảng của mạng nơ-ron tích chập (CNN): cách một bộ lọc trượt trên ảnh và cách thu nhỏ bản đồ đặc trưng."
course: thi-giac-may-tinh
type: lecture
tags: [cnn, convolution, computer-vision]
level: beginner
status: draft
source: _sources/thi-giac-may-tinh/lectures/tuan03-cnn.pdf
sourceTitle: Slide tuần 3, mạng nơ-ron tích chập (ví dụ minh họa)
prerequisites: [nen-tang/vector-va-ma-tran]
related: [thi-giac-may-tinh/resnet]
order: 10
---

## Mục tiêu

Sau bài này bạn có thể: tính tay đầu ra của một lớp tích chập, tính kích thước đầu ra khi biết padding và stride, và giải thích pooling dùng để làm gì.

## Trực giác

Một ảnh xám là ma trận các số. Một **bộ lọc** (kernel) là ma trận nhỏ, ví dụ $3 \times 3$. Ta đặt bộ lọc lên một vùng nhỏ của ảnh, nhân từng ô tương ứng rồi cộng lại thành **một số**. Trượt bộ lọc qua toàn bộ ảnh ta được một ảnh mới gọi là **bản đồ đặc trưng** (feature map).

Mỗi bộ lọc chuyên "bắt" một kiểu mẫu: cạnh dọc, cạnh ngang, góc... Điểm hay của CNN là các giá trị trong bộ lọc **không do con người đặt** mà được học từ dữ liệu.

## Công thức

Với ảnh đầu vào $x$ và bộ lọc $k$ kích thước $K \times K$, đầu ra tại vị trí $(i, j)$ là:

$$
y_{i,j} = \sum_{u=0}^{K-1} \sum_{v=0}^{K-1} x_{i+u,\; j+v} \cdot k_{u,v}
$$

Lưu ý: các thư viện học sâu gọi phép này là "tích chập" nhưng thực chất là **tương quan chéo** (cross-correlation), vì không lật bộ lọc. Khi bộ lọc được học thì việc lật hay không không ảnh hưởng khả năng biểu diễn.

### Kích thước đầu ra

Với ảnh vuông cạnh $W$, bộ lọc cạnh $K$, padding $P$ và bước nhảy (stride) $S$:

$$
W_{\text{out}} = \left\lfloor \frac{W - K + 2P}{S} \right\rfloor + 1
$$

Ví dụ: ảnh $32 \times 32$, bộ lọc $5 \times 5$, $S = 1$:

- $P = 0$ cho đầu ra $28 \times 28$.
- $P = 2$ cho đầu ra $32 \times 32$ (giữ nguyên kích thước, thường gọi là padding "same").

### Số tham số của một lớp

Lớp nhận $C_{\text{in}}$ kênh, tạo $C_{\text{out}}$ kênh, bộ lọc $K \times K$ có:

$$
(K \cdot K \cdot C_{\text{in}} + 1) \cdot C_{\text{out}} \text{ tham số}
$$

Số $+1$ là hệ số bias. Với ảnh RGB ($C_{\text{in}} = 3$), $K = 3$ và 16 bộ lọc: $(3 \cdot 3 \cdot 3 + 1) \cdot 16 = 448$ tham số. Con số này **không phụ thuộc kích thước ảnh**, đó là lý do CNN gọn hơn mạng kết nối đầy đủ.

## Pooling

Pooling thu nhỏ bản đồ đặc trưng bằng cách gom mỗi vùng nhỏ thành một số.

- **Max pooling**: lấy giá trị lớn nhất trong vùng. Với cửa sổ $2 \times 2$, stride 2, kích thước giảm một nửa theo mỗi chiều.
- **Average pooling**: lấy trung bình.

Lợi ích: giảm khối lượng tính toán, và làm kết quả ít nhạy với việc vật thể dịch chuyển vài điểm ảnh. Pooling **không có tham số học được**.

## Code tối giản

```python
import numpy as np

def conv2d(x, k, stride=1, pad=0):
    """x: (H, W), k: (kh, kw). Trả về bản đồ đặc trưng."""
    if pad:
        x = np.pad(x, pad)
    kh, kw = k.shape
    H, W = x.shape
    out_h = (H - kh) // stride + 1
    out_w = (W - kw) // stride + 1
    out = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            patch = x[i * stride:i * stride + kh, j * stride:j * stride + kw]
            out[i, j] = np.sum(patch * k)
    return out

def max_pool(x, size=2, stride=2):
    H, W = x.shape
    out_h = (H - size) // stride + 1
    out_w = (W - size) // stride + 1
    out = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            out[i, j] = x[i * stride:i * stride + size, j * stride:j * stride + size].max()
    return out

# Ảnh 6x6: nửa trái tối (0), nửa phải sáng (1)
img = np.zeros((6, 6))
img[:, 3:] = 1.0

# Bộ lọc Sobel phát hiện cạnh dọc
sobel_x = np.array([[-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]], dtype=float)

fm = conv2d(img, sobel_x)
print(fm)
```

Kết quả là ma trận $4 \times 4$ có hai cột giữa bằng 4 và hai cột ngoài bằng 0: bộ lọc "sáng lên" đúng ở nơi có cạnh dọc.

## Lỗi thường gặp

- Nhầm thứ tự kích thước: ảnh trong PyTorch có dạng `(batch, kênh, cao, rộng)`, còn nhiều thư viện khác dùng `(batch, cao, rộng, kênh)`.
- Quên padding nên ảnh bị co lại sau mỗi lớp, mạng sâu sẽ hết kích thước.
- Cho rằng pooling "học" được gì. Nó chỉ là phép tổng hợp cố định.

## Bài tập

1. Ảnh $64 \times 64$, bộ lọc $3 \times 3$, $S = 2$, $P = 1$. Đầu ra có kích thước bao nhiêu?
2. Một lớp nhận 16 kênh, tạo 32 kênh, bộ lọc $3 \times 3$. Có bao nhiêu tham số?
3. Sửa hàm `conv2d` để nhận đầu vào nhiều kênh `(H, W, C)`.

<details>
<summary>Gợi ý đáp án bài 1 và 2</summary>

1. $\lfloor (64 - 3 + 2) / 2 \rfloor + 1 = 32$, nên đầu ra là $32 \times 32$.
2. $(3 \cdot 3 \cdot 16 + 1) \cdot 32 = 4640$ tham số.

</details>

## Tài liệu tham khảo

- Slide bài giảng môn Thị giác máy tính (tài liệu gốc, không công khai).
- Goodfellow, Bengio, Courville. *Deep Learning*, chương 9 (Convolutional Networks).
