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
  document.body.addEventListener(
    'click', renderMultipleTerminalsOnClickTabTitle, false);
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
  var tabText = li.childNodes[0].textContent.trim();
  var oses = tabText.split(', ').map(function (s) { return s.trim(); });
  oses.forEach(function renderMultipleTerminalsListElemOs(osText, osIdx) {
    var os = (osText.split(' ')[0]).toLowerCase();
    if (['linux', 'mac', 'windows'].indexOf(os) < 0) {
      console.warn(
        `Child element #${liIdx} does not reference a supported OS terminal.`,
        ul,
        li,
      );
      return;
    }
    var isLastOs = (osIdx === oses.length - 1);
    var tab = li;

    // create a tabTitle <span> to replace the text node in <li>,
    // in order to apply classes
    var tabTitle = document.createElement('span');
    tabTitle.textContent = osText;
    tabTitle.classList.add('multi-terminal-tabtitle');
    tabTitle.classList.add(`multi-terminal-tabtitle-${os}`);
    tabTitle.setAttribute('data-os', os);
    if (isLastOs) {
      tab.replaceChild(tabTitle, tab.childNodes[0]);
    } else {
      // we have to create a new list element as well
      var newTab = document.createElement('li');
      newTab.appendChild(tabTitle);
      if (tab.nextSibling) {
        tab.parentNode.insertBefore(
          newTab,
          tab,
        );
      } else {
        tab.parentNode.appendChild(tabTitle);
      }
      tab = newTab;
    }

    // create a new tabContent <div>
    // and move rest of contents of the <li> into this
    var tabContent = document.createElement('div');
    tabContent.classList.add('multi-terminal-tabcontent');
    tabContent.classList.add(`multi-terminal-tabcontent-${os}`);
    tabContent.setAttribute('data-os', os);
    for (let childIdx = 1; childIdx < li.childNodes.length; ++childIdx) {
      if (isLastOs) {
        tabContent.appendChild(li.childNodes[childIdx]);
      } else {
        tabContent.appendChild(li.childNodes[childIdx].cloneNode(true));
      }
    }

    // place the tabContent <div> immediately subsequent to the <ul>
    // to which this <li> belongs
    // also set the 1st one among them to be active,
    // otherwise none will be visible by default
    tab.classList.add('multi-terminal-tab');
    tab.classList.add(`multi-terminal-tab-${os}`);
    tab.setAttribute('data-os', os);
    var isFirstTab = (liIdx === 0 && osIdx === 0);
    tab.classList.toggle('active', isFirstTab);
    tabTitle.classList.toggle('active', isFirstTab);
    tabContent.classList.toggle('active', isFirstTab);
    ul.parentNode.insertBefore(
      tabContent,
      ul.nextSibling,
    );
  });
}

function renderMultipleTerminalsOnClickTabTitle (e) {
  var tabTitle = e.target;
  if (tabTitle.classList.contains('multi-terminal-tabtitle')) {
    var tab = tabTitle.parentNode;
    var tabTextId = tab.getAttribute('data-os');
    var allTabsNodeList =
      document.querySelectorAll('.multi-terminal-tab');
    var allTabs =
      Array.prototype.slice.call(allTabsNodeList);
    allTabs.forEach(function (currTab) {
      currTab.classList.toggle(
        'active',
        (currTab.getAttribute('data-os') === tabTextId),
      );
    });
    var allTabsContentNodeList =
      document.querySelectorAll('.multi-terminal-tabcontent');
    var allTabsContent =
      Array.prototype.slice.call(allTabsContentNodeList);
    allTabsContent.forEach(function (currTabContent) {
      currTabContent.classList.toggle(
        'active',
        (currTabContent.getAttribute('data-os') === tabTextId),
      );
    });
  }
}

function renderCustomTerminalsFrames() {
  var elemNodeList =
    document.querySelectorAll('.language-windows-command-prompt');
  var elems = Array.prototype.slice.call(elemNodeList);
  elems.forEach(function (el) {
    el.parentNode.classList.add('windows-command-prompt');
  });
}
