import React, { useEffect } from "react";
import type { WebviewApi } from "vscode-webview";

type Props = {
  vscode?: WebviewApi<unknown>;
}
export const VSCodeContext = React.createContext<Props>({
  vscode: undefined,
})

export function VSCodeProvider({ children }: { children: React.ReactNode }) {
  const acquireVsCodeApiCalled = React.useRef(false);
  const [vscodeState, setVscodeState] = React.useState<WebviewApi<unknown> | undefined>(undefined);
  useEffect(() => {
    if (!acquireVsCodeApiCalled.current) {
      acquireVsCodeApiCalled.current = true;
      const vscode = acquireVsCodeApi();
      setVscodeState(vscode);
    }
  }, [])
  return (
    <VSCodeContext.Provider value={{ vscode: vscodeState }}>
      {children}
    </VSCodeContext.Provider>
  )
}