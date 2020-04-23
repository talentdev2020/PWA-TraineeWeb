const middleware = {}

middleware['stats'] = require('..\\..\\src\\middleware\\stats.js')
middleware['stats'] = middleware['stats'].default || middleware['stats']

export default middleware
