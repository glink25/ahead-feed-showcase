# ahead-feed-showcase

Ahead / 盼头 的官方示例事件源，用真实内容压测 [Open Event Feed](https://github.com/glink25/ahead) v0.1 协议的表达力。

## 事件源

一个仓库承载三个独立的 event feed，各自作为 Market 条目单独上架：

| Manifest | Feed | 内容 |
| --- | --- | --- |
| `feeds/gaming.yaml` | 值得等的游戏发售 | 大作发售、延期、折扣季 |
| `feeds/tech.yaml` | 科技发布会 | 硬件发布会与开发者大会 |
| `feeds/holidays.yaml` | 节日与假期 | 每年重复的节日与法定假期 |

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

manifest 路径分别为 `feeds/gaming.yaml`、`feeds/tech.yaml`、`feeds/holidays.yaml`。

## 海报与署名

事件的 `media[].path` 指向 Wikimedia Commons 的直链图片，均为 CC0 / 公有领域 / CC BY / CC BY-SA 许可。每张图的出处、作者与许可记录在对应事件的 `evidence` 中，`kind` 为 `citation`。

客户端可以通过隐私设置禁用远程图片加载（`settings.privacyRemoteImages`）。

## 数据准确性

日期以官方公告为准，未定档的条目使用 `unknown` 而不是猜测的日期。`confidence` 字段区分 `confirmed` / `likely` / `rumored`，`source` 与 `evidence` 记录依据。发现错误欢迎提 Issue。

## 许可

事件数据以 CC0 发布。海报图片的许可见各自的 `citation` 署名。
