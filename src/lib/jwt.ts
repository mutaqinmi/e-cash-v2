import jwt from 'jsonwebtoken';

export class Token {
    constructor(public payload: object){
        this.payload = payload;
    }

    public static generate(payload: object)  {
        return jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: '1d'});
    }

    public static verify(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    }
}