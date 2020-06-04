var React = require('react')
var Component = React.Component;
var ReactDOM = require('react-dom');
var StylesProvider = require('@material-ui/styles').StylesProvider;
var jssPreset = require('@material-ui/styles').jssPreset;
var create = require('jss');


// This component provides encapsulation for components by mounting them in the shadow DOM of a host element.

/* It is used by importing shadowRoot from './$ShadowRoot.js' and passing a render target thus;

     content = shadowRoot(renderTarget) // the render target must be an existing DOM element

     then we can use the shadow root in the render function thus;
     render() {
        return <content children={this.props.children} />
     }
*/

// It is rendered within the $Template component and serves to house the component tree of the host element.
// It accepts all kinds of elements as host element except <style> elements,
// and it preserves the 3rd party JSS styling of both host and child components.
// It's recommended to have 1 root element and 1 <style> tag within the <Template> tag.
// All styles within the <Template> tag will be scoped to that component.
// Global and 3rd party stylesheets are also imported into the shadow DOM, but scoped styles take the highest precedence.

module.exports = function shadowRoot(renderTarget) {

    if (!renderTarget.shadowRoot) {
        renderTarget.attachShadow({mode: 'open'})
    }

    class Umbra extends Component {
        constructor(props) {
            super(props)
            this.host = renderTarget
            this.shadow = renderTarget.shadowRoot
            this.state = {
                jss: create({...jssPreset(), insertionPoint: renderTarget.shadowRoot.appendChild(document.createElement('div'))})
            }
            this.style = document.querySelectorAll('head > style')
        }

        componentDidMount() {
            (async function teleport(ROOT) {
                await renderTarget.children
                ROOT.setState({jss: create({...jssPreset(), insertionPoint: ROOT.shadow.appendChild(document.createElement('div'))})})

                let topStyle = ROOT.shadow.querySelector('style'),
                globalStyles, clonedStyle
                await topStyle

                if(process.env.NODE_ENV === 'development') {
                    globalStyles = document.head.querySelectorAll('style')

                    globalStyles.forEach(
                        (item, index, array) => {
                            if(!item.hasAttribute('data-jss')) {
                                clonedStyle = item.cloneNode(true)
                                ROOT.shadow.insertBefore(clonedStyle, topStyle)
                            }
                        }
                    )
                }

                if(process.env.NODE_ENV === 'production') {
                    globalStyles = document.head.querySelectorAll('link')

                    globalStyles.forEach(
                        (item, index, array) => {
                            if(item.hasAttribute('rel') && item.rel === 'stylesheet') {
                                clonedStyle = item.cloneNode(true)
                                ROOT.shadow.insertBefore(clonedStyle, topStyle)
                            }
                        }
                    )
                }
            })(this)
        }

        render() {
            let props = {jss: this.state.jss}

            return ReactDOM.createPortal(
                React.cloneElement(StylesProvider, props, this.props.children), this.shadow
            )
        }
    }

    return Umbra
}
