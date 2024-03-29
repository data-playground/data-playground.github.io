---
title: "Edge Case: Nested and Mixed Lists"
categories:
  - Edge Case
  - test
tags:
  - content
  - css
  - edge case
  - lists
  - markup
language: Español
author:
  name        : "Pedro Mano"
  bio         : "What do you want, jewels? I am a very extravagant man."
  links:
    - label: "Email"
      icon: "fas fa-fw fa-envelope-square"
      # url: "mailto:billyrick@rick.com"
    - label: "Website"
      icon: "fas fa-fw fa-link"
      url: "https://pedromanodemoura.github.io"
    - label: "Twitter"
      icon: "fab fa-fw fa-twitter-square"
---

Nested and mixed lists are an interesting beast. It's a corner case to make sure that

* Lists within lists do not break the ordered list numbering order
* Your list styles go deep enough.

### Ordered -- Unordered -- Ordered

1. ordered item
2. ordered item 
   * **unordered**
   * **unordered** 
     1. ordered item
     2. ordered item
3. ordered item
4. ordered item

### Ordered -- Unordered -- Unordered

1. ordered item
2. ordered item 
   * **unordered**
   * **unordered** 
     * unordered item
     * unordered item
3. ordered item
4. ordered item

### Unordered -- Ordered -- Unordered

* unordered item
* unordered item 
  1. ordered
  2. ordered 
     * unordered item
     * unordered item
* unordered item
* unordered item

### Unordered -- Unordered -- Ordered

* unordered item
* unordered item 
  * unordered
  * unordered 
    1. **ordered item**
    2. **ordered item**
* unordered item
* unordered item

### Task Lists
