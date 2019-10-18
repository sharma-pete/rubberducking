const mongoCollections = require("../mongoColllection")
const users = mongoCollections.users
const ObjectId = require('mongodb').ObjectID;

async function get(id){

    if(!id) throw "for get(id) you must provide an id"
    if(typeof id !== "string") throw "for get(id) id must be a string"
    if(!ObjectId.isValid(id)) throw "for get() object id is not of proper type"

    const _user= await users()
    const userFoundbyID = await _user.findOne({_id : ObjectId(id)})

    if(userFoundbyID === null) throw "for get(id) there is no such user with that id in the collection"

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
    const removed = await _user.deleteOne({ _id: ObjectId(id) })

    if(removed.deletedCount === 0) throw "there was a problem in remove() this user could not be remmoved"
    
    return removedUser
}

async function create(firstName, lastName, uName, pwd){
    if(!firstName) throw "for create() you must provide first name"
    if(!lastName) throw "for create() you must provide last name"
    if(!uName) throw "for create() you must provide username"
    if(!pwd) throw "for create() you must provide a password"

    if(typeof firstName != "string") throw "for create() first name isn't a string"
    if(typeof lastName != "string") throw "for create() last name isn't a string"
    if(typeof uName != "string") throw "for create() username must be a string"

    let newUser = {}

    const _users = await users()

    let unameAlreadyExists
    let regExPwd=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    
    acceptedPwd = ""
    acceptedUName = ""

    if(regExPwd.test(pwd)){
        acceptedPwd=pwd
    }
    else{
        throw "password doesnt satisfy all conditions\n"+
        "password between 8 to 15 characters which contain\n"+
        "at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
    }


    if(_users.length > 0){
        unameAlreadyExists = await _users.findOne({uName : uName})
    }

    if(unameAlreadyExists !== undefined){
        throw "Username is already taken, try another"
    }

    acceptedUName = uName

    newUser={
        firstName:firstName,
        lastName:lastName,
        uName:acceptedUName,
        pwd:acceptedPwd,
        superPowers:[]
    }

    const inserted = await _users.insertOne(newUser)

    if(inserted.insertedCount === 0) throw "there was a problem in create() this animal could not be added"

    const userAdded = await get(ObjectId(inserted.insertedId).toString())
    return userAdded
}

// async function addSuperPowers(id, superpowers){
//     if(!id) throw "for addSuperPowers(id) you must provide an id"
//     if(typeof id !== "string") throw "for addSuperPowers(id) id must be a string"
//     if(!ObjectId.isValid(id)) throw "for addSuperPowers() object id is not of proper type"

//     if(!superpowers) throw "for addSuperPowers() you must provide some input"
//     if(!Array.isArray(superpowers)) throw "for addSuperPowers you must provide an array"


//     const _users = await users()
//     const userFound = await _users.findOne({_id : ObjectId(id)})

//     let existingSuperPowers = userFound.superPowers.superPowerArray

//     updatedSuperPowers = Array.prototype.push.apply(existingSuperPowers, superpowers)

//     const superPowerAdded = await _users.updateOne( {_id: ObjectId(id)}, {$set:{superPowers: updatedSuperPowers}})

//     if(superPowerAdded.modifiedCount === 0) throw "there was a problem in addSuperPowers(), couldnt add this superpower"

//     return superPowerAdded

// }

async function main(){
    console.log(await addSuperPowers("5da959e36e51eb25a8904a8c", ["java", "c++"]))
//     console.log(await create("manoj", "salvi", "manu", "Sharma*18"))

}
main()