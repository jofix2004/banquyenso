# KỊCH BẢN & NỘI DUNG SLIDE THUYẾT TRÌNH BÀI TẬP LỚN
*(Lưu ý: Nội dung mỗi slide dưới đây đã được dàn trang ngắn gọn để không bị "ngợp chữ" khi chiếu. Người thuyết trình kết hợp nói thêm ở phần ghi chú)*

**Thông tin chung:**
- **Môn học:** Tên môn học (Ví dụ: Mật mã học / An toàn thông tin)
- **Đề tài:** Ứng dụng Thuật toán Mật mã Xây dựng Hệ thống Ghi nhận và Xác minh Bản quyền Dữ liệu Đa phương tiện.
- **Giảng viên hướng dẫn:** [Tên Giảng Viên]

---

## SLIDE 1: TIÊU ĐỀ
*(Trang bìa, thiết kế trang trọng)*
- **Tên đề tài:** Ứng dụng RSA và SHA-256 để Ghi nhận và Xác minh Bản quyền Dữ liệu Đa phương tiện.
- **Thành viên nhóm:** 
  1. Nguyễn Văn A (Mã SV: ...)
  2. Trần Thị B (Mã SV: ...)
  3. Lê Văn C (Mã SV: ...)

---

## SLIDE 2: ĐẶT VẤN ĐỀ (Phần 1: Giao dịch số & Lừa đảo)
- **Rủi ro giao dịch điện tử (Hợp đồng, Hóa đơn, Văn bản hành chính):**
  - Rủi ro lớn nhất không chỉ là mất tệp, mà là **đánh tráo nội dung** (sửa số tiền, thay tên người ký) trong quá trình truyền hoặc chia sẻ.
- **Vấn nạn tin giả:**
  - Văn bản giả mạo, thông cáo báo chí ngụy tạo và ảnh chỉnh sửa tinh vi có thể gây hoang mang dư luận.
- **Nhu cầu:** Cần một cách để người nhận có thể đối chiếu và xác định văn bản thật sự do cơ quan hoặc tác giả nào phát hành.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA]:** 
> - Ghép 2 bức ảnh: Một văn bản gốc và một văn bản bị dùng Photoshop sửa đổi số tiền nhưng trông y hệt nhau.
> - Icon dấu X đỏ (Hàng fake) và Dấu check xanh (Bản thật).

---

## SLIDE 3: ĐẶT VẤN ĐỀ (Phần 2: Khủng hoảng niềm tin số)
- **Kỷ nguyên AI tạo sinh (Generative AI) & Deepfake:**
  - Midjourney, DALL-E và AI Voice khiến ranh giới thật - giả ngày càng mờ. Câu "thấy mới tin" không còn đủ tin cậy.
  - Hình ảnh, giọng nói hay video đều có thể bị tạo hoặc chỉnh sửa rất thuyết phục.
- **Giải pháp thiết yếu:**
  - Tạo **chữ ký số (Digital Signature)** và gắn vào siêu dữ liệu của tệp ngay khi phát hành để hỗ trợ xác nhận nguồn gốc và tính toàn vẹn của nội dung.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA]:** 
> - Ảnh so sánh vui: Lấy 1 bức ảnh chụp thật của nhóm và 1 bức ảnh do AI tạo ra (Deepfake) đặt cạnh nhau có dấu hỏi "Đâu là thật?".

---

## SLIDE 4: MỤC TIÊU ĐỀ TÀI
*Giải quyết bài toán niềm tin số bằng một phần mềm ứng dụng.*

- **Mục tiêu lý thuyết:** Vận dụng hàm băm SHA-256 và thuật toán mật mã bất đối xứng RSA-2048 vào bài toán xác minh nguồn gốc dữ liệu.
- **Mục tiêu thực tiễn:** Tự xây dựng ứng dụng mô phỏng "công chứng điện tử" bằng **Python**, giúp:
  1. Tác giả tạo cặp khóa định danh.
  2. Tác giả ký số lên tệp để hỗ trợ xác nhận nguồn gốc và quyền sở hữu.
  3. Người nhận kiểm tra tính toàn vẹn và phát hiện nội dung bị chỉnh sửa một cách nhanh chóng.

---

## SLIDE 5: TỔNG QUAN QUY TRÌNH (TỪ GÓC NHÌN NGƯỜI DÙNG)
*Làm sao để người dùng không biết code vẫn sử dụng được?*

**Quy trình góc nhìn tác giả (Ký số):**
1. **Bước tạo khóa:** Bấm nút để sinh cặp `(Khóa bí mật + Khóa công khai)`. Khóa bí mật được giữ kín, khóa công khai có thể chia sẻ.
2. **Bước ký số:** Đưa `[Tệp dữ liệu]` và `[Khóa bí mật]` vào phần mềm.
3. **Đầu ra:** Phần mềm sinh ra `[File chữ ký số]`. Tác giả gửi tệp gốc kèm chữ ký số cho người nhận.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA/SƠ ĐỒ]:** 
> - Vẽ một sơ đồ flowchart mũi tên nằm ngang đơn giản: 
> `[Tác Giả] -> [Giữ Khóa Bí Mật] -> Cắm vào máy PC -> Nhả ra [Tài liệu + Tiêu đề Chữ Ký Đỏ]`.

---

## SLIDE 6: TỔNG QUAN QUY TRÌNH (BÊN XÁC MINH)

**Quy trình góc nhìn người kiểm tra:**
1. Người nhận có `[Tệp dữ liệu]` kèm `[File chữ ký số]` và muốn kiểm tra tính xác thực.
2. **Bước kiểm chứng:** Đưa `[Tệp dữ liệu]`, `[File chữ ký số]` và `[Khóa công khai]` của tác giả vào phần mềm.
3. **Kết luận trên màn hình:** 
   - **"CHỮ KÝ HỢP LỆ"**: Tệp còn nguyên vẹn và chữ ký khớp với khóa công khai.
   - **"CHỮ KÝ KHÔNG HỢP LỆ"**: Tệp đã bị chỉnh sửa, chữ ký sai hoặc khóa công khai không đúng.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA/SƠ ĐỒ]:** 
> - Vẽ Flowchart: `[Người dùng] cầm Kính lúp (soi) -> Đưa 3 dữ kiện vào Phần mềm -> Rẽ 2 nhánh: [Xanh ✓ Hợp lệ] / [Đỏ ✗ Bị chỉnh sửa]`.

---

## SLIDE 7: CƠ SỞ LÝ THUYẾT (Hàm băm SHA-256)
- **Vai trò:** Hoạt động như "dấu vân tay số" của tài liệu đa phương tiện.
- **Biểu diễn:** Với SHA-256, mã băm thường được hiển thị bằng chuỗi hex dài 64 ký tự (ví dụ: `e3b0c44...`).
- **Tính chất quan trọng:**
  - **Tính một chiều:** Không thể khôi phục dữ liệu gốc chỉ từ mã băm.
  - **Hiệu ứng tuyết lở:** Nếu sửa đúng **một dấu phẩy** hoặc **1 pixel màu**, mã băm sẽ thay đổi hoàn toàn.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA]:** 
> - Ảnh so sánh: File A (Có chữ 'Fox') mũi tên ra chuỗi băm A. File B (Chữ 'fox' viết thường) mũi tên ra chuỗi băm B khác biệt hoàn toàn (đỏ). 

---

## SLIDE 8: CƠ SỞ LÝ THUYẾT (Thuật toán RSA - Bất đối xứng)
- Trong hệ đối xứng, cùng một khóa được dùng cho cả mã hóa và giải mã nên dễ bị lộ nếu phải chia sẻ cho bên nhận.
- **RSA tạo ra cặp khóa liên kết toán học:**
  - `Private Key` (Khóa bí mật): Chỉ tác giả giữ, dùng để **ký**.
  - `Public Key` (Khóa công khai): Có thể chia sẻ rộng rãi, dùng để **xác minh chữ ký**.

> 🖼️ **[GỢI Ý ẢNH MINH HỌA]:** 
> - Hình cái ổ khóa bị cắt làm đôi: Một nửa là 🗝️ Chìa Đỏ (Private Key - Lưu ở nhà) & Một nửa là 🗝️ Chìa Xanh (Public Key - Phát cho vạn người).

---

## SLIDE 9: CHI TIẾT KỸ THUẬT: QUÁ TRÌNH "KÝ ĐIỆN TỬ"
*Nguyên lý hoạt động lập trình cốt lõi:*

1. Hệ thống đọc toàn bộ tệp đa phương tiện của tác giả.
2. Dùng thư viện Python để chạy **hàm băm SHA-256** trên nội dung tệp $\rightarrow$ tạo ra mã băm đại diện cho tệp.
3. Dùng `Private Key` của tác giả kết hợp chuẩn **PKCS#1 v1.5** để ký lên mã băm này.
4. **Kết quả:** Sinh ra chuỗi dữ liệu chữ ký số, dùng để gắn danh tính tác giả với tệp tin.

> 🖼️ **[ẢNH MINH HỌA TỪ SOURCE CODE CỦA NHÓM]:** 
> - Chụp màn hình Giao diện Demo Phần Mềm: Khu vực Tab "Mô phỏng Chữ Ký" phần bên TRÁI.
> - Chụp focus vào khu vực ổ input nhập Khóa Bí Mật + Nút bấm Ký Điện Tử màu đỏ.
> 
> *(Ghi chú tài liệu thuyết trình: Công thức lõi của bước Ký là `Signature = Hash^d mod n`)*

---

## SLIDE 10: CHI TIẾT KỸ THUẬT: QUÁ TRÌNH "XÁC MINH CỐT LÕI"
*Cách Python phát hiện sự giả mạo:*

1. Băm lại tệp đang kiểm tra bằng **SHA-256** để thu được **mã băm của tệp hiện tại (#2)**.
2. Dùng `Public Key` của tác giả để kiểm tra file chữ ký và khôi phục **mã băm gốc (#1)** từ chữ ký.
3. So sánh hai mã băm:
   - Nếu **trùng khớp**: Tệp còn nguyên vẹn và chữ ký hợp lệ.
   - Nếu **khác nhau**: Tệp đã bị chỉnh sửa, chữ ký sai hoặc khóa công khai không đúng.

> 🖼️ **[ẢNH MINH HỌA TỪ SOURCE CODE CỦA NHÓM]:** 
> - Chụp màn hình Giao diện Demo: Khu vực phần bên PHẢI (Quá trình Xác thực).
> - Chụp khối kết quả "KHỚP ✓" (Màu xanh) và "KHÔNG ✗" (Màu đỏ) để làm nổi bật logic so sánh đối chiếu.
> 
> *(Ghi chú tài liệu thuyết trình: Công thức khôi phục Hash là `Hash = Signature^e mod n`)*

---

## SLIDE 11: DEMO SẢN PHẨM THỰC TẾ (DEMO TIME)
- **Kiến trúc phần mềm:** Lõi Python xử lý nghiệp vụ, chạy cục bộ với HTTP API; giao diện trực quan được dựng bằng HTML/CSS.
- Mời Hội đồng quan sát trực tiếp màn hình demo: 
  1. Trình diễn tạo cặp khóa RSA mới ngẫu nhiên.
  2. Ký thử lên một tệp hợp lệ. 
  3. Sau đó, nhóm sửa một phần nội dung để hệ thống kiểm tra và phát hiện khác biệt.

> 🖼️ **[ẢNH MINH HỌA TỪ SOURCE CODE CỦA NHÓM]:** 
> - Chụp màn hình Tab "TẠO CẶP KHÓA RSA" hiển thị các chuỗi khóa ở định dạng PEM/base64.

*(Thực hiện thao tác Demo trình chiếu trên máy chủ hoặc cửa sổ trình duyệt Python)*

---

## SLIDE 12: ĐÁNH GIÁ (ƯU VÀ NHƯỢC ĐIỂM ĐỒ ÁN)
- **Điểm sáng (Chiều sâu kỹ thuật):**
  - Nhóm không dừng ở lý thuyết mà đã tự triển khai luồng băm, ký và xác minh bằng RSA/SHA-256 với PKCS#1 v1.5.
  - Giao diện trực quan giúp người xem theo dõi quy trình xử lý thay vì chỉ quan sát kết quả ở terminal.
- **Hạn chế kỹ thuật hiện tại:** 
  - Chữ ký số hiện vẫn được lưu tách rời khỏi tệp gốc, nên chưa thuận tiện khi chia sẻ và lưu trữ.
  - Để dùng ở quy mô lớn, hệ thống cần tối ưu thêm phần quản lý khóa, nhúng chữ ký và xử lý tệp lớn.

---

## SLIDE 13: ĐỊNH HƯỚNG PHÁT TRIỂN TƯƠNG LAI
- Nhúng chữ ký số vào siêu dữ liệu của tệp lưu trữ, ví dụ EXIF của ảnh hoặc metadata của PDF, để chỉ cần phân phối một tệp duy nhất.
- Kết hợp với **thủy vân số (Digital Watermarking)** để tăng khả năng truy vết khi ảnh bị cắt xén hoặc phát tán lại.
- Công bố `Public Key` trên hạ tầng định danh tin cậy hoặc hệ thống phân tán để giảm phụ thuộc vào trang cá nhân và hạn chế nguy cơ bị giả mạo.

---

## SLIDE 14: XẾP LOẠI HIỆU SUẤT VÀ TỶ LỆ ĐÓNG GÓP NGHIỆM THU
*Công việc được chia chéo đồng thời, mỗi thành viên đều chịu trách nhiệm ở nhiều công đoạn để tạo ra sản phẩm thống nhất cuối cùng.*

| STT | Họ tên sinh viên | Vai trò & Công việc đảm nhận | Đóng góp |
|---|---|---|:---:|
| 1 | Nguyễn Văn A | Nghiên cứu cốt lõi RSA Toán Học. Code module Crypto Core bằng Python (`crypto_sign`, `crypto_verify`), config Linter Typings. Soạn Slides. | **40%** |
| 2 | Trần Thị B | Thiết kế sơ đồ Flowchart, Lập trình Frontend UI/UX Node-based. Ráp hiệu ứng đồ hoạ "Animation Băm dữ liệu quá trình". | **35%** |
| 3 | Lê Văn C | Thiết lập cấu trúc giao tiếp Network HTTP Server Python. Gắn kết API cho Logic và Frontend. Config giả lập Test Case báo lỗi. | **25%** |

---

## SLIDE 15: KẾT THÚC
- **Tài liệu tham khảo tham vấn trong đồ án:** 
  - PKCS #1: RSA Cryptography Specifications (IETF RFC 8017).
  - Tài liệu thư viện Python `cryptography` tại `cryptography.io`.
- Xin chân thành cảm ơn Thầy/Cô và Hội đồng đánh giá đã lắng nghe phần thuyết trình của nhóm!
- **[HỎI ĐÁP / Q&A]**
