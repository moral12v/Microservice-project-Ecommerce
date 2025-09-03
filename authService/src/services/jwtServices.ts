import { API_SECRET } from "../config";
import { TokenPayloadDTO } from "../dtos/jwtDTO";
import jwt from 'jsonwebtoken'

export function generateToken(payload: TokenPayloadDTO): string {
    const timeToExpire = 3;
    const sec = timeToExpire * 3600;
    const expireTimeHoursLater: any = Date.now() / 1000 + sec;
    return jwt.sign({ ...payload, exp: expireTimeHoursLater }, API_SECRET);
 }
 