window.addEventListener(
  'DOMContentLoaded',
  renderCustomTerminalsSetup,
);

function renderCustomTerminalsSetup() {
  var elemNodeList = document.querySelectorAll(
    'a[title="multiple-terminals"]',
  );
  var elems = Array.prototype.slice.call(elemNodeList);
  elems.forEach(renderMultipleTerminals);
  renderCustomTerminalsFrames();
}

function renderMultipleTerminals(el) {
  let nextEl = el.parentNode.nextSibling;
  while (nextEl && nextEl.nodeType === Node.TEXT_NODE) {
    nextEl = nextEl.nextSibling;
  }
  if (!nextEl && nextEl.tagName !== 'UL') {
    console.warn('Expected an <ul> element:', el);
    return;
  }
  var ul = nextEl;
  var childNodeList = ul.querySelectorAll('li');
  var children = Array.prototype.slice.call(childNodeList);
  console.log(children);
  if (children.length === 0) {
    console.warn('Expected at least 1 <li> element:', ul);
    return;
  }
  ul.classList.add('multi-terminal-group');
  children.forEach(function (li, liIdx) {
    renderMultipleTerminalsListElem(ul, li, liIdx);
  });
}

function renderMultipleTerminalsListElem(ul, li, liIdx) {
  // validation
  if (li.childNodes.length < 2 ||
      li.childNodes[0].nodeType !== Node.TEXT_NODE ||
      li.childNodes[1].nodeType !== Node.ELEMENT_NODE) {
    console.warn(
      `Child element #${liIdx} does not contain expected elements.`,
      ul,
      li,
    );
    return;
  }
  const tabText = li.childNodes[0].textContent.trim();
  const tabTextId = tabText.toLowerCase();
  if (['linux', 'mac', 'windows'].indexOf(tabTextId) < 0) {
    console.warn(
      `Child element #${liIdx} does not reference a supported OS terminal.`,
      ul,
      li,
    );
    return;
  }

  // create a tabTitle <span> to replace the text node in <li>,
  // in order to apply classes
  const tabTitle = document.createElement('span');
  tabTitle.textContent = tabText;
  tabTitle.classList.add('multi-terminal-tabtitle');
  tabTitle.classList.add(`multi-terminal-tabtitle-${tabTextId}`);
  tabTitle.setAttribute('data-os', tabTextId);
  li.replaceChild(tabTitle, li.childNodes[0]);

  // create a new tabContent <div>
  // and move rest of contents of the <li> into this
  const tabContent = document.createElement('div');
  tabContent.classList.add('multi-terminal-tabcontent');
  tabContent.classList.add(`multi-terminal-tabcontent-${tabTextId}`);
  tabContent.setAttribute('data-os', tabTextId);
  for (let childIdx = 1; childIdx < li.childNodes.length; ++childIdx) {
    tabContent.appendChild(li.childNodes[childIdx]);
  }

  // place the tabContent <div> immediately subsequent to the <ul>
  // to which this <li> belongs
  // also set the 1st one among them to be active,
  // otherwise none will be visible by default
  li.classList.add('multi-terminal-tab');
  li.classList.add(`multi-terminal-tab-${tabTextId}`);
  li.setAttribute('data-os', tabTextId);
  const isFirstTab = (liIdx === 0);
  li.classList.toggle('active', isFirstTab);
  tabTitle.classList.toggle('active', isFirstTab);
  tabContent.classList.toggle('active', isFirstTab);
  ul.parentNode.insertBefore(
    tabContent,
    ul.nextSibling,
  );
}

function renderCustomTerminalsFrames() {
  const elemNodeList =
    document.querySelectorAll('.language-windows-command-prompt');
  var elems = Array.prototype.slice.call(elemNodeList);
  elems.forEach(function (el) {
    el.parentNode.classList.add('windows-command-prompt');
  });
}
