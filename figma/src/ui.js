/* global document, parent*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.countRef = (element) => {
            if (element)
                element.value = '5';
            this.textbox = element;
        };
        this.onCreate = () => {
            const count = parseInt(this.textbox.value, 10);
            parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
        };
        this.onCancel = () => {
            parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("img", { src: require('./logo.svg') }),
            React.createElement("h2", null, "Rectangle Creator"),
            React.createElement("p", null,
                "Count: ",
                React.createElement("input", { ref: this.countRef })),
            React.createElement("button", { id: "create", onClick: this.onCreate }, "Create"),
            React.createElement("button", { onClick: this.onCancel }, "Cancel")));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('react-page'));
