# Curriculum Routes

## All routes starts with `/curriculum`

--- 

### POST `/job-application/{jobApplicationId}`

Content-Type expected: `multipart/form-data`

Request body expected:

   ```
   {
    "file": File
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Jobapplication not found.

--- 

### GET `/{id}`

Response body expected:

   ```
   String //signed url to download the resume
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Jobapplication not found.

--- 

### DELETE `/{id}`

#### Returns

* `204 - NO CONTENT` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Jobapplication not found.

--- 
