# 發佈檢查清單

## 發佈前檢查

### 📋 代碼品質

- [ ] 所有測試通過 (`npm run test`)
- [ ] 程式碼檢查無錯誤 (`npm run lint`)
- [ ] 格式檢查通過 (`npm run format:check`)
- [ ] 安全審計通過 (`npm audit`)
- [ ] TypeScript 編譯無錯誤 (`npm run compile`)

### 📦 套件配置

- [ ] `package.json` 版本號碼已更新
- [ ] `package.json` 中的 `publisher` 欄位正確
- [ ] `engines.vscode` 版本需求正確
- [ ] 所有依賴版本穩定且經過測試

### 📚 文檔更新

- [ ] `CHANGELOG.md` 已更新本版本變更
- [ ] `README.md` 反映最新功能
- [ ] `RELEASE_NOTES.md` 包含發佈說明
- [ ] API 文檔（如有）已更新
- [ ] 使用範例已驗證

### 🖼️ 資源檢查

- [ ] 擴展圖示 (`resources/icon.png`) 格式正確
- [ ] 圖示尺寸符合要求 (128x128px)
- [ ] 所有圖片資源可正常載入
- [ ] README 中的截圖是最新的

### ⚙️ 功能驗證

- [ ] 所有命令可正常執行
- [ ] 設定選項功能正常
- [ ] UI 元件顯示正確
- [ ] 快捷鍵綁定有效
- [ ] 通知和提示正常運作

### 🔧 相容性測試

- [ ] VS Code 最新版本測試
- [ ] VS Code 最低支援版本測試
- [ ] Windows 平台測試
- [ ] macOS 平台測試
- [ ] Linux 平台測試

## 發佈流程

### 🏷️ 版本標籤

1. **更新版本號碼**
   ```bash
   npm version [patch|minor|major]
   ```

2. **建立發佈標籤**
   ```bash
   git tag v$(node -p "require('./package.json').version")
   git push origin --tags
   ```

### 🚀 自動發佈

- [ ] GitHub Actions 工作流程觸發
- [ ] CI/CD 檢查全部通過
- [ ] 擴展自動發佈到 Marketplace
- [ ] GitHub Release 自動建立

### 📊 發佈後驗證

- [ ] Marketplace 頁面正確顯示
- [ ] 安裝測試成功
- [ ] 功能運作正常
- [ ] 評分和評論監控

## 手動發佈（備用）

如果自動發佈失敗，可使用手動流程：

### 準備工作

1. **安裝發佈工具**
   ```bash
   npm install -g @vscode/vsce
   ```

2. **登入發佈者帳號**
   ```bash
   vsce login <publisher-name>
   ```

### 發佈步驟

1. **打包擴展**
   ```bash
   vsce package
   ```

2. **測試安裝**
   ```bash
   code --install-extension countdown-extension-*.vsix
   ```

3. **發佈到 Marketplace**
   ```bash
   vsce publish
   # 或指定版本類型
   vsce publish patch
   vsce publish minor
   vsce publish major
   ```

## 緊急修復發佈

### 🚨 快速修復流程

1. **建立 hotfix 分支**
   ```bash
   git checkout -b hotfix/v1.0.1 main
   ```

2. **修復問題並測試**
   - [ ] 問題修復完成
   - [ ] 基本測試通過
   - [ ] 無新增破壞性變更

3. **緊急發佈**
   ```bash
   npm version patch
   git tag v$(node -p "require('./package.json').version")
   git push origin --tags
   ```

4. **合併回主分支**
   ```bash
   git checkout main
   git merge hotfix/v1.0.1
   git push origin main
   ```

## 發佈後檢查

### ✅ 即時檢查

- [ ] Marketplace 顯示正確版本
- [ ] 下載連結有效
- [ ] 安裝流程順暢
- [ ] 基本功能運作

### 📈 持續監控

- [ ] 下載量統計
- [ ] 用戶評分變化
- [ ] 錯誤報告收集
- [ ] 效能指標監控

### 🛠️ 問題處理

如發現問題：

1. **評估嚴重性**
   - 嚴重：立即準備 hotfix
   - 中等：計劃下次 patch 修復
   - 輕微：計劃下次 minor 版本修復

2. **用戶通知**
   - GitHub Issues 回應
   - Marketplace 評論回覆
   - 文檔更新說明

## 版本回退

### 緊急回退

如果新版本有嚴重問題：

1. **停止推廣新版本**
   ```bash
   vsce unpublish <version>
   ```

2. **重新發佈前一版本**
   ```bash
   git checkout v<previous-version>
   vsce publish
   ```

3. **通知用戶**
   - 發佈回退說明
   - 說明問題和解決方案
   - 提供臨時解決方法

## 發佈排程

### 🗓️ 定期發佈

- **Patch 版本**：每 2 週或有重要 bug 修復時
- **Minor 版本**：每 1-2 個月或有新功能時
- **Major 版本**：每 6-12 個月或有破壞性變更時

### 📅 發佈時間

- **最佳時間**：週二至週四
- **避免時間**：週五下午、假期前
- **時區考量**：台北時間上午 10:00-12:00

## 團隊協作

### 👥 角色分工

- **發佈管理者**：執行發佈流程
- **品質保證**：執行測試檢查
- **技術審查**：代碼和架構審查
- **社群管理**：處理用戶反饋

### 📞 溝通管道

- **Slack/Teams**：即時討論
- **GitHub Issues**：問題追蹤
- **Email**：正式通知
- **會議**：重要決策討論

## 備註

- 此檢查清單應在每次發佈前完整執行
- 發現遺漏項目時應立即更新此文檔
- 團隊成員應熟悉所有流程
- 定期回顧和改進發佈流程