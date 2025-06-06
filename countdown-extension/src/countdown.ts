import * as vscode from 'vscode';
import { CountdownState, CountdownOptions, NotificationOptions, CountdownHistoryItem } from './types';

export class Countdown {
    private intervalId: NodeJS.Timeout | null = null;
    private statusBarItem: vscode.StatusBarItem;
    private state: CountdownState = CountdownState.STOPPED;
    private totalSeconds: number = 0;
    private remainingSeconds: number = 0;
    private startTime: Date | null = null;
    private pausedTime: number = 0;
    private options: CountdownOptions;
    private historyItem: CountdownHistoryItem | null = null;

    constructor(statusBarItem: vscode.StatusBarItem, options: CountdownOptions = { duration: 0 }) {
        this.statusBarItem = statusBarItem;
        this.options = {
            notifications: {
                showCompletionNotification: true,
                customCompletionMessage: '⏰ 倒數計時完成！'
            },
            ...options
        };
    }

    public startCountdown(seconds?: number): void {
        if (this.state === CountdownState.RUNNING) {
            vscode.window.showWarningMessage("倒數計時器已經在運行中");
            return;
        }

        // 如果是新的倒數計時，初始化參數
        if (this.state === CountdownState.STOPPED) {
            this.totalSeconds = seconds || this.options.duration;
            this.remainingSeconds = this.totalSeconds;
            this.startTime = new Date();
            this.pausedTime = 0;
            
            // 創建歷史記錄項目
            this.historyItem = {
                id: this.generateId(),
                duration: this.totalSeconds,
                startTime: this.startTime,
                completed: false,
                message: this.options.message
            };

            if (!this.totalSeconds || this.totalSeconds <= 0) {
                vscode.window.showErrorMessage('無效的倒數時間');
                return;
            }
        }

        this.state = CountdownState.RUNNING;
        
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds > 0) {
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
        if (this.totalSeconds === 0) return 0;
        return ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
    }

    private updateStatusBar(seconds: number): void {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // 顯示進度百分比
        const progress = this.getProgress();
        const progressBar = this.createProgressBar(progress);
        
        this.statusBarItem.text = `⏱️ ${timeDisplay} ${progressBar}`;
        this.statusBarItem.tooltip = `倒數計時器 - 剩餘 ${seconds} 秒\n進度: ${Math.round(progress)}%\n點擊暫停`;
    }

    private updateStatusBarForPaused(): void {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        this.statusBarItem.text = `⏸️ ${timeDisplay} (已暫停)`;
        const mdTooltip = new vscode.MarkdownString(
            `倒數計時器已暫停 - 剩餘 ${this.remainingSeconds} 秒\n\n[恢復](command:countdown.start) | [停止鬧鐘](command:countdown.stop)`
        );
        mdTooltip.isTrusted = true;
        this.statusBarItem.tooltip = mdTooltip;
    }

    private createProgressBar(progress: number): string {
        const totalBlocks = 8;
        const filledBlocks = Math.round((progress / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    }

    private finishCountdown(): void {
        this.state = CountdownState.STOPPED;
        
        // 更新歷史記錄
        if (this.historyItem) {
            this.historyItem.endTime = new Date();
            this.historyItem.completed = true;
        }

        // 顯示完成通知
        const message = this.options.notifications?.customCompletionMessage || '⏰ 倒數計時完成！';
        if (this.options.notifications?.showCompletionNotification !== false) {
            vscode.window.showInformationMessage(message, '再來一次', '關閉')
                .then(selection => {
                    if (selection === '再來一次') {
                        this.restartWithSameSettings();
                    }
                });
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
        
        // 重設狀態欄為預設狀態
        this.statusBarItem.text = "⏰";
        this.statusBarItem.tooltip = "點擊開始倒數計時";
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