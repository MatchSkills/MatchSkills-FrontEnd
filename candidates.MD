# Candidates Routes

## All routes starts with `/candidates`

--- 

### GET `/{id}`

Response body expected:

   ```
   {
    "id": Long
    "name": String
    "email": String
    "number": String
   }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid) .
* `401 - UNAUTHORIZED` - token invalid
* `404 - NOT FOUND  ` - user dont exists.

--- 

# NOT IMPLEMENTED ANYMORE

## Access -> auth endpoint for registrate a Candidate

### POST `/`

Request body expected:

   ```
   {
    "name": String
    "password": String
    "email": String
    "number": String
   }
   ```

Response body expected:

   ```
   {
    "id": Long
    "name": String
    "email": String
    "number": String
   }
   ```

#### Returns

* `201 - CREATED` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid) .
* `401 - UNAUTHORIZED` - token invalid
* `409 - CONFLICT  ` - user already exists.

--- 

### PUT `/`

### Only with Candidate Role

Request body expected:

   ```
   {
    "id": Long
    "name": String
    "email": String
    "number": String
   }
   ```

Response body expected:

   ```
   {
    "id": Long
    "name": String
    "email": String
    "number": String
   }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid) .
* `401 - UNAUTHORIZED` - token invalid
* `404 - NOT FOUND  ` - user dont exists.

--- 

### DELETE `/{id}`

### Only with Candidate Role

#### Returns

* `204 - NOT CONTENT` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid) .
* `401 - UNAUTHORIZED` - token invalid
* `404 - NOT FOUND  ` - user dont exists.

--- 

