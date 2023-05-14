// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from 'fs';
import { join, sep } from 'path';
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";

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
			async message => {
				console.log("message: ", message);

				const config = vscode.workspace.getConfiguration("chatgpt-editor");
				// Obtain an API key
				const apikey = config.get("apiKey") as string | undefined;
				// Obtain a model
				const model = config.get("model") as "gpt-4" | "gpt-3.5-turbo-0301" | "gpt-3.5-turbo" | undefined;
				// Get temperature
				// const temperature = config.get("temperature") as number | undefined;
				if (!apikey && typeof apikey !== "string") {
					vscode.window.showErrorMessage("API key is not set.");
					return;
				}
				if (!model && typeof model !== "string") {
					vscode.window.showErrorMessage("No model is set.");
					return;
				}
				const openaiConfig = new Configuration({ apiKey: apikey });
				const openaiClient = new OpenAIApi(openaiConfig);

				let command = "関数名";
				switch (message.command) {
					case "variableName":
						command = "変数名";
						break;
					case "functionName":
						command = "関数名";
						break;
					case "fileName":
						command = "ファイル名";
						break;
					case "className":
						command = "クラス名";
						break;
					case "branchName":
						command = "ブランチ名";
						break;
					case "commitMessage":
						command = "コミットメッセージ";
						break;
					case "pullRequestTitle":
						command = "プルリクエストのタイトル";
						break;
				}
				let text = ''
				const descriptions = [message.description1, message.description2, message.description3]
				descriptions.filter((value) => value).map((value) => { text += `- ${value}\n`  })
				const prompt = `
				次の内容を表す${command}を3つ作成してください。
				===
				${text}
				===

				出力結果は次のJSONフォーマットに沿って出力してください。
				それ以外の文字列は出力しないでください。
				===
				{
					"result1": "createAudio",
					"result2": "convertTextToAudio",
					"result3": "convertTxtToAudio"
				}
				===
				`
				let content = "";
				try {
					const response = await openaiClient.createChatCompletion({
						model: model ?? "gpt-3.5",
						messages: [{ role: "user", content: prompt }],
						temperature: temperature ?? 0.1,
					});
					content = response.data.choices[0].message?.content ?? "";
					console.log("content: ", content);
					// check if the result is valid JSON
					JSON.parse(content);
				} catch(e) {
					console.log(e);
					content = JSON.stringify({
						"result1": "結果が見つかりませんでした",
					});
				}

				// send message
				webviewView.webview.postMessage({ command: "result", value: content });
			}
		);
	}
}