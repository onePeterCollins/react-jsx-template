const React = require('react');
const ReactDOM = require('react-dom');
const StylesProvider = require('@material-ui/styles/').StylesProvider;
const jssPreset = require('@material-ui/styles/').jssPreset;
const create = require('jss').create;

// This component provides style encapsulation for components by mounting their content in the shadow DOM of a root element.

/*  USAGE:

    import shadowRoot from './ShadowRoot.js';

    Content = shadowRoot(renderTarget, stylesProvider)
    
    // renderTarget: the render target must be an existing DOM element
    // stylesProvider: the stylesProvider, and adds support for styled components

    We can then use the shadowRoot in the render function;

     render() {
        return <Content {children: this.props.children} />
     }

     
    It is used within the "Template" class and serves to house the content of the root element.
    Host elements are passed to it as (renderTarget) from within the "Template" class.
    It accepts all kinds of elements as renderTargets except <style> elements,
    and it preserves the 3rd party JSS styling, using the (stylesProvider).
    It's recommended to use a root element and a single <style> element within the <Template> tags.
    All styles defined within the <Template> tags will be scoped to that component.
    Global and 3rd party stylesheets are also imported into the shadow DOM, but scoped styles take the highest precedence.
*/

    

module.exports = function shadowRoot(renderTarget, stylesProvider) {

    !renderTarget.shadowRoot ? renderTarget.attachShadow({mode: 'open'}) : null

    return class Umbra extends React.Component {
        constructor(props) {
            super(props)
            this.host = renderTarget
            this.shadow = renderTarget.shadowRoot
            this.state = {
                jss: create({...jssPreset(), insertionPoint: renderTarget.shadowRoot.appendChild(document.createElement('div'))})
            }
        }

        componentDidMount() {
            (async function teleport(ROOT) {
                await renderTarget.children
                ROOT.setState({jss: create({...jssPreset(), insertionPoint: ROOT.shadow.appendChild(document.createElement('div'))})})

                let topStyle = ROOT.shadow.querySelector('style'), globalStyles, clonedStyle
                await topStyle

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
                } else {
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
            })(this)
        }

        render() {
            !stylesProvider ? stylesProvider = StylesProvider : null

            return ReactDOM.createPortal(
                React.createElement(stylesProvider, {jss: this.state.jss}, this.props.children),
                this.shadow
            )
        }
    }
}
