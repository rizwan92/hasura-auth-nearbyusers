## JWT CONFIG in HASURA DOCKER

1. first generate private key file by running open ssl command

```
openssl genrsa -out private.pem 2048
```

2. Extract public key from private key

```
openssl rsa -in private.pem -pubout -outform PEM -out public.pem  // openssl rsa -in private.pem -pubout > public.pem
```

public.pem is PEM-encoded string or as an X509 certificate. You can use the public key to verify the signature of a JWT.

3. copy public.pem file to hasura docker container

```
HASURA_GRAPHQL_JWT_SECRET: '{"type":"RS512", "key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArFBBnf+N2Mstv5vh9xFMzgv0KxcUl1+ik/dQZLMqAF2DdELdElJTtonr8Ur81i+zvC3H3Z5YyEYIGwyN18q58GYtegMTinX+pQN1Ld7CgAa5aTf5w802lYQkXH9ZCqwGqWJqAZTT+SInV29jcOhncFddxPg76i/yhX3eMKtZcxV/Qr+MRPgfM4StRXjGBOxVezmLc7m5basDR+yPQVf3/9zXlY5t7VR3vxPnnTYGnqaBb7IdbNwKtS/FQqLzK1u7B8qDXin9A58Ssue5o5Z5UfyTRUEAnuGL5SvavkZENeg/V047muKLLiIEZCpPe8jVTMEjbe+R6/LJg3BrdmR5BQIDAQAB\n-----END PUBLIC KEY-----\n"}'
```

## CUSTOM FUCNTIONS

```
CREATE FUNCTION neary_by_user(userid Integer, radius Integer)
RETURNS SETOF public.user AS $$

SELECT id,first_name,last_name,gender,distance
FROM public.user u
JOIN public.user_tracking ut
ON  u.id = ut.user_id
WHERE u.id != userid AND
(ST_Distance(
	ST_Transform(
		(SELECT ST_SetSRID(ST_MakePoint(t.lng,t.lat),4326) FROM public.user_tracking t WHERE t.user_id = userid),3857
	),
	ST_Transform(ST_SetSRID(ST_MakePoint(ut.lng,ut.lat),4326),3857)
) / 1000) < radius

$$ LANGUAGE sql STABLE;

```
