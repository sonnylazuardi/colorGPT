const sketch = require("sketch");
const BrowserWindow = require("sketch-module-web-view");
const { getWebview } = require("sketch-module-web-view/remote");

const { getBundleUrl } = require("./index");

const webviewIdentifier = "colorcopy.webview";

const EVENTS = {
  notify: (message, webContents) => {
    sketch.UI.message(message);
  },
  addDesign: (params, webContents) => {
    const doc = sketch.getSelectedDocument();
    const colors = JSON.parse(params);
    console.log(colors);
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      const rect = new sketch.Rectangle(i * 42, 0, 42, 42);
      let box = new sketch.Shape({
        name: "Rect",
        parent: doc.selectedPage,
        frame: rect,
        locked: false,
        style: {
          fills: [color.color],
        },
      });
    }
  },
  openWebUrl: (url, webContents) => {
    console.log("OPEN WEB");
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
  },
};

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 340,
    height: 400,
    show: true,
    title: "Color Copy Paste",
  };

  const browserWindow = new BrowserWindow(options);

  Object.keys(EVENTS).forEach((eventName) => {
    browserWindow.webContents.on(eventName, (params) => {
      EVENTS[eventName](params, browserWindow.webContents);
    });
  });

  const threadDictionary = NSThread.mainThread().threadDictionary();
  if (!threadDictionary[webviewIdentifier]) {
    return;
  }

  const panel = threadDictionary[webviewIdentifier];
  panel.setLevel(NSFloatingWindowLevel);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  browserWindow.loadURL(getBundleUrl());
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}
