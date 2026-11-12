---
title: "Tổng quan thị giác máy tính và ảnh số"
summary: "Thị giác máy tính là gì, khác xử lý ảnh ở đâu, và máy tính lưu một bức ảnh thành những con số như thế nào: điểm ảnh, mức xám, ảnh nhị phân, ảnh màu và không gian màu."
course: thi-giac-may-tinh
type: lecture
tags: [computer-vision, image-processing, digital-image, color-space]
level: beginner
status: reviewed
source: _sources/thi-giac-may-tinh/Buoi1.pdf
sourceTitle: "Slide Buổi 1, Chương 1: Introduction (trang 11–67)"
lecturer: TS. Phùng Thế Bảo
prerequisites: [nen-tang/vector-va-ma-tran]
related: [khai-niem/khong-gian-mau, thi-giac-may-tinh/quan-he-giua-cac-diem-anh, thi-giac-may-tinh/tich-chap-va-pooling]
order: 1
---

## Mục tiêu

Sau bài này bạn có thể:

- Phân biệt **xử lý ảnh** (ảnh vào, ảnh ra) với **thị giác máy tính** (ảnh vào, hiểu biết hoặc quyết định ra).
- Giải thích một ảnh số được lưu bằng những con số nào: điểm ảnh, mức xám, số bit, số kênh màu.
- Biết khi nào dùng RGB, CMYK hay HSV, và vì sao ảnh đọc bằng OpenCV hay bị "sai màu".

## Trực giác

**Ảnh số giống một bức tranh ghép gạch men.** Đứng xa bạn thấy khuôn mặt, đứng sát chỉ thấy các viên gạch vuông, mỗi viên một màu đồng nhất. Máy tính "nhìn" ảnh đúng theo cách đứng sát đó: một bảng ô vuông, mỗi ô ghi **một con số** cho độ sáng (ảnh xám) hoặc **ba con số** cho lượng đỏ, lục, lam (ảnh màu). Mỗi ô gọi là một **điểm ảnh** (pixel, viết tắt của *picture element*).

Gạch càng nhỏ và càng nhiều thì tranh càng mịn. Đó là ý tưởng của **độ phân giải** (resolution). Bảng màu càng nhiều sắc độ thì chuyển màu càng mượt. Đó là ý tưởng của **số mức xám**.

**Xử lý ảnh và thị giác máy tính khác nhau ở đầu ra:**

- Bạn chỉnh ảnh trên điện thoại cho sáng hơn, nét hơn: đưa vào một ảnh, nhận về một ảnh đẹp hơn. Đó là **xử lý ảnh số** (Digital Image Processing, DIP).
- Camera ở trạm thu phí đọc biển số rồi tự trừ tiền: đưa vào một ảnh, nhận về **thông tin** ("51A-123.45") và **hành động**. Đó là **thị giác máy tính** (Computer Vision, CV).

Hệ thống thị giác máy tính thường dùng các bước xử lý ảnh làm "khâu sơ chế", rồi dùng **nhận dạng mẫu** (pattern recognition) và học máy để "hiểu" ảnh. Vì vậy môn học có tên *Thị giác máy tính và nhận dạng mẫu*.

## Thị giác máy tính là gì

Theo slide (trích Szeliski, 2022), thị giác máy tính là lĩnh vực liên ngành nghiên cứu cách để máy tính **hiểu được nội dung ở mức cao** từ ảnh hoặc video. Nhìn từ góc độ kỹ thuật, mục tiêu là **tự động hóa những việc mà mắt và não người làm được**: nhận ra đồ vật, đọc chữ, ước lượng khoảng cách...

Công việc của thị giác máy tính gồm bốn khâu: **thu nhận** ảnh, **xử lý**, **phân tích**, rồi **hiểu** ảnh. Kết quả cuối cùng là dữ liệu dạng số hoặc dạng ký hiệu, chẳng hạn một quyết định "có lỗi / không lỗi".

Slide xếp **xử lý ảnh là một phần của thị giác máy tính**. Cách hiểu dễ nhớ: xử lý ảnh là phần "làm sạch và biến đổi", thị giác máy tính thêm phần "giải thích".

### Một hệ thống thị giác máy gồm những gì

| Thành phần | Vai trò |
| --- | --- |
| Máy ảnh và ống kính | Thu ánh sáng từ cảnh thật |
| Thiết bị chiếu sáng | Tạo điều kiện ánh sáng ổn định (rất quan trọng trong nhà máy) |
| Phần mềm xử lý ảnh | Lọc nhiễu, tăng tương phản, tách vùng... |
| Thuật toán nhận dạng mẫu | Quyết định ảnh chứa gì |
| Bộ phận thực thi | Màn hình hiển thị, cánh tay robot... làm theo kết quả |

### Ứng dụng

Slide nêu các nhóm ứng dụng: kinh doanh, giải trí, giao thông, y tế, đời sống. Một số việc cụ thể:

- Phát hiện lỗi sản phẩm trên dây chuyền, đo kích thước với độ chính xác cao.
- Đọc mã vạch và nhận dạng ký tự quang học (Optical Character Recognition, OCR).
- Xe tự lái phát hiện vật thể, kể cả trong sương mù.
- Ảnh vệ tinh và hệ thống thông tin địa lý (GIS): phân loại địa hình, dự báo thời tiết, ước tính dân số và mức dùng điện từ ảnh chụp ánh đèn ban đêm.
- Thực thi pháp luật: đọc biển số ở camera tốc độ, nhận dạng vân tay, làm rõ ảnh camera an ninh (CCTV).
- Y tế: ảnh X-quang, ảnh chụp cắt lớp vi tính (CT).

### Vài mốc lịch sử

| Thời gian | Sự kiện (theo slide) |
| --- | --- |
| Đầu thập niên 1920 | Hệ thống cáp Bartlane truyền ảnh báo chí qua cáp ngầm giữa London và New York |
| Giữa đến cuối thập niên 1920 | Cải tiến Bartlane, tăng số tông màu của ảnh tái tạo |
| Thập niên 1960 | Máy tính dùng để cải thiện ảnh Mặt Trăng do tàu Ranger 7 chụp, sau đó dùng cho các chuyến Apollo |
| Thập niên 1970 | Xử lý ảnh bắt đầu dùng trong y tế |
| 1979 | Hounsfield và Cormack nhận giải Nobel Y học nhờ phát minh chụp cắt lớp, nền tảng của máy CT |
| Thập niên 1990 đến nay | Hệ thống ảnh thời gian thực, thực tế ảo, robot tự hành; xử lý ảnh có mặt ở hầu hết các lĩnh vực |

## Ảnh số được biểu diễn như thế nào

### Ảnh là một hàm hai biến

Hãy coi ảnh là một hàm $f(x, y)$:

- $(x, y)$ là **tọa độ** của một điểm trên mặt phẳng ảnh. Theo quy ước của slide, $x$ đi theo chiều ngang, $y$ đi theo chiều dọc, gốc $(0, 0)$ ở góc trên bên trái.
- Giá trị $f(x, y)$ là **cường độ sáng**, còn gọi là **mức xám** (gray level), tại điểm đó.

Khi cả tọa độ lẫn giá trị đều là **hữu hạn và rời rạc** (đếm được, không liên tục), ta có một **ảnh số** (digital image). Ảnh số chỉ là **xấp xỉ** của cảnh thật: ta đã "chia ô" và "làm tròn" thế giới liên tục. Hai thao tác này, **lấy mẫu** và **lượng hóa**, sẽ học kỹ ở Chương 2.

### Mức xám và số bit

Mỗi điểm ảnh được lưu bằng $B$ bit, nên có $L = 2^B$ mức xám khác nhau, đánh số từ $0$ (tối nhất) đến $L - 1$ (sáng nhất).

Thông dụng nhất là **8 bit** cho mỗi điểm, tức là $L = 256$ mức, giá trị từ 0 đến 255. Lý do rất thực tế: 8 bit vừa đúng **1 byte** trong máy tính. Các thang khác như 16, 32, 64, 128 mức cũng có, nhưng ít gặp hơn.

### Ba loại ảnh theo số mức và số kênh

| Loại ảnh | Mỗi điểm ảnh lưu | Ví dụ |
| --- | --- | --- |
| **Ảnh nhị phân** (binary image) | 1 giá trị, chỉ 2 mức ($B = 1$, $L = 2$): 0 là tối, 1 là sáng | Văn bản scan đen trắng, mặt nạ (mask) đánh dấu vật thể |
| **Ảnh đa cấp xám** (grayscale image) | 1 giá trị, $L > 2$ mức, thường là 256 | Ảnh X-quang, ảnh đen trắng thông thường |
| **Ảnh màu** (color image) | 3 giá trị (đỏ, lục, lam) | Ảnh chụp từ điện thoại |
| Ảnh màu có độ trong suốt | 4 giá trị: R, G, B và **alpha** (độ trong suốt, opacity) | File PNG có nền trong suốt |

Phần lớn môn học làm việc với **ảnh xám**, vì một kênh dễ tính tay và dễ minh họa. Hiểu ảnh xám rồi thì áp dụng cho từng kênh của ảnh màu.

### Độ phân giải

**Độ phân giải** đo mức chi tiết nhỏ nhất còn phân biệt được trong ảnh. Khi in hoặc hiển thị, nó thường tính bằng **số điểm ảnh trên một inch** (dots per inch, dpi). Khoảng cách giữa các điểm phải đủ nhỏ để mắt người vẫn thấy ảnh liền mạch, không thấy "ô vuông".

Ngoài đời người ta hay nói "ảnh 1920 × 1080". Đó là **kích thước ảnh tính bằng điểm ảnh**, không phải dpi. Cùng một ảnh 1920 × 1080 in ra khổ nhỏ sẽ có dpi cao hơn khi in khổ lớn.

## Không gian màu

**Không gian màu** (color space) là một mô hình toán học mô tả màu sắc bằng các con số. Không có mô hình nào mô tả trọn vẹn mọi khía cạnh của màu, nên mỗi mô hình mạnh ở một việc.

> Phần này tóm tắt theo slide. Công thức chuyển đổi (RGB sang ảnh xám, sang HSV, sang CMYK), thang giá trị HSV của OpenCV và các lỗi hay gặp khi lọc màu nằm ở trang [Không gian màu](../../khai-niem/khong-gian-mau/).

### RGB: trộn ánh sáng

Mỗi màu là tổ hợp của ba kênh **đỏ** (Red), **lục** (Green), **lam** (Blue). Mỗi kênh dùng 8 bit, giá trị 0 đến 255. RGB là **màu cộng** (additive): càng thêm ánh sáng càng sáng, cả ba kênh bằng 255 cho màu trắng. Màn hình, máy ảnh và điện thoại đều dùng RGB.

Ba kênh × 8 bit = 24 bit, nên số màu biểu diễn được là $256^3 = 16\,777\,216$, khoảng 16,7 triệu màu.

**Lưu ý với OpenCV:** thư viện này đọc ảnh và lưu các kênh theo thứ tự **BGR** (lam, lục, đỏ), ngược với RGB. Nếu đưa thẳng ảnh OpenCV sang thư viện vẽ dùng RGB như Matplotlib, màu đỏ và màu lam sẽ bị đổi chỗ cho nhau.

### CMYK: trộn mực in

Bốn kênh: **xanh lơ** (Cyan), **hồng sẫm** (Magenta), **vàng** (Yellow) và **đen** (Key). CMYK là **màu trừ** (subtractive): mực hấp thụ bớt ánh sáng, càng thêm mực càng tối. Đây là hệ màu của ngành in.

| Tiêu chí | RGB | CMYK |
| --- | --- | --- |
| Nguyên lý | Phát xạ ánh sáng (màu cộng) | Hấp thụ ánh sáng (màu trừ) |
| Số màu | Nhiều hơn | Ít hơn |
| Dùng ở đâu | Màn hình, máy ảnh, điện thoại | In ấn |

### HSV: mô tả màu theo cách con người nói

Thay vì nói "đỏ 200, lục 30, lam 30", con người thường nói "màu đỏ, khá rực, hơi tối". HSV (còn gọi là HSB) mô tả màu đúng theo ba ý đó:

- **H** (Hue, vùng màu): màu gì, đo bằng góc trên vòng tròn màu, ví dụ đỏ ở 0°, vàng ở 60°.
- **S** (Saturation, độ bão hòa): màu rực hay nhạt.
- **V** (Value, độ sáng): sáng hay tối.

Ứng dụng điển hình là **lọc màu**. Muốn tìm mọi vật màu đỏ trong ảnh, chỉ cần chọn các điểm có H gần 0°, bất kể vật đó đang ở chỗ sáng hay chỗ tối. Làm việc này bằng RGB khó hơn nhiều, vì khi ánh sáng thay đổi thì cả ba kênh đều thay đổi.

## Các bước cơ bản trong xử lý ảnh số

Slide trình bày một sơ đồ gồm các khối dưới đây, tất cả xoay quanh **miền bài toán** (problem domain) cần giải quyết. Slide chỉ nêu tên từng khối; phần giải thích ngắn bên dưới là cách mình hiểu.

| Bước | Tiếng Anh | Làm gì |
| --- | --- | --- |
| Thu nhận ảnh | Image Acquisition | Chụp hoặc quét, rồi số hóa thành ma trận số |
| Tăng cường ảnh | Image Enhancement | Làm ảnh dễ nhìn hơn: tăng tương phản, làm nét |
| Khôi phục ảnh | Image Restoration | Gỡ bỏ hư hỏng đã biết nguyên nhân, ví dụ nhiễu |
| Xử lý ảnh màu | Colour Image Processing | Các kỹ thuật riêng cho ảnh nhiều kênh |
| Nén ảnh | Image Compression | Giảm dung lượng lưu trữ và truyền |
| Xử lý hình thái | Morphological Processing | Trích các cấu trúc hình dạng của vật thể |
| Phân đoạn | Segmentation | Chia ảnh thành các vùng hoặc vật thể |
| Biểu diễn và mô tả | Representation & Description | Mô tả vùng đã tách bằng các đặc trưng |
| Nhận dạng đối tượng | Object Recognition | Gán nhãn cho vật thể: "đây là xe", "đây là chữ A" |

Các chương tiếp theo của môn đi lần lượt qua nhiều khối trong bảng: thu nhận và biểu diễn (Chương 2), tăng cường ảnh trong miền không gian và miền tần số (Chương 3, 4), khôi phục ảnh (Chương 5), phân đoạn (Chương 6).

## Công thức

Ảnh số là hàm hai biến với tọa độ và giá trị rời rạc:

$$
f(x, y), \quad x = 0, 1, \dots, \quad y = 0, 1, \dots
$$

Số mức xám khi mỗi điểm ảnh dùng $B$ bit:

$$
L = 2^{B}
$$

Mỗi điểm ảnh nhận một giá trị mức xám trong tập $\{0, 1, \dots, L - 1\}$.

Ví dụ: $B = 1$ cho $L = 2$ (ảnh nhị phân), $B = 8$ cho $L = 256$.

Số màu của ảnh RGB 24 bit (mỗi kênh 8 bit, 256 giá trị):

$$
256 \times 256 \times 256 = 2^{24} = 16\,777\,216
$$

## Code tối giản

Chỉ cần NumPy (`pip install numpy`); `colorsys` có sẵn trong Python.

```python
import numpy as np
import colorsys

# 1) Ảnh xám 8 bit: một ma trận số nguyên 0..255
img = np.array([[  0,  50, 100, 150, 200],
                [ 10,  60, 110, 160, 210],
                [ 20,  70, 120, 170, 220],
                [ 30,  80, 130, 180, 255]], dtype=np.uint8)
print(img.shape, img.dtype)   # số hàng, số cột, kiểu dữ liệu
print(img[2, 3])              # NumPy: [hàng, cột]

# 2) Số mức xám L = 2^B
for B in (1, 4, 8):
    print(f"B={B} bit -> L={2**B} mức xám (0..{2**B - 1})")

# 3) Ảnh nhị phân: chỉ giữ 2 mức
binary = (img >= 128).astype(np.uint8)
print(binary)

# 4) Ảnh màu RGB: mỗi điểm ảnh có 3 giá trị
rgb = np.array([[[255, 0, 0], [0, 255, 0]],
                [[0, 0, 255], [255, 255, 0]]], dtype=np.uint8)
print(rgb.shape)               # (cao, rộng, số kênh)
bgr = rgb[..., ::-1]           # đảo thứ tự kênh, cách OpenCV lưu
print(rgb[0, 0], "->", bgr[0, 0])
print("Số màu 24 bit:", 256 ** 3)

# 5) RGB -> HSV cho từng màu (colorsys dùng giá trị 0..1)
for name, (r, g, b) in {"đỏ": (255, 0, 0), "vàng": (255, 255, 0), "đỏ tối": (128, 0, 0)}.items():
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    print(f"{name:7s} H={h*360:5.1f}° S={s:.2f} V={v:.2f}")
```

Kết quả khi chạy (đã chạy thử với Python 3.9, NumPy):

```text
(4, 5) uint8
170
B=1 bit -> L=2 mức xám (0..1)
B=4 bit -> L=16 mức xám (0..15)
B=8 bit -> L=256 mức xám (0..255)
[[0 0 0 1 1]
 [0 0 0 1 1]
 [0 0 0 1 1]
 [0 0 1 1 1]]
(2, 2, 3)
[255   0   0] -> [  0   0 255]
Số màu 24 bit: 16777216
đỏ      H=  0.0° S=1.00 V=1.00
vàng    H= 60.0° S=1.00 V=1.00
đỏ tối  H=  0.0° S=1.00 V=0.50
```

Hai điều đáng để ý trong kết quả:

- Điểm ảnh màu đỏ `[255, 0, 0]` sau khi đảo kênh thành `[0, 0, 255]`. Nếu một thư viện RGB đọc mảng này, nó sẽ vẽ ra màu **lam**.
- "Đỏ" và "đỏ tối" có **cùng H = 0°** và chỉ khác V. Đây chính là lý do HSV tiện cho việc lọc màu.

## Lỗi thường gặp

- **Nhầm thứ tự tọa độ.** Slide viết điểm là $(x, y)$ với $x$ theo chiều ngang. NumPy lại truy cập ảnh theo `img[hàng, cột]`, tức là `img[y, x]`. Viết `img[x, y]` vẫn chạy, nhưng sẽ lấy sai điểm, và báo lỗi khi ảnh không vuông.
- **Quên OpenCV dùng BGR.** Ảnh đọc bằng `cv2.imread` mà hiển thị bằng Matplotlib sẽ bị đổi màu đỏ và lam. Cần chuyển bằng `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`.
- **Tràn số với `uint8`.** Kiểu `uint8` chỉ chứa được 0 đến 255. Trong NumPy, `np.array([250], dtype=np.uint8) + 10` cho ra `[4]` chứ không phải 260, vì giá trị bị "quay vòng". Muốn cộng trừ ảnh, hãy chuyển sang `int` hoặc `float` trước rồi cắt lại về khoảng 0 đến 255.
- **Tính số màu thành $255^3$.** Mỗi kênh có **256** giá trị (từ 0 đến 255), không phải 255, nên số màu là $256^3$.
- **Nhầm dpi với kích thước ảnh.** "1920 × 1080" là số điểm ảnh; dpi còn phụ thuộc vào kích thước khi in hoặc hiển thị.
- **Giữ CMYK để xử lý trên máy tính.** CMYK dành cho in ấn. Thuật toán xử lý ảnh thường làm việc trên ảnh xám, RGB hoặc HSV.

## Bài tập

1. Một ảnh xám dùng 6 bit cho mỗi điểm ảnh. Ảnh có bao nhiêu mức xám, và giá trị lớn nhất là bao nhiêu?
2. Cho ví dụ một bài toán **xử lý ảnh** và một bài toán **thị giác máy tính** trong cùng một ứng dụng, ví dụ camera giám sát giao thông. Đầu vào và đầu ra của mỗi bài toán là gì?
3. Bạn cần đếm số quả cà chua chín (màu đỏ) trên băng chuyền, trong điều kiện ánh sáng thay đổi theo giờ. Nên dùng không gian màu nào để tách màu đỏ? Vì sao?
4. Trong đoạn code trên, sửa ngưỡng tạo ảnh nhị phân từ 128 thành 100. Ma trận `binary` thay đổi ở những ô nào?
5. Ảnh RGBA có bao nhiêu giá trị cho mỗi điểm ảnh? Nếu mỗi giá trị dùng 8 bit thì một điểm ảnh chiếm bao nhiêu byte?

<details>
<summary>Gợi ý đáp án</summary>

1. $L = 2^6 = 64$ mức xám, giá trị từ 0 đến 63.
2. Ví dụ: làm sáng và khử nhiễu ảnh ban đêm là xử lý ảnh (ảnh vào, ảnh ra). Đọc biển số xe vượt đèn đỏ là thị giác máy tính (ảnh vào, chuỗi ký tự và quyết định phạt ra).
3. HSV. Màu đỏ nằm ở vùng H gần 0°, và H ít bị ảnh hưởng khi ánh sáng mạnh yếu; ánh sáng chủ yếu làm thay đổi V.
4. Các ô có giá trị từ 100 đến 127 chuyển từ 0 thành 1: đó là các ô 100, 110, 120 ở cột thứ 3 (chỉ số 2), ba hàng đầu. Ô 130 ở hàng cuối vốn đã là 1.
5. 4 giá trị (R, G, B, alpha), tức là 4 × 8 = 32 bit = 4 byte.

</details>

## Câu hỏi tự kiểm tra

Trả lời bằng lời của mình trước, rồi mới mở đáp án.

1. Xử lý ảnh và thị giác máy tính khác nhau ở **đầu ra** như thế nào? Cho một ví dụ mà cùng một ảnh đầu vào có thể dùng cho cả hai.
2. Vì sao 8 bit cho mỗi điểm ảnh là lựa chọn phổ biến nhất? Ảnh 8 bit có bao nhiêu mức xám?
3. Vì sao cùng một vật màu đỏ, lọc theo HSV ổn định hơn lọc theo RGB khi ánh sáng thay đổi?
4. Ảnh xám 8 bit lưu bằng `uint8`. Cộng thêm 10 vào điểm có giá trị 250 thì NumPy cho ra bao nhiêu, và vì sao?
5. Ảnh đọc bằng OpenCV, hiển thị bằng Matplotlib thì bầu trời xanh biến thành màu cam nâu. Chuyện gì đã xảy ra, và sửa thế nào?

<details>
<summary>Đáp án</summary>

1. Xử lý ảnh cho ra **một ảnh khác**, đã được cải thiện hoặc biến đổi. Thị giác máy tính cho ra **thông tin hoặc quyết định** về nội dung ảnh. Ví dụ với ảnh chụp X-quang phổi: tăng tương phản cho bác sĩ dễ nhìn là xử lý ảnh; tự động khoanh vùng nghi ngờ có khối u là thị giác máy tính.
2. 8 bit vừa đúng 1 byte, đơn vị lưu trữ cơ bản của máy tính, nên đọc ghi và tính toán thuận tiện. Ảnh 8 bit có $2^8 = 256$ mức xám, từ 0 đến 255. Mức này cũng đủ mịn để mắt người thấy chuyển sắc liền mạch.
3. Khi ánh sáng mạnh hay yếu đi, cả ba kênh R, G, B đều thay đổi cùng lúc, nên một ngưỡng cố định trên RGB dễ hỏng. Trong HSV, thay đổi ánh sáng chủ yếu làm thay đổi V (độ sáng), còn H (vùng màu) gần như giữ nguyên. Vì vậy chỉ cần đặt ngưỡng trên H, cùng một ngưỡng tối thiểu cho S và V.
4. Ra **4**, không phải 260. `uint8` chỉ chứa được 0 đến 255; khi vượt quá, giá trị "quay vòng" theo modulo 256: $260 - 256 = 4$. Muốn tránh, chuyển sang `int` hoặc `float` trước khi cộng, rồi dùng `np.clip` đưa về khoảng 0 đến 255.
5. OpenCV lưu ảnh theo thứ tự **BGR**, còn Matplotlib hiểu mảng là **RGB**. Kênh lam (rất lớn ở bầu trời) bị hiểu thành kênh đỏ, nên trời xanh thành màu cam nâu. Sửa bằng `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` trước khi hiển thị.

</details>

## Tài liệu tham khảo

- Slide bài giảng môn *Thị giác máy tính và nhận dạng mẫu*, Buổi 1, Chương 1 (tài liệu gốc, không công khai).
- Richard Szeliski. *Computer Vision: Algorithms and Applications*. Springer, 2022.
- Valliappa Lakshmanan, Martin Görner, Ryan Gillard. *Practical Machine Learning for Computer Vision*. O'Reilly Media, 2021.
- R. C. Gonzalez, R. E. Woods. *Digital Image Processing* (slide dùng nhiều hình từ sách này; slide không nêu phiên bản và năm).

## Cần kiểm tra lại

- **Số màu 24 bit:** slide (trang 35) ghi $255 \times 255 \times 255 = 16\,581\,375$. Mình tính lại là $256^3 = 16\,777\,216$, vì mỗi kênh có 256 giá trị. Nên hỏi lại giảng viên để chắc chắn.
- **Câu "không gian màu mặc định của OpenCV là RGB nhưng lưu ở dạng BGR"** (trang 35) dễ gây hiểu nhầm. Theo mình biết, `cv2.imread` trả ảnh theo thứ tự BGR, nên trong code cứ coi là BGR. Cần đối chiếu với tài liệu OpenCV.
- **Định nghĩa thứ hai về thị giác máy tính** (trang 21) được slide ghi nguồn "Wikipedia" kèm sách Szeliski. Chưa rõ câu nào lấy từ nguồn nào.
- **Sơ đồ "Related fields"** (trang 22) và **sơ đồ hệ thống xử lý ảnh** (trang 44) chỉ có dạng hình. Mình chưa đọc được chữ trong hình nên chưa đưa vào bài.
- **Phần giải thích từng bước trong "Fundamental Steps in DIP"** là cách mình hiểu theo sách Gonzalez & Woods; slide chỉ nêu tên từng khối.
- **Mục lục môn ở trang 4** (Chương 5 Phân đoạn ảnh, Chương 6 Nhận dạng ảnh) không khớp với nội dung slide thực tế (Chương 5 Khôi phục ảnh, Chương 6 Phân đoạn ảnh). Câu "các chương tiếp theo" trong bài viết theo nội dung slide thực tế.
- **Độ phân giải:** slide định nghĩa theo dpi. Phần phân biệt dpi với kích thước ảnh tính bằng điểm ảnh là mình bổ sung.
