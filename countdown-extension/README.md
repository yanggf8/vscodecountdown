# VSCode 倒數計時器 / VSCode Countdown Timer

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/vscode-countdown-dev/countdown-extension)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VSCode](https://img.shields.io/badge/VSCode-1.75.0+-orange.svg)](https://code.visualstudio.com/)

功能豐富的 VSCode 倒數計時器擴展，支援計時器管理、歷史記錄和統計功能。完美適用於番茄工作法、時間管理和專注工作。

A feature-rich VSCode countdown timer extension with timer management, history tracking, and statistics. Perfect for Pomodoro Technique, time management, and focused work sessions.

## ✨ 主要功能 / Key Features

### 🎯 核心計時功能 / Core Timer Features

- **智能計時器控制** - 啟動、暫停、恢復、停止倒數計時
- **自訂時間設定** - 支援 1 秒到 24 小時的任意時間設定
- **預設時間選項** - 內建番茄鐘、休息時間等常用預設
- **自訂完成訊息** - 個人化的計時完成提醒訊息

### 📊 歷史與統計 / History & Statistics

- **計時歷史記錄** - 自動保存所有計時會話記錄
- **詳細統計資料** - 總次數、完成率、平均時長等數據
- **歷史記錄管理** - 查看、重新開始、刪除歷史記錄
- **智能數據持久化** - 資料自動保存到 VSCode 全域狀態

### 🎨 用戶介面 / User Interface

- **狀態欄整合** - 即時顯示計時進度和剩餘時間
- **多種顯示格式** - mm:ss、中文格式、簡潔/詳細模式
- **進度條顯示** - 視覺化計時進度指示器
- **直觀圖標** - 清晰的狀態欄圖標和命令圖標

### 🔧 高級配置 / Advanced Configuration

- **通知系統** - 完成提醒、聲音通知、警告提醒
- **快速啟動** - 一鍵快速開始常用時間設定
- **鍵盤快捷鍵** - 完整的快捷鍵支援
- **可自訂預設** - 個人化預設時間和訊息

## 🚀 快速開始 / Quick Start

### 安裝 / Installation

1. **從 VSCode 市場安裝**

   ```text
   在 VSCode 中按 Ctrl+Shift+X 開啟擴展面板
   搜尋 "VSCode 倒數計時器" 並安裝
   ```

2. **從源代碼安裝**

   ```bash
   git clone https://github.com/vscode-countdown-dev/countdown-extension.git
   cd countdown-extension
   npm install
   npm run compile
   ```

### 基本使用 / Basic Usage

1. **快速開始** - 點擊狀態欄的 ⏰ 圖標或開啟命令面板搜尋 "快速開始"
2. **自訂計時** - 開啟命令面板 (`Ctrl+Shift+P`)，輸入 "開始計時器"
3. **管理計時器** - 使用暫停/恢復/停止命令控制計時器
4. **查看歷史** - 開啟命令面板搜尋 "歷史記錄"

## 📋 命令列表 / Command List

| 命令 / Command | 快捷鍵 / Shortcut | 說明 / Description |
|---|---|---|
| `倒數計時器: 開始計時器` | 可自訂 | 開始新的倒數計時器 |
| `倒數計時器: 快速開始` | 可自訂 | 從預設選項快速開始計時 |
| `倒數計時器: 暫停計時器` | 可自訂 | 暫停當前運行的計時器 |
| `倒數計時器: 繼續計時器` | 可自訂 | 恢復暫停的計時器 |
| `倒數計時器: 停止計時器` | 可自訂 | 停止當前計時器 |

### 🔧 自訂快捷鍵 / Custom Shortcuts

**方法一：啟用建議快捷鍵**
在設定中啟用 `countdown.enableKeyboardShortcuts`，使用以下快捷鍵：
- `Ctrl+Alt+T` (Mac: `Cmd+Alt+T`) - 快速開始
- `Ctrl+Alt+H` (Mac: `Cmd+Alt+H`) - 查看歷史

**方法二：完全自訂**
在 VSCode 鍵盤快捷鍵設定中搜尋 "countdown" 並自訂您偏好的按鍵組合

## ⚙️ 配置選項 / Configuration Options

### 基本設定 / Basic Settings

```json
{
  "countdown.defaultTimer": {
    "minutes": 25,
    "seconds": 0
  },
  "countdown.showProgressBar": true,
  "countdown.historyLimit": 50,
  "countdown.autoSaveHistory": true,
  "countdown.enableKeyboardShortcuts": false
}
```

### 通知設定 / Notification Settings

```json
{
  "countdown.notifications": {
    "enabled": true,
    "sound": true,
    "showCountdownWarning": true,
    "warningTime": 60
  }
}
```

### 顯示設定 / Display Settings

```json
{
  "countdown.statusBarFormat": "mm:ss",
  "countdown.quickStartPresets": [
    { "name": "番茄鐘", "minutes": 25, "seconds": 0 },
    { "name": "短休息", "minutes": 5, "seconds": 0 },
    { "name": "長休息", "minutes": 15, "seconds": 0 },
    { "name": "專注時間", "minutes": 45, "seconds": 0 }
  ]
}
```

### 設定選項說明 / Configuration Details

| 設定項目 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| `countdown.defaultTimer` | object | `{minutes: 25, seconds: 0}` | 預設計時器時間 |
| `countdown.showProgressBar` | boolean | `true` | 是否顯示進度條 |
| `countdown.historyLimit` | number | `50` | 歷史記錄數量限制 (1-500) |
| `countdown.notifications.enabled` | boolean | `true` | 啟用通知 |
| `countdown.notifications.sound` | boolean | `true` | 啟用聲音通知 |
| `countdown.notifications.warningTime` | number | `60` | 警告提醒時間 (秒) |
| `countdown.statusBarFormat` | string | `"mm:ss"` | 狀態欄顯示格式 (四種選項) |
| `countdown.autoSaveHistory` | boolean | `true` | 自動保存歷史記錄 |
| `countdown.enableKeyboardShortcuts` | boolean | `false` | 啟用鍵盤快捷鍵 |

## 📖 使用指南 / User Guide

### 🎯 番茄工作法 / Pomodoro Technique

VSCode 倒數計時器完美支援番茄工作法：

1. **開始番茄鐘** - 使用快速開始選擇 "🍅 25 分鐘" 預設
2. **專注工作** - 在狀態欄查看剩餘時間，保持專注
3. **短休息** - 完成後選擇 "☕ 15 分鐘" 休息
4. **查看統計** - 使用統計功能追蹤每日效率

### 📊 歷史記錄功能 / History Features

- **自動記錄** - 每次計時會話自動保存到歷史
- **重新開始** - 從歷史記錄快速重新開始相同時長的計時
- **篩選查看** - 支援搜尋和篩選歷史記錄
- **數據分析** - 查看完成率和平均時長統計

### 🔧 進階使用技巧 / Advanced Tips

1. **自訂預設** - 在設定中配置您常用的時間預設
2. **快捷操作** - 記住常用快捷鍵提高效率
3. **狀態監控** - 利用狀態欄即時了解計時進度
4. **批量管理** - 使用歷史記錄功能管理多個計時會話

## 🔧 開發指引 / Development Guide

### 環境需求 / Requirements

- Node.js 16.0+
- VSCode 1.75.0+
- TypeScript 4.4+

### 開發設置 / Development Setup

```bash
# 1. 複製倉庫
git clone https://github.com/vscode-countdown-dev/countdown-extension.git
cd countdown-extension

# 2. 安裝依賴
npm install

# 3. 編譯 TypeScript
npm run compile

# 4. 啟動監視模式 (開發時)
npm run watch

# 5. 運行測試
npm test

# 6. 建立擴展包
npm run package
```

### 專案結構 / Project Structure

```text
countdown-extension/
├── src/
│   ├── extension.ts      # 主擴展邏輯
│   ├── countdown.ts      # 計時器核心功能
│   └── types/
│       └── index.ts      # TypeScript 類型定義
├── package.json          # 擴展配置和依賴
├── tsconfig.json         # TypeScript 配置
└── README.md            # 本文檔
```

### 核心架構 / Core Architecture

- **[`extension.ts`](src/extension.ts:1)** - 擴展啟動點，註冊命令和事件處理
- **[`countdown.ts`](src/countdown.ts:1)** - [`Countdown`](src/countdown.ts:5) 類實現核心計時邏輯
- **[`types/index.ts`](src/types/index.ts:1)** - [`CountdownOptions`](src/types/index.ts:17), [`CountdownState`](src/types/index.ts:2) 等類型定義

## 🐛 故障排除 / Troubleshooting

### 常見問題 / Common Issues

**Q: 計時器沒有顯示在狀態欄**
A: 請確認擴展已正確安裝並啟用，重新載入 VSCode 窗口

**Q: 快捷鍵不工作**
A: 檢查是否有快捷鍵衝突，可在鍵盤快捷鍵設定中自訂

**Q: 歷史記錄消失**
A: 歷史記錄保存在 VSCode 全域狀態中，請確認 `autoSaveHistory` 設定為 true

**Q: 通知不顯示**
A: 檢查 VSCode 通知設定和擴展通知配置

### 回報問題 / Report Issues

如果遇到問題，請在 [GitHub Issues](https://github.com/vscode-countdown-dev/countdown-extension/issues) 回報，並提供：

- VSCode 版本
- 擴展版本
- 錯誤訊息或截圖
- 重現步驟

## 🤝 貢獻指南 / Contributing

我們歡迎所有形式的貢獻！

### 貢獻方式 / How to Contribute

1. **回報錯誤** - 在 GitHub Issues 中回報問題
2. **功能建議** - 提出新功能想法和改進建議
3. **代碼貢獻** - 提交 Pull Request 改進代碼
4. **文檔改善** - 協助改善文檔和使用指南

### 開發流程 / Development Workflow

```bash
# 1. Fork 專案並複製到本地
git clone https://github.com/your-username/countdown-extension.git

# 2. 創建功能分支
git checkout -b feature/new-feature

# 3. 進行開發和測試
npm run watch    # 開發模式
npm test        # 運行測試

# 4. 提交變更
git commit -m "Add new feature"
git push origin feature/new-feature

# 5. 創建 Pull Request
```

### 代碼規範 / Code Standards

- 使用 TypeScript 進行開發
- 遵循 ESLint 配置
- 添加適當的註釋和文檔
- 確保所有測試通過

## 📄 版本歷史 / Changelog

### v0.2.0 (Current)

- ✨ 基礎倒數計時功能
- ✨ 暫停/恢復功能
- ✨ 快速開始預設選項
- ✨ 歷史記錄和統計
- ✨ 狀態欄整合
- ✨ 完整快捷鍵支援
- ✨ 可自訂通知系統

## 📜 許可證 / License

本專案採用 [MIT 許可證](LICENSE)。

## 🙏 致謝 / Acknowledgments

感謝所有貢獻者和使用者的支持！

## 📞 聯絡方式 / Contact

- **GitHub**: [vscode-countdown-dev/countdown-extension](https://github.com/vscode-countdown-dev/countdown-extension)
- **Issues**: [回報問題](https://github.com/vscode-countdown-dev/countdown-extension/issues)
- **Discussions**: [討論區](https://github.com/vscode-countdown-dev/countdown-extension/discussions)

---

**享受高效的時間管理體驗！🎯**
**Enjoy efficient time management! 🎯**
