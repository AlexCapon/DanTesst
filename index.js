import fetchServices from './api/response.js'

const body = document.querySelector('body')
const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
</svg>`
const minusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
</svg>`

function renderTree () {
  const loader = createLoader()
  body.appendChild(loader)

  fetchServices()
    .then((response) => {
      const dataObject = JSON.parse(response)
      const [dataArray] = Object.values(dataObject)

      const nodes = createNodes(dataArray)
      const roots = createRoots(nodes)
      const tree = createTree(roots)
      addListenersOnButtons(tree)

      loader.remove()
      body.appendChild(tree)
    })
    .catch((err) => console.log('error: ', err))
}
function createNodes (array) {
  const nodes = array.map((element) => createNode(element))
  const sortedNodes = nodes.toSorted((a, b) => a.getAttribute('sorthead') - b.getAttribute('sorthead'))
  sortedNodes.forEach((node) => node.removeAttribute('sorthead'))

  return sortedNodes
}
function createRoots (nodes) {
  nodes.forEach((node) => {
    if (node.hasAttribute('head')) {
      const head = node.getAttribute('head')
      const parent = nodes.find((parentNode) => parentNode.id === head)
      const childrenRoom = parent.querySelector('.children')
      node.removeAttribute('head')
      childrenRoom.appendChild(node)
    }
  })

  return nodes.filter((node) => node.classList.contains('root'))
}
function createTree (roots) {
  const tree = document.createElement('div')
  tree.classList.add('tree')
  roots.forEach((root) => tree.appendChild(root))

  return tree
}

function createNode (object) {
  const node = document.createElement('div')

  const nodeClass = object.node === 0 ? 'list' : 'parent'
  const nodeType = object.head === null ? 'root' : 'branch'
  node.classList.add(nodeClass, nodeType)

  node.setAttribute('sorthead', object.sorthead)
  node.setAttribute('id', object.id)
  if (nodeType !== 'root') node.setAttribute('head', object.head)

  const text = createText(object.name, object.price)
  const button = createButton(object.id, (object.node !== 0))
  node.appendChild(button)
  node.appendChild(text)

  if (nodeClass === 'parent') {
    const children = document.createElement('div')
    children.classList.add('children')
    node.appendChild(children)
  }

  return node
}
function createText (name, price) {
  const isPrice = price > 0
  const text = document.createElement('span')
  text.classList.add('text')
  text.textContent = isPrice ? `${name} (${price})` : name

  return text
}
function createButton (nodeId, isParent) {
  const button = document.createElement('button')
  button.setAttribute('id', `${nodeId}`)
  if (isParent) {
    button.classList.add('parent-button')
    button.innerHTML = arrowIcon
  } else {
    button.classList.add('list-button')
    button.innerHTML = minusIcon
  }

  return button
}

function createLoader () {
  const loader = document.createElement('h2')
  loader.classList.add('loader')
  loader.textContent = 'Загрузка...'

  return loader
}
function addListenersOnButtons (node) {
  const buttons = node.querySelectorAll('.parent-button')
  buttons.forEach((button) => button.addEventListener('click', () => toggleChildren(button)))
}
function toggleChildren (button) {
  const parent = button.closest('div')
  const childrenRoom = parent.querySelector('.children')

  button.classList.toggle('closed')
  childrenRoom.classList.toggle('hidden')
}

renderTree()
