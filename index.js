const React = require('react');
const shadowRoot = require('./ShadowRoot.js');


// This component provides style encapsulation for components by mounting their content in the shadow DOM of a host element.

/* USAGE:

*default setting with material-ui styles provider
    
    import {Template} from 'react-jsx-template'

    render() {
        return (
            <Template>
                <Root>
                    <Content></Content>
                </Root>

                <style>
                {`
                    selector {...rules}
                `}
                </style>
            </Template>
        )
    }



*customized setting with user defined styles provider

    // create a template.js file in your working directory with the following content;

    import {StylesProvider} from 'custom-styles-provider';
    import {initializeTemplate} from 'react-jsx-template';

    const Template = initializeTemplate(StylesProvider);

    export default Template;

    // use it within your components;

    import Template from './template.js'

    render() {
        return (
            <Template>
                <Root>
                    <Content></Content>
                </Root>

                <style>
                {`
                    selector {...rules}
                `}
                </style>
            </Template>
        )
    }

    The first child component within the <Template> tag is automatically used as the root element.
    Root elements can be anything but a <style> tag.
    The root element class can also be passed to <Template> as a prop;

   <Template root={rootElementClass}></Template>

    styling the root element can be done using the :host selector within the components stylesheet.
    styling rules for 3rd party styled components will be preserved.
*/


// set the content once root element is mounted to the DOM
function setContent (ROOT) {
    if(ROOT.state.isLive && ROOT.root) {
        let props = {children: ROOT.props.children}

        return React.cloneElement(ROOT.state.shadow, props)
    } else if (ROOT.state.isLive && !ROOT.root) {
        let adjacentChildren = ROOT.props.children.map(
            (item, index, array) => {
                let value, props = {key: index}

                if (index > 0) {
                    value = React.cloneElement(item, props)
                }

                return value
            }
        ),

        props = {
            children: [ROOT.props.children[0].props.children, adjacentChildren]
        }

        return React.createElement(ROOT.state.shadow, props)
    } else {
        return null
    }
}


// render the content of the component as children of the root element
function renderValueFN (ROOT) {
    if (ROOT.root) {
        let props = {children: ROOT.state.content, ref: ROOT.ref}

        return React.cloneElement(ROOT.root, props)
    } else if (!ROOT.root && ROOT.props.children[0]) {
        let props = {ref: ROOT.ref, children: ROOT.state.content}

        return React.cloneElement(ROOT.props.children[0], props)
    }
}


// default setting with material-ui styles provider
module.exports.Template = class Template extends React.Component {
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

        this.setContent = setContent
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
        let renderValue = renderValueFN(this)

        return React.createElement(React.Fragment, {children: renderValue})
    }
}


// customized setting with user defined styles provider
module.exports.initializeTemplate = function initializeTemplate (stylesProvider) {

    return class Template extends React.Component {
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
    
                ROOT.setState({shadow: shadowRoot(ROOT.state.component, stylesProvider)})
                await ROOT.state.shadow
    
                ROOT.setState({content: ROOT.setContent(ROOT)})
                await ROOT.state.content
            })(this)
    
            this.setContent = setContent
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
                    ROOT.setState({shadow: shadowRoot(ROOT.state.component, stylesProvider)})
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
            let renderValue = renderValueFN(this)
    
            return React.createElement(React.Fragment, {children: renderValue})
        }
    }    
}
