重建回答「头发长什么样」，反向规划回答「从现在的发型出发，要做哪些操作」。下面是研究初稿的一组实验：以波浪长发 `big_wavy1` 为起点、短卷发 `short_curly1` 为目标，在 145,304 根发丝上预测剪发、烫发、定型和干剪后的几何形状。

<div class="planning-score">
<p><span>三视图轮廓 IoU</span><strong>0.452 <span aria-hidden="true">→</span> 0.846</strong></p>
<p>完整方案与目标轮廓更接近。这个指标衡量正面、侧面和顶面的轮廓重合度，不代表卷度、发量或实际剪烫效果。</p>
</div>

### 从目标反推操作

<figure class="planning-method">
<img src="static/assets/monohair/planning-method.svg" width="600" height="420" loading="lazy" alt="对齐目标后提取卷度、发流和占据体积，分别反推卷杠、定型路径和参考长度，再由几何求解器拟合剪法并预测结果。">
<figcaption>方法示意 · 根据稿件图 2 重绘</figcaption>
</figure>

先把目标重建对齐到当前头部，不要求发丝逐根对应。**卷度**用来选卷杠，**发流**决定定型后的走向，沿路径走出**目标体积**的位置给出参考剪长，再补偿卷曲造成的回缩。几何求解器把逐根长度拟合成少数剪法，并对不可逆的剪过头施加更大惩罚。

<ol class="planning-steps" aria-label="完整方案的四类操作">
<li><span>01</span><strong>剪出大形</strong><small>8 步常规剪法</small></li>
<li><span>02</span><strong>分区烫发</strong><small>5 个分区</small></li>
<li><span>03</span><strong>顺发流定型</strong><small>调整发丝走向</small></li>
<li><span>04</span><strong>干剪修形</strong><small>按预测轮廓收尾</small></li>
</ol>

### 走向和长度一样重要

同一组目标剪长和卷杠参数，只剪加烫得到 **0.632**，完整方案达到 **0.846**。单靠剪短和烫卷，不能把原先偏在脸侧的发丝移到目标需要的位置。

<figure class="planning-chart">
<figcaption>三视图轮廓 IoU · 根据稿件图 4 重绘</figcaption>
<ul aria-label="各方案的轮廓交并比，范围 0 到 1">
<li><span>原发型</span><meter min="0" max="1" value="0.452" aria-label="原发型 IoU">0.452</meter><b>0.452</b></li>
<li><span>只剪</span><meter min="0" max="1" value="0.588" aria-label="只剪 IoU">0.588</meter><b>0.588</b></li>
<li><span>剪 + 烫</span><meter min="0" max="1" value="0.632" aria-label="剪加烫 IoU">0.632</meter><b>0.632</b></li>
<li><span>早期方案</span><meter min="0" max="1" value="0.758" aria-label="无定型的早期方案 IoU">0.758</meter><b>0.758</b></li>
<li class="planning-full"><span>完整方案</span><meter min="0" max="1" value="0.846" aria-label="完整方案 IoU">0.846</meter><b>0.846</b></li>
<li class="planning-upper"><span>复制目标上限</span><meter min="0" max="1" value="0.943" aria-label="逐根复制目标的参考上限 IoU">0.943</meter><b>0.943</b></li>
</ul>
</figure>

### Agent 会找方案，也会找捷径

单步实验中，Agent 调用几何求解器时完成了接近流水线的剪法；自行填写手法参数的表现较弱。全流程里限制干剪总量时，最佳 Agent 单次结果是 **0.810**，同条件下自动流水线是 **0.789**。解除限制后的高分不能作同样解读。

<aside class="planning-caveat" aria-label="如何解读最高分">
<p><strong>0.919 不是可执行的理发方案。</strong> 这次运行跳过常规剪发和烫发，只做定型与干剪。模型允许定型沿目标发流替换原有波浪，也允许不受限地逐根精剪；两项假设都比现实宽松。</p>
</aside>

**验证范围**：以上结果只覆盖一对发型，是静态几何预测，未运行发丝动力学，也没有真实剪烫实验。Agent 每种设置仅运行 1–3 次。下方放映室是单独的早期剪发演示，不是这组剪烫规划结果的实拍验证。
