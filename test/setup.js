// setup JSDOM
require('jsdom-global')()

// make expect available globally
global.expect = require('chai').expect

// make $ available globally
global.$ = require('jquery')

global.ace = {
  edit: () => {
    return {
      focus: () => {}
    }
  }
}