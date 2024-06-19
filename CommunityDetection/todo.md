# Cơ sở lý thuyết (Preliminaries)

- Trình bày về Girvan-Newman.
    - Các bước cơ bản 
    - Cách định nghĩa edge betweenness (là mở rộng của vertex betweenness cho cạnh)
    - Làm ví dụ (hệt như trong đồ án, nếu muốn thì thêm một cạnh)
    - Nêu độ phức tạp của giải thuật (thời gian/không gian) -> Dùng được cho đồ thị lớn đến mức nào
      thì còn khả thi?

    * Nói chung mục này gần như cóp hết phần trong đồ án qua được, vì cũng chỉ là miêu tả cùng một
    cái. Ví dụ trong đồ án tui thấy cũng gần như đơn giản hết mức có thể rồi, nên khó mà lấy ví dụ
    khác đơn giản hơn (nếu có thì phải làm một ví dụ phức tạp hơn).


- Các độ đo centrality khác (centrality thường dược định nghĩa là độ kết nối - tầm quan trọng của
một đỉnh trong đồ thị, được tính bằng nhiều cách khác nhau, trong đó betweenness là một cách đặt).
    - Phần này mở rộng, thích thì thêm, tui thấy không liên quan trực tiếp tới phần mình làm
    Girvan-Newman.

- Làm sao đánh giá kết quả của thí nghiệm? 
    - Bằng độ đo modularity (networkx có hàm, định nghĩa xem ở
    https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.community.quality.modularity.html#networkx.algorithms.community.quality.modularity).
    Nếu muốn nhanh thì định nghĩa hệt vậy mình khỏi phải implement gì kết).

Xem thêm:
- https://en.wikipedia.org/wiki/Girvan%E2%80%93Newman_algorithm
- https://memgraph.github.io/networkx-guide/algorithms/community-detection/girvan-newman
- https://en.wikipedia.org/wiki/Centrality
- https://memgraph.github.io/networkx-guide/algorithms/centrality-algorithms
- Coi 4.1 trong paper này - đánh giá chất lượng của community: https://arxiv.org/pdf/1812.06598.pdf

# Phương pháp tiếp cận (Approaches)

- Miêu tả tập dữ liệu cần chọn 
    - Cạnh đỉnh biểu thị điều gì?
    - Số cạnh, số đỉnh?
    - Có paper nào phân tích tập dữ liệu này hay chưa? Kết quả của paper đó thể nào?
    - Mục tiêu cần thưc hiện trên tập dữ liệu là gì?

- Giải thuật
    - Viết mã giả cho giải thuật Girvan-Newman.
    - Hiện thực thế nào? (ngôn ngữ, thư viện)
    - (nếu có) Tiền xử lý dữ liệu đầu vào như thế nào?

Xem thêm:
- Đồ án mẫu
- Chi tiết về tập dữ liệu và paper liên quan (nếu có)

# Kết quả thí nghiệm

- Làm code, tạo và xử lý kết quả.

- Kết quả thực hiện thí nghiệm?
    - Với các tham số khác nhau
    - Phân tích ý nghĩa của kết quả thu được

Xem thêm:
- https://ona-book.org/community.html#community
- https://memgraph.github.io/networkx-guide/algorithms/community-detection/girvan-newman
- https://networkx.org/documentation/stable/tutorial.html
