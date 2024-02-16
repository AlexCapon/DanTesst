import fetchServices from './api/response.js'

const body = document.querySelector('body')
const arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
</svg>`
const minusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
</svg>`

function renderTree () {
  const loader = document.createElement('div')
  loader.classList.add('loader')
  const loaderText = document.createElement('h2')
  loaderText.textContent = 'Загрузка...'
  loader.appendChild(loaderText)
  body.appendChild(loader)

  fetchServices()
    .then((response) => {
      const dataObject = JSON.parse(response)
      const dataArray = Object.values(dataObject)[0]
      const tree = createTree(dataArray)
      loader.remove()
      body.appendChild(tree)
    })
    .catch((err) => console.log('error:', err))
}
function createTree (array) {
  const tree = document.createElement('div')
  tree.classList.add('tree')

  const nodes = createNodes(array)
  nodes.forEach((node) => {
    if (node.hasAttribute('head')) {
      const head = node.getAttribute('head')
      const parent = nodes.find((parentNode) => parentNode.id === head)
      const childrenRoom = parent.querySelector('.children')
      childrenRoom.appendChild(node)
    }
  })

  const roots = nodes.filter((node) => node.classList.contains('root'))
  roots.forEach((root) => tree.appendChild(root))

  return tree
}
function createNodes (array) {
  const sortedArray = array.toSorted((a, b) => a.sorthead - b.sorthead)
  const nodes = sortedArray.map((element) => {
    const node = document.createElement('div')

    const nodeClass = element.node === 0 ? 'list' : 'parent'
    const nodeType = element.head === null ? 'root' : 'branch'
    node.classList.add(nodeClass, nodeType)

    node.setAttribute('id', element.id)
    if (nodeType !== 'root') node.setAttribute('head', element.head)

    const text = createText(element.name, element.price)
    const button = createButton(element.id, (element.node !== 0))
    node.appendChild(button)
    node.appendChild(text)

    if (nodeClass === 'parent') {
      const children = document.createElement('div')
      children.classList.add('children')
      node.appendChild(children)
    }

    return node
  })

  return nodes
}
function createText (name, price) {
  const isPrice = price > 0
  const text = document.createElement('span')
  text.classList.add('text')
  text.textContent = isPrice ? `${name} (${price})` : name

  return text
}
function createButton (nodeId, nodeIsParent) {
  const button = document.createElement('button')
  button.setAttribute('id', `${nodeId}`)
  if (nodeIsParent) {
    button.classList.add('parent-button')
    button.innerHTML = arrowIcon
  } else {
    button.classList.add('list-button')
    button.innerHTML = minusIcon
  }

  return button
}

renderTree()

const buttons = body.querySelectorAll('.parent-button')
buttons.forEach((button) => button.addEventListener('click', () => toggleChildren(button)))

function toggleChildren (button) {
  const parent = button.closest('div')
  const childrenRoom = parent.querySelector('.children')

  button.classList.toggle('closed')
  childrenRoom.classList.toggle('hidden')
}
