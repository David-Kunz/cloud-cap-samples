function bootstrap({ path, listEntityName, objectEntityName, objectEntityProperties }) {
  listEntityName = listEntityName.split('.').pop()
  objectEntityName = objectEntityName.split('.').pop()

  const GET = url => axios.get(path + url)

  const items = new Vue({
    delimiters: ['${', '}'],
    el: '#app',

    data: {
      list: [],
      loading: false,
      selectedItem: undefined
    },

    methods: {
      search: ({ target: { value: v } }) => items.fetch(v && '?$search=' + v),

      async fetch(etc = '') {
        const { data } = await GET(`/${listEntityName}${etc}`)
        items.list = data.value
      },

      async inspect(eve) {
        const selectedItem = (items.selectedItem = items.list[eve.currentTarget.rowIndex - 1])
        items.loading = true
        const res = await GET(`/${objectEntityName}/${selectedItem.ID}?$select=${objectEntityProperties}`)
        Object.assign(selectedItem, res.data)
        items.loading = false
      }
    }
  })

  items.fetch()
}
