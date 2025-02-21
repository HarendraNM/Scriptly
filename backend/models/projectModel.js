import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    projlanguage:{
        type: String,
        required: true,
        enum: ['c++','java','python','csharp','c','javascript','go']
    },
    code:{
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    version:{
        type: String,
        required: true
    }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;