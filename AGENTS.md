# Repository Guidelines

## Project Structure & Module Organization

这是一个轻量网页 Canvas 游戏，目前没有构建步骤。入口文件是 `index.html`，它以 ES module 方式加载 `src/main.js`。核心代码位于 `src/`：`game.js` 负责主循环和状态流转，`player.js` 负责玩家移动，`level.js` 定义关卡数据，`renderer.js` 绘制 Canvas 场景，`input.js` 处理键盘输入，`collision.js` 和 `game-rules.js` 放置可测试的规则函数。

测试文件位于 `test/`，按行为或模块命名，例如 `test/collision.test.js`。项目文档位于 `docs/`。页面样式集中在 `styles/main.css`。后续图片、音效等静态资源放入 `assets/`，不要提交 `.DS_Store` 等本机元数据文件。

## Build, Test, and Development Commands

- `npm test`：使用 Node 内置测试框架运行全部测试。
- `npm start`：使用 Node 零依赖静态服务启动本地游戏，地址为 `http://localhost:4173`。
- `PORT=5173 npm start`：使用自定义端口启动服务。

当前没有打包器、安装依赖步骤或生产构建命令。

## Coding Style & Naming Conventions

使用现代 JavaScript ES modules，并写明相对导入路径，例如 `import { createLevel } from "./level.js"`。优先编写小而清晰的行为函数，Canvas 绘制逻辑应留在 `renderer.js`。统一使用两个空格缩进、分号、描述性 `camelCase` 变量和函数名。可调游戏数值使用 `UPPER_SNAKE_CASE` 常量名。

注释应少而有用；优先通过清晰命名表达意图。

## Testing Guidelines

测试使用 Node 内置的 `node:test` 和 `node:assert/strict`。修改玩法规则前，优先为纯逻辑和状态变化补测试。测试文件命名为 `*.test.js`，每个用例只验证一个可观察行为，例如碰撞相交、撞击冷却或扣时规则。

提交前运行 `npm test`。如果功能难以自动化测试，需要补充一次简短的浏览器手动验证。

## Commit & Pull Request Guidelines

当前历史使用简短、祈使式提交信息，例如 `Initial gravity delivery game`。后续继续使用能概括用户可见变化的短句，例如 `Add time pickups`。

Pull Request 应包含简短说明、玩法影响、验证步骤。涉及 Canvas 视觉变化时，附截图或录屏。若有关联 issue，请在描述中链接；如果调整了手感参数，也应提示评审重点试玩。

## Agent-Specific Instructions

遵守现有项目边界。除非任务明确要求，不要引入框架、打包器或资源流水线。避免破坏性清理命令；如需清理生成物或临时文件，先列出候选路径供确认。
