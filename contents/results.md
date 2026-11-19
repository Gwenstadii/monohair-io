以下指标比较本次复现与作者发布的发丝结果。Chamfer 距离越小，表示两组结果的点集越接近；耗时为复现记录中的单张 H100 测量值。

| 样例 | 发丝数 | Chamfer 距离 | 总耗时 |
| :--- | ---: | ---: | ---: |
| `big_wavy1` · 波浪长发 | 173,205 | 1.82 mm | 约 2.7 h |
| `short_curly1` · 短卷发 | 143,516 | 1.62 mm | 约 2.1 h |

作为参考，MonoHair 作者发布的 `big_wavy1` 两版结果（`full` 与 `full1`）之间的 Chamfer 距离为 2.40 mm。该比较衡量与发布结果的一致性，不是对真实发丝几何的测量。[查看复现记录与完整指标 ↗](https://github.com/Snowflake-Pink/monohair-repro)
