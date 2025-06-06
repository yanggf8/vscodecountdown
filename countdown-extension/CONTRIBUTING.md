# 貢獻指南

感謝您對 VSCode 倒數計時器擴展的關注！我們歡迎各種形式的貢獻，包括但不限於：

- 🐛 錯誤報告
- 💡 功能建議
- 📝 文檔改進
- 🔧 代碼貢獻
- 🧪 測試改進

## 開始之前

在開始貢獻之前，請確保您已經：

1. 閱讀了 [行為準則](CODE_OF_CONDUCT.md)
2. 查看了現有的 [Issues](https://github.com/vscode-countdown-dev/countdown-extension/issues) 以避免重複
3. 熟悉了項目的基本架構和目標

## 開發環境設置

### 前置要求

- Node.js (版本 16 或更高)
- npm 或 yarn
- Visual Studio Code
- Git

### 安裝步驟

1. Fork 並克隆倉庫：
   ```bash
   git clone https://github.com/你的用戶名/countdown-extension.git
   cd countdown-extension
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 在 VSCode 中打開項目：
   ```bash
   code .
   ```

4. 按 `F5` 啟動擴展開發宿主窗口進行測試

## 開發工作流

### 分支策略

- `main` - 主分支，包含穩定版本
- `develop` - 開發分支，包含最新功能
- `feature/功能名稱` - 功能分支
- `bugfix/問題描述` - 錯誤修復分支

### 提交規範

我們使用約定式提交規範。提交訊息應該遵循以下格式：

```
<類型>[可選的作用域]: <描述>

[可選的正文]

[可選的頁腳]
```

**類型包括：**
- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔變更
- `style`: 代碼格式調整（不影響代碼邏輯）
- `refactor`: 代碼重構
- `test`: 測試相關
- `chore`: 建構系統或輔助工具的變動

**示例：**
```
feat(timer): 添加暫停和繼續功能

新增了計時器暫停和繼續的功能，允許用戶在需要時中斷計時器。

Closes #123
```

## 代碼標準

### TypeScript 風格指南

- 使用 TypeScript 進行開發
- 遵循項目的 ESLint 和 Prettier 配置
- 為新功能添加適當的類型定義
- 確保代碼具有良好的可讀性和可維護性

### 代碼檢查

在提交之前，請執行以下命令：

```bash
# 代碼格式檢查
npm run lint

# 代碼格式化
npm run format

# 運行測試
npm run test

# 運行所有檢查
npm run ci
```

## 測試

### 運行測試

```bash
# 運行所有測試
npm run test

# 運行單元測試
npm run test:unit
```

### 添加測試

- 為新功能添加相應的單元測試
- 測試文件應放在 `src/test/unit/` 目錄下
- 使用描述性的測試名稱
- 確保測試覆蓋率不下降

### 測試最佳實踐

- 測試應該是獨立的、可重複的
- 使用 arrange-act-assert 模式
- 模擬外部依賴
- 測試邊界條件和錯誤情況

## 提交 Pull Request

### 準備 PR

1. 確保您的分支是基於最新的 `develop` 分支
2. 運行所有測試並確保通過
3. 更新相關文檔
4. 添加適當的變更記錄

### PR 檢查清單

- [ ] 代碼符合項目風格指南
- [ ] 已添加或更新相關測試
- [ ] 所有測試通過
- [ ] 已更新文檔（如有需要）
- [ ] 提交訊息遵循約定式提交規範
- [ ] PR 描述清晰說明了變更內容

### PR 模板

請在 PR 描述中包含以下資訊：

```markdown
## 變更類型
- [ ] 新功能
- [ ] 錯誤修復
- [ ] 文檔更新
- [ ] 重構
- [ ] 測試改進

## 變更描述
簡要描述此 PR 的變更內容

## 測試
描述如何測試這些變更

## 相關 Issue
Closes #(issue 號碼)

## 截圖（如適用）
```

## 報告錯誤

### 錯誤報告模板

使用 [Issue 模板](https://github.com/vscode-countdown-dev/countdown-extension/issues/new) 報告錯誤時，請包含：

- VSCode 版本
- 操作系統
- 擴展版本
- 重現步驟
- 預期行為
- 實際行為
- 錯誤訊息或截圖

## 功能建議

我們歡迎新功能建議！請在提交建議時：

1. 檢查是否已有類似的建議
2. 清楚描述功能的用途和價值
3. 考慮實現的複雜度和維護成本
4. 提供具體的使用場景

## 文檔貢獻

文檔改進同樣重要：

- 修正錯字或語法錯誤
- 改善說明的清晰度
- 添加使用示例
- 翻譯文檔到其他語言

## 社群

- GitHub Issues: [項目 Issues](https://github.com/vscode-countdown-dev/countdown-extension/issues)
- GitHub Discussions: [項目討論](https://github.com/vscode-countdown-dev/countdown-extension/discussions)

## 許可證

通過貢獻代碼，您同意您的貢獻將使用與項目相同的 [MIT 許可證](LICENSE) 進行許可。

## 感謝

感謝所有貢獻者讓這個項目變得更好！您的貢獻將被記錄在項目的變更記錄中。

---

如果您有任何問題，請隨時通過 GitHub Issues 或 Discussions 與我們聯繫。