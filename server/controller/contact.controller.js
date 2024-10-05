import { Contact } from "../model/contact.model.js"


export const contactPost=async(req, res)=>{
    try{
        const {name, email, message}=req.body
        const newContact=new Contact({name, email, message})
        await newContact.save()
        res.json({message:'Contact submitted successfully'})
    }catch(e){
        console.error(e)
        res.status(500).json({error: 'Server Error'})
    }
}
//get contact message

export const contactGet=async(req, res)=>{
    try{
        const contacts=await Contact.find()
        res.json(contacts)
    }catch(e){
        console.error(e)
        res.status(500).json({error: 'Server Error'})
    }
}


//delete contact message

export const contactDelete=async(req, res)=>{
    try{
        const contact=await Contact.findByIdAndDelete(req.params.id)
        if(!contact) return res.status(404).json({message: 'Contact not found'})
        res.json({message:'Contact deleted successfully'})
    }catch(e){
        console.error(e)
        res.status(500).json({error: 'Server Error'})
    }
}