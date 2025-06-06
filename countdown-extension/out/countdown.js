"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Countdown = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("./types");
class Countdown {
    constructor(statusBarItem, options = { duration: 0 }) {
        this.intervalId = null;
        this.state = types_1.CountdownState.STOPPED;
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.startTime = null;
        this.pausedTime = 0;
        this.historyItem = null;
        this.statusBarItem = statusBarItem;
        this.options = Object.assign({ notifications: {
                showCompletionNotification: true,
                customCompletionMessage: '⏰ 倒數計時完成！'
            } }, options);
    }
    startCountdown(seconds) {
        if (this.state === types_1.CountdownState.RUNNING) {
            vscode.window.showWarningMessage("倒數計時器已經在運行中");
            return;
        }
        // 如果是新的倒數計時，初始化參數
        if (this.state === types_1.CountdownState.STOPPED) {
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
        this.state = types_1.CountdownState.RUNNING;
        this.intervalId = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.updateStatusBar(this.remainingSeconds);
                this.remainingSeconds--;
            }
            else {
                this.finishCountdown();
            }
        }, 1000);
        // 初始顯示
        this.updateStatusBar(this.remainingSeconds);
        // 更新狀態欄命令為暫停
        this.statusBarItem.command = 'countdown.pause';
        vscode.window.showInformationMessage(`倒數計時器已${this.pausedTime > 0 ? '恢復' : '開始'}`);
    }
    pauseCountdown() {
        var _a;
        if (this.state !== types_1.CountdownState.RUNNING) {
            vscode.window.showWarningMessage('沒有正在運行的倒數計時器可以暫停');
            return;
        }
        this.state = types_1.CountdownState.PAUSED;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.pausedTime += Date.now() - (((_a = this.startTime) === null || _a === void 0 ? void 0 : _a.getTime()) || 0);
        // 更新狀態欄顯示和命令
        this.updateStatusBarForPaused();
        this.statusBarItem.command = 'countdown.resume';
        vscode.window.showInformationMessage('倒數計時器已暫停');
    }
    resumeCountdown() {
        if (this.state !== types_1.CountdownState.PAUSED) {
            vscode.window.showWarningMessage('沒有暫停的倒數計時器可以恢復');
            return;
        }
        this.startTime = new Date();
        this.startCountdown();
    }
    getState() {
        return this.state;
    }
    getRemainingTime() {
        return this.remainingSeconds;
    }
    getTotalTime() {
        return this.totalSeconds;
    }
    getProgress() {
        if (this.totalSeconds === 0)
            return 0;
        return ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
    }
    updateStatusBar(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        // 顯示進度百分比
        const progress = this.getProgress();
        const progressBar = this.createProgressBar(progress);
        this.statusBarItem.text = `⏱️ ${timeDisplay} ${progressBar}`;
        this.statusBarItem.tooltip = `倒數計時器 - 剩餘 ${seconds} 秒\n進度: ${Math.round(progress)}%\n點擊暫停`;
    }
    updateStatusBarForPaused() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        this.statusBarItem.text = `⏸️ ${timeDisplay} (已暫停)`;
        const mdTooltip = new vscode.MarkdownString(`倒數計時器已暫停 - 剩餘 ${this.remainingSeconds} 秒\n\n[恢復](command:countdown.start) | [停止鬧鐘](command:countdown.stop)`);
        mdTooltip.isTrusted = true;
        this.statusBarItem.tooltip = mdTooltip;
    }
    createProgressBar(progress) {
        const totalBlocks = 8;
        const filledBlocks = Math.round((progress / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    }
    finishCountdown() {
        var _a, _b;
        this.state = types_1.CountdownState.STOPPED;
        // 更新歷史記錄
        if (this.historyItem) {
            this.historyItem.endTime = new Date();
            this.historyItem.completed = true;
        }
        // 顯示完成通知
        const message = ((_a = this.options.notifications) === null || _a === void 0 ? void 0 : _a.customCompletionMessage) || '⏰ 倒數計時完成！';
        if (((_b = this.options.notifications) === null || _b === void 0 ? void 0 : _b.showCompletionNotification) !== false) {
            vscode.window.showInformationMessage(message, '再來一次', '關閉')
                .then(selection => {
                if (selection === '再來一次') {
                    this.restartWithSameSettings();
                }
            });
        }
        this.stopCountdown();
    }
    restartWithSameSettings() {
        this.state = types_1.CountdownState.STOPPED;
        this.startCountdown(this.totalSeconds);
    }
    stopCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.state = types_1.CountdownState.STOPPED;
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.startTime = null;
        this.pausedTime = 0;
        // 重設狀態欄為預設狀態
        this.statusBarItem.text = "⏰";
        this.statusBarItem.tooltip = "點擊開始倒數計時";
        this.statusBarItem.command = 'countdown.quickStart';
    }
    getHistoryItem() {
        return this.historyItem;
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    // 獲取格式化的時間字串
    getFormattedTime(seconds = this.remainingSeconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    // 設定自訂完成訊息
    setCustomMessage(message) {
        if (this.options.notifications) {
            this.options.notifications.customCompletionMessage = message;
        }
    }
}
exports.Countdown = Countdown;
