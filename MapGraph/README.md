# Shortest-path graph exercise

## Problem statements

1.  Khởi tạo dữ liệu ma trận từ bản đồ google map, gồm 1 vùng diện tích
    có tối thiểu 100 đỉnh vs 100 cạnh trong khu vực Tp.HCM. (2)

2.  Cài đặt 3 thuật toán Dijstra, Bellman-Ford, Floyd warshall trên dữ
    liệu khởi tạo và đưa ra đánh giá về performance -- chọn ngẫu nhiên
    các cặp đỉnh (3)

3.  Cho phép nhập điểm đầu và điểm cuối trên bản đồ và xuất ra 3 đường
    đi ngắn nhất. Minh họa 3 đường đi trên bản đồ (google map là 1 điểm
    cộng) (4)

4.  So sánh kết quả giải thuật vs dữ liệu thực tế từ google. (1)

## Tentative plan

- [x] Test OSMnx

- [x] Implement 3 algo (Dijkstra, Bellman-Ford, Floyd-Warshall) in networkx
    - [x] Compare them (run multiple random vertices test - maybe calculate spread of time by histogram)

- [x] Client UI
    - [x] How to choose pair of points on the maps, and send it to backend
    - [x] How to draw paths on map, given sets of points (preferably from the backend)

- [x] Backend
    - [x] Figure out the backend (Flask)
    - [ ] (optional) Read about the k-shortest path problem
    - [ ] (optional) Implement changes/new algo on networkx data structure

- [x] Compare with Google map
    - [ ] (optional) How to draw on Google map using JS
    - [x] Try some test cases
    - [x] Compare results -> try to figure out discrepancies (why is google's solution better?)

- [x] Write report

## Structure

```
.
├── map-ui
├── osmnx-examples
├── osmnx-test
├── perf-test
├── report
├── README.md
└── requirements.txt
```

- `map-ui` contains code for implementing the map UI, including backend code
- `osmnx-examples` is a submodule for [osmnx-examples](https://github.com/gboeing/osmnx-examples),
- `osmnx-test` contains actual test code, running OSMnx for related functionalities.
- `perf-test` contains code for testing routing algorithms performance
- `report` contains content used for reporting this exercise
containing tutorial file for OSMnx usage.
- `README.md` is what you are reading
- `requirements.txt` is needed to install all Python dependencies, since all the code is run within
a virtual environment.
