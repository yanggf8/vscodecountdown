import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { Countdown } from '../../countdown';
import { CountdownState, CountdownOptions } from '../../types';

suite('Countdown Tests', () => {
  let statusBarItem: vscode.StatusBarItem;
  let countdown: Countdown;
  let clock: sinon.SinonFakeTimers;

  setup(() => {
    // 創建模擬的 StatusBarItem
    statusBarItem = {
      text: '',
      tooltip: '',
      command: '',
      show: sinon.stub(),
      hide: sinon.stub(),
      dispose: sinon.stub(),
    } as any;

    // 模擬 vscode.window.showInformationMessage
    sinon.stub(vscode.window, 'showInformationMessage');
    sinon.stub(vscode.window, 'showWarningMessage');
    sinon.stub(vscode.window, 'showErrorMessage');

    // 使用假時鐘來控制計時器
    clock = sinon.useFakeTimers();
  });

  teardown(() => {
    sinon.restore();
    clock.restore();
  });

  suite('Constructor', () => {
    test('應該正確初始化 Countdown 實例', () => {
      const options: CountdownOptions = { duration: 60 };
      countdown = new Countdown(statusBarItem, options);

      assert.strictEqual(countdown.getState(), CountdownState.STOPPED);
      assert.strictEqual(countdown.getRemainingTime(), 0);
      assert.strictEqual(countdown.getTotalTime(), 0);
    });
  });

  suite('Start Countdown', () => {
    test('應該能正常開始倒數計時', () => {
      countdown = new Countdown(statusBarItem);
      countdown.startCountdown(60);

      assert.strictEqual(countdown.getState(), CountdownState.RUNNING);
      assert.strictEqual(countdown.getRemainingTime(), 60);
      assert.strictEqual(countdown.getTotalTime(), 60);
    });

    test('應該拒絕無效的倒數時間', () => {
      countdown = new Countdown(statusBarItem);
      countdown.startCountdown(0);

      assert.strictEqual(countdown.getState(), CountdownState.STOPPED);
      sinon.assert.calledWith(vscode.window.showErrorMessage as sinon.SinonStub, '無效的倒數時間');
    });
  });
});
