import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { Countdown } from '../../countdown';

describe('Extension Test Suite', () => {
  let originalNotifications: any;
  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
    // Save original settings before each test
    originalNotifications = vscode.workspace.getConfiguration('countdown').get('notifications');
  });

  afterEach(async () => {
    // Restore original settings and stubs after each test
    await vscode.workspace.getConfiguration('countdown').update('notifications', originalNotifications, vscode.ConfigurationTarget.Global);
    sandbox.restore();
  });

  it('Should display a warning notification at the configured time', async function() {
    this.timeout(20000); // Increase timeout for this integration test

    // 1. Configure the warning notification settings for the test
    const config = vscode.workspace.getConfiguration('countdown');
    const testNotifications = { ...originalNotifications, warningTime: 5, showCountdownWarning: true };
    await config.update('notifications', testNotifications, vscode.ConfigurationTarget.Global);

    // 2. Stub the input box to simulate user entering '10' seconds
    sandbox.stub(vscode.window, 'showInputBox').resolves('10');

    // 3. Listen for the warning message
    const warningMessagePromise = new Promise<string>(resolve => {
      sandbox.stub(vscode.window, 'showWarningMessage').callsFake((message: string) => {
        resolve(message);
        return Promise.resolve(undefined);
      });
    });

    // 4. Execute the start command
    await vscode.commands.executeCommand('countdown.start');

    // 5. Wait for the warning message to be resolved
    const warningMessage = await warningMessagePromise;

    // 6. Assert that the message is correct
    assert.ok(
      warningMessage.includes('計時器即將完成！'),
      `Expected warning message to include '計時器即將完成！', but got '${warningMessage}'`
    );
  });

  it('Should play a sound on completion when enabled', async function() {
    this.timeout(10000);

    // 1. Configure sound notifications
    const config = vscode.workspace.getConfiguration('countdown');
    const testNotifications = { ...originalNotifications, sound: true };
    await config.update('notifications', testNotifications, vscode.ConfigurationTarget.Global);

    // 2. Stub input and spy on the beep method
    sandbox.stub(vscode.window, 'showInputBox').resolves('1'); // 1-second countdown
    const beepSpy = sandbox.spy(Countdown.prototype, 'playSystemBeep');

    // 3. Listen for the completion message
    const completionMessagePromise = new Promise<void>(resolve => {
      sandbox.stub(vscode.window, 'showInformationMessage').callsFake(async (message: string, ...items: any[]) => {
        if (message.includes('倒數計時完成！')) {
          resolve();
        }
        return undefined;
      });
    });

    // 4. Start countdown
    await vscode.commands.executeCommand('countdown.start');

    // 5. Wait for the completion message
    await completionMessagePromise;

    // 6. Assert that the beep was triggered
    assert.ok(beepSpy.calledWith(3), 'Expected the beep method to be called with 3');
  });
});