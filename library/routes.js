
module.exports = {
    "user": {
        "url": "api/v/1/user/register",
        "method": "post",
        "payload": {
            "name":"Stark",
            "email":"stark@john.com",
            "phoneNumber":"9898989898",
            "password":"123",
            "confirmPassword":"123"
        },
        "url": "api/v/1/user/login",
        "method": "post",
        "payload": {
            "email":"stark@john.com",
            "password":"123"
        }
    },
    "movie": {
        "url": "api/v/1/movie",
        "method": "post",
        "payload": {
            "name": "Avengers",
            "released_on": "2020-02-02"
        },
        "url": "http://localhost:3000/api/v/1/movie/",
        "method": "get"
    }
}