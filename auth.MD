# Auth Routes

## All routes starts with `/auth`

--- 

### POST `/register/company`

Request body expected:

   ```
   {
    "name": String
    "cnpj": String
    "email": String
    "password": String
    "address": String
    }
   ```

Response body expected:

   ```
{
    "tokens": {
        "accessToken": String
        "refreshToken": String
    },
    "company": {
        "id": Long
        "name": String
        "cnpj": String
        "email": String
        "address": String
    }
}
   ```

#### Returns

* `201 - CREATED` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).

--- 

### POST `/register/candidate`

Request body expected:

   ```
   {
    "name": String
    "email": String
    "password": String
    "number": String
    }
   ```

Response body expected:

   ```
{
    "tokens": {
        "accessToken": String
        "refreshToken": String
    },
    "candidate": {
        "id": Long
        "name": String
        "email": String
        "password": String
        "number": String
    }
}
   ```

#### Returns

* `201 - CREATED` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).

---

### POST `/login/company`

Request body expected:

   ```
   {
    "cnpj": String
    "password": String
    }
   ```

Response body expected:

   ```
{
    "tokens": {
        "accessToken": String
        "refreshToken": String
    },
    "company": {
        "id": Long
        "name": String
        "cnpj": String
        "email": String
        "address": String
    }
}
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Invalid CNPJ or password or company dont exists.

---

### POST `/login/candidate`

Request body expected:

   ```
   {
    "email": String
    "password": String
    }
   ```

Response body expected:

   ```
{
    "tokens": {
        "accessToken": String
        "refreshToken": String
    },
    "candidate": {
        "id": Long
        "name": String
        "email": String
        "password": String
        "number": String
    }
}
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Invalid email or password or candidate dont exists.

---

### POST `/logout`

Header expected:

``Authentication: Bearer <Access Token>``

Request body expected:

   ```
   {
    "refreshToken": String
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid format
* `401 - UNAUTHORIZED` - Invalid jwt.

---

### POST `/refresh`

Header expected:

``Authentication: Bearer <Access Token>``

Response body expected:

   ```
   {
    "accessToken": String
    "refreshToken": String
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid format
* `401 - UNAUTHORIZED` - Invalid jwt.