import Coordinate from './Coordinate';

export default interface Message {
    id: string;
    type: 'text' | 'image' | 'location';
    text?: string;
    uri?: string;
    coordinate?: Coordinate;
}