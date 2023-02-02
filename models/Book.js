const { Schema, model } = require("mongoose")

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    comments: [String]
    //commentcount: Number
}, {
    strict: false
})

function count_comments(book) {
    book.set("commentcount", book.comments.length)

    return book
}

bookSchema.post(/^find/, function (res, next) {

    if (Array.isArray(res))
        res = res.map((book) => count_comments(book))
    else
        res = count_comments(res)


    next()
})


const Book = model("Book", bookSchema)

module.exports = Book