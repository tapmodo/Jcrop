# Aspect Ratio

<example2 />

**Aspect ratio example.** Implements a single widget and a reset
button that restores the original crop. The reset is accomplished by
animating the crop widget back to the original coordinates.

  * Only one crop widget is allowed
  * Custom handles array is passed, only corner handles
  * Initial coordinates are set and crop widget is created
  * `aspectRatio` is set/locked to original crop dimensions
  * Reset button implements `animate()` method, moves back to original coordinates

### Source code

<<< @/docs/.vuepress/components/example2.vue
