import Message from "../models/Message";
import Coordinate from "../models/Coordinate";
// import { uuid } from 'uuidv4';

let messageId = 0;

const getNextId = () => (messageId++).toString();

export const createTextMessage = (text: string): Message => {
    return {
        type: 'text',
        id: getNextId(),
        text,
    }
}

export const createImageMessage = (uri: string): Message => {
    return {
        type: 'image',
        id: getNextId(),
        uri
    }
}

export const createLocationMessage = (coordinate: Coordinate): Message => {
    return {
        type: 'location',
        id: getNextId(),
        coordinate
    }
}