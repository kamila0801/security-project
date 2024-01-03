import { EventModel } from "./eventModel";

export interface OrganisationModel {
    id:  number,
    name: string,
    tagline: string,
    address: string,
    postCode: number,
    city: string,
    description: string,
    phoneNumber: number,
    email: string,
    category: string,
    colorHex: string,
    imageUrl: string,
    events?: EventModel[]
}