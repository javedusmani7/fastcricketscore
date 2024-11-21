const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  article_source:  { type: String},
    url: { type: String,  unique: true},
    source: {
      id:  { type: String },
      name: { type: String },
    },
    author: { type: String },
    title: { type: String },
    description: { type: String },
    urlToImage: { type: String },
    publishedAt: { type: String },
    content: { type: String },
    status: { type: Boolean, default: true },
},
{
    timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);