import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { fromEnv } from "lib:utils/etc";

const ISSUER = fromEnv('JWT_ISSUER');
const AUDIENCE = fromEnv('JWT_AUDIENCE');

export interface User {
    id: string,
    email: string,
    name: string
}

interface Payload {
    user: User
}

export const sign = async (payload: User, exp?: string) => {
    const secret = fromEnv('JWT_SECRET');
    const encoded_secret = new TextEncoder().encode(secret)
    const alg = 'HS256'

    const jwt = await new SignJWT({ user: payload })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setExpirationTime(exp || '7d')
        .sign(encoded_secret)

    return jwt
}

export const verify = async (jwt: string) => {
    const secret = fromEnv('JWT_SECRET');
    const encoded_secret = new TextEncoder().encode(secret)
      
    try {
        const { payload } = await jwtVerify<Payload>(jwt, encoded_secret, {
            issuer: ISSUER,
            audience: AUDIENCE,
        })
        
        return payload.user
    } catch (e) {
        return null
    }
}

type AuthFailed = {
    type: 'failed',
    value: null
}

type AuthPassed = {
    type: 'passed',
    value: User
}

type AuthRefresh = {
    type: 'refresh',
    value: string
}

type FactoryResult = AuthFailed | AuthPassed | AuthRefresh;

import log from "lib:utils/log";
export const factory = async (jwt?: string, refresh?: string): Promise<FactoryResult> => {
    if(jwt && jwt.length > 0) {
        const token = await verify(jwt);
        if(token) {
            return {
                type: 'passed',
                value: token
            }
        }
    }
    if(refresh) {
        const refresh_token = await verify(refresh);
        if(refresh_token) {
            const new_jwt = await sign({
                id: refresh_token.id,
                email: refresh_token.email,
                name: refresh_token.name
            })
    
            log.info(`${refresh_token.email} regenerated his JWT token using the refresh token.`)
            return {
                type: 'refresh',
                value: new_jwt
            }
        }
    }
    return {
        type: 'failed',
        value: null
    }
}