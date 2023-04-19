# Mock api

> For now only mock hard coded responses to certain search api endpoints are held in this repository.  Later other mock responses can be held here.

## Getting started

- `cd search-apis` (For now we just have mock data for search, in the future, this may change)
- `npm i`
- `npm start` (if you need to a specify port set your env before running eg. `PORT=3000 npm start`)

 
## Usage

The initial intended use for these mock responses is for any consuming application of the search service to be able to have a stable response for functional testing.

This folder comes with a Dockerfile so that it can be built straight from the git url.  For example:

```
docker build https://github.com/nice-digital/mocks-apis.git#main:search-apis -t mock-search-api
```

should build the image `mock-search-api`. 

To run the container:

`docker run --publish 80:80 --name=search-api -d mock-search-api`

Now you should be able to go to any of these links:

- http://localhost:3000/api/typeahead?q=re&index=cks (typeahead no results)
- http://localhost:3000/api/typeahead?q=ast&index=cks (typeahead results)
- http://localhost:3000/api/search?q=asdfg&index=cks (search no results)
- http://localhost:3000/api/search?q=cancer&index=cks (search results)

## Docker compose

Consuming this image in another docker compose file can be done like so:

```
  mock-api:
    build: https://github.com/nice-digital/mocks-apis.git#main:search-apis
    container_name: mock-api
    ports:
      - "3000:3000"
    networks:
      default:
        aliases:
          - test-search-api.nice.org.uk
```

