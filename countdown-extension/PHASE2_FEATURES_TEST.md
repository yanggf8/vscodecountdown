# Phase 2 Features Testing Guide

## 🔧 **Advanced History Search & Filtering**

### **Testing the Enhanced History System**

#### **Step 1: Create Test Data**
1. Start multiple timers with different durations and completion states
2. Complete some timers, stop others before completion
3. Add custom messages to create variety
4. Ensure some are from different time periods

#### **Step 2: Test Filter Options**
Access via `Ctrl+Shift+P` → "Countdown: View History" (or `Ctrl+Alt+H` if enabled)

**Filter Categories to Test:**

| Filter | Expected Result |
|--------|----------------|
| 📋 所有記錄 | Shows all timer records |
| ✅ 已完成 | Only completed timers |
| ⏹️ 未完成 | Only stopped/incomplete timers |
| 📅 今天 | Only today's records |
| 📅 本週 | This week's records |
| 📅 本月 | This month's records |
| ⏱️ 長時間 (>30分) | Sessions longer than 30 minutes |
| ⏱️ 短時間 (≤15分) | Sessions 15 minutes or shorter |

#### **Step 3: Test Sorting Options**

| Sort Type | Expected Order |
|-----------|----------------|
| 📅 最新優先 | Newest to oldest by start time |
| 📅 最舊優先 | Oldest to newest by start time |
| ⏱️ 時間最長 | Longest to shortest duration |
| ⏱️ 時間最短 | Shortest to longest duration |

#### **Step 4: Test Enhanced Display**
Verify each history item shows:
- ✅ Status indicator (completed/stopped)
- ⏱️ Duration in readable format
- 📝 Custom message/description
- 📅 Relative time ("2小時前", "1天前", etc.)
- 📅 Absolute timestamp

#### **Step 5: Test Actions**
For each selected history item, verify:
- **開始**: Restarts timer with same duration/message
- **刪除此記錄**: Removes item from history
- **查看統計**: Opens statistics view
- **取消**: Closes without action

### **Expected User Experience Improvements:**
- ✅ **Faster navigation** through large history lists
- ✅ **Contextual filtering** for specific use cases
- ✅ **Smart sorting** for different user needs
- ✅ **Rich information display** with relative timestamps

---

## ⚠️ **Enhanced Warning Notifications**

### **Testing the Advanced Warning System**

#### **Setup for Warning Tests**
1. Configure warning time: `"countdown.notifications.warningTime": 10` (for quick testing)
2. Ensure warnings are enabled: `"countdown.notifications.showCountdownWarning": true`
3. Start a timer longer than the warning threshold

#### **Warning Display Test**
When warning triggers, verify it shows:

**Expected Warning Message:**
```
⚠️ 計時器即將完成！

剩餘時間：9秒
進度：████████░ 89%

選擇您的操作：
```

**Action Buttons to Test:**

| Button | Expected Behavior |
|--------|------------------|
| ⏸️ 暫停 | Pauses timer, shows "計時器已暫停" |
| ➕ 延長5分鐘 | Adds 300 seconds, shows "已延長 5 分鐘" |
| ➕ 延長10分鐘 | Adds 600 seconds, shows "已延長 10 分鐘" |
| ⏹️ 停止 | Stops timer, shows "計時器已停止" |
| 👁️ 繼續 | Continues timer, shows "繼續計時中..." |

#### **Timer Extension Testing**
1. **Before Extension**: Note remaining time and total duration
2. **Trigger Extension**: Click "延長5分鐘" or "延長10分鐘"
3. **Verify Results**:
   - ✅ Remaining time increased by correct amount
   - ✅ Total duration updated
   - ✅ Progress percentage recalculated
   - ✅ Status bar updates immediately
   - ✅ Warning flag reset (can trigger again if needed)

#### **Progress Indicator Testing**
Verify progress bar shows:
- ✅ **Accurate percentage** based on current time/total time
- ✅ **Visual progress bar** using █ and ░ characters
- ✅ **Real-time updates** in warning messages

#### **Multi-Warning Behavior**
1. Set warning time to 60 seconds
2. Start 2-minute timer
3. Wait for first warning at 60 seconds
4. Choose "繼續" to dismiss
5. Extend timer by 5 minutes when near completion
6. Verify: New warning can trigger again

### **Expected User Experience Improvements:**
- ✅ **Actionable warnings** instead of passive notifications
- ✅ **Visual progress feedback** with real-time percentages
- ✅ **Timer control** directly from warning dialog
- ✅ **Flexible time management** with extension options

---

## 🎯 **Integration Testing**

### **Cross-Feature Testing**
1. **Filter + Extend Workflow**:
   - Start timer with extension via warning
   - Check extended timer appears correctly in history filters
   - Verify duration and completion status tracking

2. **Status Bar + Warning Integration**:
   - Test all 4 status bar formats during warning display
   - Verify progress bars match between status bar and warning

3. **Sound + Action Integration**:
   - Verify warning sound plays with enhanced notifications
   - Test sound settings respect user preferences

### **Performance Testing**
1. **Large History Dataset**: Test with 50+ history items
2. **Filter Responsiveness**: Verify quick filtering of large datasets
3. **Memory Usage**: Ensure no memory leaks with extended timers

### **Edge Case Testing**
1. **Zero/Negative Time**: Test warning system edge cases
2. **Multiple Extensions**: Extend timer multiple times
3. **Rapid Actions**: Quick succession of warning actions
4. **Settings Changes**: Dynamic configuration changes during operation

---

## ✅ **Success Criteria**

### **Advanced History**
- [ ] All 8 filter options work correctly
- [ ] All 4 sort options work correctly  
- [ ] Time-ago calculations are accurate
- [ ] Actions (start, delete, stats) work from filtered views
- [ ] Performance remains smooth with large datasets

### **Enhanced Warnings**
- [ ] Progress bars display correctly with accurate percentages
- [ ] All 5 action buttons work as expected
- [ ] Timer extension functionality works correctly
- [ ] Warning system integrates with existing sound notifications
- [ ] Multiple warning scenarios handled properly

### **Overall Phase 2 Goals**
- [ ] Power users can efficiently manage large timer histories
- [ ] Warning notifications provide actionable immediate control
- [ ] User experience significantly improved over basic implementation
- [ ] All new features integrate seamlessly with existing functionality
- [ ] Performance impact is minimal (<50ms overhead)

**🚀 Phase 2 Complete: Ready for v0.3.0 Release!**