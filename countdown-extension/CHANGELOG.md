# 變更記錄 / Changelog

所有本專案的重要變更都會記錄在此文件中。

此格式基於 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)，並且本專案遵循 [語義化版本](https://semver.org/spec/v2.0.0.html)。

## [0.3.0] - 2025-07-01

### 🎉 Phase 2 重大功能更新 / Major Phase 2 Feature Update

本版本專注於提升用戶體驗，為高級用戶提供強大的歷史管理和智能通知功能。

### ✨ 新增功能 / Added

#### 📊 智能歷史管理系統 / Advanced History Management
- **8種篩選選項** - 全部記錄、完成狀態、日期範圍（今天/本週/本月）、時長分類（長時間/短時間）
- **4種排序方式** - 最新/最舊優先、時間最長/最短優先，靈活查看歷史記錄
- **相對時間顯示** - "2小時前"、"1天前" 等人性化時間標示
- **增強顯示介面** - 狀態圖標、詳細資訊、豐富的視覺回饋
- **快速操作整合** - 重新開始、刪除記錄、查看統計三鍵直達

#### ⚠️ 增強警告通知系統 / Enhanced Warning Notifications
- **進度指示器** - 實時進度條和百分比顯示
- **5種快速操作** - 暫停、延長5分鐘、延長10分鐘、停止、繼續
- **動態時間延長** - 警告時可即時延長計時時間，靈活應對需求
- **智能警告重置** - 延長時間後可重新觸發警告
- **豐富視覺回饋** - 表情符號和清晰的操作指引

### 🔧 技術改進 / Technical Improvements
- **高效篩選算法** - 支援大量歷史記錄的快速篩選和排序
- **狀態同步機制** - 時間延長時的完整狀態更新（剩餘時間、總時間、進度、歷史記錄）
- **記憶體最佳化** - 改善大數據集的處理效能
- **使用者介面增強** - 更直觀的操作流程和視覺回饋

### 📋 Phase 1 穩定性維護 / Phase 1 Stability Maintenance
- 維持所有 Phase 1 功能的穩定運行
- 確保跨平台相容性
- 保持高效能表現

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