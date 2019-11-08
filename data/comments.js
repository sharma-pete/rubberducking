const bcrypt = require("bcrypt")
const mongoCollections = require("../mongoColllection")
const users = mongoCollections.users
const posts = mongoCollections.posts
const comments = mongoCollections.comments
const ObjectId = require('mongodb').ObjectID;