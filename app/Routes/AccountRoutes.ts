import {Express} from "express";
import AccountController from "../Controllers/AccountController";
import ContactController from "../Controllers/ContactController";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.put("/account", AccountController.update);

    this.get("/account/contacts", ContactController.get);
    this.get("/account/contacts/:id", ContactController.getById);
    this.post("/account/contacts/", ContactController.AddAccount);

}
