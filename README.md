# Module: MMM-Cronixie

The `MMM-Cronixie` module is yet another clock for the [MagicMirror²](https://github.com/MichMich/MagicMirror).

This is a simple demo scene of [Cronixie](https://vk.com/cronixie) project.

![](pic/preview_landscape.png)
![](pic/preview_landscape_v2.png)
![](pic/preview_portrait.png)
![](pic/preview_portrait_v2.png)

## Installation

1. Go to the MagicMirror modules folder

```bash
cd ~/MagicMirror/modules
```

2. Clone this repository

```bash
git clone https://github.com/timophey/MMM-Cronixie.git
```

3. Add the this module to the modules array in the MagicMirror `config/config.js` file, like this:

```javascript
modules: [
  {
    module: "MMM-Cronixie",
    position: "middle_center",
    config:{
        width: "80vw",
        orientation: "landscape",
        reroll: 2,
        ver: 2,
    }
  }
]
```
The following configurations are available:

Config       | Possible values            | Default value | Description
:------------|:---------------------------|:--------------|:------------
`width`      | `80vh` `500px` `20em`      | `90vw`        | Width in CSS units
`orientation`| `landscape` or  `portrait` | `landscape`   | Array or vertical tower view
`reroll`     | `0`-`2`                    | `1`           | Reroll option
`rerollDelay`| `integer` in `ms`          | `255`         | Delay between nixies on reroll
`functions`  | array of [`0`,`1`]         | `[1,1,1,1,1,0]`| Transition function for each nixie
`rev`        | `1`, `2`                   | `2`           | Photos version, next build

## Todo

- [ ] Color shift animations
- [ ] Roll and Fade transitions
- [x] Roll right to left and even-numbered on minute change
