module.exports = {
  title: 'Jcrop',
  description: 'Javascript cropping engine',
  ga: 'UA-52538749-3',
  themeConfig: {
    displayAllHeaders: false,
    sidebarDepth: 3,
    sidebar: [
      {
        title: 'Documentation',
        children: [
          '/guide/',
          '/guide/instance',
          '/guide/widgets',
          '/guide/options',
          '/guide/styling',
          '/guide/events'
        ]
      },
      {
        title: 'Reference',
        children: [
          '/objects/rect',
          '/objects/domobj',
          '/objects/confobj'
        ]
      },
      {
        title: 'Examples',
        //collapsable: false,
        children: [
          '/examples/',
          '/examples/aspect',
          '/examples/custom-widget'
        ]
      },
      {
        title: 'Appendix',
        children: [
          '/guide/design',
          '/guide/extend'
        ]
      }
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Github', link: 'https://github.com/tapmodo/Jcrop' },
    ]
  }
}
