import * as vscode from 'vscode';
import {
  CountdownState,
  CountdownOptions,
  // NotificationOptions, // 未來實現客制通知時使用
  CountdownHistoryItem,
} from './types';

export class Countdown {
  private intervalId: ReturnType<typeof setTimeout> | null = null;
  private statusBarItem: vscode.StatusBarItem;
  private state: CountdownState = CountdownState.STOPPED;
  private totalSeconds: number = 0;
  private remainingSeconds: number = 0;
  private startTime: Date | null = null;
  private pausedTime: number = 0;
  private options: CountdownOptions;
  private historyItem: CountdownHistoryItem | null = null;
  private warningShown: boolean = false;

  constructor(statusBarItem: vscode.StatusBarItem, options: CountdownOptions = { duration: 0 }) {
    this.statusBarItem = statusBarItem;
    this.options = {
      notifications: {
        showCompletionNotification: true,
        customCompletionMessage: '⏰ 倒數計時完成！',
      },
      ...options,
    };
  }

  public startCountdown(seconds?: number): void {
    if (this.state === CountdownState.RUNNING) {
      vscode.window.showWarningMessage('倒數計時器已經在運行中');
      return;
    }

    // 如果是新的倒數計時，初始化參數
    if (this.state === CountdownState.STOPPED) {
      this.totalSeconds = seconds || this.options.duration;
      this.remainingSeconds = this.totalSeconds;
      this.startTime = new Date();
      this.pausedTime = 0;
      this.warningShown = false;

      // 創建歷史記錄項目
      this.historyItem = {
        id: this.generateId(),
        duration: this.totalSeconds,
        startTime: this.startTime,
        completed: false,
        message: this.options.message,
      };

      if (!this.totalSeconds || this.totalSeconds <= 0) {
        vscode.window.showErrorMessage('無效的倒數時間');
        return;
      }
    }

    this.state = CountdownState.RUNNING;

    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.checkForWarning();
        this.updateStatusBar(this.remainingSeconds);
        this.remainingSeconds--;
      } else {
        this.finishCountdown();
      }
    }, 1000);

    // 初始顯示
    this.updateStatusBar(this.remainingSeconds);

    // 更新狀態欄命令為暫停
    this.statusBarItem.command = 'countdown.pause';

    vscode.window.showInformationMessage(`倒數計時器已${this.pausedTime > 0 ? '恢復' : '開始'}`);
  }

  public pauseCountdown(): void {
    if (this.state !== CountdownState.RUNNING) {
      vscode.window.showWarningMessage('沒有正在運行的倒數計時器可以暫停');
      return;
    }

    this.state = CountdownState.PAUSED;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.pausedTime += Date.now() - (this.startTime?.getTime() || 0);

    // 更新狀態欄顯示和命令
    this.updateStatusBarForPaused();
    this.statusBarItem.command = 'countdown.resume';

    vscode.window.showInformationMessage('倒數計時器已暫停');
  }

  public resumeCountdown(): void {
    if (this.state !== CountdownState.PAUSED) {
      vscode.window.showWarningMessage('沒有暫停的倒數計時器可以恢復');
      return;
    }

    this.startTime = new Date();
    this.startCountdown();
  }

  public getState(): CountdownState {
    return this.state;
  }

  public getRemainingTime(): number {
    return this.remainingSeconds;
  }

  public getTotalTime(): number {
    return this.totalSeconds;
  }

  public getProgress(): number {
    if (this.totalSeconds === 0) {
      return 0;
    }
    return ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
  }

  private updateStatusBar(seconds: number): void {
    // Get format setting from configuration
    const config = vscode.workspace.getConfiguration('countdown');
    const format = config.get('statusBarFormat', 'mm:ss') as string;
    
    const progress = this.getProgress();
    const timeDisplay = this.getFormattedTimeDisplay(seconds, format);
    const progressInfo = this.getProgressInfo(progress);

    this.statusBarItem.text = timeDisplay;
    this.statusBarItem.tooltip = `倒數計時器 - 剩餘 ${seconds} 秒\n${progressInfo}\n點擊暫停`;
  }

  private getFormattedTimeDisplay(seconds: number, format: string): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const progress = this.getProgress();
    const progressBar = this.createProgressBar(progress);

    switch (format) {
      case 'mm:ss':
        return `⏱️ ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${progressBar}`;
      
      case 'm分s秒':
        return `⏱️ ${minutes}分${secs}秒 ${progressBar}`;
      
      case '簡潔':
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      case '詳細':
        return `⏱️ ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${progressBar} (${Math.round(progress)}%)`;
      
      default:
        // Fallback to mm:ss format
        return `⏱️ ${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${progressBar}`;
    }
  }

  private getProgressInfo(progress: number): string {
    return `進度: ${Math.round(progress)}%`;
  }

  private updateStatusBarForPaused(): void {
    // Get format setting from configuration
    const config = vscode.workspace.getConfiguration('countdown');
    const format = config.get('statusBarFormat', 'mm:ss') as string;
    
    const timeDisplay = this.getFormattedTimeDisplayForPaused(this.remainingSeconds, format);

    this.statusBarItem.text = `⏸️ ${timeDisplay} (已暫停)`;
    const mdTooltip = new vscode.MarkdownString(
      `倒數計時器已暫停 - 剩餘 ${this.remainingSeconds} 秒\n\n[恢復](command:countdown.resume) | [停止計時器](command:countdown.stop)`
    );
    mdTooltip.isTrusted = true;
    this.statusBarItem.tooltip = mdTooltip;
  }

  private getFormattedTimeDisplayForPaused(seconds: number, format: string): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    switch (format) {
      case 'mm:ss':
      case '詳細':
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      case 'm分s秒':
        return `${minutes}分${secs}秒`;
      
      case '簡潔':
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      
      default:
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  private createProgressBar(progress: number): string {
    const totalBlocks = 8;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;

    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  }

  private checkForWarning(): void {
    // Get warning settings from VSCode configuration
    const config = vscode.workspace.getConfiguration('countdown');
    const notifications = config.get('notifications', {
      showCountdownWarning: true,
      warningTime: 60
    });

    // Check if warning should be shown
    if (!this.warningShown && 
        notifications.showCountdownWarning && 
        this.remainingSeconds <= notifications.warningTime && 
        this.remainingSeconds > 0) {
      
      this.warningShown = true;
      
      // Create enhanced warning with progress and actions
      this.showEnhancedWarning();

      // Play warning sound if enabled
      this.playNotificationSound('warning');
    }
  }

  private showEnhancedWarning(): void {
    // Calculate progress and format display
    const progress = this.getProgress();
    const progressBar = this.createProgressBar(progress);
    const timeFormatted = this.formatWarningTime(this.remainingSeconds);
    const progressPercent = Math.round(progress);
    
    // Create detailed warning message with progress
    const warningMessage = `⚠️ 計時器即將完成！
    
剩餘時間：${timeFormatted}
進度：${progressBar} ${progressPercent}%
    
選擇您的操作：`;

    // Show warning with action buttons
    vscode.window.showWarningMessage(
      warningMessage,
      { modal: false },
      '⏸️ 暫停',
      '➕ 延長5分鐘',
      '➕ 延長10分鐘',
      '⏹️ 停止',
      '👁️ 繼續'
    ).then(action => {
      this.handleWarningAction(action);
    });
  }

  private handleWarningAction(action: string | undefined): void {
    if (!action) {
      return; // User dismissed without action
    }

    switch (action) {
      case '⏸️ 暫停':
        this.pauseCountdown();
        vscode.window.showInformationMessage('計時器已暫停');
        break;
        
      case '➕ 延長5分鐘':
        this.extendTimer(300); // 5 minutes
        vscode.window.showInformationMessage('已延長 5 分鐘');
        break;
        
      case '➕ 延長10分鐘':
        this.extendTimer(600); // 10 minutes
        vscode.window.showInformationMessage('已延長 10 分鐘');
        break;
        
      case '⏹️ 停止':
        this.stopCountdown();
        vscode.window.showInformationMessage('計時器已停止');
        break;
        
      case '👁️ 繼續':
        // Just continue, no action needed
        vscode.window.showInformationMessage('繼續計時中...');
        break;
    }
  }

  private extendTimer(additionalSeconds: number): void {
    // Extend both total and remaining seconds
    this.totalSeconds += additionalSeconds;
    this.remainingSeconds += additionalSeconds;
    
    // Reset warning flag so it can show again if needed
    this.warningShown = false;
    
    // Update status bar immediately
    this.updateStatusBar(this.remainingSeconds);
    
    // Update history item if exists
    if (this.historyItem) {
      this.historyItem.duration = this.totalSeconds;
    }
  }

  private formatWarningTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}分${secs}秒`;
    }
    return `${secs}秒`;
  }

  public playNotificationSound(type: 'warning' | 'completion'): void {
    // Get sound settings from VSCode configuration
    const config = vscode.workspace.getConfiguration('countdown');
    const notifications = config.get('notifications', {
      sound: true
    });

    // Only play sound if enabled
    if (!notifications.sound) {
      return;
    }

    try {
      // Use system beep for notifications
      // This is a simple cross-platform solution
      if (type === 'warning') {
        // Single beep for warning
        this.playSystemBeep(1);
      } else {
        // Triple beep for completion
        this.playSystemBeep(3);
      }
    } catch (error) {
      // Silently fail if sound cannot be played
      // Log error for debugging purposes only
    }
  }

  public playSystemBeep(count: number): void {
    // Use terminal bell character to trigger system notification sound
    // This works across different platforms
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        // Use process.stdout.write to send bell character
        if (process.stdout.write) {
          process.stdout.write('\u0007');
        }
      }, i * 200); // 200ms delay between beeps
    }
  }

  private showEnhancedVisualNotification(type: 'warning' | 'completion'): void {
    // Enhanced visual notification as fallback when sound fails
    const icon = type === 'completion' ? '🎉' : '⚠️';
    const message = type === 'completion' 
      ? `${icon} 倒數計時完成！` 
      : `${icon} 倒數計時警告`;
    
    // Use modal notification to ensure visibility
    if (type === 'completion') {
      vscode.window.showInformationMessage(message, { modal: false }, '再來一次', '關閉')
        .then(selection => {
          if (selection === '再來一次') {
            this.restartWithSameSettings();
          }
        });
    } else {
      vscode.window.showWarningMessage(message, '確定');
    }
  }

  private finishCountdown(): void {
    this.state = CountdownState.STOPPED;

    // 更新歷史記錄
    if (this.historyItem) {
      this.historyItem.endTime = new Date();
      this.historyItem.completed = true;
    }

    // Play completion sound first (includes enhanced visual fallback)
    this.playNotificationSound('completion');

    // 顯示完成通知
    const message = this.options.notifications?.customCompletionMessage || '⏰ 倒數計時完成！';
    if (this.options.notifications?.showCompletionNotification !== false) {
      // Delay to avoid conflict with sound notification
      setTimeout(() => {
        vscode.window.showInformationMessage(message, '再來一次', '關閉').then(selection => {
          if (selection === '再來一次') {
            this.restartWithSameSettings();
          }
        });
      }, 100);
    }

    this.stopCountdown();
  }

  private restartWithSameSettings(): void {
    this.state = CountdownState.STOPPED;
    this.startCountdown(this.totalSeconds);
  }

  public stopCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.state = CountdownState.STOPPED;
    this.remainingSeconds = 0;
    this.totalSeconds = 0;
    this.startTime = null;
    this.pausedTime = 0;
    this.warningShown = false;

    // 重設狀態欄為預設狀態
    this.statusBarItem.text = '⏰';
    this.statusBarItem.tooltip = '點擊開始倒數計時';
    this.statusBarItem.command = 'countdown.quickStart';
  }

  public getHistoryItem(): CountdownHistoryItem | null {
    return this.historyItem;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 獲取格式化的時間字串
  public getFormattedTime(seconds: number = this.remainingSeconds): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 設定自訂完成訊息
  public setCustomMessage(message: string): void {
    if (this.options.notifications) {
      this.options.notifications.customCompletionMessage = message;
    }
  }
}
