# 对话迁移摘要：反重力快递

## 当前项目

项目名：反重力快递

类型：网页 Canvas 动作挑战小游戏

当前阶段：项目启动完成，已有轻量项目骨架、设计文档、路线图和最小可运行 Canvas 雏形。

## 已确定的核心方向

玩家控制一台绑着纸箱的小型快递飞行器，在城市楼道中赶单。游戏目标是在倒计时结束前到达终点，过程中需要躲避障碍、拾取时间包。

## 操作方式

- `ArrowLeft`：向左移动
- `ArrowRight`：向右移动
- `Space`：切换重力方向

## 第一版玩法范围

MVP 包含：

- 一个网页小游戏
- 一个限时送达关卡
- 左右移动
- 空格切换重力
- 障碍物
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
  styles/
    main.css
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
- 玩家左右移动
- 空格切换重力
- 上下边界限制
- 简单城市楼道背景
- 纸箱快递飞行器的几何绘制
- 倒计时和进度 UI
- 重开按钮

尚未实现：

- 障碍物生成和绘制
- 碰撞检测
- 撞击扣时间
- 时间包
- 到达终点后的完整状态界面
- 成功/失败后的输入控制
- 音效

## 下一步建议

下一步做“里程碑 3：关卡与障碍”：

1. 在 `src/level.js` 中定义第一版障碍物数据。
2. 在 `src/renderer.js` 中绘制障碍物。
3. 新建或扩展碰撞检测逻辑。
4. 在 `src/game.js` 中处理撞击扣时间。
5. 加入撞击冷却，避免连续扣时间。

## 迁移后的继续方式

在新目录开启新对话时，可以让 Codex 读取：

- `README.md`
- `docs/design.md`
- `docs/roadmap.md`
- `docs/conversation-summary.md`

然后从“里程碑 3：关卡与障碍”继续开发。

