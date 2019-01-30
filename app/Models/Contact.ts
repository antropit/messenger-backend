import { Mongoose, Schema } from "mongoose";

const ContactSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", unique: false, index: true, required: true },
    contact: { type: Schema.Types.ObjectId, ref: "User" },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

ContactSchema.static("addContact", async function(userId: string, contactId: string, byname: string) {
    return await this.findOneAndUpdate({ user: userId, contact: contactId },
        { $set: { user: userId, contact: contactId, byname }, $setOnInsert: { added_at: Date.now() }},
        { upsert: true, new: true });
});

ContactSchema.static("updateContact", async function(id: string, userId: string, byname: string) {
    return await this.findOneAndUpdate({ _id: id, user: userId },
        { $set: { byname }}, { new: true });
});

ContactSchema.static("deleteContact", async function(id: string, userId: string) {
    return await this.deleteMany({ _id: id, user: userId });
});

export default (mongoose: Mongoose) => mongoose.model("Contact", ContactSchema, "users.contacts");