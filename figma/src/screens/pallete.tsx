import * as React from "react";

declare function require(path: string): any;

const { Tip, Button } = require("react-figma-plugin-ds");
const { AnimatePresence, motion } = require("framer-motion");

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

const Pallete = (props) => {
  React.useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "" } }, "*");
  }, []);

  window.onmessage = (event: any) => {
    let message = event.data.pluginMessage;
    const { type, data } = message;
    if (type == "") {
    }
  };

  return (
    <div className="content">
      <Tip iconName="import">
        Click color to copy, click Add to design to create color frames
      </Tip>

      <div className="grid">
        <AnimatePresence>
          {props.colors.map((item: any, i: number) => {
            return (
              <motion.div
                key={i}
                className="color"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ backgroundColor: item.color }}
                onClick={() => {
                  copyTextToClipboard(item.color);
                  parent.postMessage(
                    {
                      pluginMessage: {
                        type: "change-color",
                        data: {
                          color: item.color,
                        },
                      },
                    },
                    "*"
                  );
                  parent.postMessage(
                    {
                      pluginMessage: {
                        type: "notify",
                        data: {
                          message: `Color ${item.color} copied!`,
                        },
                      },
                    },
                    "*"
                  );
                }}
              >
                <div
                  className="remove"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newColors = props.colors.filter(
                      (filterItem) => filterItem.color !== item.color
                    );
                    props.setColors(newColors);
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: "notify",
                          data: {
                            message: `Color ${item.color} removed!`,
                          },
                        },
                      },
                      "*"
                    );
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: "set-colors",
                          data: { colors: newColors },
                        },
                      },
                      "*"
                    );
                  }}
                >
                  x
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="actions">
        <div className="action-row">
          <Button
            isSecondary={true}
            className="button"
            onClick={async () => {
              props.setCurrentPage("home");
            }}
          >
            Open Camera
          </Button>
          <div className="separator" />
          <Button
            className="button"
            onClick={async () => {
              parent.postMessage(
                {
                  pluginMessage: {
                    type: "add-design",
                    data: { colors: props.colors },
                  },
                },
                "*"
              );
            }}
          >
            Add to Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pallete;
