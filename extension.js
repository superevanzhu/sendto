// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process')
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sendto" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sendto', function () {
		// The code you place here will be executed every time your command is executed

		const currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;

		if (!currentlyOpenTabfilePath || /^Untitled\-/.test(currentlyOpenTabfilePath)) {
			console.log(`请先打开一个文件`);
			vscode.window.showInformationMessage(`请先打开一个文件`);
		}else{
			const workbenchConfig = vscode.workspace.getConfiguration('sendto')
			if (!workbenchConfig){
				console.log(`sendto配置缺失`);
				vscode.window.showInformationMessage(`sendto配置缺失`);
			}else{
				const target = workbenchConfig.get('target')
				
				// check target exist and is dir.
				if(!target){
					console.log(`sendto.target配置缺失`);
					vscode.window.showInformationMessage("sendto.target配置缺失");
				}else{
					fs.stat(target, (err, stats) => {
						if (err) {
							console.log(`${target} ${err ? '不存在' : '存在'}`);
							vscode.window.showInformationMessage(`${target} ${err ? '不存在' : '存在'}`);
						} else if (!stats.isDirectory()){
							console.log(`${target} 不是目录`);
							vscode.window.showInformationMessage(`${target} 不是目录`);
						}else{
							let cmd = "cp " + currentlyOpenTabfilePath + " " + target;
							cp.exec(cmd, (err, stdout, stderr) => {
								if (err) {
									console.log(err)
									vscode.window.showInformationMessage(err);
								} else {
									console.log(`当前文章复制到${target},success`)
									vscode.window.showInformationMessage(`当前文章复制到${target},success`);
								}
							});
						}
					})
				}
			}
			

		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
