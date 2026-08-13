# Jobapplication Routes

## All routes starts with `/job-application`

--- 

### POST `/create`

### Only with Candidate Role

Request body expected:

   ```
   {
    "jobpostingId": Long
    "candidateId": Long
    "candidateName": String
    "hardskills": List<String>
    }
   ```

Response body expected:

   ```
   {
    "id": Long
    "jobpostingId": Long
    "candidateId": Long
    "candidateName": String
    "hardskills": List<String>
    "softskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    "createAt": String
    }
   ```

#### Returns

* `201 - CREATED` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `409 - CONFLICT` - Candidate already applied to this jobposting.

--- 

### PUT `/edit-softskills`

Request body expected:

   ```
   {
    "id": Long
    "softskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
   ```

Response body expected:

   ```
   {
    "id": Long
    "jobpostingId": Long
    "candidateId": Long
    "candidateName": String
    "hardskills": List<String>
    "softskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    "createAt": String
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Jobapplication not found.

--- 

### GET `/jobposting/{id}`

### Only with Company Role

Header expected:

``Authorization: Bearer <Access Token>``

Response body expected:

   ```
   [
       {
            "candidateName": String
            "matchSoftSkillsPercent": Long
            "matchHardSkillsPercent": Long
       }
   ]
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `401 - UNAUTHORIZED` - token invalid, expired or in blacklist.
* `403 - FORBIDDEN` - Company is not owner of this JobPosting.
* `404 - NOT FOUND` - JobPosting not found.

--- 
