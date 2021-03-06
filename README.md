# Prasmananjs

Prasmananjs is an alternative for infinite slider that plays nicely with mobile (via HammerJS). It is made to be highly adjustable. No need to add another library/plugin if you only want to add it to your desktop web.

## How to use
Simply download this repository to your local directory. Then, add the javascript before the closing body tag like this:

```html
<script src="prasmananjs/dist/prasmanan.min.js" type="text/javascript"></script>
```

Add css on head section like this (optional):

```html
<link href="prasmananjs/dist/prasmanan.min.css" rel="stylesheet">
```

Add these code to your html and javascript:

```html
<div class="container">

<ul class="cards">

  <li class="card">
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
  </li>

  <li class="card">
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
  </li>

  <li class="card">
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    </p>
  </li>
</ul>

<div class="cards__control control--prev"></div>
<div class="cards__control control--next"></div>

</div>
```

```javascript
config = {
  container: document.getElementsByClassName('container')[0],
  cardMargin: 20,
  cardWidth: 0.75,
  card: document.getElementsByClassName('card'),
  cards: document.getElementsByClassName('cards')[0],
  prevControl: document.getElementsByClassName('control--prev')[0],
  nextControl: document.getElementsByClassName('control--next')[0]
};
prasmanan = new Prasmanan(config);
prasmanan.serve();
```

If you want a better support for mobile (like swipe to view next/previous slide), add `enableTouch: true` to options, and add [hammerjs](https://github.com/hammerjs/hammer.js) before `prasmananjs` reference.

## Development
It is still highly under development, so it might change frequently. Below are some checklists that i'm working on.

- [ ] Add AMD support.
- [ ] Add more tests.
- [ ] Add center mode.

If you want to contribute, you are very welcome to send a pull request or an issue on this repository.
