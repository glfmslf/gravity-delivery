# Arcade Collision Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为有效障碍撞击加入 `60ms` 精确停顿、强震动、红色闪光和固定轨迹火花。

**Architecture:** 新建 `src/hit-effects.js` 管理纯数据的撞击效果状态和时间推进，并返回停顿后可用于游戏模拟的剩余帧时间。`src/game.js` 创建和推进效果；`src/renderer.js` 读取效果状态，移动场景坐标并绘制火花及屏幕闪光。

**Tech Stack:** 原生 JavaScript ES modules、Canvas 2D、Node `node:test`

---

### Task 1: 撞击效果状态

**Files:**
- Create: `src/hit-effects.js`
- Create: `test/hit-effects.test.js`

- [x] **Step 1: 写创建、停顿、衰减和火花测试**

测试要求：

- 创建状态时 `pauseRemaining` 为 `0.06`、`durationRemaining` 为 `0.32`。
- 创建 10 个固定火花，并验证多数火花的 `velocityX < 0`。
- 以 `0.05` 秒推进时，`simulationDelta` 为 `0`。
- 再以 `0.05` 秒推进时，`simulationDelta` 为 `0.04`，停顿归零。
- 较晚时刻的震动幅度和闪光强度小于较早时刻。
- 效果结束后返回 `effect: null` 和完整 `simulationDelta`。

- [x] **Step 2: 运行 `node --test test/hit-effects.test.js`，确认模块缺失导致红灯**

- [x] **Step 3: 实现常量和纯函数**

导出：

```js
export const HIT_PAUSE_SECONDS = 0.06;
export const HIT_EFFECT_SECONDS = 0.32;
export function createHitEffect({ x, y }) {}
export function advanceHitEffect(effect, deltaSeconds) {}
export function getHitEffectVisuals(effect) {}
```

`advanceHitEffect()` 必须先从帧时间中扣除停顿，再把剩余时间作为 `simulationDelta` 返回。效果总时间始终按真实帧时间递减。

- [x] **Step 4: 运行单文件测试和全部测试，确认通过**

### Task 2: 接入游戏循环

**Files:**
- Modify: `src/game.js`

- [x] **Step 1: 初始状态增加 `hitEffect: null`**
- [x] **Step 2: 每个 playing 帧先调用 `advanceHitEffect()`，使用返回的 `simulationDelta` 推进倒计时、距离和玩家物理**
- [x] **Step 3: 停顿帧继续调用 `input.consumeStartRequest()`，但不调用玩家更新，从而保留重力翻转队列**
- [x] **Step 4: 有效撞击时以玩家前缘中心创建效果**
- [x] **Step 5: 运行全部测试**

### Task 3: Canvas 街机反馈

**Files:**
- Modify: `src/renderer.js`

- [x] **Step 1: 用 `getHitEffectVisuals()` 获取震动偏移、闪光强度和火花**
- [x] **Step 2: 在 `context.save()` 范围内平移整个游戏场景，结束态遮罩不参与震动**
- [x] **Step 3: 绘制 10 个随时间移动、缩小和淡出的黄白/橙红火花**
- [x] **Step 4: 最后绘制红色全屏闪光和暗红边缘**
- [x] **Step 5: 运行全部测试**

### Task 4: 文档与浏览器验证

**Files:**
- Modify: `README.md`
- Modify: `docs/design.md`
- Modify: `docs/roadmap.md`
- Modify: `docs/conversation-summary.md`

- [x] **Step 1: 同步街机撞击反馈和 `60ms` 停顿说明**
- [x] **Step 2: 运行 `git diff --check` 和 `npm test`**
- [x] **Step 3: 启动 `npm start`，在桌面和 `390×760` 视口触发或模拟撞击**
- [x] **Step 4: 检查控制台错误、横向溢出和特效持续时间**
- [x] **Step 5: 关闭浏览器和本地服务，确认 `package-lock.json` 未被暂存或修改**
