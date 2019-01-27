import { DB } from "..";
import Validator from "../../src/HttpServer/Validator";
import Joi from "../../src/Joi/Joi";
import { IBlacklist, IBlacklostModel } from "../Models/Blacklist.d";
import BlacklistCollectionResource from "../Resources/BlacklistCollectionResource";
import BlacklistResource from "../Resources/BlacklistResource";

const Blacklist = DB.getModel<IBlacklist, IBlacklostModel>("Blacklist");

export default class ContactController {
    public static async getBlacklist(req: any, res: any, next: any) {
        try {

            const { offset } = Validator(req.query, { offset: Joi.number() });
            const { id } = req.user;

            const contacts = await Blacklist.find({ user_id: id });

            next(new BlacklistCollectionResource(contacts, { user_id: id, offset }));

        } catch (err) {
            next(err);
        }
    }

    public static async addToBlacklist(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id: bannedId } = Validator(req.body, { id: Joi.objectId() });

            const contact = await Blacklist.addToBlacklist(userId, bannedId);

            next(new BlacklistResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async deleteFromBlacklist(req: any, res: any, next: any) {
        try {

            const { id } = Validator(req.params, { id: Joi.objectId() });

            await Blacklist.removeFromBlacklist(id);

            res.json({ message: "successfully" });

        } catch (err) {
            next(err);
        }
    }

}
