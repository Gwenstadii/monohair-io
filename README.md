# MonoHair 复现 · 项目展示页

中文版静态展示页，包含可切换视角的剪前／剪后对比、剪烫反向规划摘要及重绘图表、剪发视频和两个重建样例的指标。无需后端或模型权重。

## 预览与部署

在仓库根目录运行 `python -m http.server 8000 --bind 127.0.0.1`，打开 `http://127.0.0.1:8000/`。模板通过 `fetch` 读取内容，请用 HTTP 预览，不要直接双击 `index.html`。

提交并推送到 `Gwenstadii/monohair-io` 的 `main` 后，在 **Settings → Pages** 选择 **Deploy from a branch → main → / (root)**。默认项目站地址为 `https://gwenstadii.github.io/monohair-io/`。本地资源使用相对路径，无需构建步骤。

- 内容与导航：`contents/config.yml` 和各节的 Markdown。
- 展示素材：`static/assets/monohair/`，仅收录项目交接材料中的渲染和 MP4，不含原始数据或私有权重。
- 页面样式：`static/css/project.css`。
- 对比滑杆与视频切换：`static/js/project.js`；对比图沿用交接材料的 `simulated_comparison.png`。
- 反向规划：`contents/planning.md`。展示研究初稿中的方法、单案例测量和限制；未收录仅限组内使用的真人面部渲染。
- 验证：`node --test tests/*.test.js`。

页面基于 [Sen Li 的学术主页模板](https://github.com/senli1073/academic-homepage-template)，保留其 [MIT 许可证](LICENSE)。派生媒体按[原展示材料说明](https://github.com/Snowflake-Pink/monohair-repro/tree/codex/agent-haircut-handover/docs/handover)以 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 用于非商业展示，与模板代码分别授权。
