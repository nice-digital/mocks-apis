# Mock search api

> Gives mock hard coded responses to certain search api endpoints

## Getting started

- `npm i`
- `npm start` (if you need to a specify port set your env before running eg. `PORT=3000 npm start`)

 
## Usage

The initial intended use for these mock responses is for any consuming application of the search service to be able to have a stable response for functional testing.

This folder comes with a Dockerfile so that it can be built straight from the git url.  For example:

`docker build https://github.com/nice-digital/mocks-apis.git#main:search-apis -t mock-search-api` should build the image `mock-search-api`. 

To run the container:

`docker run --publish 3000:3000 --name=search-api -d mock-search-api`

Now you should be able to go to any of these links:

http://localhost:3000/api/typeahead?q=re&index=cks (typeahead no results)
http://localhost:3000/api/typeahead?q=ast&index=cks (typeahead results)
http://localhost:3000/api/search?q=asdfg&index=cks (search no results)
http://localhost:3000/api/search?q=cancer&index=cks (search results)


