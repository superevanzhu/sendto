// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process')
const fs = require('fs');
const os = require('os');
const path = require('path');
const fecha = require("fecha")


// 我的日志函数。省的每次都写两行代码啊
function mylog(info){
	console.log(info);
	vscode.window.showInformationMessage(info);
}

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
			mylog(`请先打开一个文件`);
		}else{
			const workbenchConfig = vscode.workspace.getConfiguration('sendto')
			if (!workbenchConfig){
				mylog(`sendto配置缺失`);
			}else{
				const target = workbenchConfig.get('target')
				
				// check target exist and is dir.
				if(!target){
					mylog(`sendto.target配置缺失`);
				}else{
					fs.stat(target, (err, stats) => {
						if (err) {
							mylog(`${target} ${err ? '不存在' : '存在'}`);
						} else if (!stats.isDirectory()){
							mylog(`${target} 不是目录`);
						}else{
							//配置中开启了meta检查。开启，则要确保文章有元信息。
							if(workbenchConfig.get('meta')){
								insureHasMeta(currentlyOpenTabfilePath,(err)=>{
									if(err){
										mylog(err);
									}else{
										doSend(currentlyOpenTabfilePath,target)
									}
								})
							}else{
								doSend(currentlyOpenTabfilePath,target)
							}
						}
					})
				}
			}
		}
	});

	context.subscriptions.push(disposable);
}

/**
 * 确保文章有元信息。没有，则构建并添加到开头
 * @param  {[type]}   filePath [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function insureHasMeta(filePath, callback=()=>{}) {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            callback(err)
            return 
        }

        //如果不包含元信息，需要构建并写在开头
        if (!(/^\-\-\-[^]*[\r\n]title:[^]*[\r\n]\-\-\-/).test(data)) {
            let meta = [
                "---",
                "title: " + path.basename(filePath, ".md"),
                "date: " + fecha.format(Date.now(), 'YYYY-MM-DD'),
                "tags: ",
                "---",
            ].join(os.EOL)

			fs.writeFile(filePath, meta + os.EOL + data, (err) => {
                if (err) {
                	callback(err)
                }else{
                	callback(null)
                }
            });
        }
    })
}

/**
 * 复制文件到目录
 * @param  {[type]} filePath [description]
 * @param  {[type]} target   [description]
 * @return {[type]}          [description]
 */
function doSend(filePath,target){
	let cmd = "cp " + filePath + " " + target;
	cp.exec(cmd, (err, stdout, stderr) => {
		if (err) {
			mylog(err)
		} else {
			mylog(`成功复制当前文件到${target}`)
		}
	});
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
