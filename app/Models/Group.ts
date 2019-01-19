import {Model, Mongoose, Schema} from "mongoose";
import {IGroup} from "./Group.d";
import {IGroupMember, IGroupMemberModel} from "./GroupMember.d";
import {IUser} from "./User.d";

let GroupMember: IGroupMemberModel;

const GroupSchema = new Schema({
    creator: {type: String, required: true},
    name: {type: String, required: true, trim: true},
    description: {type: String, default: null, trim: true},
    invitingCode: {type: String, default: null},
    }, {
    timestamps: {createdAt: "created_at", updatedAt: false},
});

GroupSchema.method("isCreator", function(user: string | IUser) {
    if (typeof user !== "string") user = user._id.toString();

    return this.creator === user;
});

GroupSchema.method("isMember", async function(user: string | IUser) {
    return await GroupMember.isMember(this, user);
});

GroupSchema.method("addMember", async function(user: string | IUser) {
    return await GroupMember.addMemberTo(this, user);
});

GroupSchema.method("deleteMember", async function(member: string | IUser) {
    return await GroupMember.deleteMemberFrom(this, member);
});

GroupSchema.method("getMembers", async function(offset?: number, limit?: number) {
    return await GroupMember.getMembersFor(this, offset, limit);
});

GroupSchema.static("getGroup", async function(id: string) {
    return await this.findById(id);
});

GroupSchema.static("getGroupByInvitationCode", async function(invitation_code: string) {
    return await this.findOne({invitingCode: invitation_code});
});

GroupSchema.static("addGroup", async function(user: string | IUser, name: string, description?: string) {
    let userId = user;
    if (typeof user !== "string") userId = user._id.toString();
    return await this.create({name, description, creator: userId, invitingCode:null});
});

GroupSchema.method("updateGroup", function(name?: string, description?: string) {
    this.name = name || this.name;
    this.description = description || this.description;
    return;
});

// GroupSchema.method("getInvite", function() {
//     return this.invitingCode;
// });

GroupSchema.static("createInvite", async function(group: IGroup) {
    let invitation_code = "invite" + Math.random() * Math.random() * 1000000;
    let foundedGroup = await this.findOne({invitingCode: invitation_code});
    while (foundedGroup) {
        invitation_code = "invite" + Math.random() * Math.random() * 1000000;
        foundedGroup = await this.findOne({invitingCode: invitation_code});
    }
    group.invitingCode = invitation_code;
    return;
});

GroupSchema.method("deleteInvite", function() {
    this.invitingCode = null;
    return;
});

export default function(mongoose: Mongoose) {
    this.on("registeredAllModels", () => GroupMember = this.getModel("GroupMember"));
    return mongoose.model("Group", GroupSchema);
}
