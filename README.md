# Mock api

> Static mock API responses for various backend systems, for use in functional tests in Docker

## Getting started

- `cd` into a sub folder
  - For example `cd search-apis` for the Single Search Endpoint (SSE)
  - or `cd publications` for a mock Publications API
- `npm ci`
- `npm start` (if you need to a specify port set your env before running eg. `PORT=3000 npm start`)
 
## Usage

The initial intended use for these mock responses is for any consuming application of these APIs to be able to have a stable response for functional testing.

Each folder comes with a Dockerfile so that it can be built straight from from a subfolder in GitHub. For example:

```
docker build https://github.com/nice-digital/mocks-apis.git#main:<SUB_FOLDER> -t <SOME_IMAGE_TAG>
```

### Single Search Endpoint

Build the docker image with:

```
docker build https://github.com/nice-digital/mocks-apis.git#main:search-apis -t mock-search-api
```

Then run it with:

```
docker run --publish 80:80 --name=mock-search-api -d mock-search-api
```

The available endpoints will then be:

- http://localhost:3000/api/typeahead?q=re&index=cks (typeahead no results)
- http://localhost:3000/api/typeahead?q=ast&index=cks (typeahead results)
- http://localhost:3000/api/search?q=asdfg&index=cks (search no results)
- http://localhost:3000/api/search?q=cancer&index=cks (search results)

See the [search-apis/data](search-apis/data) folder for which indices and search terms are supported.

### Publications

Build the docker image with:

```
docker build https://github.com/nice-digital/mocks-apis.git#main:publications -t mock-publications
```

Then run it with:

`docker run --publish 80:80 --name=mock-publications -d mock-publications`

The available endpoints will then be:

- http://localhost:3000/feeds/product/ind63 (single Indicator product)

See the [publications/data](publications/data) folder for which products are supported.

## Docker compose

Consume one of the mock services (e.g. SSE) in Docker compose like this:

```
  mock-search-api:
    build: https://github.com/nice-digital/mocks-apis.git#main:search-apis
    container_name: mock-search-api
    ports:
      - "80:80"
    networks:
      default:
        aliases:
          - mock-search-api.nice.org.uk
```

