const ReleaseTaskRunner = require('../../jeli-cli/packages/cli/lib/utils/release-task');
const path = require('path');

async function runTask() {
    const cliVersion = require('@jeli/cli/package.json').version;
    const taskRunner = new ReleaseTaskRunner(path.resolve(__dirname, '../packages'), 'npm', '', cliVersion);
    const confirmRelease = await taskRunner.versionPrompt();
    if (!confirmRelease) return;
    await taskRunner.updatePackageVersionTask('Updating package versions...');
    // TODO: fix lock file update command
    // await taskRunner.updateLockFileTask()
    await taskRunner.buildTask(['run', 'build'])
    await taskRunner.gitCommitTask('commit git changes ..', [
        ['add', '-A'],
        ['commit', '-m', `release: v${taskRunner.targetVersion}`]
    ]);
    await taskRunner.publishTask('Publishing Packages...', taskRunner.targetVersion);
    await taskRunner.gitPushTask('Push to git..', [
        ['tag', `v${taskRunner.targetVersion}`],
        ['push', 'origin', `refs/tags/v${taskRunner.targetVersion}`],
        ['push']
    ]);
}

runTask();