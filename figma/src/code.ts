/* global figma, __html__*/

figma.showUI(__html__, { width: 340, height: 400 });

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    }
    : null
}

function generateUserID() {
  //@ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a: any) =>
    (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
  );
}

function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

const createNewUserID = async () => {
  const newID = generateUserID();
  await figma.clientStorage.setAsync("userId", newID);
  return newID;
};

export const getUserID = async () => {
  const userId = await figma.clientStorage.getAsync("userId");
  if (userId && userId.length > 5) {
    return userId;
  } else {
    const result = await createNewUserID();
    return result;
  }
}

figma.ui.onmessage = (msg) => {

  if (msg.type === 'window-resize') {
    figma.ui.resize(msg.data.width, msg.data.height);
  }

  if (msg.type === 'set-user-id') {
    figma.clientStorage.setAsync("userId", msg.data.userId);
  }

  if (msg.type === 'notify') {
    figma.notify(msg.data.message);
  }

  if (msg.type === 'set-colors') {
    figma.clientStorage.setAsync("colors", JSON.stringify(msg.data.colors));
  }

  if (msg.type === 'get-colors') {
    figma.clientStorage.getAsync("colors").then(colors => {
      let results = []
      if (colors && colors.length > 5) {
        results = JSON.parse(colors);
      }
      figma.ui.postMessage({ type: 'get-colors', data: { colors: results } })
    })
  }

  if (msg.type === 'add-design') {
    const colors = msg.data.colors;
    let myFrame = figma.createFrame();
    for (let i = 0; i < colors.length; i++) {
      const rect = figma.createRectangle();
      const fills = clone(rect.fills)
      const rgb = hexToRgb(colors[i].color)
      fills[0].color.r = rgb.r
      fills[0].color.g = rgb.g
      fills[0].color.b = rgb.b
      rect.fills = fills;
      rect.x = i * 42;
      rect.y = 0;
      rect.resize(42, 42);
      myFrame.appendChild(rect)
    }
    myFrame.resize(colors.length * 42, 42)
  }

  if (msg.type === 'change-color') {
    const { color } = msg.data;

    let nodes = figma.currentPage.selection;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      //@ts-ignore
      if (node.fills) {
        //@ts-ignore
        const fills = clone(node.fills)
        const rgb = hexToRgb(color)
        fills[0].color.r = rgb.r
        fills[0].color.g = rgb.g
        fills[0].color.b = rgb.b
        //@ts-ignore
        node.fills = fills;
      }
    }
  }

  if (msg.type === 'get-user-id') {
    getUserID().then(userId => {
      figma.ui.postMessage({ type: 'get-user-id', data: { userId } })
    })
  }
}