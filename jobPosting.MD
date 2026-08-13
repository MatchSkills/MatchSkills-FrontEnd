# JobPosting Routes

## All routes starts with `/jobs`

--- 

### GET `/{id}`

Response body expected:

   ```
   {
    "id": Long
    "companyId": String
    "title": String
    "description": String
    "local": String
    "createAt: String
    "targetHardskills": List<String>
    "targetSoftskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
   ```


#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `404 - NOT FOUND` - Job posting not found.

--- 

### GET

Pagination url (optional)

```/jobs?page=0&size=10```

``page`` - num of page (starts from 0)

``size`` - num content for page

Response body expected:

   ```
  {
    "content": [
        {
            "id": Long
            "companyId": String
            "title": String
            "description": String
            "local": String
            "createAt: String
        }
    ],
    "empty": Boolean,
    "first": Boolean,
    "last": Boolean,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 20,
        "paged": true,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "unpaged": false
    },
    "size": 20,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "totalElements": Long,
    "totalPages": Long
}
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).

---

### GET `/company/{id}`

Pagination url (optional)

```/jobs/company/{id}?page=0&size=10```

``page`` - num of page (starts from 0)

``size`` - num content for page

Response body expected:

   ```
  {
    "content": [
        {
            "id": Long
            "companyId": String
            "title": String
            "description": String
            "local": String
            "createAt: String
        }
    ],
    "empty": Boolean,
    "first": Boolean,
    "last": Boolean,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
        "offset": 0,
        "pageNumber": 0,
        "pageSize": 20,
        "paged": true,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "unpaged": false
    },
    "size": 20,
    "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
    },
    "totalElements": Long,
    "totalPages": Long
}
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `403 - FORBIDDEN` - Company is not owner of this JobPosting.

--- 

### POST `/create`

### Only Company

Request body expected:

   ```
   {
    "companyId": String
    "title": String
    "description": String
    "local": String,
    "targetHardskills": List<String>
    "targetSoftskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
   ```

Response body expected:

   ```
   {
    "id": Long
    "companyId": String
    "title": String
    "description": String
    "local": String
    "createAt: String
    "targetHardskills": List<String>
    "targetSoftskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
    }
   ```

#### Returns

* `201 - CREATED` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).

--- 

### PUT `/{id}/edit`

### Only Company

Request body expected:

   ```
   {
    "id": Long
    "companyId": String
    "title": String
    "description": String
    "local": String
    }
   ```

Response body expected:

   ```
   {
    "id": Long
    "companyId": String
    "title": String
    "description": String
    "local": String
    "createAt: String
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `403 - FORBIDDEN` - Company is not owner of this JobPosting.

--- 

### PUT `/{id}/targetSoftskill`

### Only Company

Request body expected:

   ```
   "targetSoftskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
   ```

Response body expected:

   ```
   {
    "id": Long
    "companyId": String
    "title": String
    "description": String
    "local": String
    "createAt: String
    "targetHardskills": List<String>
    "targetSoftskills": {
            "skill name": Long //Long is a level 1 to 5
        }
    }
   ```

#### Returns

* `200 - OK` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `403 - FORBIDDEN` - Company is not owner of this JobPosting.

--- 

### DELETE `/{id}/delete`

### Only Company

#### Returns

* `204 - NO CONTENT` - Sucess.
* `400 - BAD REQUEST` - Invalid parameters(null parameters, size invalid).
* `403 - FORBIDDEN` - Company is not owner of this JobPosting.

--- 