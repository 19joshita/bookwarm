import mongoose from 'mongoose'

 const connectDb = async () => { 
    try{
    const conn = await mongoose.connect(process.env.MONGO_URL)
    console.log(`connect to server successfully ${conn.connection.host}`)
    }catch(error){
        console.log(`Server is Disconnected ${error}`)
    }

} 
export default connectDb