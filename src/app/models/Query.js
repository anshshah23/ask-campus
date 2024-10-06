import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending','inProgress', 'completed'],
        default: 'pending',
    },
    completedAt: {
        type: Date, 
    },
    urgencyType: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        default:null
    },
    embedding: {
        type: [Number],
        default: null,
    }
});

const studentQuerySchema = new mongoose.Schema({
    
    phoneNo: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    queries: [querySchema],
});

export const StudentQuery = mongoose.models.StudentQuery || mongoose.model('StudentQuery', studentQuerySchema);