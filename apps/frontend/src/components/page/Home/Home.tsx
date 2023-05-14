import React, { useCallback, FormEvent, useState, useEffect, useContext } from "react";
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import styles from "./Home.module.css";
import { VSCodeContext } from "../../ui/VSCodeProvider/VSCodeProvider";
import { z } from "zod";
import { options } from "common-variable";
const schema = {
  command: z.union([z.literal("variableName"), z.literal("functionName"), z.literal("fileName"), z.literal("className"), z.literal("interfaceName"), z.literal("branchName"), z.literal("commitMessage"), z.literal("pullRequestTitle")]),
  description1: z.string().nonempty().max(144),
  description2: z.string().max(144).optional(),
  description3: z.string().max(144).optional(),
}

export function HomeIndexPage() {
  const { vscode } = useContext(VSCodeContext);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("variableName");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [description3, setDescription3] = useState("");
  const [description1Error, setDescription1Error] = useState("");
  const [description2Error, setDescription2Error] = useState("");
  const [description3Error, setDescription3Error] = useState("");
  const handleSelectOption = useCallback((e: Event | React.FormEvent<HTMLElement>) => {
    // retrieve selected option value from event
    const selectedOption = (e.target as HTMLSelectElement).value;
    setSelectedOption(selectedOption);
  }, []);
  const handleDescriptionChange = useCallback((e: Event | React.FormEvent<HTMLElement>) => {
    // retrieve id
    const id = (e.target as any)?.id;
    // retrieve value
    const value = (e.target as any)?.value ?? "";
    if (!id) return;
    switch(id) {
      case "my-text-field-1":
        setDescription1(value);
        break;
      case "my-text-field-2":
        setDescription2(value);
        break;
      case "my-text-field-3":
        setDescription3(value);
        break;
    }
  }, []);
  const handleSubmit = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    // 検証
    const result = schema.command.safeParse(selectedOption);
    if (!result.success) {
      return;
    }
    const result1 = schema.description1.safeParse(description1);
    if (!result1.success) {
      // retrieve error message from zod error message
      const errorMessage = result1.error.issues[0].message;
      setDescription1Error(errorMessage);
    }
    const result2 = schema.description2.safeParse(description2);
    if (!result2.success) {
      // retrieve error message from zod error message
      const errorMessage = result2.error.issues[0].message;
      setDescription2Error(errorMessage);
    }
    const result3 = schema.description3.safeParse(description3);
    if (!result3.success) {
      // retrieve error message from zod error message
      const errorMessage = result3.error.issues[0].message;
      setDescription3Error(errorMessage);
    }

    if (!result.success || !result1.success || !result2.success || !result3.success) {
      return;
    }

    setLoading(true);
    setSubmitted(true);

    vscode?.postMessage({
      command: selectedOption,
      description1,
      description2,
      description3,
    });
  }, [vscode, selectedOption, description1, description2, description3]);

  useEffect(() => {
    const callback = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case 'result':
          const newResult = JSON.parse(message.value);
          // check newResult has data property and newResult.data is an array of string
          if (!newResult.data || !Array.isArray(newResult.data)) {
            break;
          }
          setResults(newResult.data);
          break;
      }
      setLoading(false);
    }
    window.addEventListener('message', callback);

    return () => {
      window.removeEventListener('message', callback);
    }
  }, [])
  return (
    <div className="py-3 w-full h-full">
      <form className="mb-3">
        <div className={`${styles['dropdown-container']} mb-3 w-full`}>
          <label htmlFor="my-dropdown">作成したい名前</label>
          <VSCodeDropdown className="w-full" id="my-dropdown" onChange={handleSelectOption}>
            {
              options.map((option) => (
                <VSCodeOption key={option.value} value={option.value}>{option.text}</VSCodeOption>
              ))
            }
          </VSCodeDropdown>
        </div>
        <div className={`${styles['dropdown-container']} mb-3 w-full`}>
          <label htmlFor="my-text-field-1">説明1<span className="text-red-500">*</span></label>
          <VSCodeTextField id="my-text-field-1" name="example1" className="w-full" placeholder="動画の音声を文字列に変換する" onChange={handleDescriptionChange} />
          {
            description1Error && (
              <p className="text-red-500 text-xs">{description1Error}</p>
            )
          }
        </div>
        <div className={`${styles['dropdown-container']} mb-3 w-full`}>
          <label htmlFor="my-text-field-2">説明2<span className="">{"(任意)"}</span></label>
          <VSCodeTextField id="my-text-field-2" name="example1" className="w-full" placeholder="変換された文字列は日本語になる" onChange={handleDescriptionChange}/>
          {
            description2Error && (
              <p className="text-red-500 text-xs">{description2Error}</p>
            )
          }
        </div>
        <div className={`${styles['dropdown-container']} mb-3 w-full`}>
          <label htmlFor="my-text-field-3">説明3<span className="">{"(任意)"}</span></label>
          <VSCodeTextField id="my-text-field-3" name="example1" className="w-full" placeholder="32文字以内で作成してください" onChange={handleDescriptionChange}/>
          {
            description3Error && (
              <p className="text-red-500 text-xs">{description3Error}</p>
            )
          }
        </div>
        <VSCodeButton disabled={loading} className="w-full" appearance="primary" onClick={handleSubmit}>Ask Genie</VSCodeButton>
      </form>
      {
        submitted && (
          <div className={`w-full h-full flex flex-col ${styles['result-container']}`}>
            {
              loading ? (
                <div className="flex flex-col items-center justify-center">
                  <VSCodeProgressRing />
                </div>
              ) : (
                <>
                  <ul>
                    {
                      results.map((value) => {
                        return (
                          <li key={value}>{value}</li>
                        );
                      })
                    }
                  </ul>
                </>
              )
            }
          </div>
        )
      }
    </div>
  )
} 5