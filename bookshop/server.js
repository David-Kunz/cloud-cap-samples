const cds = require('@sap/cds')
const express = require('express')
const handlebars = require('express-handlebars')

const helpers = {}
helpers.isNavigation = element => element.type === 'cds.Association' || element.type === 'cds.Composition'
helpers.isPlainElement = element => !helpers.isNavigation(element) && element.type !== 'cds.LargeBinary'
helpers.getViewableElements = entity =>
  Object.keys(entity.elements)
    .map(k => entity.elements[k])
    .filter(helpers.isPlainElement)
    .sort((a, b) => (a.key && b.key ? 0 : a.key ? -1 : b.key ? 1 : 0))
helpers.joinByComma = elements => elements.map(e => e.name).join(',')

cds.on('served', () => {
  const app = cds.app
  app.set('view engine', 'hbs')
  console.log(cds.model.definitions['CatalogService.Books'])
  app.engine(
    'hbs',
    handlebars({
      partialsDir: __dirname + '/views/partials/',
      extname: 'hbs',
      helpers
    })
  )
  app.use('/views', express.static('views'))
  app.get('/app', (req, res) => {
    res.render('main', {
      layout: 'index',
      listEntity: cds.model.definitions['CatalogService.ListOfBooks'],
      objectEntity: cds.model.definitions['CatalogService.Books'],
      path: cds.model.definitions['CatalogService']['@path']
    })
  })
})
module.exports = cds.server
