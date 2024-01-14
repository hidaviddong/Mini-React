import { createElement } from './src/React'
import {createRoot} from './src/ReactDOM'

const domNode = createRoot(document.getElementById('app'))
const reactElement = createElement('h1',{className:'greeting'},'Hello')
domNode.render(reactElement)