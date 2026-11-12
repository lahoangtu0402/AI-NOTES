---
title: "Không gian màu"
summary: "Cách mô tả một màu bằng vài con số. RGB hợp với màn hình, CMYK với máy in, HSV với cách con người gọi tên màu; chuyển đổi qua lại bằng công thức xác định."
course: khai-niem
type: concept
tags: [color-space, image-processing, computer-vision, opencv]
level: beginner
status: reviewed
prerequisites: [thi-giac-may-tinh/tong-quan-thi-giac-may-tinh-va-anh-so]
usedIn: [thi-giac-may-tinh/tong-quan-thi-giac-may-tinh-va-anh-so]
related: [thuat-toan/k-means]
order: 30
---

## Định nghĩa một câu

**Không gian màu** (color space) là một mô hình toán học quy định cách biểu diễn mỗi màu bằng một bộ vài con số, ví dụ ba số (R, G, B) hoặc (H, S, V).

## Trực giác

Cùng một màu cam, có ba cách "đọc công thức":

- **Họa sĩ trộn ánh sáng** từ ba đèn pin đỏ, lục, lam: "đỏ hết cỡ, lục một nửa, không lam". Đó là **RGB**, cách màn hình tạo màu.
- **Thợ in pha mực** lên giấy trắng: "nhiều vàng, một ít hồng, không xanh lơ". Đó là **CMYK**.
- **Người bình thường mô tả**: "màu cam, rất rực, sáng". Đó là **HSV**: tên màu (Hue), độ rực (Saturation), độ sáng (Value).

Màu vẫn là một. Chỉ có "hệ tọa độ" để mô tả nó là khác nhau, giống như cùng một địa điểm có thể ghi bằng địa chỉ nhà hoặc bằng kinh độ, vĩ độ. Chọn hệ nào là chọn hệ khiến bài toán của mình **dễ** nhất.

## Công thức

Các công thức dưới đây dùng $R, G, B$ đã chia cho 255, tức là nằm trong $[0, 1]$.

### RGB sang ảnh xám

Mắt người nhạy với màu lục nhất và kém nhạy với màu lam, nên ảnh xám **không** lấy trung bình cộng ba kênh mà dùng trọng số:

$$
Y = 0{,}299\,R + 0{,}587\,G + 0{,}114\,B
$$

Đây là hệ số theo chuẩn ITU-R BT.601, cũng là hệ số OpenCV dùng khi chuyển sang ảnh xám.

### RGB sang HSV

Đặt $M = \max(R, G, B)$, $m = \min(R, G, B)$ và $\Delta = M - m$. Khi đó:

$$
V = M, \qquad
S = \begin{cases} 0 & M = 0 \\ \Delta / M & M > 0 \end{cases}
$$

$$
H = \begin{cases}
0 & \Delta = 0 \\
60^\circ \times \dfrac{G - B}{\Delta} \bmod 360^\circ & M = R \\
60^\circ \times \dfrac{B - R}{\Delta} + 120^\circ & M = G \\
60^\circ \times \dfrac{R - G}{\Delta} + 240^\circ & M = B
\end{cases}
$$

Trường hợp $\Delta = 0$ thực ra là $H$ không xác định; gán bằng 0 chỉ là quy ước.

Mốc dễ nhớ: đỏ ở $0^\circ$, vàng $60^\circ$, lục $120^\circ$, xanh lơ $180^\circ$, lam $240^\circ$, hồng sẫm $300^\circ$.

Màu xám ($R = G = B$) có $S = 0$, và $H$ **không có ý nghĩa**: màu xám không thuộc vùng màu nào.

### RGB sang CMYK (công thức đơn giản)

$$
K = 1 - \max(R, G, B), \qquad
C = \frac{1 - R - K}{1 - K}, \quad
M_{\text{CMYK}} = \frac{1 - G - K}{1 - K}, \quad
Y_{\text{CMYK}} = \frac{1 - B - K}{1 - K}
$$

Khi $K = 1$ (màu đen tuyệt đối) thì đặt $C = M_{\text{CMYK}} = Y_{\text{CMYK}} = 0$. Máy in thật dùng hồ sơ màu (ICC profile) riêng của từng loại mực và giấy, nên công thức này chỉ để hiểu ý tưởng.

## Ví dụ và phản ví dụ

**Ví dụ: HSV giúp lọc màu dễ hơn RGB.** Muốn tách quả cà chua đỏ trên băng chuyền:

- Trong RGB, cà chua dưới nắng có thể là $(230, 40, 40)$, trong bóng râm là $(110, 20, 20)$. Cả ba số đều thay đổi, nên khó đặt ngưỡng.
- Trong HSV, cả hai đều có $H \approx 0^\circ$ và $S$ cao; chỉ $V$ khác nhau. Chỉ cần ngưỡng trên $H$ và $S$.

**Phản ví dụ 1: HSV không phải lúc nào cũng tốt hơn.** Với các điểm ảnh gần xám ($S$ nhỏ), $H$ dao động rất mạnh chỉ vì một chút nhiễu, nên lọc theo $H$ sẽ cho kết quả lộn xộn. Lọc màu bằng HSV phải đi kèm ngưỡng tối thiểu cho $S$ và $V$.

**Phản ví dụ 2: màu đỏ "bị cắt đôi".** $H$ là một góc nên đỏ nằm ở **cả hai đầu**: $0^\circ$ đến khoảng $10^\circ$ và khoảng $350^\circ$ đến $360^\circ$. Một ngưỡng duy nhất kiểu $H < 10^\circ$ sẽ bỏ sót nửa số điểm đỏ. Phải gộp hai khoảng.

**Phản ví dụ 3: ảnh xám không phải trung bình cộng.** Lấy $(R + G + B) / 3$ thì đỏ thuần và lam thuần cùng ra một mức xám (85), trong khi mắt người thấy đỏ sáng hơn lam rõ rệt. Công thức có trọng số cho đỏ khoảng 76, lam khoảng 29.

## Dấu hiệu nhận biết

- Ảnh hiển thị bị **đổi chỗ màu đỏ và lam** (mặt người xanh lè): đang nhầm thứ tự kênh **BGR** của OpenCV với RGB.
- Ngưỡng màu chạy tốt lúc sáng nhưng hỏng lúc chiều: đang lọc trên RGB, nên chuyển sang HSV hoặc một không gian tách độ sáng riêng.
- Lọc màu đỏ chỉ được một nửa: quên rằng $H$ là góc và màu đỏ nằm ở hai đầu.
- Giá trị $H$ của OpenCV không vượt quá 179: đây **không phải lỗi**, xem bên dưới.

## Cách xử lý hoặc đo lường

- **Đọc ảnh bằng OpenCV xong thì chuyển ngay sang RGB** nếu dùng Matplotlib hoặc thư viện khác: `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`.
- **Nhớ thang đo của OpenCV với ảnh 8 bit:** $H \in [0, 179]$ (bằng góc chia 2, để vừa một byte), còn $S, V \in [0, 255]$. Thư viện khác như `colorsys` hoặc scikit-image dùng thang $[0, 1]$.
- **Gọi đúng mã chuyển đổi:** `COLOR_RGB2GRAY` và `COLOR_BGR2GRAY` cho kết quả khác nhau trên cùng một mảng.

```python
import numpy as np
import colorsys
import cv2

def rgb_to_gray(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return 0.299 * r + 0.587 * g + 0.114 * b

def rgb_to_hsv(r, g, b):
    """r, g, b trong [0, 1]. Trả về H theo độ, S và V trong [0, 1]."""
    mx, mn = max(r, g, b), min(r, g, b)
    v = mx
    s = 0.0 if mx == 0 else (mx - mn) / mx
    if mx == mn:
        h = 0.0                                   # màu xám: H không xác định, quy ước 0
    elif mx == r:
        h = (60 * (g - b) / (mx - mn)) % 360
    elif mx == g:
        h = 60 * (b - r) / (mx - mn) + 120
    else:
        h = 60 * (r - g) / (mx - mn) + 240
    return h, s, v

colors = {"đỏ": (255, 0, 0), "lục": (0, 255, 0), "lam": (0, 0, 255),
          "cam": (255, 128, 0), "xám": (128, 128, 128)}
for name, (r, g, b) in colors.items():
    h, s, v = rgb_to_hsv(r / 255, g / 255, b / 255)
    h2, s2, v2 = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    assert np.allclose([h, s, v], [h2 * 360, s2, v2])      # khớp với thư viện chuẩn
    cv_h = cv2.cvtColor(np.uint8([[[r, g, b]]]), cv2.COLOR_RGB2HSV)[0, 0]
    print(f"{name:4s} H={h:6.1f}° S={s:.2f} V={v:.2f} | OpenCV (H,S,V) = {tuple(int(t) for t in cv_h)}")

px = np.uint8([[[255, 0, 0]]])                    # một điểm ảnh đỏ, thứ tự RGB
print(rgb_to_gray(px.astype(float))[0, 0])
print(cv2.cvtColor(px, cv2.COLOR_RGB2GRAY)[0, 0], cv2.cvtColor(px, cv2.COLOR_BGR2GRAY)[0, 0])
```

Kết quả (đã chạy thử với Python 3.9.6, NumPy 2.0.2, OpenCV 5.0.0):

```text
đỏ   H=   0.0° S=1.00 V=1.00 | OpenCV (H,S,V) = (0, 255, 255)
lục  H= 120.0° S=1.00 V=1.00 | OpenCV (H,S,V) = (60, 255, 255)
lam  H= 240.0° S=1.00 V=1.00 | OpenCV (H,S,V) = (120, 255, 255)
cam  H=  30.1° S=1.00 V=1.00 | OpenCV (H,S,V) = (15, 255, 255)
xám  H=   0.0° S=0.00 V=0.50 | OpenCV (H,S,V) = (0, 0, 128)
76.24499999999999
76 29
```

- Hàm tự viết khớp với `colorsys` (lệnh `assert` không báo lỗi).
- $H$ của OpenCV đúng bằng nửa góc: lục $120^\circ \to 60$, lam $240^\circ \to 120$.
- Cùng một điểm đỏ: hiểu đúng là RGB thì mức xám là 76, hiểu nhầm thành BGR (tức tưởng đó là màu lam) thì ra 29.

## Khái niệm liên quan

- [Tổng quan thị giác máy tính và ảnh số](../../thi-giac-may-tinh/tong-quan-thi-giac-may-tinh-va-anh-so/): điểm ảnh, số kênh, so sánh RGB và CMYK.
- [K-means](../../thuat-toan/k-means/): nén màu ảnh bằng cách gom màu các điểm ảnh thành $k$ màu đại diện. Không gian màu dùng để gom ảnh hưởng tới kết quả.
- Các không gian màu khác sẽ gặp sau: YCbCr (tách độ sáng khỏi màu, dùng trong nén JPEG), CIE Lab (khoảng cách Euclid gần với cảm nhận màu của mắt người hơn).

## Câu hỏi tự kiểm tra

1. Điểm ảnh $(R, G, B) = (0, 0, 0)$ và $(128, 128, 128)$ có $H$ bằng bao nhiêu? Vì sao giá trị đó không có ý nghĩa?
2. Bạn đọc một ảnh bằng `cv2.imread`, rồi chuyển sang HSV bằng `cv2.COLOR_RGB2HSV`. Màu đỏ trong ảnh sẽ có $H$ khoảng bao nhiêu trong OpenCV, và vì sao?
3. Viết điều kiện lọc màu đỏ cho ảnh HSV của OpenCV, có tính đến việc đỏ nằm ở hai đầu thang $H$.

<details>
<summary>Đáp án</summary>

1. Cả hai đều có $\Delta = 0$ nên $H$ được quy ước là 0. Giá trị đó không có ý nghĩa vì đen và xám không thuộc vùng màu nào; chỉ $V$ (và $S = 0$) mô tả chúng.
2. `imread` trả về BGR, nên kênh đầu tiên thực ra là lam. Dùng mã `RGB2HSV` thì OpenCV sẽ hiểu màu đỏ $(B, G, R) = (0, 0, 255)$ thành màu lam, cho $H \approx 120$ (tức $240^\circ$). Phải dùng `cv2.COLOR_BGR2HSV`.
3. Ví dụ: `((H <= 10) | (H >= 170)) & (S >= 100) & (V >= 50)`. Phần đầu gộp hai đầu thang $H$ của OpenCV; phần sau loại các điểm gần xám hoặc quá tối, nơi $H$ không đáng tin. Các con số ngưỡng cần chỉnh theo ảnh thật.

</details>

## Cần kiểm tra lại

- Ví dụ giá trị RGB của cà chua dưới nắng và trong bóng râm là số mình tự đặt để minh họa, chưa đo từ ảnh thật.
- Ngưỡng ở câu hỏi 3 chỉ là điểm xuất phát, không phải giá trị chuẩn.
- Công thức RGB sang CMYK là dạng đơn giản hóa, không dùng được cho in ấn thật.
