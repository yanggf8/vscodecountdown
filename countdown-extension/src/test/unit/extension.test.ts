import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { activate, deactivate } from '../../extension';

suite('Extension Tests', () => {
  let context: vscode.ExtensionContext;
  let sandbox: sinon.SinonSandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    // 模擬 ExtensionContext
    context = {
      subscriptions: [],
      globalState: {
        get: sandbox.stub().returns([]),
        update: sandbox.stub().resolves(),
        keys: sandbox.stub().returns([]),
        setKeysForSync: sandbox.stub(),
      },
      workspaceState: {
        get: sandbox.stub().returns(undefined),
        update: sandbox.stub().resolves(),
        keys: sandbox.stub().returns([]),
      },
      extensionUri: vscode.Uri.parse('file:///test'),
      extensionPath: '/test/path',
      storagePath: '/test/storage',
      globalStoragePath: '/test/global-storage',
      logPath: '/test/log',
      asAbsolutePath: sandbox.stub().returns('/test/absolute'),
      extensionMode: vscode.ExtensionMode.Test,
      secrets: {} as any,
      environmentVariableCollection: {} as any,
      extension: {} as any,
      logUri: vscode.Uri.parse('file:///test/log'),
      storageUri: vscode.Uri.parse('file:///test/storage'),
      globalStorageUri: vscode.Uri.parse('file:///test/global-storage'),
      languageModelAccessInformation: {} as any,
    };

    // 模擬 VSCode API
    sandbox.stub(vscode.window, 'createStatusBarItem').returns({
      text: '',
      tooltip: '',
      command: '',
      show: sandbox.stub(),
      hide: sandbox.stub(),
      dispose: sandbox.stub(),
    } as any);

    sandbox.stub(vscode.commands, 'registerCommand').returns({
      dispose: sandbox.stub(),
    } as any);

    sandbox.stub(vscode.window, 'registerWebviewViewProvider').returns({
      dispose: sandbox.stub(),
    } as any);

    sandbox.stub(vscode.window, 'showInputBox').resolves('60');
    sandbox.stub(vscode.window, 'showQuickPick').resolves(undefined);
    sandbox.stub(vscode.window, 'showInformationMessage').resolves(undefined);
    sandbox.stub(vscode.window, 'showWarningMessage').resolves(undefined);
    sandbox.stub(vscode.window, 'showErrorMessage').resolves(undefined);
  });

  teardown(() => {
    sandbox.restore();
  });

  suite('Activation', () => {
    test('應該正確啟動擴展', () => {
      activate(context);

      // 檢查是否創建了狀態欄項目
      sinon.assert.calledOnce(vscode.window.createStatusBarItem as sinon.SinonStub);

      // 檢查是否註冊了命令
      sinon.assert.called(vscode.commands.registerCommand as sinon.SinonStub);

      // 檢查是否註冊了 WebviewViewProvider
      sinon.assert.called(vscode.window.registerWebviewViewProvider as sinon.SinonStub);
    });

    test('應該從全域狀態載入歷史記錄', () => {
      const mockHistory = [
        {
          id: '1',
          duration: 60,
          startTime: new Date(),
          completed: true,
        },
      ];

      (context.globalState.get as sinon.SinonStub).returns(mockHistory);

      activate(context);

      sinon.assert.calledWith(context.globalState.get as sinon.SinonStub, 'countdownHistory', []);
    });
  });

  suite('Deactivation', () => {
    test('應該正確停用擴展', () => {
      activate(context);
      deactivate();

      // 測試通過，如果沒有錯誤拋出
      assert.ok(true);
    });
  });
});
