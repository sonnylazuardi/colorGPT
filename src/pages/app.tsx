import * as React from "react"
import Home from "../screens/home"
import Pallete from "../screens/pallete"
import "react-figma-plugin-ds/styles/figma-plugin-ds.min.css"
import "../components/ui.css"

declare function require(path: string): any

//@ts-ignore
const io = require("socket.io-client")

const ROOM_NAME = "CopyPasteColor"
const DEFAULT_SERVER_URL = "https://color-copy-paste-socket.herokuapp.com/"
const INIT = "INIT"
const CONNECTED = "CONNECTED"
const ERROR = "ERROR"

let loaded = false

function generateId() {
  //@ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (a: any) =>
    (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
  )
}

const createNewUserID = () => {
  const newID = generateId()
  localStorage.setItem("userId", newID)
  return newID
}

const getUserID = () => {
  const userId = localStorage.getItem("userId")
  if (userId && userId.length > 5) {
    return userId
  } else {
    const result = createNewUserID()
    return result
  }
}

const App = () => {
  const [status, setStatus] = React.useState(INIT)
  const [userId, setUserId] = React.useState("")
  const [mySocket, setMySocket] = React.useState<any>(null)
  const [currentPage, setCurrentPage] = React.useState("home")
  const [colors, setColors] = React.useState([])

  console.log(status)

  React.useEffect(() => {
    const userId = getUserID()
    setUserId(userId)

    const colors = localStorage.getItem("colors")

    let results = []
    if (colors && colors.length > 5) {
      results = JSON.parse(colors)
    }

    setColors(results)
  }, [])

  React.useEffect(() => {
    if (userId && userId.length > 5 && !loaded) {
      loaded = true

      const socket = io(DEFAULT_SERVER_URL, {
        reconnectionAttempts: 3,
        forceNew: true,
        transports: ["websocket"],
      })

      socket.on("connected", () => {
        setStatus(CONNECTED)
        setMySocket(socket)

        socket.emit("join room", ROOM_NAME)

        console.log("SOCKET ID", userId)
        socket.emit("set user", {
          name: "web-" + userId,
          color: ``,
          url: DEFAULT_SERVER_URL,
        })

        socket.emit("chat message", {
          roomName: ROOM_NAME,
          message: "hello",
        })
      })

      socket.on("connect_error", () => {
        setStatus(ERROR)
      })

      socket.on("reconnect_error", () => {
        setStatus(ERROR)
      })
    }
  }, [userId])

  React.useEffect(() => {
    if (mySocket) {
      mySocket.on("chat message", (data: any) => {
        if (data.user.name === userId) {
          const newColor = { id: generateId(), color: data.message }
          const newColors: any = [...colors, newColor]
          setColors(newColors)
          localStorage.setItem("colors", JSON.stringify(newColors))

          setCurrentPage("pallete")
        }
      })
    }
  }, [mySocket, colors, userId])

  console.log(userId)

  const renderPage = () => {
    switch (currentPage) {
      case "pallete":
        return (
          <Pallete
            setCurrentPage={setCurrentPage}
            colors={colors}
            setColors={setColors}
          />
        )
      default:
      case "home":
        return (
          <Home
            setCurrentPage={setCurrentPage}
            userId={userId}
            onTap={() => {}}
          />
        )
    }
  }

  return (
    <div className="page-outer">
      <div className="page-wrap">{renderPage()}</div>
    </div>
  )
}

export default App
