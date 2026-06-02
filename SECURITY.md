# Security Policy

## Supported Versions

我们只为以下版本提供安全更新：

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

我们非常重视安全问题。如果你发现了安全漏洞，请**不要**通过公开的 GitHub Issue 报告，而是通过以下方式私下联系我们：

### 联系方式

- **GitHub Security Advisories**: <https://github.com/badhope/TaskFlow/security/advisories/new>
  （推荐 — 支持加密通信，公开披露前给我们修复时间）

- **Issue 标签**: 提交 [Issue](https://github.com/badhope/TaskFlow/issues/new) 时使用 `security` 标签

### 报告内容

请在报告中尽可能包含以下信息：

1. **漏洞类型**（XSS / CSRF / 数据泄露 / 远程代码执行等）
2. **受影响的版本**
3. **复现步骤**（含 PoC 代码或截图）
4. **潜在影响**（攻击场景）
5. **建议修复方案**（如有）

### 响应时间承诺

| 阶段 | 时间 |
|------|------|
| 首次确认收到报告 | 48 小时内 |
| 初步评估与严重性评级 | 7 天内 |
| 修复方案制定 | 14 天内 |
| 修复发布 | 视严重性而定，最长 30 天 |

我们会在修复发布后公开致谢报告者（除非你选择匿名）。

## 安全最佳实践

使用本项目时的安全建议：

- **本地优先数据**：TaskFlow 所有数据存储在 AsyncStorage（本地），不发送到任何服务器
- **HTTPS Only**：Web 部署强制 HTTPS
- **依赖审计**：`npm audit` 定期检查
- **CSP**：Web 构建包含 Content-Security-Policy 头

## 已知安全考虑

- **Web 端 localStorage**：跨子域场景下浏览器可能隔离，请使用同源部署
- **依赖供应链**：`npm install` 请使用 lock 文件固定版本

---

感谢你帮助我们让 TaskFlow 更安全！🔒
