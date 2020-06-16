# react-jsx-template


<p>react + react-jsx-template = <a href='https://en.wikipedia.org/wiki/Modular_programming' target='_blank'>modularity</a> and <a href='https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)'  target='_blank'>encapsulation</a></p>

<p>React component for style encapsulation. It helps you create components with scoped styles, also compatible with material-UI styled components. It works with the <a href='https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM' target='_blank'>Shadow DOM API</a> and essentially renders the content of the component within the Shadow DOM of a 'root' element. It works a bit like the &lt;template&gt; tag in Vue.js, except that in this case it contains everything in the component, including the &lt;style&gt; tag.</p>

<p> If you're a Vue.js developer transitioning to React.js you will love this powerful yet simple component.</p>

# installation

<p>If you have <a href='https://nodejs.org' target='_blank'>node</a> installed on your computer, run;</p>

```sh
npm install react-jsx-template
```

# peer dependencies

<p>This package requires that you have the following packages installed in your project;</p>

* Material-UI components version: ^"4.10.1" for reusable UI components. More information <a href='https://material-ui.com' target='_blank'>here</a>

  to install run;

  ```sh
  npm install @material-ui/core
  ``` 

* React library. It comes by default if you scaffold your project on CRA. More information <a href='https://reactjs.org' target='_blank'>here</a>

  to install run;

  ```sh
  npm install react
  ```

# Usage

<p>Now we're all setup, to use the 'react-jsx-template' import it at the top of your script.</p>

```js
import {Template} from 'react-jsx-template'
```

<p>Then you can use it in the render function of your component;</p>

```js
// component with scoped styles, using material-ui component library
render() {
    return (
        <Template>
            <div> {/* this div is the root element */}
                <p>Red colored content, try it</p>
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
<p> The &lt;Template&gt; tag does not get mounted to the DOM, but the root element gets mounted to the DOM and hosts a shadow root to contain all the other elements of our component. &lt;style&gt; tags enclosed in &lt;Template&gt; tags will also be rendered in the shadow DOM, and their styles will be applied exclusively to elements within the shadow DOM.</p>

<p> You can use material-ui styled components, the inline styles will be preserved by default. To use a different component library, you need to setup a custom 'StylesProvider' the setup is explained below. </p>

<p> Create a template.js file in your working directory, and write the following code in it; 

```js
// template.js
import {StylesProvider} from // 'location of user defined styles provider'
import {initializeTemplate} from 'react-jsx-template'

const Template = initializeTemplate(StylesProvider)
export default Template
```

<p> You can now use it in your components; </p>

```js
// your component
import Template from './template.js'
import {Item} from 'other component library'
```

<p>and in the render function we can have something like this;</p>

```javascript
// component with scoped styles, using other component library
render() {
    return (
        <Template>
            <Item {/* this component is the root element */}
             display = 'flex'
             justifyContent = 'space-between'
             width = '100%'
             padding = '0.5rem'
             background = '#06397d'
            >
                <Item className='red box' height='100%'></Item>
                <Item className='yellow box' height='100%'></Item>
            </Item>
        </Template>

        <style> {/* user defined style rules override component library's inline styles */}
        {`
            .red {background: #911f1e;}

            .yellow {background: #fcdfa3;}

            .box {height: 50%;}
        `}
        </style>
    )
}
```

<p> Styling the root element of your component can be done using the `:host` selector. The root element will host the internal shadow root of this component, therefore the `:host` selector can be used to target the host element from within the shadow root.</p>

```javascript
// styling the root element
render() {
    return (
        <Template>
            <div> {/* this is the root element */}
                The root element has red text.
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

<p>We have our CSS inside our JS file, and this allows us to play around with the CSS, using javascript variables as CSS selectors in our component styling, take a look;</p>

```javascript
// JS variable as CSS selector
render() {
    // we can change the value of 'target' dynamically to 'green' or 'blue'
    let target = 'red'

    return (
        <Template>
            <div>
                <p className={target}>
                    This paragraph has a variable className and a CSS selector that always matches its className and applies persistent styling rules, eliminating the need for an additional className.
                </p>
            </div>

            <style>
            {`
                p.${target} {...persistent styling rules}

                .red {color: red;}
                .green {color: green;}
                .blue {blue: blue;}
            `}
            </style>
        </Template>
    )
}
```

<p>We can also use this concept to implement dynamic CSS properties in our component styles</p>

 ```javascript
// JS variable as CSS property
render() {
    // we can dynamically alternate the value of 'property' between 'border-color' and 'color'
    let property = 'border-color'

    return (
        <Template>
            <div>
                <p className='someClass'> This paragraph can either have a blue text color or a blue border color</p> 
            </div>

            <style>
            {`
                .someClass {${property}: blue;}
            `}
            </style>
        </Template>
    )
}
```

<p>With the same technique, we can have dynamic CSS values in our component styles</p>

 ```javascript
// JS variable as CSS value
render() {
    // we can dynamically change 'value'
    let value = '10%'

    return (
        <Template>
            <div>
                <p className='someClass'> The CSS value of the height of this paragraph can be directly manipulated using Javascript.</p> 
            </div>

            <style>
            {`
                .someClass {height: ${value};}
            `}
            </style>
        </Template>
    )
}
```

<p>This makes controling the CSS styles of pseudo elements a breeze, see an example;</p>

```javascript
// JS variable as CSS selector
render() {
    // we can dynamically change the value of 'size' to 'medium' or 'large'
    let size = 'small'

    return (
        <Template>
            <div>
                <p className={size}>The :before pseudo element of this paragraph will always maintain its styling no matter what the className changes to.</p>
            </div>

            <style>
            {`
                .${size}:before {
                    content: '';
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: crimson;
                }

                .small {width: 10%;}
                .medium {width: 25%;}
                .large {width: 40%;}
                .x-large {width: 60%;}
            `}
            </style>
        </Template>
    )
} 
```

<p>We can also experiment with dynamic media queries, see an example;</p>

```javascript
// JS variable as media query breakpoint
render() {
    // we can dynamically adjust the breakpoint of the media query, thereby activating or deactivating it.
        let breakpointMobile = '720px'
        let breakpointDesktop = '1280px'

    return (
        <Template>
            <div>
                <p> You can alter the breakpoint to display desktop view on mobile and vice-versa. </p>
            </div>
        </Template>

        <style>
        {`
            @media screen and (max-width: ${breakpointMobile}) {
                // mobile styling
            }

            @media screen and (min width: ${breakpointDesktop}) {
                // desktop styling
            }
        `}
        </style>
    )
} 
```

<p> For additional suport, follow me on <a href='https://twitter.com/onepetercollins' target='_blank'>twitter</a> @onepetercollins. You can share your ideas and cool projects, I'd love to see them. </p>

<p> I will also appreciate your donations towards the maintenance of this package. </p>
