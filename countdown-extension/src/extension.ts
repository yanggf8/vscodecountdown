import * as vscode from 'vscode';
import { Countdown } from './countdown';
import { CountdownOptions, CountdownHistoryItem, PresetTimeOption, CountdownState } from './types';
import { CountdownOptionsViewProvider } from './providers/CountdownOptionsViewProvider';

let countdown: Countdown | null = null;
let countdownStatusBarItem: vscode.StatusBarItem;
let countdownHistory: CountdownHistoryItem[] = [];
let countdownOptionsProvider: CountdownOptionsViewProvider;

function applyHistoryFilter(history: CountdownHistoryItem[], filterType: string): CountdownHistoryItem[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (filterType) {
    case 'all':
      return history;
    
    case 'completed':
      return history.filter(item => item.completed);
    
    case 'incomplete':
      return history.filter(item => !item.completed);
    
    case 'today':
      return history.filter(item => item.startTime >= today);
    
    case 'thisWeek':
      return history.filter(item => item.startTime >= thisWeekStart);
    
    case 'thisMonth':
      return history.filter(item => item.startTime >= thisMonthStart);
    
    case 'longSessions':
      return history.filter(item => item.duration > 1800); // > 30 minutes
    
    case 'shortSessions':
      return history.filter(item => item.duration <= 900); // <= 15 minutes
    
    default:
      return history;
  }
}

function applySorting(history: CountdownHistoryItem[], sortType: string): CountdownHistoryItem[] {
  const sorted = [...history];
  
  switch (sortType) {
    case 'newest':
      return sorted.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    
    case 'oldest':
      return sorted.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    
    case 'longest':
      return sorted.sort((a, b) => b.duration - a.duration);
    
    case 'shortest':
      return sorted.sort((a, b) => a.duration - b.duration);
    
    default:
      return sorted.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return '剛剛';
  } else if (diffMins < 60) {
    return `${diffMins}分鐘前`;
  } else if (diffHours < 24) {
    return `${diffHours}小時前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}週前`;
  }
}

function initializeStatusBar() {
  if (!countdownStatusBarItem) {
    countdownStatusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    countdownStatusBarItem.text = '⏰';
    const mdTooltip = new vscode.MarkdownString(`
**快速預設**
- [⏱️ 5 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([300, '短暫休息']))})
- [☕ 15 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([900, '茶歇時間']))})
- [🍅 25 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([1500, '番茄工作法']))})
- [⏰ 30 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([1800, '會議時間']))})
- [🎯 1 小時](command:countdown.select?${encodeURIComponent(JSON.stringify([3600, '深度工作']))})
- [📚 90 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([5400, '學習時間']))})
<br/>點擊圖示選擇或快速啟動
        `);
    mdTooltip.isTrusted = true;
    countdownStatusBarItem.tooltip = mdTooltip;
    countdownStatusBarItem.command = 'countdown.quickStart';
    countdownStatusBarItem.show();
  }
}

function addToHistory(item: CountdownHistoryItem) {
  countdownHistory.unshift(item);
  // 保持歷史記錄在合理範圍內
  if (countdownHistory.length > 50) {
    countdownHistory = countdownHistory.slice(0, 50);
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 從擴展上下文載入歷史記錄
  countdownHistory = context.globalState.get('countdownHistory', []);

  // 初始化狀態欄
  initializeStatusBar();
  context.subscriptions.push(countdownStatusBarItem);
  // 註冊預設選擇命令，用於 tooltip command link
  const selectDisposable = vscode.commands.registerCommand(
    'countdown.select',
    (seconds: number, description?: string) => {
      if (countdown && countdown.getState() !== CountdownState.STOPPED) {
        countdown.stopCountdown();
      }
      const options: CountdownOptions = { duration: seconds, message: description };
      countdown = new Countdown(countdownStatusBarItem, options);
      countdown.startCountdown();
    }
  );
  context.subscriptions.push(selectDisposable);

  // 創建並註冊 CountdownOptionsViewProvider
  countdownOptionsProvider = new CountdownOptionsViewProvider(
    context.extensionUri,
    (seconds: number, description?: string) => {
      // 當用戶選擇計時器選項時的回調
      if (countdown && countdown.getState() !== CountdownState.STOPPED) {
        countdown.stopCountdown();
      }

      const options: CountdownOptions = {
        duration: seconds,
        message: description,
      };

      countdown = new Countdown(countdownStatusBarItem, options);
      countdown.startCountdown();
    }
  );

  // 註冊 WebviewViewProvider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CountdownOptionsViewProvider.viewType,
      countdownOptionsProvider
    )
  );

  // 開始倒數計時命令
  const startDisposable = vscode.commands.registerCommand('countdown.start', async () => {
    if (countdown && countdown.getState() !== CountdownState.STOPPED) {
      const choice = await vscode.window.showWarningMessage(
        '倒數計時器已在運行中，要停止當前的並開始新的嗎？',
        '是',
        '否'
      );
      if (choice === '是') {
        countdown.stopCountdown();
      } else {
        return;
      }
    }

    const seconds = await vscode.window.showInputBox({
      placeHolder: '輸入倒數秒數 (例如: 300 = 5分鐘)',
      prompt: '請輸入正整數',
      validateInput: value => {
        const num = Number(value);
        return isNaN(num) || num <= 0 || num > 86400 ? '請輸入 1-86400 之間的正整數' : null;
      },
    });

    if (seconds) {
      // 詢問是否要自訂完成訊息
      const customMessage = await vscode.window.showInputBox({
        placeHolder: '自訂完成訊息 (可選)',
        prompt: '倒數結束時顯示的訊息，留空使用預設訊息',
      });

      const options: CountdownOptions = {
        duration: parseInt(seconds),
        message: customMessage || undefined,
        notifications: {
          customCompletionMessage: customMessage || '⏰ 倒數計時完成！',
        },
      };

      countdown = new Countdown(countdownStatusBarItem, options);
      countdown.startCountdown();
    }
  });

  // 停止倒數計時命令
  const stopDisposable = vscode.commands.registerCommand('countdown.stop', () => {
    if (countdown && countdown.getState() !== CountdownState.STOPPED) {
      // 將未完成的計時器加入歷史記錄
      const historyItem = countdown.getHistoryItem();
      if (historyItem) {
        historyItem.endTime = new Date();
        historyItem.completed = false;
        addToHistory(historyItem);
        saveHistory(context);
      }

      countdown.stopCountdown();
      countdown = null;
      countdownStatusBarItem.text = '⏰';
      countdownStatusBarItem.tooltip = '點擊開始倒數計時';
      vscode.window.showInformationMessage('倒數計時器已停止');
    } else {
      vscode.window.showInformationMessage('沒有正在運行的倒數計時器');
    }
  });

  // 暫停倒數計時命令
  const pauseDisposable = vscode.commands.registerCommand('countdown.pause', () => {
    if (countdown && countdown.getState() === CountdownState.RUNNING) {
      countdown.pauseCountdown();
    } else {
      vscode.window.showInformationMessage('沒有正在運行的倒數計時器可以暫停');
    }
  });

  // 恢復倒數計時命令
  const resumeDisposable = vscode.commands.registerCommand('countdown.resume', () => {
    if (countdown && countdown.getState() === CountdownState.PAUSED) {
      countdown.resumeCountdown();
    } else {
      vscode.window.showInformationMessage('沒有暫停的倒數計時器可以恢復');
    }
  });

  // 快速開始命令 (顯示 Panel)
  const quickStartDisposable = vscode.commands.registerCommand('countdown.quickStart', async () => {
    try {
      // 顯示倒數計時選項 Panel
      await vscode.commands.executeCommand('workbench.view.panel.countdownOptions');
      // 同步顯示 QuickPick 下拉選單
      const presets: PresetTimeOption[] = [
        { label: '⏱️ 5 分鐘', description: '專注時間', value: 300, icon: '⏱️' },
        { label: '☕ 15 分鐘', description: '休息時間', value: 900, icon: '☕' },
        { label: '🍅 25 分鐘', description: '番茄工作法', value: 1500, icon: '🍅' },
        { label: '⏰ 30 分鐘', description: '會議時間', value: 1800, icon: '⏰' },
        { label: '🎯 1 小時', description: '深度工作', value: 3600, icon: '🎯' },
        { label: '📚 90 分鐘', description: '學習時間', value: 5400, icon: '📚' },
        { label: '🔧 自訂時間...', description: '輸入自訂的倒數時間', value: -1, icon: '🔧' },
      ];
      const selected = await vscode.window.showQuickPick(presets, {
        placeHolder: '選擇預設的倒數時間',
      });
      if (selected) {
        if (countdown && countdown.getState() !== CountdownState.STOPPED) {
          countdown.stopCountdown();
        }
        if (selected.value === -1) {
          vscode.commands.executeCommand('countdown.start');
        } else {
          const options: CountdownOptions = {
            duration: selected.value,
            message: selected.description,
          };
          countdown = new Countdown(countdownStatusBarItem, options);
          countdown.startCountdown();
        }
      }
      countdownOptionsProvider.show();
    } catch (error) {
      // 如果 Panel 無法顯示，退回到原本的 QuickPick 作為 fallback
      console.warn('無法顯示倒數計時選項 Panel，使用 QuickPick 作為替代方案:', error);

      const presets: PresetTimeOption[] = [
        { label: '⏱️ 5 分鐘', description: '專注時間', value: 300, icon: '⏱️' },
        { label: '☕ 15 分鐘', description: '休息時間', value: 900, icon: '☕' },
        { label: '🍅 25 分鐘', description: '番茄工作法', value: 1500, icon: '🍅' },
        { label: '⏰ 30 分鐘', description: '會議時間', value: 1800, icon: '⏰' },
        { label: '🎯 1 小時', description: '深度工作', value: 3600, icon: '🎯' },
        { label: '📚 90 分鐘', description: '學習時間', value: 5400, icon: '📚' },
        { label: '🔧 自訂時間...', description: '輸入自訂的倒數時間', value: -1, icon: '🔧' },
      ];

      const selected = await vscode.window.showQuickPick(presets, {
        placeHolder: '選擇預設的倒數時間',
      });

      if (selected) {
        if (countdown && countdown.getState() !== CountdownState.STOPPED) {
          countdown.stopCountdown();
        }

        if (selected.value === -1) {
          // 自訂時間
          vscode.commands.executeCommand('countdown.start');
          return;
        }

        const options: CountdownOptions = {
          duration: selected.value,
          message: selected.description,
        };

        countdown = new Countdown(countdownStatusBarItem, options);
        countdown.startCountdown();
      }
    }
  });

  // 查看計時歷史記錄命令 (enhanced with filtering)
  const historyDisposable = vscode.commands.registerCommand('countdown.history', async () => {
    if (countdownHistory.length === 0) {
      vscode.window.showInformationMessage('暫無計時歷史記錄');
      return;
    }

    // Show filter options first
    const filterChoice = await vscode.window.showQuickPick([
      { label: '📋 所有記錄', value: 'all', description: '顯示所有計時記錄' },
      { label: '✅ 已完成', value: 'completed', description: '只顯示完成的計時記錄' },
      { label: '⏹️ 未完成', value: 'incomplete', description: '只顯示未完成的計時記錄' },
      { label: '📅 今天', value: 'today', description: '顯示今天的計時記錄' },
      { label: '📅 本週', value: 'thisWeek', description: '顯示本週的計時記錄' },
      { label: '📅 本月', value: 'thisMonth', description: '顯示本月的計時記錄' },
      { label: '⏱️ 長時間 (>30分)', value: 'longSessions', description: '顯示超過30分鐘的記錄' },
      { label: '⏱️ 短時間 (≤15分)', value: 'shortSessions', description: '顯示15分鐘以下的記錄' },
    ], {
      placeHolder: '選擇篩選條件',
    });

    if (!filterChoice) {
      return;
    }

    // Apply filter
    const filteredHistory = applyHistoryFilter(countdownHistory, filterChoice.value);
    
    if (filteredHistory.length === 0) {
      vscode.window.showInformationMessage(`沒有符合 "${filterChoice.label}" 條件的計時記錄`);
      return;
    }

    // Sort options
    const sortChoice = await vscode.window.showQuickPick([
      { label: '📅 最新優先', value: 'newest', description: '按開始時間排序 (新到舊)' },
      { label: '📅 最舊優先', value: 'oldest', description: '按開始時間排序 (舊到新)' },
      { label: '⏱️ 時間最長', value: 'longest', description: '按計時時長排序 (長到短)' },
      { label: '⏱️ 時間最短', value: 'shortest', description: '按計時時長排序 (短到長)' },
    ], {
      placeHolder: '選擇排序方式',
    });

    if (!sortChoice) {
      return;
    }

    // Apply sorting
    const sortedHistory = applySorting(filteredHistory, sortChoice.value);

    // Create display items
    const historyItems = sortedHistory.map((item: CountdownHistoryItem) => {
      const duration = formatDuration(item.duration);
      const status = item.completed ? '✅ 已完成' : '⏹️ 已停止';
      const startTime = item.startTime.toLocaleString();
      const description = item.message || '無描述';
      const ago = getTimeAgo(item.startTime);

      return {
        label: `${status} ${duration}`,
        description: description,
        detail: `${ago} • ${startTime}`,
        item: item,
      };
    });

    const selected = await vscode.window.showQuickPick(historyItems, {
      placeHolder: `${filterChoice.label} - ${sortChoice.label} (${historyItems.length} 筆記錄)`,
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (selected) {
      const choice = await vscode.window.showInformationMessage(
        `重新開始這個 ${formatDuration(selected.item.duration)} 的計時器？`,
        '開始',
        '刪除此記錄',
        '查看統計',
        '取消'
      );

      if (choice === '開始') {
        if (countdown && countdown.getState() !== CountdownState.STOPPED) {
          countdown.stopCountdown();
        }

        const options: CountdownOptions = {
          duration: selected.item.duration,
          message: selected.item.message,
        };

        countdown = new Countdown(countdownStatusBarItem, options);
        countdown.startCountdown();
      } else if (choice === '刪除此記錄') {
        countdownHistory = countdownHistory.filter(h => h.id !== selected.item.id);
        saveHistory(context);
        vscode.window.showInformationMessage('歷史記錄已刪除');
      } else if (choice === '查看統計') {
        vscode.commands.executeCommand('countdown.stats');
      }
    }
  });

  // 清除歷史記錄命令
  const clearHistoryDisposable = vscode.commands.registerCommand(
    'countdown.clearHistory',
    async () => {
      const choice = await vscode.window.showWarningMessage(
        '確定要清除所有計時歷史記錄嗎？',
        '確定',
        '取消'
      );

      if (choice === '確定') {
        countdownHistory = [];
        saveHistory(context);
        vscode.window.showInformationMessage('計時歷史記錄已清除');
      }
    }
  );

  // 顯示計時統計命令
  const statsDisposable = vscode.commands.registerCommand('countdown.stats', () => {
    const stats = calculateStats();
    const message = `
📊 計時統計
────────────
總計時次數: ${stats.totalSessions}
已完成次數: ${stats.completedSessions}
完成率: ${stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0}%
總計時時間: ${formatDuration(stats.totalTimeSpent)}
平均計時時長: ${formatDuration(stats.averageSessionLength)}
        `.trim();

    vscode.window.showInformationMessage(message, { modal: true });
  });

  // 當倒數計時完成時，自動加入歷史記錄 (未來功能)
  // const originalFinishCallback = () => {
  //   if (countdown) {
  //     const historyItem = countdown.getHistoryItem();
  //     if (historyItem) {
  //       addToHistory(historyItem);
  //       saveHistory(context);
  //     }
  //   }
  // };

  context.subscriptions.push(
    startDisposable,
    stopDisposable,
    pauseDisposable,
    resumeDisposable,
    quickStartDisposable,
    historyDisposable,
    clearHistoryDisposable,
    statsDisposable
  );
}

function saveHistory(context: vscode.ExtensionContext) {
  context.globalState.update('countdownHistory', countdownHistory);
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}小時${minutes}分${secs}秒`;
  } else if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  } else {
    return `${secs}秒`;
  }
}

function calculateStats() {
  const totalSessions = countdownHistory.length;
  const completedSessions = countdownHistory.filter(h => h.completed).length;
  const totalTimeSpent = countdownHistory
    .filter(h => h.completed)
    .reduce((total, h) => total + h.duration, 0);
  const averageSessionLength = completedSessions > 0 ? totalTimeSpent / completedSessions : 0;

  return {
    totalSessions,
    completedSessions,
    totalTimeSpent,
    averageSessionLength,
  };
}

export function deactivate() {
  if (countdown) {
    countdown.stopCountdown();
  }
  if (countdownStatusBarItem) {
    countdownStatusBarItem.dispose();
  }
}
