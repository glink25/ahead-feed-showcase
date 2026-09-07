# ahead-feed-showcase

Ahead / 盼头 的官方示例事件源，用真实内容压测 [Open Event Feed](https://github.com/glink25/ahead) v0.1 协议的表达力。

## 事件源

一个仓库承载多个独立的 event feed，各自作为 Market 条目单独上架。内容不只记录“大日子”，也收集那些会让普通一天变得值得等待的真实活动。

| Manifest | Feed | 内容 |
| --- | --- | --- |
| `feeds/gaming.yaml` | 值得等的游戏发售 | 大作发售、延期、折扣季 |
| `feeds/tech.yaml` | 科技发布会 | 硬件发布会与开发者大会 |
| `feeds/holidays.yaml` | 节日与假期 | 每年重复的节日与法定假期 |
| `feeds/china-holidays.yaml` | 中国官方假期 | 国务院逐年公布的放假区间与调休 |
| `feeds/east-asian-festivals.yaml` | 东亚节庆 | 日本、韩国文化节庆 |
| `feeds/world-festivals.yaml` | 世界节庆 | 多地区文化与季节庆典 |
| `feeds/screen-and-film.yaml` | 银幕与影展 | 电影节、片单与颁奖礼 |
| `feeds/music-live.yaml` | 一起听现场 | 音乐日、演出与共同聆听 |
| `feeds/sports-moments.yaml` | 等一个赛点 | 全球重要与特色赛事 |
| `feeds/skywatching.yaml` | 抬头看天 | 流星雨与共同观测夜 |
| `feeds/nature-watch.yaml` | 等自然发生 | 观鸟和公众自然观察 |
| `feeds/museum-art.yaml` | 博物馆开到很晚 | 博物馆夜与公共艺术 |
| `feeds/books-fantasy.yaml` | 书页里的节日 | 阅读社群、书展与幻想传统 |
| `feeds/science-geek.yaml` | 科学家的节日 | 数学、科学与开源活动 |
| `feeds/unexpected-traditions.yaml` | 居然还有这种节 | 有出处的冷门趣味传统 |
| `feeds/doomsday-lore.yaml` | 末日预言观察站 | 末日说法、科学澄清与技术期限 |
| `feeds/opening-soon.yaml` | 终于要开了 | 新馆、新空间与重新开放 |
| `feeds/rail-openings.yaml` | 等一列还没开来的车 | 地铁新线、延伸段与新服务 |
| `feeds/space-journeys.yaml` | 等它抵达另一颗星球 | 航天抵达、入轨与科学阶段 |
| `feeds/hobby-gatherings.yaml` | 同好们要集合了 | Maker、钢笔等兴趣圈线下聚会 |
| `feeds/theme-park-watch.yaml` | 这次真的开园了 | 新过山车、新园区与经典设施回归 |
| `feeds/seasonal-bites.yaml` | 等这一口 | 真实产季、上市与季节饮食节点 |
| `feeds/photo-windows.yaml` | 一年只出现几天的画面 | 光线、天气与地形形成的摄影窗口 |
| `feeds/last-chance.yaml` | 趁它还在 | 最后运营、永久关闭与告别活动 |
| `feeds/human-firsts.yaml` | 那天以后就不是未来了 | 可验证的首次开放、抵达与投入使用 |
| `feeds/stationery-year.yaml` | 文具人的一年 | 用人群身份组织手帐、钢笔与纸笔盼头 |

## 选题原则

新增 feed 不以“大众”或“小众”作为唯一判断标准，而看是否存在真实的等待行为：有人会主动记住日期、安排时间、为它倒数。优先选择有稳定来源、能持续更新、并且时间会从模糊窗口逐步变得确定的事件。

**Market 正式 feed 默认目标是同时维持至少 8–12 个仍值得等待的未来事件。** 如果一个方向长期无法达到这一密度，应优先考虑扩大合理边界、与相邻主题合并，或暂不上架；不能用营销纪念日、无可靠来源的小事或明显凑数条目填满列表。对于活动日历、线路建设、航天任务等有结构化官方信息的方向，维护时应优先批量扫描整个未来时间带，而不是逐条零散添加。

对于受天气、自然条件或施工进度影响的内容，使用 `month` / `quarter` / `year` 与 `likely` 表达真实的不确定性；只有官方明确日期时才使用 `exact`。

## 协议覆盖

这些源合起来覆盖 v0.1 的全部时间表达方式，用于验证客户端不会「假精确」：

| 能力 | 样例事件 |
| --- | --- |
| `exact` | 中秋节、圣诞节、CES、博物馆开放日 |
| `datetime` + `timezone` | 苹果秋季发布会、Hobonichi 限定版本开售 |
| `month` | WWDC 2027、Horsetail Fall 摄影窗口 |
| `quarter` | GTA VI、主题乐园春季新设施 |
| `year` | 上古卷轴 VI、尚未公布具体日期的线路开通 |
| `range` | Steam 秋季特卖、Maker Faire、钢笔展 |
| `unknown` | 丝之歌资料片、下一代前沿模型 |
| `recurrence` | 国庆假期、圣诞节 |
| `duration` | 国庆假期（7 天）、春节（8 天）、发布会（90 分钟） |
| 多条 `schedule` entry | GTA VI（年 → 季度 → 延期），苹果发布会（传闻 → 确认） |

## 订阅

```text
github:glink25/ahead-feed-showcase
```

manifest 均位于 `feeds/`，路径见上表。

## 海报与署名

Market 示例源原则上为每个 active 事件提供与事件语义直接相关的高质量远程主图。选图优先级是：**事件 / 主办方官方视觉或现场图 > Wikimedia Commons、NASA、ESA、NPS 等可追溯的事件实景 > 同一地点或同一设施的高质量主题参考图**。如果只能使用“目的地 / 氛围参考”而不是事件成品图，必须在 `evidence` 的 `citation` 中明确说明，避免让用户误以为是尚未建成设施的实拍。

图片应尽量使用来源可追溯、无水印、长边约 1600 px 或以上的版本；不能为了“有图”而使用无关库存图。自然现象优先真实现象照片，航天优先机构任务图，交通优先线路实车 / 车站，兴趣活动优先活动现场或与爱好直接相关的高质量静物。每个事件使用独立 HTTPS 图片地址，并提供中英文 `alt`。来源页、作者 / 许可或官方版权说明记录在对应事件的 `evidence` 中；图片只负责表达，不替代日期、赛程等事实证据。

同一个仓库中的事件卡片原则上不复用同一张 `media[].path`。同一事件因不同订阅逻辑出现在多个 feed 时，也应尽量使用不同但同样可追溯的视觉，避免 Market 浏览时出现连续重复卡片。

客户端可以通过隐私设置禁用远程图片加载（`settings.privacyRemoteImages`）。修改海报后运行唯一性审计：

```sh
node scripts/audit-images.mjs
```

## 数据准确性

日期以官方公告为准，未定档的条目使用 `unknown` 或较粗时间粒度，而不是猜测具体日期。`confidence` 字段区分 `confirmed` / `likely` / `rumored`，`source` 与 `evidence` 记录依据。发现错误欢迎提 Issue。

中国放假安排只按国务院每年发布的通知人工录入。农历节日本身与官方假期分开表达；未来年份尚未发布通知时，不推算连休天数或调休日期。天象与摄影窗口给出适合关注的时间范围，实际可见性取决于所在地、月光、天气、水量等自然条件。

“末日预言观察站”用于考据和科学素养，不认可其中的超自然预言。风险事实优先引用 NASA 等监测机构；末日钟明确视为风险警示符号，而不是准确预言。

## 标签约定

标签 ID 是跨语言稳定的推荐键，展示名称由每个 feed 的 `tags[].label` 提供。主题标签说明内容，地区标签说明主要发生地，参与方式标签说明能否在线、免费或户外参与。事件只声明当前 feed 已定义的标签。

## 年度维护清单

1. 国务院发布下一年度通知后，逐项抄录放假起止日和补班日并双人核对，不复制上一年规则。
2. 逐年核查天象极大期、摄影窗口、活动主办方日历、线路工程节点和赛事赛程；日期未确认时降低 `confidence`，不伪造精度。
3. 对“开业 / 通车 / 新设施 / 告别”类事件持续记录时间窗口收窄过程，让 schedule history 保留等待从模糊到确定的变化。
4. 每轮维护优先批量扫描未来 12–18 个月的官方日历，保证正式 Market feed 尽量维持 8–12 个有效未来事件，而不是等内容跌到只剩几条再补。
5. 检查引用和图片仍可访问、来源说明完整、中英文案齐全、事件标签均已定义，并运行图片唯一性审计。
6. 运行 Ahead schema 校验和客户端构建，再更新 Market 条目。

## 许可

事件数据以 CC0 发布。远程海报由各图片服务提供，使用条件与原始图片许可见对应服务及各事件的 `citation` 说明。
