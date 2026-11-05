const memory = {
  books: [
    {id: 1, title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", year: 1840, pages: 352, copies: 3, shelf: "A-1"},
    {id: 2, title: "Тигролови", author: "Іван Багряний", genre: "Роман", year: 1944, pages: 288, copies: 2, shelf: "A-2"},
    {id: 3, title: "Лісова пісня", author: "Леся Українка", genre: "Драма", year: 1911, pages: 160, copies: 2, shelf: "A-1"},
    {id: 4, title: "Захар Беркут", author: "Іван Франко", genre: "Повість", year: 1883, pages: 224, copies: 1, shelf: "A-3"},
    {id: 5, title: "Сад Гетсиманський", author: "Іван Багряний", genre: "Роман", year: 1950, pages: 512, copies: 1, shelf: "A-2"},
    {id: 6, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", genre: "Повість", year: 1879, pages: 192, copies: 4, shelf: "B-1"}
  ],
  readers: [
    {id: 1, name: "Олійник Марта Ігорівна", birth: "2003-04-11", phone: "+380 50 123-45-67", email: "marta.oliinyk@example.com", address: "вул. Шевченка, 12, кв. 5", registered: "2024-09-02", category: "Студент"},
    {id: 2, name: "Захарченко Богдан Сергійович", birth: "1965-08-23", phone: "+380 66 222-33-44", email: "bzakh@example.com", address: "вул. Франка, 3", registered: "2019-03-15", category: "Викладач"},
    {id: 3, name: "Литвин Софія Олегівна", birth: "2011-12-01", phone: "+380 97 555-66-77", email: "sofia.lytvyn@example.com", address: "просп. Миру, 40, кв. 18", registered: "2023-01-20", category: "Школяр"},
    {id: 4, name: "Кузьменко Василь Петрович", birth: "1950-02-14", phone: "+380 63 888-99-00", email: "kuzmenko.vp@example.com", address: "вул. Садова, 7", registered: "2015-06-10", category: "Пенсіонер"},
    {id: 5, name: "Гнатюк Роман Андрійович", birth: "1998-07-30", phone: "+380 93 111-22-33", email: "r.hnatiuk@example.com", address: "вул. Лесі Українки, 25, кв. 3", registered: "2026-02-05", category: "Інше"}
  ],
  loans: [
    {id: 1, book: 1, reader: 1, given: "2026-10-01", days: 14, returned: true, librarian: "Ковальчук Н."},
    {id: 2, book: 2, reader: 3, given: "2026-10-10", days: 21, returned: false, librarian: "Ковальчук Н."},
    {id: 3, book: 4, reader: 2, given: "2026-09-20", days: 30, returned: false, librarian: "Петрук О."},
    {id: 4, book: 3, reader: 1, given: "2026-10-15", days: 14, returned: false, librarian: "Петрук О."},
    {id: 5, book: 6, reader: 4, given: "2026-08-25", days: 30, returned: true, librarian: "Ковальчук Н."},
    {id: 6, book: 2, reader: 5, given: "2026-10-20", days: 14, returned: false, librarian: "Петрук О."}
  ]
}

const repo = {
  all(name) {
    return memory[name]
  },
  save(name, list) {
    memory[name] = list
  }
}

const GENRES = ["Роман", "Повість", "Поезія", "Драма", "Детектив", "Фантастика", "Наукова"]
const CATEGORIES = ["Студент", "Школяр", "Викладач", "Пенсіонер", "Інше"]

const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

function plusDays(date, days) {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d + Number(days))).toISOString().slice(0, 10)
}

function toLocal(date) {
  const [y, m, d] = date.split("-")
  return `${d}.${m}.${y}`
}

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function findById(name, id) {
  return repo.all(name).find(item => item.id === Number(id))
}

function available(bookId) {
  const book = findById("books", bookId)
  if (!book) return 0
  const taken = repo.all("loans").filter(loan => loan.book === book.id && !loan.returned).length
  return book.copies - taken
}

function booksOnHands(readerId) {
  return repo.all("loans").filter(loan => loan.reader === readerId && !loan.returned).length
}

const schema = {
  books: {
    tab: "Книги",
    fields: [
      {key: "id", label: "№"},
      {key: "title", label: "Назва", input: "text"},
      {key: "author", label: "Автор", input: "text"},
      {key: "genre", label: "Жанр", input: "select", options: GENRES},
      {key: "year", label: "Рік видання", input: "number"},
      {key: "pages", label: "Сторінок", input: "number"},
      {key: "copies", label: "Примірників", input: "number"},
      {key: "free", label: "Вільно", calc: book => available(book.id)},
      {key: "shelf", label: "Полиця", input: "text"}
    ]
  },
  readers: {
    tab: "Читачі",
    fields: [
      {key: "id", label: "№"},
      {key: "name", label: "ПІБ", input: "text"},
      {key: "birth", label: "Дата народження", input: "date"},
      {key: "phone", label: "Телефон", input: "tel"},
      {key: "email", label: "Email", input: "email"},
      {key: "address", label: "Адреса", input: "text"},
      {key: "registered", label: "Дата реєстрації", input: "date", initial: () => today},
      {key: "category", label: "Категорія", input: "select", options: CATEGORIES},
      {key: "hands", label: "Книг на руках", calc: reader => booksOnHands(reader.id)}
    ]
  },
  loans: {
    tab: "Видачі",
    fields: [
      {key: "id", label: "№"},
      {key: "book", label: "Книга", input: "ref", ref: "books", show: "title"},
      {key: "reader", label: "Читач", input: "ref", ref: "readers", show: "name"},
      {key: "given", label: "Дата видачі", input: "date", initial: () => today},
      {key: "days", label: "Термін, днів", input: "number", initial: () => 14},
      {key: "due", label: "Повернути до", calc: loan => {
        const due = plusDays(loan.given, loan.days)
        return !loan.returned && due < today ? toLocal(due) + " (прострочено)" : toLocal(due)
      }},
      {key: "returned", label: "Повернено", input: "checkbox"},
      {key: "librarian", label: "Бібліотекар", input: "text"}
    ]
  }
}

function display(field, item) {
  if (field.calc) return field.calc(item)
  const value = item[field.key]
  if (field.input === "date") return toLocal(value)
  if (field.input === "checkbox") return value ? "так" : "ні"
  if (field.input === "ref") {
    const linked = findById(field.ref, value)
    return linked ? linked[field.show] : "-"
  }
  return value
}

function controlHtml(field, value) {
  const attrs = `name="${field.key}"`
  if (field.input === "checkbox") return `<input type="checkbox" ${attrs}${value ? " checked" : ""}>`
  if (field.input === "select" || field.input === "ref") {
    const choices = field.input === "select"
      ? field.options.map(option => [option, option])
      : repo.all(field.ref).map(item => [item.id, item[field.show]])
    const options = choices.map(([val, text]) =>
      `<option value="${esc(val)}"${String(val) === String(value) ? " selected" : ""}>${esc(text)}</option>`
    ).join("")
    return `<select ${attrs}>${options}</select>`
  }
  return `<input type="${field.input}" ${attrs} value="${value === undefined ? "" : esc(value)}">`
}

function readControl(el) {
  return el.type === "checkbox" ? el.checked : el.value.trim()
}

function parse(field, raw) {
  return field.input === "number" || field.input === "ref" ? Number(raw) : raw
}

function validate(field, raw) {
  if (field.input === "checkbox") return null
  if (raw === "") return `Поле "${field.label}" не може бути порожнім`
  if (field.input === "number") {
    const n = Number(raw)
    if (!Number.isInteger(n) || n < 1) return `"${field.label}": потрібне ціле число від 1`
    if (field.key === "year" && n > new Date().getFullYear()) return "Рік видання ще не настав"
  }
  if (field.input === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) return "Email введено неправильно"
  if (field.key === "birth" && raw > today) return "Дата народження ще не настала"
  return null
}

function headerHtml(name) {
  const cells = schema[name].fields.map(field => `<th>${field.label}</th>`).join("")
  return `<tr>${cells}<th></th></tr>`
}

function newRowHtml(name) {
  const cells = schema[name].fields.map(field => {
    if (!field.input) return `<td>${field.key === "id" ? "+" : ""}</td>`
    return `<td>${controlHtml(field, field.initial ? field.initial() : undefined)}</td>`
  }).join("")
  return `<tr>${cells}<td><button data-action="add" data-entity="${name}">Додати</button></td></tr>`
}

function itemRowHtml(name, item) {
  const cells = schema[name].fields.map(field => {
    const text = esc(display(field, item))
    return `<td>${text}</td>`
  }).join("")
  return `<tr>${cells}<td></td></tr>`
}

function sectionHtml(name, active) {
  const rows = repo.all(name).map(item => itemRowHtml(name, item)).join("")
  return `<section id="view-${name}"${name === active ? "" : " hidden"}>
<h3>${schema[name].tab}</h3>
<table border="1" cellpadding="4" cellspacing="0">${headerHtml(name)}${rows}${newRowHtml(name)}</table>
</section>`
}

function currentView() {
  const name = location.hash.slice(1)
  return schema[name] ? name : "books"
}

function paintTabs() {
  const active = currentView()
  const links = Object.keys(schema).map(name =>
    name === active ? `<b>${schema[name].tab}</b>` : `<a href="#${name}">${schema[name].tab}</a>`
  ).join(" | ")
  document.getElementById("tabs").innerHTML = links
  Object.keys(schema).forEach(name => {
    document.getElementById("view-" + name).hidden = name !== active
  })
}

function paintViews() {
  const active = currentView()
  document.getElementById("views").innerHTML = Object.keys(schema).map(name => sectionHtml(name, active)).join("")
}

function repaint() {
  paintViews()
  paintTabs()
}

function createItem(name, row) {
  const item = {}
  for (const field of schema[name].fields.filter(f => f.input)) {
    const el = row.querySelector(`[name="${field.key}"]`)
    const raw = readControl(el)
    const problem = validate(field, raw)
    if (problem) {
      alert(problem)
      el.focus()
      return
    }
    item[field.key] = parse(field, raw)
  }
  if (name === "loans" && !item.returned && available(item.book) <= 0) {
    alert("Вільних примірників цієї книги немає")
    return
  }
  const list = repo.all(name)
  item.id = list.reduce((max, x) => Math.max(max, x.id), 0) + 1
  repo.save(name, [...list, item])
  repaint()
}

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]")
  if (!target) return
  const {action, entity, id, key} = target.dataset
  if (action === "add") createItem(entity, target.closest("tr"))
})

window.addEventListener("hashchange", paintTabs)

repaint()
