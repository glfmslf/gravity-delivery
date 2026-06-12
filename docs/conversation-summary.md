# 对话迁移摘要：反重力快递

## 当前项目

项目名：反重力快递

类型：网页 Canvas 动作挑战小游戏

当前阶段：MVP 试玩版已基本完成，包含反重力手感、障碍、投递门牌、时间包、结束态、重开流程和基础音效。

## 已确定的核心方向

玩家控制一台绑着纸箱的小型快递飞行器，在城市楼道中赶单。游戏目标是在倒计时结束前完成全部绿色门牌投递并到达终点，过程中需要躲避障碍，并拾取黄色时间包延长时间。到达终点但漏送订单会失败。

## 操作方式

- `Space`：切换重力方向

玩家横向位置固定，关卡自动向前滚动。

## 第一版玩法范围

MVP 包含：

- 一个网页小游戏
- 一个限时送达关卡
- 空格切换重力
- 障碍物
- 投递门牌
- 时间包
- 撞击扣时间
- 到达终点成功
- 时间归零失败
- 重开按钮

暂不包含：

- 多关卡
- 排行榜
- 账号或存档
- 商店系统
- 复杂剧情
- 移动端深度适配

## 当前文件结构

```text
.
  README.md
  index.html
  docs/
    design.md
    roadmap.md
    conversation-summary.md
  src/
    main.js
    game.js
    input.js
    player.js
    level.js
    renderer.js
    collision.js
    game-rules.js
    delivery-rules.js
    pickup-rules.js
    audio.js
  styles/
    main.css
  test/
    collision.test.js
    delivery-rules.test.js
    game-rules.test.js
    level.test.js
    pickup-rules.test.js
    player.test.js
  scripts/
    dev-server.js
  assets/
    images/
    sounds/
```

## 当前实现状态

已实现：

- 页面入口
- Canvas 画布
- 游戏主循环
- 键盘输入
- 空格切换重力
- 玩家固定横向跑道
- 垂直速度限制，避免一下冲到顶或到底
- 上下边界限制
- 第一版障碍物数据
- 障碍物绘制
- 玩家 hitbox 碰撞检测
- 撞击扣时间
- 撞击冷却，避免连续扣时间
- 投递门牌数据
- 投递门牌绘制
- 投递判定、加时奖励与完成计数
- 时间包数据
- 时间包绘制
- 时间包拾取、加时奖励与收集状态
- 简单城市楼道背景
- 纸箱快递飞行器的几何绘制
- 倒计时和进度 UI
- 成功/失败 Canvas 结束态
- 成功/失败后冻结游戏更新
- 重开按钮
- 基础 WebAudio 音效：翻转、撞击、投递、拾取、成功、失败
- Node 零依赖本地开发服务：`npm start`
- Node 内置测试：`npm test`
- 贡献者指南：`AGENTS.md`

尚未实现：

- 多关卡
- 排行榜
- 移动端触摸控制
- 图片/音频资源替换

## 下一步建议

下一步做“里程碑 5：第一版体验整理”：

1. 试玩并微调障碍、门牌、时间包的位置和奖励数值。
2. 优化成功/失败状态文案和视觉层级。
3. 补充更明确的试玩说明。
4. 视需要加入移动端触摸控制或更完整的音效资源。

## 迁移后的继续方式

在新目录开启新对话时，可以让 Codex 读取：

- `README.md`
- `docs/design.md`
- `docs/roadmap.md`
- `docs/conversation-summary.md`

然后从“里程碑 5：第一版体验整理”继续开发。
