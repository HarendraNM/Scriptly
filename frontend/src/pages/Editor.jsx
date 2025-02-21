import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NpmEditor from "@monaco-editor/react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Editor = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view this project.");
        return;
      }

      const response = await axios.post(`${api_base_url}/getProject`, {
        projectId: id,
        token,
      });

      const savedInput = localStorage.getItem(`inputValue-${id}`);
      const savedOutput = localStorage.getItem(`output-${id}`);

      setInputValue(savedInput ?? "");
      setOutput(savedOutput ?? "");
      setCode(response.data.project.code);
      setData(response.data.project);
    } catch (error) {
      toast.error("Failed to fetch project.");
    }
  };

  const saveProject = async () => {
    if (!code) return;

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to save a project.");
        return;
      }

      await axios.post(`${api_base_url}/saveProject`, {
        projectId: id,
        code,
        token,
      });

      if (id) {
        localStorage.setItem(`inputValue-${id}`, inputValue);
      }

      if (id) {
        localStorage.setItem(`output-${id}`, output);
      }

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      toast.error("Failed to save project.");
    }
  };

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveProject();
    }, 1500);
    return () => clearTimeout(saveTimeout);
  }, [code]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const runProject = async () => {
    if (!data || !data.projlanguage) {
      toast.error("Project language is not defined.");
      return;
    }

    const languageConfig = {
      "c++": { version: "10.2.0", fileExtension: ".cpp" },
      java: { version: "15.0.2", fileExtension: ".java" },
      python: { version: "3.10.0", fileExtension: ".py" },
      "csharp.net": {
        version: "5.0.201",
        fileExtension: ".cs",
        runtime: "dotnet",
      },
      c: { version: "10.2.0", fileExtension: ".c" },
      javascript: { version: "18.15.0", fileExtension: ".js" },
      go: { version: "1.16.2", fileExtension: ".go" },
    };

    const { version, fileExtension, runtime } = languageConfig[
      data.projlanguage
    ] || {
      version: "default",
      fileExtension: ".txt",
      runtime: undefined,
    };

    const fileName = data.name + fileExtension;

    try {
      const payload = {
        language: data.projlanguage,
        version,
        files: [{ name: fileName, content: code }],
        stdin: inputValue,
        runtime,
      };

      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        payload
      );
      const result = response.data;
      if (id) {
        localStorage.setItem(`inputValue-${id}`, inputValue);
      }

      setOutput(result.run.output);
      if (id) {
        localStorage.setItem(`output-${id}`, result.run.output);
      }
      const savedOutput = localStorage.getItem(`output-${id}`);
      setError(result.run.code === 1);
    } catch (error) {
      toast.error("Failed to execute code. Please check the runtime version.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col sm:flex-row h-[calc(100vh-90px)] bg-gray-900">
        {/* Left: Code Editor */}
        <div className="w-full sm:w-1/2 h-[50vh] sm:h-full relative">
          <NpmEditor
            height="100%"
            width="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              automaticLayout: true,
              suggestOnTriggerCharacters: true, // Enables autocomplete suggestions
              quickSuggestions: { other: true, comments: true, strings: true }, // Improves auto-suggestions
              parameterHints: { enabled: true }, // Shows function parameters
              wordBasedSuggestions: true, // Enables word-based autocomplete
            }}
          />
          {isSaving && (
            <p className="absolute top-2 left-3 text-gray-400 text-sm">
            </p>
          )}
        </div>

        {/* Right: Output & Controls */}
        <div className="w-full sm:w-1/2 h-[50vh] sm:h-full bg-gray-800 p-4 flex flex-col">
          {/* Button Row - Run Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={runProject}
              className="w-full sm:w-auto px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md transition-all hover:bg-blue-600 hover:cursor-pointer"
            >
              Run
            </button>
          </div>

          {/* Input Section */}
          <div className="flex-1 flex flex-col mb-4">
            <p className="text-gray-300 text-lg font-semibold mb-2">Input</p>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 flex-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder=""
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-300 text-lg font-semibold mb-2">Output</p>
            <pre
              className={`w-full flex-1 p-3 rounded-md text-sm overflow-auto ${
                error ? "text-red-400" : "text-white"
              } bg-gray-900`}
            >
              {output}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;