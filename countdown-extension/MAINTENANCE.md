# 維護指南

## 概述

本文檔說明 VSCode 倒數計時器擴展的維護策略和操作流程。

## 發佈流程

### 自動發佈

擴展使用 GitHub Actions 進行自動發佈：

1. **建立標籤**：推送符合 `v*.*.*` 格式的標籤觸發發佈
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **自動流程**：
   - 執行測試和檢查
   - 打包擴展
   - 發佈到 VS Code Marketplace
   - 建立 GitHub Release

### 手動發佈

如需手動發佈：

1. **準備環境**
   ```bash
   npm install -g @vscode/vsce
   vsce login <publisher-name>
   ```

2. **發佈步驟**
   ```bash
   npm run ci                    # 執行所有檢查
   npm run package              # 打包擴展
   vsce publish patch           # 發佈 patch 版本
   # 或
   vsce publish minor           # 發佈 minor 版本
   vsce publish major           # 發佈 major 版本
   ```

## 版本管理

### 語義化版本控制

遵循 [語義化版本控制 2.0.0](https://semver.org/lang/zh-TW/)：

- **MAJOR** (主版本)：不相容的 API 變更
- **MINOR** (次版本)：向下相容的功能性新增
- **PATCH** (修訂版本)：向下相容的問題修正

### 分支策略

- `main`：穩定的發佈分支
- `develop`：開發分支
- `feature/*`：功能開發分支
- `hotfix/*`：緊急修復分支

## 依賴管理

### 自動更新

使用 Dependabot 自動管理依賴：

- 每週一檢查更新
- 自動建立 PR
- 分組相關依賴
- 忽略主要版本更新

### 手動檢查

定期執行安全審計：

```bash
npm audit                     # 檢查安全漏洞
npm audit fix                 # 自動修復
npm outdated                  # 檢查過時的依賴
```

## 品質保證

### 測試策略

- **單元測試**：`npm run test:unit`
- **整合測試**：`npm run test`
- **程式碼檢查**：`npm run lint`
- **格式檢查**：`npm run format:check`

### CI/CD 流程

每次推送和 PR 都會觸發：

1. 多 Node.js 版本測試 (16, 18, 20)
2. 程式碼品質檢查
3. 安全審計
4. 打包測試

## 問題管理

### Issue 分類

使用標籤系統進行分類：

- `bug`：錯誤回報
- `enhancement`：功能請求
- `question`：使用問題
- `documentation`：文檔相關
- `good first issue`：適合新手
- `help wanted`：需要協助

### 回應時間目標

- **Bug**：2 個工作日內回應
- **功能請求**：1 週內回應
- **問題諮詢**：3 個工作日內回應

## 社群管理

### 貢獻者指南

參考 [`CONTRIBUTING.md`](CONTRIBUTING.md) 了解：

- 程式碼風格指南
- 提交規範
- PR 流程
- 測試要求

### 行為準則

遵循 [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) 確保：

- 包容性的社群環境
- 尊重所有參與者
- 建設性的討論

## 監控與分析

### Marketplace 指標

定期監控：

- 下載量趨勢
- 用戶評分
- 評論和回饋
- 錯誤報告

### 使用統計

透過 VS Code 內建的遙測系統收集：

- 功能使用頻率
- 效能指標
- 錯誤發生率

## 備份與復原

### 代碼備份

- GitHub 作為主要代碼庫
- 定期建立發佈標籤
- 重要變更前建立分支備份

### 配置備份

定期備份：

- GitHub 設定
- Marketplace 發佈者設定
- CI/CD 配置

## 緊急應變

### 快速修復流程

1. **識別問題**：確認嚴重性和影響範圍
2. **建立 hotfix 分支**：從 main 分支建立
3. **修復測試**：確保修復有效且不引入新問題
4. **緊急發佈**：跳過正常的審查流程
5. **後續跟進**：完整的測試和文檔更新

### 回退策略

如果發佈出現問題：

1. **立即回退**：發佈前一個穩定版本
2. **通知用戶**：在 GitHub 發佈說明
3. **修復問題**：分析根本原因
4. **重新發佈**：完成修復後重新發佈

## 定期維護任務

### 每週

- [ ] 檢查 CI/CD 狀態
- [ ] 處理新的 Issues 和 PR
- [ ] 審查 Dependabot PR

### 每月

- [ ] 更新文檔
- [ ] 分析使用統計
- [ ] 檢查安全漏洞
- [ ] 評估功能請求

### 每季

- [ ] 規劃新功能
- [ ] 更新路線圖
- [ ] 依賴大版本更新評估
- [ ] 效能評估和優化

### 每年

- [ ] 技術債務清理
- [ ] 架構評估
- [ ] 工具鏈更新
- [ ] 安全性全面審計

## 聯絡資訊

- **主要維護者**：VSCode Countdown Dev Team
- **電子郵件**：dev@vscode-countdown.com
- **GitHub**：https://github.com/vscode-countdown-dev/countdown-extension
- **問題回報**：https://github.com/vscode-countdown-dev/countdown-extension/issues