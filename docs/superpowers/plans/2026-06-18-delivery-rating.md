# Delivery Rating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 成功通关后计算并展示 `S/A/B/C` 准时送达评级，同时把评级保存到本机排行榜。

**Architecture:** 新建 `src/rating.js` 承载无副作用的评级规则。`src/game.js` 在成功结算时一次性计算最终分数和评级，写入状态及排行榜；`src/renderer.js` 根据状态绘制大字评级成功界面。旧排行榜数据通过显示层的 `?? "--"` 兼容。

**Tech Stack:** 原生 JavaScript ES modules、Canvas 2D、Node `node:test`、浏览器 `localStorage`

---

### Task 1: 评级规则

**Files:**
- Create: `src/rating.js`
- Create: `test/rating.test.js`

- [x] **Step 1: 写四档评级和边界测试**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { calculateDeliveryRating } from "../src/rating.js";

test("zero hits and full combo earns S", () => {
  assert.deepEqual(calculateDeliveryRating({
    timeLeft: 12,
    maxCombo: 4,
    hitCount: 0,
    totalDeliveries: 4,
  }), { grade: "S", label: "完美送达" });
});

test("one hit with 30 seconds earns A", () => {
  assert.deepEqual(calculateDeliveryRating({
    timeLeft: 30,
    maxCombo: 2,
    hitCount: 1,
    totalDeliveries: 4,
  }), { grade: "A", label: "准时送达" });
});

test("15 seconds earns B", () => {
  assert.deepEqual(calculateDeliveryRating({
    timeLeft: 15,
    maxCombo: 1,
    hitCount: 2,
    totalDeliveries: 4,
  }), { grade: "B", label: "顺利送达" });
});

test("slower successful delivery earns C", () => {
  assert.deepEqual(calculateDeliveryRating({
    timeLeft: 14.9,
    maxCombo: 1,
    hitCount: 2,
    totalDeliveries: 4,
  }), { grade: "C", label: "完成送达" });
});
```

- [x] **Step 2: 运行 `node --test test/rating.test.js`，确认因模块不存在而失败**

- [x] **Step 3: 实现最小评级函数**

```js
export function calculateDeliveryRating({ timeLeft, maxCombo, hitCount, totalDeliveries }) {
  if (hitCount === 0 && maxCombo >= totalDeliveries) {
    return { grade: "S", label: "完美送达" };
  }
  if (hitCount <= 1 && timeLeft >= 30) {
    return { grade: "A", label: "准时送达" };
  }
  if (timeLeft >= 15) {
    return { grade: "B", label: "顺利送达" };
  }
  return { grade: "C", label: "完成送达" };
}
```

- [x] **Step 4: 运行评级测试及全部测试，确认通过**

### Task 2: 成功结算与排行榜

**Files:**
- Modify: `src/game.js`
- Modify: `test/leaderboard.test.js`

- [x] **Step 1: 添加排行榜评级保留及旧记录兼容测试**
- [x] **Step 2: 运行测试，确认新断言失败**
- [x] **Step 3: 成功时计算 `finalScore`、`finalRating`，保存 `rating`，排行榜缺失评级显示 `--`**
- [x] **Step 4: 运行相关测试及全部测试**

### Task 3: 大字评级成功界面

**Files:**
- Modify: `src/renderer.js`

- [x] **Step 1: 将成功和失败绘制拆为独立函数，失败界面保持不变**
- [x] **Step 2: 成功界面绘制标题、大号评级、评级文案、分数、时间、连击、撞击和下一关提示**
- [x] **Step 3: 运行全部自动化测试**
- [x] **Step 4: 启动 `npm start`，在桌面和移动视口验证文字、层级和重开交互**

### Task 4: 文档同步与最终校验

**Files:**
- Modify: `README.md`
- Modify: `docs/design.md`
- Modify: `docs/roadmap.md`
- Modify: `docs/conversation-summary.md`

- [x] **Step 1: 更新评级规则、展示方式和当前实现状态**
- [x] **Step 2: 运行 `git diff --check`**
- [x] **Step 3: 运行 `npm test`，确认零失败**
- [x] **Step 4: 检查 `git status --short`，确保无临时文件进入版本控制**
