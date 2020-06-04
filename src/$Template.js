var React = require('react');
var Component = React.Component;
var shadowRoot = require('./$ShadowRoot');


// This component provides encapsulation for components by mounting them in the shadow DOM of a host element.
// The first child component within the <Template> tag is automatically used as the root element.
// Root elements can be anything but a <style> tag.
// The root element class name can also be passed into the <Template> as a prop thus;
// <Template root={rootElementClass}></Template>
// styling the root element must be done using the :host selector within the components stylesheet.
// styling rules for 3rd party styled components will no longer apply

module.exports = class Template extends Component {
    constructor(props) {
        super(props)
        this.root = this.props.root
        this.ref = React.createRef()
        this.state = {
            component: null,
            content: null,
            isLive: false,
            shadow: null
        }
        this.updateLive = true
        this.updateComponent = true
        this.updateShadow = true
        this.updateContent = true
    }

    componentDidMount() {
        (async function(ROOT) {
            ROOT.setState({isLive: true})
            await ROOT.state.isLive

            /* document.querySelector(`#${ROOT.id}`) doesn't work when nested, so use ROOT.ref.current instead*/
            ROOT.setState({component: ROOT.ref.current})
            await ROOT.state.component

            ROOT.setState({shadow: shadowRoot(ROOT.state.component)})
            await ROOT.state.shadow

            ROOT.setState({content: ROOT.setContent(ROOT)})
            await ROOT.state.content
        })(this)

        this.setContent = function(ROOT) {
            if(ROOT.state.isLive && ROOT.root) {
                let props = {children: ROOT.props.children}
                return React.cloneElement(ROOT.state.shadow, props)
            } else if (ROOT.state.isLive && !ROOT.root) {
                let newArray = [],
                adjacentChildren = ROOT.props.children.map(
                    (item, index, array) => {
                        if (index > 0) newArray.push(item)
                        return newArray
                    }
                ),
                props = {},
                children = [
                    React.cloneElement(ROOT.props.children[0].props.children),
                    React.cloneElement(adjacentChildren)
                ]

                return React.cloneElement(
                    ROOT.state.shadow,
                    props,
                    [...children]
                )
            } else {
                return null
            }
        }
    }

    componentDidUpdate() {
        (async function(ROOT) {
            if (!ROOT.state.isLive && ROOT.updateLive) {
                ROOT.setState({isLive: true})
                ROOT.updateLive = false

                setTimeout(() => {ROOT.updateLive = true}, 1000)
            }
            
            await ROOT.state.isLive

            if (ROOT.state.component !== ROOT.ref.current && ROOT.updateComponent) {
                ROOT.setState({component: ROOT.ref.current})
                ROOT.updateComponent = false

                setTimeout(() => {ROOT.updateComponent = true}, 1000)
            }
            
            await ROOT.state.component

            if (ROOT.state.shadow !== shadowRoot(ROOT.state.component) && ROOT.updateShadow) {
                ROOT.setState({shadow: shadowRoot(ROOT.state.component)})
                ROOT.updateShadow = false

                setTimeout(() => {ROOT.updateShadow = true}, 1000)
            }
            
            await ROOT.state.shadow

            if (ROOT.state.content !== ROOT.setContent(ROOT) && ROOT.updateContent) {
                ROOT.setState({content: ROOT.setContent(ROOT)})
                ROOT.updateContent = false

                setTimeout(() => {ROOT.updateContent = true}, 1000)
            }
            
            await ROOT.state.content
        })(this)
    }

    render() {
        let renderValue = (function(ROOT) {
            let props = {ref: ROOT.ref, children: ROOT.state.content}

            if (ROOT.root) {
                return React.cloneElement(ROOT.root, props)
            } else if (!ROOT.root && ROOT.props.children[0]) {
                return React.cloneElement(ROOT.props.children[0], props)
            }
        })(this)

        return React.Fragment(renderValue)
    }
}
