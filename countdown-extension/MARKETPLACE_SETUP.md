# VS Code Marketplace 發佈設定指南

## 概述

本指南說明如何設定和配置 VS Code Marketplace 發佈者帳號，以及如何發佈擴展到 Marketplace。

## 前置準備

### 必要工具

1. **Node.js 和 npm**
   ```bash
   node --version  # 需要 Node.js 16+
   npm --version
   ```

2. **Visual Studio Code Extension Manager (vsce)**
   ```bash
   npm install -g @vscode/vsce
   ```

3. **Git**
   ```bash
   git --version
   ```

## 建立發佈者帳號

### 步驟 1：註冊 Microsoft 帳號

1. 前往 [Microsoft 帳號註冊頁面](https://account.microsoft.com/account)
2. 註冊新帳號或使用現有帳號
3. 確保帳號已驗證電子郵件

### 步驟 2：建立 Azure DevOps 組織

1. 前往 [Azure DevOps](https://dev.azure.com/)
2. 使用 Microsoft 帳號登入
3. 建立新組織或使用現有組織
4. 記錄組織名稱

### 步驟 3：產生個人存取權杖 (PAT)

1. 在 Azure DevOps 中，點擊右上角的用戶圖示
2. 選擇「Personal access tokens」
3. 點擊「New Token」
4. 設定權杖：
   - **Name**: `vscode-marketplace-token`
   - **Organization**: 選擇您的組織
   - **Expiration**: 建議選擇最長期限
   - **Scopes**: 選擇「Custom defined」，然後勾選：
     - `Marketplace` > `Acquire` (讀取)
     - `Marketplace` > `Manage` (管理)
     - `Marketplace` > `Publish` (發佈)
5. 點擊「Create」
6. **重要**：立即複製權杖並安全保存

### 步驟 4：建立發佈者

1. 前往 [Marketplace 管理頁面](https://marketplace.visualstudio.com/manage)
2. 使用相同的 Microsoft 帳號登入
3. 點擊「Create publisher」
4. 填寫發佈者資訊：
   - **Publisher name**: `vscode-countdown-dev` (唯一識別碼)
   - **Publisher display name**: `VSCode Countdown Dev Team`
   - **Description**: 簡短描述團隊或個人
   - **Website**: 團隊網站 URL (可選)
   - **Support link**: 支援頁面 URL
5. 點擊「Create」

## 配置 vsce

### 登入發佈者帳號

```bash
vsce login vscode-countdown-dev
```

輸入剛才產生的 PAT 權杖。

### 驗證配置

```bash
vsce ls-publishers
```

應該會看到您的發佈者名稱。

## 準備擴展發佈

### 檢查 package.json

確保以下欄位正確設定：

```json
{
  "name": "countdown-extension",
  "displayName": "VSCode 倒數計時器",
  "description": "功能豐富的 VSCode 倒數計時器擴展",
  "version": "0.1.5",
  "publisher": "vscode-countdown-dev",
  "author": {
    "name": "VSCode Countdown Dev Team",
    "email": "dev@vscode-countdown.com"
  },
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": [
    "Productivity",
    "Other"
  ],
  "keywords": [
    "countdown",
    "timer",
    "productivity"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/vscode-countdown-dev/countdown-extension.git"
  },
  "bugs": {
    "url": "https://github.com/vscode-countdown-dev/countdown-extension/issues"
  },
  "homepage": "https://github.com/vscode-countdown-dev/countdown-extension#readme",
  "license": "MIT"
}
```

### 準備圖示

1. **圖示檔案**: `resources/icon.png`
2. **尺寸要求**: 128x128 pixels
3. **格式**: PNG
4. **設計建議**:
   - 清晰簡潔的設計
   - 在深色和淺色背景下都清楚可見
   - 避免過於複雜的細節

### 準備 README

確保 [`README.md`](README.md) 包含：

- 清楚的功能說明
- 安裝指導
- 使用範例
- 設定選項說明
- 截圖或 GIF 展示
- 授權資訊

## 發佈流程

### 測試打包

```bash
vsce package
```

這會產生 `.vsix` 檔案，可用於：

1. **本地測試**:
   ```bash
   code --install-extension countdown-extension-0.1.5.vsix
   ```

2. **分享測試**:
   將 `.vsix` 檔案分享給測試者

### 發佈到 Marketplace

```bash
# 發佈當前版本
vsce publish

# 或自動遞增版本並發佈
vsce publish patch   # 0.1.5 -> 0.1.6
vsce publish minor   # 0.1.5 -> 0.2.0
vsce publish major   # 0.1.5 -> 1.0.0

# 發佈預覽版本
vsce publish --pre-release
```

### 驗證發佈

1. 前往 [Marketplace](https://marketplace.visualstudio.com/)
2. 搜尋您的擴展
3. 檢查：
   - 顯示名稱和描述
   - 圖示顯示正確
   - 截圖和文檔
   - 版本號碼
   - 下載連結

## GitHub Actions 自動化

### 設定 Secrets

在 GitHub 專案中設定以下 Secrets：

1. 前往 GitHub 專案 > Settings > Secrets and variables > Actions
2. 新增 Secret：
   - **Name**: `VSCE_TOKEN`
   - **Value**: 您的 PAT 權杖

> 📚 **詳細設定指南**: 請參考 [`GITHUB_SECRET_SETUP.md`](./GITHUB_SECRET_SETUP.md) 獲得完整的GitHub Secret配置步驟、安全性檢查和故障排除指南。

### 自動發佈工作流程

工作流程已在 [`.github/workflows/release.yml`](.github/workflows/release.yml) 中配置。

觸發自動發佈：

```bash
# 建立並推送標籤
git tag v0.1.6
git push origin v0.1.6
```

## 管理已發佈的擴展

### 查看統計資料

1. 登入 [Marketplace 管理頁面](https://marketplace.visualstudio.com/manage)
2. 點擊您的擴展
3. 查看：
   - 下載統計
   - 使用者評分
   - 評論和回饋

### 更新擴展資訊

在 Marketplace 管理頁面可以更新：

- 擴展描述
- 分類和標籤
- 支援連結
- 發佈者資訊

### 撤銷版本

如果需要撤銷有問題的版本：

```bash
vsce unpublish <publisher>.<extension-name>@<version>
# 例如：
vsce unpublish vscode-countdown-dev.countdown-extension@0.1.5
```

## 最佳實踐

### 發佈前檢查

使用 [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) 確保：

- [ ] 所有測試通過
- [ ] 文檔更新
- [ ] 版本號碼正確
- [ ] 圖示和截圖最新

### 版本策略

- **Patch** (0.1.5 -> 0.1.6): 錯誤修復
- **Minor** (0.1.5 -> 0.2.0): 新功能
- **Major** (0.1.5 -> 1.0.0): 破壞性變更

### 用戶溝通

- 在 CHANGELOG 中詳細記錄變更
- 回應用戶評論和問題
- 提供清楚的文檔和範例

## 故障排除

### 常見錯誤

1. **PAT 權杖過期**
   ```
   Error: Failed request: (401) Unauthorized
   ```
   解決：重新產生 PAT 並更新

2. **發佈者名稱不符**
   ```
   Error: Publisher name mismatch
   ```
   解決：檢查 package.json 中的 publisher 欄位

3. **版本衝突**
   ```
   Error: Version already exists
   ```
   解決：更新版本號碼或使用 `vsce publish patch`

### 獲取幫助

- [VS Code Extension API](https://code.visualstudio.com/api)
- [vsce 工具文檔](https://github.com/microsoft/vscode-vsce)
- [Marketplace 發佈指南](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

## 安全注意事項

1. **保護 PAT 權杖**
   - 不要在代碼中硬編碼
   - 使用 GitHub Secrets 存儲
   - 定期更新權杖

2. **最小權限原則**
   - 只授予必要的權限
   - 為不同用途建立不同權杖

3. **定期審查**
   - 檢查權杖使用情況
   - 撤銷不需要的權杖
   - 監控異常活動

## 聯絡支援

如果遇到技術問題：

- **Microsoft Support**: [Azure DevOps 支援](https://azure.microsoft.com/support/devops/)
- **VS Code 團隊**: [GitHub Issues](https://github.com/microsoft/vscode/issues)
- **社群討論**: [VS Code 討論區](https://github.com/microsoft/vscode/discussions)