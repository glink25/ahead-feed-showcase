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

## 协议覆盖

三个源合起来覆盖 v0.1 的全部时间表达方式，用于验证客户端不会「假精确」：

| 能力 | 样例事件 |
| --- | --- |
| `exact` | 中秋节、圣诞节、CES |
| `datetime` + `timezone` | 苹果秋季发布会 |
| `month` | WWDC 2027 |
| `quarter` | GTA VI |
| `year` | 上古卷轴 VI |
| `range` | Steam 秋季特卖 |
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

事件的 `media[].path` 指向 Wikimedia Commons 的直链图片，均为 CC0 / 公有领域 / CC BY / CC BY-SA 许可。每张图的出处、作者与许可记录在对应事件的 `evidence` 中，`kind` 为 `citation`。同一主题的事件可以共用能够代表该主题的海报。

客户端可以通过隐私设置禁用远程图片加载（`settings.privacyRemoteImages`）。

## 数据准确性

日期以官方公告为准，未定档的条目使用 `unknown` 而不是猜测的日期。`confidence` 字段区分 `confirmed` / `likely` / `rumored`，`source` 与 `evidence` 记录依据。发现错误欢迎提 Issue。

中国放假安排只按国务院每年发布的通知人工录入。农历节日本身与官方假期分开表达；未来年份尚未发布通知时，不推算连休天数或调休日期。天象条目给出适合关注的极大夜，实际可见性取决于所在地、月光和天气。

“末日预言观察站”用于考据和科学素养，不认可其中的超自然预言。风险事实优先引用 NASA 等监测机构；末日钟明确视为风险警示符号，而不是准确预言。

## 标签约定

标签 ID 是跨语言稳定的推荐键，展示名称由每个 feed 的 `tags[].label` 提供。主题标签说明内容，地区标签说明主要发生地，参与方式标签说明能否在线、免费或户外参与。事件只声明当前 feed 已定义的标签。

## 年度维护清单

1. 国务院发布下一年度通知后，逐项抄录放假起止日和补班日并双人核对，不复制上一年规则。
2. 逐年核查天象极大期、活动主办方日历和赛事赛程；日期未确认时降低 `confidence`，不伪造精度。
3. 检查引用仍可访问、图片许可与署名完整、中英文案齐全、事件标签均已定义。
4. 运行 Ahead schema 校验和客户端构建，再更新 Market 条目。

## 许可

事件数据以 CC0 发布。海报图片的许可见各自的 `citation` 署名。
