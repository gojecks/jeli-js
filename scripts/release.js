const ReleaseTaskRunner = require('../../jeli-cli/packages/cli/lib/utils/release-task');
const path = require('path');

async function runTask() {
    const cliVersion = require('@jeli/cli/package.json').version;
    const dirPath  = path.resolve(__dirname, '../packages');
    const distPath = path.resolve(__dirname, '../dist');
    const taskRunner = new ReleaseTaskRunner(dirPath, 'npm', '', cliVersion, distPath);
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