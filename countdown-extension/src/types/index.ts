// 計時器狀態枚舉
export enum CountdownState {
    STOPPED = 'stopped',
    RUNNING = 'running',
    PAUSED = 'paused'
}

// 通知選項
export interface NotificationOptions {
    showProgressNotification?: boolean;
    showCompletionNotification?: boolean;
    customCompletionMessage?: string;
    playSound?: boolean;
}

// 倒數計時器選項
export interface CountdownOptions {
    duration: number; // 倒數的秒數
    message?: string; // 可選的提示訊息
    notifications?: NotificationOptions;
    autoStart?: boolean;
}

// 計時器歷史記錄項目
export interface CountdownHistoryItem {
    id: string;
    duration: number;
    startTime: Date;
    endTime?: Date;
    completed: boolean;
    message?: string;
}

// 計時器統計資料
export interface CountdownStats {
    totalSessions: number;
    totalTimeSpent: number;
    completedSessions: number;
    averageSessionLength: number;
}

// 預設時間選項
export interface PresetTimeOption {
    label: string;
    description: string;
    value: number;
    icon?: string;
}

// 狀態欄配置
export interface StatusBarConfig {
    showSeconds?: boolean;
    showProgress?: boolean;
    customFormat?: string;
}