# 變更記錄 / Changelog

所有本專案的重要變更都會記錄在此文件中。

此格式基於 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，並且本專案遵循 [語義化版本](https://semver.org/spec/v2.0.0.html)。

## [0.2.0] - 2025-06-06

### 🎉 首次正式發佈 / First Official Release

這是 VSCode 倒數計時器擴展的首次正式發佈到 VS Code Marketplace！

### ✨ 新增功能 / Added

- **核心計時功能** / Core Timer Features
  - 基本倒數計時器功能
  - 暫停和恢復計時器
  - 停止計時器功能
  - 自訂時間設定（分鐘和秒數）

- **快速開始預設** / Quick Start Presets
  - 番茄鐘（25分鐘）
  - 短休息（5分鐘）
  - 長休息（15分鐘）
  - 專注時間（45分鐘）

- **歷史記錄功能** / History Features
  - 自動保存計時歷史記錄
  - 查看歷史記錄列表
  - 清除歷史記錄功能
  - 可配置歷史記錄保存數量限制

- **統計功能** / Statistics
  - 計時統計資料查看
  - 總次數和完成率統計
  - 平均時長計算

- **用戶介面** / User Interface
  - 狀態欄整合顯示
  - 多種時間顯示格式（mm:ss, 中文格式等）
  - 進度條顯示
  - 倒數計時選項面板

- **通知系統** / Notification System
  - 計時完成通知
  - 可選聲音通知
  - 倒數警告提醒
  - 可配置警告時間

- **配置選項** / Configuration Options
  - 預設計時器時間設定
  - 通知偏好設定
  - 狀態欄顯示格式
  - 自動保存歷史記錄選項

- **命令支援** / Command Support
  - 完整的命令面板整合
  - 可自訂快捷鍵
  - 豐富的命令選項

### 🔧 技術特性 / Technical Features

- TypeScript 開發
- 完整的測試套件
- ESLint 和 Prettier 代碼規範
- 自動化 CI/CD 流程
- 完整的文檔和使用指南

### 📋 系統需求 / System Requirements

- VS Code 1.75.0 或更高版本
- Node.js 16.0+ （開發環境）

### 🎯 主要用途 / Main Use Cases

- 番茄工作法計時
- 專注工作時間管理
- 休息時間提醒
- 工作效率追蹤

### 🚀 安裝方式 / Installation

```bash
# 從 VS Code Marketplace 安裝
在 VS Code 中搜尋 "VSCode 倒數計時器"

# 或使用命令行
code --install-extension vscode-countdown-dev.countdown-extension
```

### 📖 相關資源 / Resources

- [GitHub Repository](https://github.com/vscode-countdown-dev/countdown-extension)
- [使用指南](README.md)
- [問題回報](https://github.com/vscode-countdown-dev/countdown-extension/issues)

---

## 發佈說明 / Release Notes

這個版本標誌著 VSCode 倒數計時器擴展正式進入 VS Code Marketplace。我們致力於提供穩定、易用且功能豐富的時間管理工具，幫助開發者提高工作效率。

感謝所有測試用戶的反饋和建議！

**享受高效的時間管理體驗！🎯**