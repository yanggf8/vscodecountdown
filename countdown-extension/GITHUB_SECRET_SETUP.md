# GitHub VSCE_TOKEN Secret 配置指南

## 目前CI/CD配置分析

### 現有配置檢查結果
✅ **Release工作流程已正確配置** ([`release.yml`](countdown-extension/.github/workflows/release.yml:32))
- 第32行正確使用了 `${{ secrets.VSCE_TOKEN }}`
- 觸發條件：推送版本標籤 (`v*.*.*`)
- 包含完整的測試、打包和發佈流程

✅ **Package.json配置正確**
- Publisher: `vscode-countdown-dev`
- 版本: `0.1.5`
- 包含所需的 [`package`](countdown-extension/package.json:271) script

✅ **CI工作流程獨立運作**
- CI流程不涉及發佈，僅進行測試和安全檢查
- 不需要VSCE_TOKEN

## GitHub Secret配置步驟

### 步驟1：在GitHub Repository中設定Secret

1. **進入Repository設定**
   ```
   GitHub Repository → Settings → Secrets and variables → Actions
   ```

2. **新增Repository Secret**
   - 點擊 "New repository secret"
   - Name: `VSCE_TOKEN`
   - Value: 您從Azure DevOps獲得的Personal Access Token

### 步驟2：驗證Secret配置

**檢查Secret是否正確設定：**
```bash
# 在Repository的Settings > Secrets and variables > Actions中
# 應該看到：
# VSCE_TOKEN **************** (Updated X time ago)
```

### 步驟3：測試發佈流程

**方法1：創建測試標籤**
```bash
# 在本地專案目錄執行
git tag v0.1.6-test
git push origin v0.1.6-test
```

**方法2：手動觸發測試（建議）**
- 可以暫時修改 [`release.yml`](countdown-extension/.github/workflows/release.yml:3-6) 觸發條件進行測試
- 測試完畢後記得恢復原始配置

## 安全性檢查

### ✅ 當前安全配置狀態

1. **Secret使用正確**
   - ✅ 使用 `${{ secrets.VSCE_TOKEN }}` 語法
   - ✅ 沒有hardcode任何敏感資訊
   - ✅ Secret僅在需要時使用（發佈步驟）

2. **權限範圍適當**
   - ✅ Secret僅用於Marketplace發佈
   - ✅ 工作流程權限最小化
   - ✅ 只有在推送版本標籤時才觸發

3. **檔案安全性**
   - ✅ `.gitignore` 正確配置
   - ✅ 沒有敏感檔案被追蹤

### 安全最佳實務建議

1. **Token權限管理**
   ```
   在Azure DevOps中設定Token時：
   - 只給予 "Marketplace (publish)" 權限
   - 設定適當的過期時間
   - 定期輪換Token
   ```

2. **Repository設定**
   ```
   在GitHub Repository設定中：
   - 限制誰可以管理Secrets
   - 啟用Branch protection rules
   - 要求Pull Request reviews
   ```

3. **監控和稽核**
   ```
   定期檢查：
   - Actions執行歷史
   - Secret使用紀錄
   - 發佈成功/失敗狀態
   ```

## 發佈流程測試方法

### 測試Secret配置有效性

1. **查看Actions執行狀態**
   ```
   GitHub Repository → Actions → 查看最新的Release workflow
   ```

2. **檢查發佈步驟日誌**
   ```
   如果Secret配置正確，應該看到：
   ✅ "Publish to Marketplace" 步驟成功執行
   ❌ 如果失敗，檢查錯誤訊息是否為認證問題
   ```

3. **驗證Marketplace發佈**
   ```
   發佈成功後檢查：
   - VS Code Marketplace上的extension
   - 版本號是否正確更新
   ```

## 故障排除

### 常見問題和解決方案

1. **403 Unauthorized錯誤**
   ```
   可能原因：
   - VSCE_TOKEN值不正確
   - Token已過期
   - Token權限不足
   
   解決方案：
   - 重新生成Azure DevOps Personal Access Token
   - 確認Token有Marketplace publish權限
   - 重新設定GitHub Secret
   ```

2. **Publisher驗證失敗**
   ```
   確認：
   - package.json中的publisher名稱正確
   - Publisher在Azure DevOps中已驗證
   - Token關聯到正確的Publisher
   ```

3. **工作流程未觸發**
   ```
   檢查：
   - 標籤格式是否符合 v*.*.*
   - 是否推送到正確的repository
   - 工作流程檔案語法是否正確
   ```

## 完成檢查清單

在設定完成後，請確認以下項目：

- [ ] VSCE_TOKEN Secret已在GitHub Repository中設定
- [ ] Secret值為有效的Azure DevOps Personal Access Token
- [ ] Token具有Marketplace publish權限
- [ ] Release workflow配置正確使用Secret
- [ ] 測試發佈流程正常運作
- [ ] 沒有敏感資訊暴露在代碼中
- [ ] 設定了適當的安全監控

## 後續維護

### 定期維護任務

1. **每3個月檢查**
   - Token是否接近過期
   - 發佈流程是否正常
   - 安全設定是否仍然適當

2. **每次發佈後檢查**
   - Marketplace上的extension狀態
   - 下載和評分情況
   - 用戶反饋

3. **安全性審查**
   - 定期審查Secret存取權限
   - 檢查工作流程執行歷史
   - 監控異常活動