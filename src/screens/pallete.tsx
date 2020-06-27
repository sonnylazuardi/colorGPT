import * as React from "react"

declare function require(path: string): any

const { Tip, Button } = require("react-figma-plugin-ds")
const { AnimatePresence, motion } = require("framer-motion")

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea")
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = "0"
  textArea.style.left = "0"
  textArea.style.position = "fixed"

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand("copy")
    var msg = successful ? "successful" : "unsuccessful"
    console.log("Fallback: Copying text command was " + msg)
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err)
  }

  document.body.removeChild(textArea)
}

const Pallete = props => {
  const [search, setSearch] = React.useState("")

  return (
    <div className="content">
      <div className="search-wrapper">
        <input
          type="text"
          className="input input-search"
          placeholder="Search color name"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid-wrapper">
        <div className="grid">
          {props.colors
            .filter(item => {
              return item.name.toLowerCase().indexOf(search) !== -1
            })
            .map((item: any, i: number) => {
              return (
                <div key={i} className="color-box">
                  <div
                    className="color"
                    style={{ backgroundColor: item.color }}
                    onClick={() => {
                      copyTextToClipboard(item.color)
                    }}
                  >
                    <div
                      className="remove"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        const newColors = props.colors.filter(
                          filterItem => filterItem.id !== item.id
                        )
                        props.setColors(newColors)
                      }}
                    >
                      x
                    </div>
                    <div className="color-popup">{item.color}</div>
                  </div>
                  <div className="color-name">
                    <input
                      type="text"
                      className="input input-name"
                      value={item.name}
                      onChange={e => {
                        const newColors = props.colors.map(v => {
                          if (v.id === item.id) {
                            return { ...v, name: e.target.value }
                          } else return v
                        })
                        props.setColors(newColors)
                        localStorage.setItem(
                          "colors",
                          JSON.stringify(newColors)
                        )
                      }}
                    />
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      <div className="actions">
        <div className="action-row">
          <Button
            isSecondary={true}
            className="button"
            onClick={async () => {
              props.setCurrentPage("home")
            }}
          >
            Open Camera
          </Button>
          <div className="separator" />
          <Button className="button" onClick={async () => {}}>
            Add to Design
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pallete
