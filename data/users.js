const bcrypt = require("bcrypt")
const mongoCollections = require("../mongoColllection")
const users = mongoCollections.users
const posts = mongoCollections.posts
const ObjectId = require('mongodb').ObjectID;

const commentsFile=require("./comments")

async function get(id){

    if(!id) throw "for get(id) you must provide an id"
    if(typeof id !== "string") throw "for get(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for get() object id is not of proper type"

    const _user= await users()
    const userFoundbyID = await _user.findOne({_id : ObjectId(id)})

    if(userFoundbyID === null || userFoundbyID === undefined) throw "for get(id) there is no such user with that id in the collection"

    return userFoundbyID
}

async function getAll(){

    const _users= await users()

    if(_users === null) throw "for getAll() there are no users to display"

    const allUsers= await _users.find({}).toArray()

    return allUsers
}

async function remove(id){
    
    if(!id) throw "for remove(id) you must provide an id"
    if(typeof id !== "string") throw "for remove(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for remove() object id is not of proper type"

    removedUser = await get(id)
    const _user = await users()
    const _posts = await posts()
    const removed = await _user.deleteOne({ _id: ObjectId(id) })

    postsArr = removedUser.posts
    commentsArr = removedUser.comments


    if(removed.deletedCount === 0) throw "there was a problem in remove() this user could not be remmoved"

    for(i=0;i<commentsArr.length;i++){
        await commentsFile.remove(commentsArr[i].toString())
    }
    
    for(i=0;i<postsArr.length;i++){
        await _posts.deleteOne({_id:ObjectId(postsArr[i])})
    }

    return removedUser
}

async function create(firstName, lastName, emailID, uName, pwd){
    if(!firstName) throw "for create() you must provide first name"
    if(!lastName) throw "for create() you must provide last name"
    if(!uName) throw "for create() you must provide username"
    if(!pwd) throw "for create() you must provide a password"
    if(!emailID) throw "for create() you must provide an email-id"

    if(typeof firstName != "string") throw "for create() first name isn't a string"
    if(typeof lastName != "string") throw "for create() last name isn't a string"
    if(typeof uName != "string") throw "for create() username must be a string"
    if(typeof pwd!= "string") throw "for create() password must be string"
    if(typeof emailID!= "string") throw "for create() email-id must be a string"

    const salts = 16

    let newUser = {}

    const _users = await users()

    let unameAlreadyExists
    let regExPwd =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    let regExUname = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    let regExEmailID = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    validPwd = ""
    acceptedUName = ""
    acceptedEmailID = ""

    if(regExEmailID.test(emailID)){
        acceptedEmailID = emailID.toLowerCase()
    }
    else{
        throw "email Id does not match specifications\n"+
        "email must be comparable to 'user@example.com'"
    }

    if(regExPwd.test(pwd)){
        validPwd=pwd
    }
    else{
        throw "password doesnt satisfy all conditions\n"+
        "password between 8 to 15 characters which contain\n"+
        "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    }

    if(_users.length > 0){
        unameAlreadyExists = await _users.findOne({uName : uName})
    }

    if(unameAlreadyExists !== undefined ){
        throw "Username is already taken, try another"
    }

    if(regExUname.test(uName)){
        acceptedUName = uName
    }
    else{
        throw"username does not match specifications\n"+
        "username must be 3 to 15 charecters\n"+
        "can contain letters numbers and '_'"
    }

    let hashedPwd = await bcrypt.hash(validPwd,salts)

    newUser={
        firstName:firstName.toLowerCase(),
        lastName:lastName.toLowerCase(),
        emailID:acceptedEmailID,
        uName:acceptedUName.toLowerCase(),
        pwd:hashedPwd,
        superPowers:[],
        posts:[],
        comments:[],
        score:score
    }

    const inserted = await _users.insertOne(newUser)

    if(inserted.insertedCount === 0) throw "there was a problem in create() this user could not be added"

    const userAdded = await get(ObjectId(inserted.insertedId).toString())
    return userAdded
}

async function addSuperPowers(id, superpowers){

    if(!id) throw "for addSuperPowers(id) you must provide an id"
    if(typeof id !== "string") throw "for addSuperPowers(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for addSuperPowers() object id is not of proper type"

    if(!superpowers) throw "for addSuperPowers() you must provide some input"
    if(!Array.isArray(superpowers)) throw "for addSuperPowers you must provide an array"


    const _users = await users()
    const userFound = await _users.findOne({_id : ObjectId(id)})

    let existingSuperPowers = userFound.superPowers

    for (i=0; i<superpowers.length; i++){
        existingSuperPowers.push(superpowers[i])
    }

    const superPowerAdded = await _users.updateOne( {_id: ObjectId(id)}, {$set:{superPowers: existingSuperPowers}})

    if(superPowerAdded.modifiedCount === 0) throw "there was a problem in addSuperPowers(), couldnt add this superpower"

    return superPowerAdded
}

async function login(uName, pwd){
    if(!uName) throw "for login() you must provide a username"
    if(!pwd) throw "for login() you must provide a password"

    if(typeof uName !== "string") throw "for login() username must be a string"
    if(typeof pwd !== "string") throw "for login password must be a strinng"

    const _users = await users()

    unameFound = await _users.findOne({uName : uName})

    if(unameFound === undefined || unameFound === null){
        throw "no such username"
    }
    else{
        let comparePWD = await bcrypt.compare(pwd, unameFound.pwd)
        if(comparePWD){
            return true
        }
        else{
            return false
        }
    }    
}

async function searchByName(firstName, lastName){
    if(!firstName) throw "for searchByName() you first name"
    if(!lastName) throw "for searchByName() you must provide a last name"

    if(typeof firstName !== "string") throw "for searchByName() firstname must be a string"
    if(typeof lastName !== "string") throw "for searchByName() last name must be a string"

    const _users = await users()

    userFound = await _users.findOne({
        $and: [
            {firstName:firstName.toLowerCase()},
            {lastName:lastName.toLowerCase()}
        ]
    })

    if(userFound === undefined || userFound === null) throw "for searchByName() user was not found"

    return userFound
}

async function searchByUName(uName){
    if(!uName) throw "for searchByUName() you must provide a username"
    if(typeof uName !== "string") throw "for searchByUName() username must be a string"

    const _users = await users()

    let userFound = await _users.findOne({uName:uName})

    if(userFound === undefined || userFound === null) throw "for searchByUName() user was not found"

    return userFound
}

async function updateName(id, newFirstName, newLastName){
    if(!id) throw "for addSuperPowers(id) you must provide an id"
    if(typeof id !== "string") throw "for addSuperPowers(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for addSuperPowers() object id is not of proper type"

    if(!newFirstName) throw "for updateName() you must provide a new firstname"
    if(!newLastName) throw "for updateName() you must provide a new lastname"

    if(typeof newFirstName !== "string") throw "for updateName() new firstname must br a string"
    if(typeof newLastName !== "string") throw "for updateName() new lastname musr be a string"

    const _users = await users()

    let newNameUser = await _users.updateOne(
        {_id: ObjectId(id)}, 
        {$set:{firstName : newFirstName, lastName : newLastName}}
    )

    if(newNameUser.modifiedCount === 0) throw "there was a problem in updateName(), couldnt rename this user"

    return await get(id)
}

async function updateUName(id, newUName){
    if(!id) throw "for addSuperPowers(id) you must provide an id"
    if(typeof id !== "string") throw "for addSuperPowers(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for addSuperPowers() object id is not of proper type"

    if(!newUName) throw "for updateName() you must provide a new firstname"
    if(!newUName) throw "for updateName() you must provide a new lastname"

    const _users = await users()

    let unameAlreadyExists = await _users.findOne({uName : newUName})

    if(unameAlreadyExists !== null && unameAlreadyExists !== undefined){
        throw "username already taken try another"
    }

    let newUNameUser = await _users.updateOne(
        {_id: ObjectId(id)}, 
        {$set:{uName : newUName}}
    )
    
    if(newUNameUser.modifiedCount === 0) throw "there was a problem in updateUName(), couldnt update the username of this user"

    return get(id)
}

module.exports={
    get,
    getAll,
    remove,
    create,
    addSuperPowers,
    login,
    searchByName,
    searchByUName,
    updateName,
    updateUName
}

// async function main(){

//     let manoj = await create("manoj", "salvi", "mrunal@gmail.com", "manu", "mimadhur!@#$1A")
//     console.log(manoj)

//     let andy = await create("john", "pimple", "heavymetalani@gmail.com", "heavymetalani", "hopesh!@#$1A")
//     console.log(andy)

//     let atul = await create("atul", "kundan", "aakash@gmail.com", "pussydestroyer", "jaishivji!@#$1A")
//     console.log(atul)

//     let pete = await create("petesh", "sherman", "protogdyt@gmail.com", "prothepsmesh", "mustdie!@#$1A")
//     console.log(pete)

    // console.log(await getAll())
    // console.log(await get(pete._id.toString()))
    // console.log(await get(andy._id.toString()))
    // console.log(await get(manoj._id.toString()))
    // console.log(await get(atul._id.toString()))

    // manojPost = await postsFile.create(manoj._id.toString(), "ganja", "ohhh ganja ganja ganja gun")
    // anyPost = await postsFile.create(andy._id.toString(), "dance", "i want to learn how to dance")
    // atulPost = await postsFile.create(atul._id.toString(), "i am amaze", "hey hi this is atul, how are you, i am pretty much good")
    // petePost = await postsFile.create(pete._id.toString(), "must die", "ishq hai ya gunha, kyaa keh raha tere jahan?")

    // manojComm1 = await commentsFile.create(manoj._id.toString(), petePost._id.toString(), "pete comment")
    // manojComm2 = await commentsFile.create(manoj._id.toString(), atulPost._id.toString(), "atul comment")
    // manojComm3 = await commentsFile.create(manoj._id.toString(), anyPost._id.toString(), "andy comment")

    // await remove(manoj._id.toString())

// }
// main()
