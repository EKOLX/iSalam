import Message from "../models/Message";
import Coordinate from "../models/Coordinate";
import { v4 as uuid } from 'uuid';

export const createTextMessage = (text: string): Message => {
    return {
        type: 'text',
        id: uuid(),
        text,
    }
}

export const createImageMessage = (uri: string): Message => {
    return {
        type: 'image',
        id: uuid(),
        uri
    }
}

export const createLocationMessage = (coordinate: Coordinate): Message => {
    return {
        type: 'location',
        id: uuid(),
        coordinate
    }
}