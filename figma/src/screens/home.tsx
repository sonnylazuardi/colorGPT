import * as React from "react";

declare function require(path: string): any;

const { Tip, Button } = require("react-figma-plugin-ds");

const QRCode = require("qrcode.react");

const Home = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const url = `https://copy-paste-color.netlify.app?user=${props.userId}`;

  return (
    <div className="content">
      <Tip iconName="import">Scan QR code on your phone</Tip>

      <div
        className="flex"
        onClick={() => {
          props.onTap && props.onTap();
        }}
      >
        <QRCode value={url} size={200} />
      </div>

      <div className="actions">
        <div className="action-row">
          <Button
            className="button"
            onClick={async () => {
              window.open(url);
            }}
          >
            Open in Browser
          </Button>
          <div className="separator" />
          <Button
            isSecondary={true}
            className="button"
            onClick={() => {
              props.setCurrentPage("pallete");
            }}
          >
            Open Pallete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
