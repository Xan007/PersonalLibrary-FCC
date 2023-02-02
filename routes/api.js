const Book = require("../models/Book.js")

'use strict';

module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res) {
      const books = await Book.find({})

      res.send(books)

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      const { title } = req.body;

      if (!title)
        return res.send("missing required field title")

      const newBook = new Book({ title: title })

      try {
        await newBook.save()
        //Borrar comments array por si algo.

        res.send(newBook)
      } catch {
        res.send("error on creating book")
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({})
        res.send("complete delete successful")
      } catch {
        res.send("error on deleting all books")
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      const { id } = req.params;

      try {
        const book = await Book.findById(id)

        res.send(book)
      } catch {
        res.send("no book exists")
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      const { id } = req.params;
      const { comment } = req.body;

      if (!comment)
        return res.send("missing required field comment")

      try {
        let book = await Book.findByIdAndUpdate(id, { $push: { comments: comment } }, { returnDocument: "after" })
        console.log(book)
        res.send(book)
      } catch {
        res.send("no book exists")
      }
    })

    .delete(async function (req, res) {
      const { id } = req.params;

      try {
        if (!await Book.findByIdAndDelete(id))
          throw new Error()

        res.send("delete successful")
      } catch {
        res.send("no book exists")
      }

      //if successful response will be 'delete successful'
    });

};
