# react-jsx-template

React component for style encapsulation. It helps you create components with scoped styles, also compatible with material UI styled components. Works with the Shadow DOM API and essentially renders the content of the component within the Shadow DOM of the 'root' element. It works a bit like the <template> tag in Vue.js development, except that in this case it contains everything in the component, including the <style> tag.

# installation

If you have [node] (https://nodejs.org/en/download) installed, and the [npm] (https://nodejs.org/en/download) command line tool

run; 

```bash
npm install react-jsx-template
```

# peer dependencies

This package requires that you have the following packages installed in your project folder;

* Material UI components for reusable styled UI components. More information [here] (https://)

  to install run;

  ```bash
  npm install @material-ui/core
  ``` 

* JSS for injecting javascript-generated styling. More information [here] (https://)

  to install run;

  ```bash
  npm install jss
  ```

* React library. It comes by default if you scaffold your project on CRA. More information [here] (https://)

  to install run;

  ```bash
  npm install react
  ```

* React-dom. This package manages rendering react element to the DOM and is installed by default in CRA scaffold. More information [here] (https://)

  to install run;

  ```bash
  npm install react-dom
  ```

# Usage

Now we're all setup, to use the react-jsx-template import it at the top of your script.

```javascript
import Template from 'react-jsx-template'
```

Then you can use it in the render function of your component like this;

```javascript
// component with scoped styles
render() {
    return (
        <Template>
            <div> {/* this div is the root element */}
                <p>paragraph with red text</p>
            </div>

            <style>
            {`
                div {color: red;}
            `}
            </style>
        </Template>
    )
}
```
The <Template> tag does not get mounted to the DOM, but the root element gets mounted to the DOM and hosts a shadow root to contain all other elements styles within the component. <style> tags within the <Template> tag will also be rendered in the components shadow DOM.

You can also use styled components from material UI components within your components;

```javascript
import Template from 'react-jsx-template'
import Box from '@material-ui/core/Box'
```

and in the render function we can have something like this;

```javascript
// component with scoped styles using material UI components
render() {
    return (
        <Template>
            <Box {/* this material UI component is the root element */}
             display = 'flex'
             justifyContent = 'space-between'
             width = '100%'
             padding = '0.5rem'
             background = '#06397d'
            >
                <Box className='red box' height='100%'></Box>
                <Box className='yellow box' height='100%'></Box>
            </Box>
        </Template>

        <style> {/* user styles override material UI styles */}
        {`
            .red {background: #911f1e;}

            .yellow {background: #fcdfa3;}

            .box {height: 50%;}
        `}
        </style>
    )
}
```

Styling the root element of your component can be done within the style tag using the `:host` selector.
The root element will be the host for the internal shadow root of this component, therefore any inline styles on it will be lost, making it necessary to style it from within the shadow DOM using the `:host` selector.

```javascript
// styling the root element
render() {
    return (
        <Template>
            <div> {/* this is the root element */}
                red text
            </div>

            <style>
            {`
                :host {color: red;}
            `}
            </style>
        </Template>
    )
}
```

This component also allows you to use javascript variables as CSS selectors or values in your component styling, take a look;

```javascript
// JS variable as CSS selector
render() {
    return (

    )
}
```

```javascript
// JS variable as CSS value
render() {
    return (

    )
}
```
This makes it very easy to directly control the CSS values of pseudo elements, see an example;

```javascript
// JS variable as CSS selector
render() {
    return (

    )
}
```
