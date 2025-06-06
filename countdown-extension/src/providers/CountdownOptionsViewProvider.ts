import * as vscode from 'vscode';
import { PresetTimeOption } from '../types';

export class CountdownOptionsViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'countdownOptions';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _onTimerSelected: (seconds: number, description?: string) => void
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // 監聽來自 webview 的訊息
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'selectTimer':
                        this._onTimerSelected(message.seconds, message.description);
                        this.hide();
                        break;
                    case 'customTimer':
                        // 呼叫原本的自訂計時器命令
                        vscode.commands.executeCommand('countdown.start');
                        this.hide();
                        break;
                }
            }
        );
    }

    public show() {
        if (this._view) {
            this._view.show?.(true);
        }
    }

    public hide() {
        if (this._view) {
            this._view.show?.(false);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // 預設時間選項
        const presets: PresetTimeOption[] = [
            { label: '5 分鐘', description: '短暫休息', value: 300, icon: '⏱️' },
            { label: '15 分鐘', description: '茶歇時間', value: 900, icon: '☕' },
            { label: '25 分鐘', description: '番茄工作法', value: 1500, icon: '🍅' },
            { label: '30 分鐘', description: '會議時間', value: 1800, icon: '⏰' },
            { label: '60 分鐘', description: '專注時間', value: 3600, icon: '🎯' },
            { label: '90 分鐘', description: '深度工作', value: 5400, icon: '📚' }
        ];

        const presetButtons = presets.map(preset => `
            <button class="preset-button" onclick="selectTimer(${preset.value}, '${preset.description}')">
                <span class="preset-icon">${preset.icon}</span>
                <div class="preset-content">
                    <span class="preset-label">${preset.label}</span>
                    <span class="preset-description">${preset.description}</span>
                </div>
            </button>
        `).join('');

        return `<!DOCTYPE html>
        <html lang="zh-TW">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>倒數計時選項</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-editor-background);
                    margin: 0;
                    padding: 16px;
                    box-sizing: border-box;
                }
                
                .container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-width: 100%;
                }
                
                .preset-button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: 1px solid var(--vscode-button-border, transparent);
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    min-height: 44px;
                    text-align: left;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .preset-button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                    border-color: var(--vscode-focusBorder);
                }
                
                .preset-button:active {
                    transform: translateY(1px);
                }
                
                .preset-icon {
                    font-size: 18px;
                    width: 24px;
                    text-align: center;
                    flex-shrink: 0;
                }
                
                .preset-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-width: 0;
                }
                
                .preset-label {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 2px;
                }
                
                .preset-description {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    opacity: 0.8;
                }
                
                .custom-section {
                    margin-top: 12px;
                    padding-top: 12px;
                    border-top: 1px solid var(--vscode-panel-border);
                }
                
                .custom-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border: 1px solid var(--vscode-button-secondaryBorder, var(--vscode-button-border));
                    background-color: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    width: 100%;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }
                
                .custom-button:hover {
                    background-color: var(--vscode-button-secondaryHoverBackground);
                }
                
                .title {
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: var(--vscode-foreground);
                }
                
                /* 響應式設計 */
                @media (max-width: 300px) {
                    .preset-button {
                        padding: 10px 12px;
                        min-height: 40px;
                    }
                    
                    .preset-icon {
                        font-size: 16px;
                        width: 20px;
                    }
                    
                    .preset-label {
                        font-size: 13px;
                    }
                    
                    .preset-description {
                        font-size: 11px;
                    }
                }
                
                /* 焦點樣式 */
                .preset-button:focus,
                .custom-button:focus {
                    outline: 1px solid var(--vscode-focusBorder);
                    outline-offset: 2px;
                }
                
                /* 高對比度支援 */
                @media (prefers-contrast: high) {
                    .preset-button,
                    .custom-button {
                        border-width: 2px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="title">選擇倒數時間</div>
                ${presetButtons}
                <div class="custom-section">
                    <button class="custom-button" onclick="customTimer()">
                        <span>🔧</span>
                        <span>自訂時間...</span>
                    </button>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function selectTimer(seconds, description) {
                    vscode.postMessage({
                        command: 'selectTimer',
                        seconds: seconds,
                        description: description
                    });
                }
                
                function customTimer() {
                    vscode.postMessage({
                        command: 'customTimer'
                    });
                }
                
                // 鍵盤導航支援
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        vscode.postMessage({
                            command: 'hide'
                        });
                    }
                });
                
                // 確保按鈕可以用鍵盤訪問
                const buttons = document.querySelectorAll('.preset-button, .custom-button');
                buttons.forEach((button, index) => {
                    button.setAttribute('tabindex', '0');
                    button.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            button.click();
                        }
                    });
                });
            </script>
        </body>
        </html>`;
    }
}