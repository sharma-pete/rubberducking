const mongoCollections = require("../mongoColllection")
const users = mongoCollections.users
const posts = mongoCollections.posts
const ObjectId = require('mongodb').ObjectID;

async function create(posterID, title, content){

    if(!posterID) throw "for create() you must provide an id"
    if(typeof posterID !== "string") throw "for create() id must be a string"
    if(!ObjectId.isValid(posterID)) throw "for create() object id is not of proper type"

    if(!title) throw "for create() you must provide post title"
    if(typeof title !== "string") throw "for create() title must be a string"
    if(title.length < 1) throw "for create() title is empty"

    if(!content) throw "for create() you must provide post title"
    if(typeof content !== "string") throw "for create() title must be a string"
    if(content.length < 1) throw "for create() title is empty"

    const _users = await users()
    const _posts = await posts()

    const userFoundById = await _users.findOne({_id : ObjectId(posterID)})

    if(!userFoundById) throw "no user with that id"

    let newPost = {
        "title": title,
        "author": {
            "posterID":posterID,
            "name":userFoundById.name
        },
        "content": content        
    }

    const postAdded = await _posts.insertOne(newPost)
    if(postAdded.insertedCount === 0) throw "there was a problem, could not add post"

    let pushObj={
        _id: postID,
        title: newPost.title
    }
        
    const addPostTouser = await _users.replaceOne( {_id: ObjectId(posterID)}, {$push:{posts: pushObj}})

    return newPost
}

async function get(id){

    if(!id) throw "for get(id) you must provide an id"
    if(typeof id !== "string") throw "for get(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for get() object id is not of proper type"

    const _posts= await posts()
    const postFoundbyID = await _posts.findOne({_id : ObjectId(id)})

    if(postFoundbyID === null) throw "for get(id) there is no such psot with that id in the collection"

    return postFoundbyID
}

async function getAll(){

    const _posts= await posts()

    if(_posts === null) throw "for getAll() there are no users to display"

    const allPosts= await _posts.find({}).toArray()

    return allPosts
}

async function remove(id){

    if(!id) throw "for remove(id) you must provide an id"
    if(typeof id !== "string") throw "for remove(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for remove() object id is not of proper type"

    postRemoved = await get(id)
    const _posts = await posts()
    const removed = await _posts.deleteOne({ _id: ObjectId(id) })

    if(removed.deletedCount === 0) throw "there was a problem in remove() this post could not be remmoved"
    
    return postRemoved
}

async function rename(id, newTitle, newContent){

    if(!id) throw "for rename() you must provide an id"
    if(typeof id !== "string") throw "for rename() id must be a string"
    if(!ObjectId.isValid(id)) throw "for rename() object id is not of proper type"

    if(!newTitle) throw "for rename() you must privide a new name"
    if(typeof newTitle !== "string") throw "for rename() name must bbe a string"
    if(newTitle.length <=0) throw "for rename() newname cannot be empty" 

    if(!newContent) throw "for rename() you must privide a new name"
    if(typeof newContent !== "string") throw "for rename() name must bbe a string"
    if(newContent.length <=0) throw "for rename() newname cannot be empty" 

    const _posts = await posts()
    const _users = await users()

    const postFoundbyID = await _posts.findOne({_id : ObjectId(id)})

    const renamespost = await _posts.updateOne( {_id: ObjectId(id)}, {$set:{title : newTitle}} )

    if(renamespost.modifiedCount === 0) throw "there was a problem in rename(), couldnt update title of post"

    const recontentpost = await _posts.updateOne( {_id: ObjectId(id)}, {$set:{content : newContent}} )

    if(recontentpost.modifiedCount === 0) throw "there was a problem in rename(), couldnt update title of post"

    const userID = postFoundbyID.author._id

    const userFound = await _users.findOne({_id: ObjectId(userID)})

    let myArr = userFound.posts

    for(i=0;i<myArr.length;i++){
        if(myArr[i]._id.toString() === id){
            myArr[i].title = newTitle
        }
    }

    await _users.updateOne( {_id: ObjectId(userID)}, {$set:{posts: myArr}})

    return await get(id)
}

module.exports = {
    create,
    get,
    getAll,
    remove,
    rename
}