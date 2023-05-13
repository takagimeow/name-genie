// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from 'fs';
import { join, sep } from 'path';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "name-genie" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('name-genie.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Name Genie!');
	});

	let disposableWebView = vscode.window.registerWebviewViewProvider(
		"name-genie.webview",
		new WebViewProvider(context.extensionUri, context.extensionPath)
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableWebView);
}

// This method is called when your extension is deactivated
export function deactivate() { }

class WebViewProvider {
	constructor(private extensionUri: vscode.Uri, private extensionPath: string) {
		console.log("HELLO WORLD");
	 }

	public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken) {
		const mediaPath = join(this.extensionPath, "dist", "media");
		const htmlFileName = "index.html";
		let indexHtml = readFileSync(join(mediaPath, htmlFileName), "utf8");
		const scriptPathOnDisk = vscode.Uri.file(join(mediaPath, sep));
		const scriptUri = webviewView.webview.asWebviewUri(scriptPathOnDisk);
		indexHtml = indexHtml
			.replace(
				/<script type="module" crossorigin src="\/assets\//g,
				`<script type="module" crossorigin src="${scriptUri.toString()}assets/`
			)
			.replace(
				/<link rel="stylesheet" href="\/assets\//g,
				`<link rel="stylesheet" href="${scriptUri.toString()}assets/`
			);
		console.log("indexHtml: ", indexHtml);
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(mediaPath)],
		};
		webviewView.webview.html = indexHtml;
		webviewView.webview.onDidReceiveMessage(
			message => {
				console.log("message: ", message);
				// send message
				webviewView.webview.postMessage({ command: "result", value: "Hello from the extension" });
			}
		);
	}
}