import type { NextPage } from "next";
import Head from "next/head";
import CameraColorPick, { FacingMode } from "../src/components/Camera";
import { useEffect, useState } from "react";
import { rgbToHex } from "../src/utils";
import { Toaster, toast } from "sonner";
import { HexColorPicker } from "react-colorful";

export interface ColorSet {
  color: string;
  hex: string;
}

export const PASSKEY = "colorgpt";

const App: NextPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [colorSet, setColorSet] = useState<ColorSet[]>([]);
  const [showOnboard, setShowOnboard] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState("#888888");

  useEffect(() => {
    const currentKey = localStorage.getItem("apiKey");
    const currentColorSet = localStorage.getItem("colorSet");
    if (currentKey) {
      setApiKey(currentKey);
    } else {
      setShowOnboard(true);
    }
    if (currentColorSet) {
      setColorSet(JSON.parse(currentColorSet));
    }
  }, []);

  const saveApiKey = (value: string) => {
    localStorage.setItem("apiKey", value);
    setShowOnboard(false);
  };

  const saveColor = async () => {
    const req = await fetch(
      `/api/color?hex=${color.replace("#", "")}&apiKey=${apiKey}`
    );
    const result = await req.json();
    if (result.error) {
      return toast.error("API Key is invalid");
    }
    setColorSet((v) => {
      const colorSet = [result, ...v];
      localStorage.setItem("colorSet", JSON.stringify(colorSet));
      return colorSet;
    });
  }

  const renderColorPick = () => {
    return (
      <div className="absolute z-50 top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center p-4 bg-black/70">
        <div
          className="absolute left-0 top-0 right-0 bottom-0"
          onClick={(e) => setShowPicker(false)}
        />
        <div className="bg-white max-w-[400px] w-full p-6 rounded-lg relative flex justify-center items-center flex-col">
          <div className="mb-2">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          <div className="mb-4">
            <input
              placeholder="Color Hex"
              className="border rounded-lg border-neutral-75 px-4 py-2 w-full text-black"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            ></input>
          </div>
          <div>
            <button
              className="p-4 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg font-semibold"
              onClick={() => {
                saveColor();
                setShowPicker(false);
              }}
            >
              Save Color
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOnboard = () => {
    return (
      <div className="absolute z-50 top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center p-4 bg-black/70">
        <div
          className="absolute left-0 top-0 right-0 bottom-0"
          onClick={(e) => setShowOnboard(false)}
        />
        <div className="bg-white max-w-[400px] w-full p-6 rounded-lg relative text-black">
          <div className="text-2xl font-semibold mb-4">
            Enter your OpenAI API key
          </div>
          <div className="mb-2">
            <a
              className="underline font-semibold"
              target="_blank"
              href="https://platform.openai.com/account/api-keys"
            >
              → Get your API key from OpenAI dashboard.
            </a>
          </div>
          <div className="mb-4">
            <input
              placeholder="Your OpenAI API Key"
              className="border rounded-lg border-neutral-75 px-4 py-2 w-full text-black"
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  saveApiKey(e.target.value);
                }
              }}
              value={apiKey}
            ></input>
          </div>
          <div>
            <button
              className="p-4 bg-neutral-100 hover:bg-neutral-200 text-black rounded-lg font-semibold"
              onClick={(e) => {
                saveApiKey(apiKey);
              }}
            >
              Save API Key
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderApp = () => {
    return (
      <>
        <div
          className="flex flex-1 justify-center items-center bg-black"
          style={{ height: "100vh" }}
        >
          <div className="w-96 h-96 rounded-3xl overflow-hidden">
            <CameraColorPick
              facingMode={FacingMode.environment}
              onColor={(value: any) => {
                setColor(rgbToHex(value.r, value.g, value.b).toUpperCase());
              }}
              paused={showPicker}
              onTakePhoto={() => {}}
            />
          </div>
        </div>

        <div
          className="absolute top-0 left-0 w-full flex justify-center items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="width-[1px] height-[1px] rounded-full relative flex justify-center items-center"
            style={{ background: color }}
          >
            <div className="absolute -top-16 p-3 rounded-md backdrop-blur-xl bg-black/30 text-white font-semibold shadow-black/90 shadow-xl flex flex-row items-center space-x-4 border border-white/10 ring-1 ring-black/70">
              <div
                className="h-8 w-8 rounded-full border border-white/20 ring-1 ring-black/40"
                style={{ background: color }}
              ></div>
              <div className="w-20">{color}</div>
            </div>
            <div className="w-0 h-0 absolute top-[-6px] border-l-[10px] border-l-transparent border-t-[10px] border-t-white/30 border-r-[10px] border-r-transparent shadow-black/90 shadow-xl"></div>
            <button
              className="w-20 h-20 absolute top-64 border-4 border-blue-500 flex justify-center items-center rounded-full"
              onClick={() => saveColor()}
            >
              <div className="w-16 h-16 bg-white rounded-full hover:bg-neutral-300"></div>
            </button>

            <button
              className="absolute top-[280px] ml-72 text-white p-2 rounded-xl hover:bg-neutral-800"
              onClick={(e) => setShowOnboard(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </button>

            <button
              className="absolute top-[280px] mr-72 text-white p-2 rounded-xl hover:bg-neutral-800"
              onClick={(e) => setShowPicker(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-20 top-[10%] absolute w-full">
          <div className="flex mx-auto max-w-screen-sm w-full">
            <div className="flex p-4 overflow-y-hidden overflow-x-auto">
              <div className="flex flex-row items-center text-white pr-4">
                {colorSet.map((v, i) => {
                  return (
                    <button
                      key={i}
                      className="flex flex-row space-x-2 items-center mr-4 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800"
                      onClick={(e) => {
                        navigator.clipboard.writeText(`${v.color} (${v.hex})`);
                        toast(`Copied ${v.color} (${v.hex})`);
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: v.hex }}
                      ></div>
                      <div className="truncate">{v.color}</div>
                      <button
                        className="p-1 rounded-lg hover:bg-neutral-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setColorSet((v) => {
                            const colorSet = v.filter((_, k) => k !== i);
                            localStorage.setItem(
                              "colorSet",
                              JSON.stringify(colorSet)
                            );
                            return colorSet;
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {showOnboard ? renderOnboard() : null}
        {showPicker ? renderColorPick() : null}
      </>
    );
  };

  return (
    <div className="w-full" style={{ height: "100vh" }}>
      <Head>
        <title>colorGPT</title>
        <link rel="icon" href="/favicon.ico" />
        <script async defer src="https://analytics.umami.is/script.js" data-website-id="52141638-f113-4e05-b41b-05ad5ccf55c7"></script>
      </Head>
      {renderApp()}
      <Toaster />
    </div>
  );
};

export default App;
