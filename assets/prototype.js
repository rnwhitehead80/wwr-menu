(() => {
  'use strict';

  const h = React.createElement;
  const menus = window.nextWomensMenus;
  const nextSite = 'https://www.next.co.uk';

  function Chevron({ direction = 'right' }) {
    return h('img', {
      className: 'wm-chevron',
      src: './assets/icons/chevron-' + direction + '.svg',
      alt: '',
      'aria-hidden': true
    });
  }

  function MenuDemo() {
    const [version, setVersion] = React.useState('before');
    const [branchId, setBranchId] = React.useState(null);
    const menuPane = React.useRef(null);
    const heading = React.useRef(null);
    const indexScroll = React.useRef(0);
    const nextFocus = React.useRef(null);
    const branches = menus[version];
    const branch = branches.find(item => item.id === branchId);
    const linkCount = branches.reduce((sum, item) => sum + item.links.length, 0);

    React.useLayoutEffect(() => {
      const pane = menuPane.current;
      pane.scrollTop = branchId ? 0 : indexScroll.current;
      if (nextFocus.current === 'heading') {
        heading.current.focus({ preventScroll: true });
      } else if (nextFocus.current) {
        pane.querySelector('[data-branch="' + nextFocus.current + '"]')?.focus({ preventScroll: true });
      }
      nextFocus.current = null;
    }, [version, branchId]);

    function openBranch(id) {
      indexScroll.current = menuPane.current.scrollTop;
      nextFocus.current = 'heading';
      setBranchId(id);
    }

    function backToWomen() {
      nextFocus.current = branchId;
      setBranchId(null);
    }

    function compare(nextVersion) {
      if (nextVersion === version) return;
      indexScroll.current = 0;
      if (branchId && !menus[nextVersion].some(item => item.id === branchId)) {
        setBranchId('W01');
      }
      setVersion(nextVersion);
    }

    function renderBranch(item) {
      return h('li', { key: item.id },
        h('button', {
          className: 'wm-row wm-branch',
          type: 'button',
          'data-branch': item.id,
          onClick: () => openBranch(item.id)
        },
        h('img', { className: 'wm-thumbnail', src: './assets/thumbnails/' + item.id + '.webp', alt: '' }),
        h('span', null, item.label),
        h(Chevron)));
    }

    function renderLink(link) {
      return h('li', { key: link.id },
        h('a', {
          className: 'wm-row',
          href: new URL(link.url, nextSite).href,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        h('span', null, link.label),
        h(Chevron)));
    }

    return h('div', { className: 'wm-demo' },
      h('div', { className: 'wm-comparison' },
        h('div', { className: 'wm-controls', role: 'group', 'aria-label': 'Compare Women’s menu versions' },
          ['before', 'after'].map(mode => h('button', {
            key: mode,
            className: 'wm-mode',
            type: 'button',
            'aria-pressed': version === mode,
            onClick: () => compare(mode)
          }, mode === 'before' ? 'Before' : 'After'))),
        h('p', { className: 'wm-meta', 'aria-live': 'polite' },
          (version === 'before' ? 'UK app snapshot' : 'Proposed menu') + ' · ' +
          branches.length + ' sections · ' + linkCount + ' links')),
      h('section', { className: 'wm-device', 'aria-label': 'Next Women’s mobile menu' },
        h('div', { className: 'wm-brand' },
          h('img', { src: './assets/icons/next-logo.svg', alt: 'Next' })),
        h('header', { className: 'wm-title' },
          branch && h('button', {
            className: 'wm-back',
            type: 'button',
            'aria-label': 'Back to Women’s',
            onClick: backToWomen
          }, h(Chevron, { direction: 'left' })),
          h('h1', { id: 'wm-section-title', ref: heading, tabIndex: -1 }, branch ? branch.label : 'Women’s')),
        h('nav', { className: 'wm-pane', ref: menuPane, 'aria-labelledby': 'wm-section-title' },
          h('ul', { className: 'wm-list' }, branch ? branch.links.map(renderLink) : branches.map(renderBranch)))));
  }

  ReactDOM.createRoot(document.getElementById('next-womens-menu')).render(h(MenuDemo));
})();
