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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const countdown_1 = require("./countdown");
const types_1 = require("./types");
const CountdownOptionsViewProvider_1 = require("./providers/CountdownOptionsViewProvider");
let countdown = null;
let countdownStatusBarItem;
let countdownHistory = [];
let countdownOptionsProvider;
function initializeStatusBar() {
    if (!countdownStatusBarItem) {
        countdownStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        countdownStatusBarItem.text = "⏰";
        const mdTooltip = new vscode.MarkdownString(`
**快速預設**
- [⏱️ 5 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([300, "短暫休息"]))})
- [☕ 15 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([900, "茶歇時間"]))})
- [🍅 25 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([1500, "番茄工作法"]))})
- [⏰ 30 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([1800, "會議時間"]))})
- [🎯 1 小時](command:countdown.select?${encodeURIComponent(JSON.stringify([3600, "深度工作"]))})
- [📚 90 分鐘](command:countdown.select?${encodeURIComponent(JSON.stringify([5400, "學習時間"]))})
<br/>點擊圖示選擇或快速啟動
        `);
        mdTooltip.isTrusted = true;
        countdownStatusBarItem.tooltip = mdTooltip;
        countdownStatusBarItem.command = 'countdown.quickStart';
        countdownStatusBarItem.show();
    }
}
function addToHistory(item) {
    countdownHistory.unshift(item);
    // 保持歷史記錄在合理範圍內
    if (countdownHistory.length > 50) {
        countdownHistory = countdownHistory.slice(0, 50);
    }
}
function activate(context) {
    // 從擴展上下文載入歷史記錄
    countdownHistory = context.globalState.get('countdownHistory', []);
    // 初始化狀態欄
    initializeStatusBar();
    context.subscriptions.push(countdownStatusBarItem);
    // 註冊預設選擇命令，用於 tooltip command link
    const selectDisposable = vscode.commands.registerCommand('countdown.select', (seconds, description) => {
        if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
            countdown.stopCountdown();
        }
        const options = { duration: seconds, message: description };
        countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
        countdown.startCountdown();
    });
    context.subscriptions.push(selectDisposable);
    // 創建並註冊 CountdownOptionsViewProvider
    countdownOptionsProvider = new CountdownOptionsViewProvider_1.CountdownOptionsViewProvider(context.extensionUri, (seconds, description) => {
        // 當用戶選擇計時器選項時的回調
        if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
            countdown.stopCountdown();
        }
        const options = {
            duration: seconds,
            message: description
        };
        countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
        countdown.startCountdown();
    });
    // 註冊 WebviewViewProvider
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(CountdownOptionsViewProvider_1.CountdownOptionsViewProvider.viewType, countdownOptionsProvider));
    // 開始倒數計時命令
    let startDisposable = vscode.commands.registerCommand('countdown.start', () => __awaiter(this, void 0, void 0, function* () {
        if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
            const choice = yield vscode.window.showWarningMessage('倒數計時器已在運行中，要停止當前的並開始新的嗎？', '是', '否');
            if (choice === '是') {
                countdown.stopCountdown();
            }
            else {
                return;
            }
        }
        const seconds = yield vscode.window.showInputBox({
            placeHolder: '輸入倒數秒數 (例如: 300 = 5分鐘)',
            prompt: '請輸入正整數',
            validateInput: (value) => {
                const num = Number(value);
                return isNaN(num) || num <= 0 || num > 86400 ? '請輸入 1-86400 之間的正整數' : null;
            }
        });
        if (seconds) {
            // 詢問是否要自訂完成訊息
            const customMessage = yield vscode.window.showInputBox({
                placeHolder: '自訂完成訊息 (可選)',
                prompt: '倒數結束時顯示的訊息，留空使用預設訊息'
            });
            const options = {
                duration: parseInt(seconds),
                message: customMessage || undefined,
                notifications: {
                    customCompletionMessage: customMessage || '⏰ 倒數計時完成！'
                }
            };
            countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
            countdown.startCountdown();
        }
    }));
    // 停止倒數計時命令
    let stopDisposable = vscode.commands.registerCommand('countdown.stop', () => {
        if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
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
            countdownStatusBarItem.text = "⏰";
            countdownStatusBarItem.tooltip = "點擊開始倒數計時";
            vscode.window.showInformationMessage('倒數計時器已停止');
        }
        else {
            vscode.window.showInformationMessage('沒有正在運行的倒數計時器');
        }
    });
    // 暫停倒數計時命令
    let pauseDisposable = vscode.commands.registerCommand('countdown.pause', () => {
        if (countdown && countdown.getState() === types_1.CountdownState.RUNNING) {
            countdown.pauseCountdown();
        }
        else {
            vscode.window.showInformationMessage('沒有正在運行的倒數計時器可以暫停');
        }
    });
    // 恢復倒數計時命令
    let resumeDisposable = vscode.commands.registerCommand('countdown.resume', () => {
        if (countdown && countdown.getState() === types_1.CountdownState.PAUSED) {
            countdown.resumeCountdown();
        }
        else {
            vscode.window.showInformationMessage('沒有暫停的倒數計時器可以恢復');
        }
    });
    // 快速開始命令 (顯示 Panel)
    let quickStartDisposable = vscode.commands.registerCommand('countdown.quickStart', () => __awaiter(this, void 0, void 0, function* () {
        try {
            // 顯示倒數計時選項 Panel
            yield vscode.commands.executeCommand('workbench.view.panel.countdownOptions');
            // 同步顯示 QuickPick 下拉選單
            const presets = [
                { label: '⏱️ 5 分鐘', description: '專注時間', value: 300, icon: '⏱️' },
                { label: '☕ 15 分鐘', description: '休息時間', value: 900, icon: '☕' },
                { label: '🍅 25 分鐘', description: '番茄工作法', value: 1500, icon: '🍅' },
                { label: '⏰ 30 分鐘', description: '會議時間', value: 1800, icon: '⏰' },
                { label: '🎯 1 小時', description: '深度工作', value: 3600, icon: '🎯' },
                { label: '📚 90 分鐘', description: '學習時間', value: 5400, icon: '📚' },
                { label: '🔧 自訂時間...', description: '輸入自訂的倒數時間', value: -1, icon: '🔧' }
            ];
            const selected = yield vscode.window.showQuickPick(presets, { placeHolder: '選擇預設的倒數時間' });
            if (selected) {
                if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
                    countdown.stopCountdown();
                }
                if (selected.value === -1) {
                    vscode.commands.executeCommand('countdown.start');
                }
                else {
                    const options = { duration: selected.value, message: selected.description };
                    countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
                    countdown.startCountdown();
                }
            }
            countdownOptionsProvider.show();
        }
        catch (error) {
            // 如果 Panel 無法顯示，退回到原本的 QuickPick 作為 fallback
            console.warn('無法顯示倒數計時選項 Panel，使用 QuickPick 作為替代方案:', error);
            const presets = [
                { label: '⏱️ 5 分鐘', description: '專注時間', value: 300, icon: '⏱️' },
                { label: '☕ 15 分鐘', description: '休息時間', value: 900, icon: '☕' },
                { label: '🍅 25 分鐘', description: '番茄工作法', value: 1500, icon: '🍅' },
                { label: '⏰ 30 分鐘', description: '會議時間', value: 1800, icon: '⏰' },
                { label: '🎯 1 小時', description: '深度工作', value: 3600, icon: '🎯' },
                { label: '📚 90 分鐘', description: '學習時間', value: 5400, icon: '📚' },
                { label: '🔧 自訂時間...', description: '輸入自訂的倒數時間', value: -1, icon: '🔧' }
            ];
            const selected = yield vscode.window.showQuickPick(presets, {
                placeHolder: '選擇預設的倒數時間'
            });
            if (selected) {
                if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
                    countdown.stopCountdown();
                }
                if (selected.value === -1) {
                    // 自訂時間
                    vscode.commands.executeCommand('countdown.start');
                    return;
                }
                const options = {
                    duration: selected.value,
                    message: selected.description
                };
                countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
                countdown.startCountdown();
            }
        }
    }));
    // 查看計時歷史記錄命令
    let historyDisposable = vscode.commands.registerCommand('countdown.history', () => __awaiter(this, void 0, void 0, function* () {
        if (countdownHistory.length === 0) {
            vscode.window.showInformationMessage('暫無計時歷史記錄');
            return;
        }
        const historyItems = countdownHistory.map(item => {
            const duration = formatDuration(item.duration);
            const status = item.completed ? '✅ 已完成' : '⏹️ 已停止';
            const startTime = item.startTime.toLocaleString();
            const description = item.message || '無描述';
            return {
                label: `${status} ${duration}`,
                description: description,
                detail: `開始時間: ${startTime}`,
                item: item
            };
        });
        const selected = yield vscode.window.showQuickPick(historyItems, {
            placeHolder: '選擇歷史記錄項目',
            matchOnDescription: true,
            matchOnDetail: true
        });
        if (selected) {
            const choice = yield vscode.window.showInformationMessage(`重新開始這個 ${formatDuration(selected.item.duration)} 的計時器？`, '開始', '刪除此記錄', '取消');
            if (choice === '開始') {
                if (countdown && countdown.getState() !== types_1.CountdownState.STOPPED) {
                    countdown.stopCountdown();
                }
                const options = {
                    duration: selected.item.duration,
                    message: selected.item.message
                };
                countdown = new countdown_1.Countdown(countdownStatusBarItem, options);
                countdown.startCountdown();
            }
            else if (choice === '刪除此記錄') {
                countdownHistory = countdownHistory.filter(h => h.id !== selected.item.id);
                saveHistory(context);
                vscode.window.showInformationMessage('歷史記錄已刪除');
            }
        }
    }));
    // 清除歷史記錄命令
    let clearHistoryDisposable = vscode.commands.registerCommand('countdown.clearHistory', () => __awaiter(this, void 0, void 0, function* () {
        const choice = yield vscode.window.showWarningMessage('確定要清除所有計時歷史記錄嗎？', '確定', '取消');
        if (choice === '確定') {
            countdownHistory = [];
            saveHistory(context);
            vscode.window.showInformationMessage('計時歷史記錄已清除');
        }
    }));
    // 顯示計時統計命令
    let statsDisposable = vscode.commands.registerCommand('countdown.stats', () => {
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
    // 當倒數計時完成時，自動加入歷史記錄
    const originalFinishCallback = () => {
        if (countdown) {
            const historyItem = countdown.getHistoryItem();
            if (historyItem) {
                addToHistory(historyItem);
                saveHistory(context);
            }
        }
    };
    context.subscriptions.push(startDisposable, stopDisposable, pauseDisposable, resumeDisposable, quickStartDisposable, historyDisposable, clearHistoryDisposable, statsDisposable);
}
exports.activate = activate;
function saveHistory(context) {
    context.globalState.update('countdownHistory', countdownHistory);
}
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}小時${minutes}分${secs}秒`;
    }
    else if (minutes > 0) {
        return `${minutes}分${secs}秒`;
    }
    else {
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
        averageSessionLength
    };
}
function deactivate() {
    if (countdown) {
        countdown.stopCountdown();
    }
    if (countdownStatusBarItem) {
        countdownStatusBarItem.dispose();
    }
}
exports.deactivate = deactivate;
