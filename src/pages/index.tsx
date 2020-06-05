import React from "react"
import { Link } from "gatsby"

import "../components/style.css"

import Logo from "../images/logocolor.svg"
import IconClick from "../images/click.svg"
import IconFigma from "../images/icon-figma.png"
import IconSketch from "../images/icon-sketch.png"
import IconBrowser from "../images/icon-browser.png"
import BgStatic from "../images/bgstatic.jpg"
import Hand from "../images/hand.png"
import BgDesk from "../images/bgdesk.jpg"
import BgSlider from "../images/bgslider.png"
import avatar1 from "../images/avatar-1.png"
import avatar2 from "../images/avatar-2.png"
import avatar3 from "../images/avatar-3.png"
import avatar4 from "../images/avatar-4.png"
import avatar5 from "../images/avatar-5.png"
import avatar6 from "../images/avatar-6.png"
import avatar7 from "../images/avatar-7.png"
import avatar8 from "../images/avatar-8.png"
import avatar9 from "../images/avatar-9.png"
import avatar10 from "../images/avatar-10.png"
import avatar11 from "../images/avatar-11.png"
import avatar12 from "../images/avatar-12.png"
import avatar13 from "../images/avatar-13.png"
import avatar14 from "../images/avatar-14.png"

import Image from "../components/image"
import SEO from "../components/seo"
import { motion, useAnimation, AnimatePresence } from "framer-motion"

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

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

const IndexPage = () => {
  const controls = useAnimation()
  const controlSlider = useAnimation()
  const controlColor = useAnimation()
  const [color, setColor] = React.useState("#DDDDDD")
  const [colors, setColors] = React.useState([])
  const canvasRef = React.useRef(null)
  const sliderRef = React.useRef(null)

  React.useEffect(() => {
    controls.start({ x: 720 }, { damping: 300 })
    controlSlider.start({ x: -800 }, { damping: 300 })
  }, [])
  return (
    <>
      <SEO title="Color Copy Paste" />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <div className="header">
          <div className="header-column">
            <div className="header-wrap">
              <img src={Logo} style={{ marginBottom: 16 }} />
              <h1 style={{ display: "none" }}>Color Copy Paste</h1>
              <a
                className="github-button"
                href="https://github.com/sonnylazuardi/color-copy-paste"
                data-size="large"
                data-show-count="true"
                aria-label="Star sonnylazuardi/color-copy-paste on GitHub"
              >
                Star
              </a>
            </div>
          </div>
          <div className="header-column column-two">
            <div className="header-wrap">
              <div className="header-label">
                Copy & paste colour directly from your camera to:
              </div>
              <a
                href="https://www.figma.com/community/plugin/845733021314534317/Camera-Color-Copy-Paste"
                className="button-web button-blue"
              >
                <img className="button-icon" src={IconFigma} />
                Figma Plugin
              </a>
              <a
                href="https://github.com/sonnylazuardi/color-copy-paste/releases/download/v1.2.0/color-copy-paste.sketchplugin.zip"
                className="button-web button-yellow"
              >
                <img className="button-icon" src={IconSketch} />
                Sketch Plugin
              </a>
              <Link to="app" className="button-web button-yellow">
                <img className="button-icon" src={IconBrowser} />
                Web Browser
              </Link>
            </div>
          </div>
        </div>
        <img
          src={BgSlider}
          ref={sliderRef}
          style={{ width: 1080, height: 152, display: "none" }}
          onLoad={() => {
            const canvas = canvasRef.current
            var context = canvas.getContext("2d")
            canvas.width = 1080
            canvas.height = 152
            context.drawImage(sliderRef.current, 0, 0, 1080, 152)
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <img src={BgStatic} className="content-static" />
        <motion.div
          className="content-default"
          onMouseMove={e => {
            function getElementOffset(element) {
              var de = document.documentElement
              var box = element.getBoundingClientRect()
              var left = box.left + window.pageXOffset - de.clientLeft
              return left
            }

            const relativeX = e.pageX - getElementOffset(e.target)
            if (relativeX > 70 && relativeX < 790) {
              controls.start(
                {
                  x: relativeX,
                },
                { damping: 300 }
              )
              controlSlider.start(
                {
                  x: relativeX * -1 - 180,
                },
                { damping: 300 }
              )
              const canvas = canvasRef.current
              var context = canvas.getContext("2d")
              var pixel = context.getImageData(relativeX + 224, 68, 1, 1).data
              controlColor.start({
                backgroundColor: `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`,
              })
              setColor(rgbToHex(pixel[0], pixel[1], pixel[2]))
            }
          }}
          onClick={() => {
            setColors([...colors, color])
          }}
        >
          <div style={{ height: 500, overflow: "hidden" }}>
            <img src={BgDesk} style={{ width: "100%" }} draggable={false} />
          </div>
          <motion.div
            drag="x"
            dragConstraints={{
              left: -100,
              right: 200,
            }}
            animate={controls}
            className="control-hand"
            style={{
              backgroundImage: `url(${Hand})`,
            }}
          >
            <div className="phone-screen">
              <motion.div
                animate={controlSlider}
                className="control-slider"
                style={{
                  backgroundImage: `url(${BgSlider})`,
                }}
              />
            </div>
            <div className="bubble">
              <motion.div animate={controlColor} className="control-color" />
              {color.toUpperCase()}
            </div>
          </motion.div>
          <div className="pallete">
            {colors.length > 0 ? (
              <AnimatePresence>
                 
                <div className="grid">
                  {colors.map((item: any, i: number) => {
                    return (
                      <motion.div
                        key={i}
                        className="color"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{ backgroundColor: item }}
                        onClick={() => {
                          copyTextToClipboard(item)
                        }}
                      ></motion.div>
                    )
                  })}
                </div>
              </AnimatePresence>
            ) : (
              <div className="empty">
                <img src={IconClick} style={{ marginBottom: 8 }} />
                Click to capture colour
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <div className="section">
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem 1.45rem`,
          }}
        >
          <div className="row">
            <div className="column">
              <div className="box">
                <h3>How can I copy color?</h3>
                <p>
                  Tap and hold the capture button located in the bottom of your
                  screen. Release to paste it to web browser or plugin.
                </p>
              </div>
            </div>
            <div className="column">
              <div className="box">
                <h3>Where is my color saved?</h3>
                <p>
                  It is saved inside the local storage of the plugin or web
                  browser.
                </p>
              </div>
            </div>
            <div className="column">
              <div className="box">
                <h3>How does my phone connect?</h3>
                <p>
                  The app uses socket to connect phone to your computer. It will
                  generate unique id when showing QR Code.
                </p>
              </div>
            </div>
            <div className="column">
              <div className="box">
                <h3>Can I save to color style?</h3>
                <p>
                  Currently not yet, but you can click on the color to change
                  the object's color and copy the hex code
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 80,
          padding: 16,
        }}
      >
        <blockquote className="twitter-tweet" data-theme="dark">
          <a href="https://twitter.com/sonnylazuardi/status/1263895972456697856">
            @sonnylazuardi
          </a>
        </blockquote>
      </div>

      <div className="section-dark">
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0 1.0875rem 1.45rem`,
          }}
        >
          <h2>What others are saying</h2>
          <div className="row">
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar1})` }}
                />

                <div className="card-comment">
                  Well this just might be the coolest plugin I've ever reviewed.
                  :) Great job on this.
                </div>
                <div className="card-name">Josh, Figma Review</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar2})` }}
                />

                <div className="card-comment">
                  Get the inspiration from nature, so... going out door to pick
                  colour
                </div>
                <div className="card-name">Clu, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar7})` }}
                />

                <div className="card-comment">
                  Yeah nooo! This is some crazy stuff right here @sonnylazuardi
                  More reasons why we love the @figmadesign community 🥂
                </div>
                <div className="card-name">Uche, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar4})` }}
                />

                <div className="card-comment">
                  So cool, moving 3D real world elements into 2D interface or
                  digital world, the boundary is becoming blur.
                </div>
                <div className="card-name">Mi Yuhao, AI UX Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar5})` }}
                />

                <div className="card-comment">This is neat!</div>
                <div className="card-name">Ernest Ojeh, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar6})` }}
                />

                <div className="card-comment">Gokil sekali</div>
                <div className="card-name">Dimas, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar3})` }}
                />

                <div className="card-comment">So goood mas!</div>
                <div className="card-name">Afnizar, UX Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar8})` }}
                />

                <div className="card-comment">
                  @sonnylazuardi built a @figmadesign plugin through a @framer
                  prototype 🤯
                </div>
                <div className="card-name">
                  Addison, Frontend Dev & Designer
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar9})` }}
                />

                <div className="card-comment">
                  Marvellous plugin as always! Easy to use yet useful. Hats off!
                </div>
                <div className="card-name">Tyas, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar10})` }}
                />

                <div className="card-comment">
                  That’s pretty insane. Great work!
                </div>
                <div className="card-name">
                  Andy Ngo, Designer & Frontend Dev
                </div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar11})` }}
                />

                <div className="card-comment">Sorcery 🧙‍♂️</div>
                <div className="card-name">Arif Eka, UI Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar12})` }}
                />

                <div className="card-comment">You’re on a roll 👏</div>
                <div className="card-name">Gaddafi Rusli, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar14})` }}
                />

                <div className="card-comment">
                  This is amazing! Looking forward to the plugin 🚀
                </div>
                <div className="card-name">Soliudeen, Product Designer</div>
              </div>
            </div>
            <div className="column">
              <div className="card">
                <div
                  className="card-avatar"
                  style={{ backgroundImage: `url(${avatar13})` }}
                />

                <div className="card-comment">👏</div>
                <div className="card-name">Jacky Lee, Product Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-footer">
        <div className="footer-caption">
          This project was built for fun and to explore what’s possible with
          design plugin. If you like this app, give me a{" "}
          <a href="https://twitter.com/sonnylazuardi">follow on twitter</a>, an
          upvote in <a href="https://twitter.com/sonnylazuardi">Product Hunt</a>{" "}
          or star on{" "}
          <a href="https://github.com/sonnylazuardi/color-copy-paste">github</a>
          . We built this to give back 😍 to the design community.
        </div>
        <div className="ph-wrap"></div>
        <div className="footer">
          Built by{" "}
          <a href="https://twitter.com/sonnylazuardi">@sonnylazuardi</a> in
          Singapore. Illustrated by{" "}
          <a href="https://dribbble.com/alzea">Alzea Arafat</a>
        </div>
      </div>
    </>
  )
}

export default IndexPage
