import { TicketModel } from "./ticketModel"

export interface EventModel {
    id: number,
    name: string,
    shortDescription: string,
    fullDescription: string,
    date: Date,
    price: number,
    tickets: TicketModel[],
    address: string,
    postCode: number,
    city: string,
    organisationName: string,
    organisationCategory: string,
    organisationEventsCount: number,
    imageUrl: string,
    colorHex: string
}