// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from 'fs';
import { join, sep } from 'path';
import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";
import { options } from "common-variable";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "name-genie" is now active!');

	let disposableWebView = vscode.window.registerWebviewViewProvider(
		"name-genie.webview",
		new WebViewProvider(context.extensionUri, context.extensionPath)
	);

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

				const config = vscode.workspace.getConfiguration("name-genie");
				// Obtain an API key
				const apikey = config.get("apiKey") as string | undefined;
				// Obtain a model
				const model = config.get("model") as "gpt-4" | "gpt-3.5-turbo-0301" | "gpt-3.5-turbo" | undefined;
				// Get temperature
				const temperature = config.get("temperature") as number | undefined;
				if (!apikey || typeof apikey !== "string") {
					vscode.window.showErrorMessage("API key is not set.");
					webviewView.webview.postMessage({
						command: "result", value: JSON.stringify({
							data: [
								"APIキーが設定されていません"
							],
						})
					});
					return;
				}
				if (!model && typeof model !== "string") {
					vscode.window.showErrorMessage("No model is set.");
					return;
				}
				const openaiConfig = new Configuration({ apiKey: apikey });
				const openaiClient = new OpenAIApi(openaiConfig);

				let command = "関数名";
				for (const option of options) {
					if (option.value === message.command) {
						command = option.text;
						break;
					}
				}
				let text = "";
				const descriptions = [message.description1, message.description2, message.description3]
				descriptions.filter((value) => value).map((value) => { text += `- ${value}\n`  })
				const prompt = `
				# Example
				次の内容を表す関数名を3つ作成してください。
				出力結果は次のJSONフォーマットに沿って出力してください。
				それ以外の文字列は出力しないでください。
				===
				- 音声を作成する
				- テキストを音声に変換する
				===

				{
					data: [
						"createAudio",
						"convertTextToAudio",
						"convertTxtToAudio"
					]
				}

				# Task
				次の内容を表す${command}を3つ作成してください。
				出力結果は次のJSONフォーマットに沿って出力してください。
				それ以外の文字列は出力しないでください。
				===
				${text}
				===
				`;
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