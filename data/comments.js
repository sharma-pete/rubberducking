const bcrypt = require("bcrypt")
const mongoCollections = require("../mongoColllection")
const users = mongoCollections.users
const posts = mongoCollections.posts
const comments = mongoCollections.comments
const ObjectId = require('mongodb').ObjectID;

async function create(posterID, postID, comment){

    if(!postID) throw "for create() you must provide a postID"
    if(!posterID) throw "for create() you must provide a posterID"
    if(!comment) throw "for create() you must provide a comment"

    if(typeof posterID !== "string") throw "for create() id must be a string"
    if(!ObjectId.isValid(posterID)) throw "for create() object id is not of proper type"

    if(typeof postID !== "string") throw "for create() id must be a string"
    if(!ObjectId.isValid(postID)) throw "for create() object id is not of proper type"

    if(typeof comment !== "string") throw "comment must be a string"

    let newComment={
        posterID:posterID,
        postID:postID,
        comment:comment
    }

    const _comments = await comments()
    const _posts = await posts()
    const _users = await users()

    const userFoundById = await _users.findOne({_id : ObjectId(posterID)})

    if(!userFoundById) throw "no user with that id"

    const postFoundById = await _posts.findOne({_id : ObjectId(postID)})

    if(!postFoundById) throw "no post with that id"


    const inserted = await _comments.insertOne(newComment)

    if(inserted.insertedCount == 0) throw "therer was a problem in create(), couldnt add new comment"

    const addCommentopost = await _posts.replaceOne( {_id: ObjectId(postID)}, {$push:{comments: inserted.insertedId}})
    const addCommentTouser = await _users.replaceOne( {_id: ObjectId(posterID)}, {$push:{comments: inserted.insertedId}})

}

async function remove(id){
    if(!id) throw "for remove() you must provide an id"
    if(typeof id !== "string") throw "for remove() id must be a string"
    if(!ObjectId.isValid(id)) throw "for remove() object id is not of proper type"

    const _comments = await comments()
    const _users = await users()
    const _posts = await posts()

    const commentFoundById = await _comments.findOne({_id : ObjectId(id)})
    if(!commentFoundById) throw "no comment with that id"

    postID = commentFoundById.postID
    posterID = commentFoundById.posterID

    const removed = await _comments.deleteOne({ _id: ObjectId(id)})

    await _users.updateOne({_id:ObjectId(posterID)},{$pull:{comments:ObjectId(id)}})
    await _posts.updateOne({_id:ObjectId(postID)},{$pull:{comments:ObjectId(id)}})

}

module.exports={
    create,
    remove
}