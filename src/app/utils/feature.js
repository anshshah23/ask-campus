import mongoose from "mongoose";

const connect = {};
export async function mongoConnect() {
    if (connect.isConnected) {
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        connect.isConnected = db.connection.readyState;
        console.log("Connection Successful...");
    } catch (err) {
        console.error(err.message);
        throw new Error("MongoDB connection error");
    }
}

export function calculateCosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));

    return dotProduct / (magnitudeA * magnitudeB);
}
