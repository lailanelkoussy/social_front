importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    {
        "url": "index.html",
        "revision": "eb3f198b65aa45ade83493dc4b0dc493"
    },
    {
        "url": "manifest.json",
        "revision": "c136836924cf3cb72625ea9e2e371e7b"
    },
    {
        "url": "src/css/style.css",
        "revision": "20c59d9b8adb3b20e267aa0b3a6c9636"
    },
    {
        "url": "src/html/group.html",
        "revision": "165110274c9b6a6bcda3e428f2da94be"
    },
    {
        "url": "src/html/groups.html",
        "revision": "77c3542cf279d2a7221ba7d7f9d3de75"
    },
    {
        "url": "src/html/homepage.html",
        "revision": "246f7e7b71b42890b961a23f590b435b"
    },
    {
        "url": "src/html/personalProfile.html",
        "revision": "664352416e732c98eb479fcfa713895a"
    },
    {
        "url": "src/html/profile.html",
        "revision": "d3ffe0b09dfbd249856baf4b1212f5fc"
    },
    {
        "url": "src/html/searchResults.html",
        "revision": "42291e2dcdce689861f91306863e786d"
    },
    {
        "url": "src/html/signup.html",
        "revision": "1ee5ab63ea56b194264c7ea8404ef2a2"
    },
    {
        "url": "src/js/groups.js",
        "revision": "edfc07d5e5d05ef4dd5fc704f1d72bb7"
    },
    {
        "url": "src/js/home.js",
        "revision": "1e59ff4eb6570fb81fda30471ef21ece"
    },
    {
        "url": "src/js/homepage.js",
        "revision": "2096c9a1342aa0b11984b871954020c1"
    },
    {
        "url": "src/js/profile.js",
        "revision": "4e84ebb05b109ad60e2ccb4988490d61"
    },
    {
        "url": "src/js/search.js",
        "revision": "90d79d6aa927fdfad91548752add7033"
    },
    {
        "url": "src/js/sessionCheck.js",
        "revision": "52e5d9a08411d6ec120a9bd293124c4e"
    },
    {
        "url": "src/js/signin.js",
        "revision": "c2fe4f08ebb227b47f132427435aee1f"
    },
    {
        "url": "src/js/signUpValidation.js",
        "revision": "7b919b24774c29465ef435097e307d77"
    },
    {
        "url": "src/js/uploadPhoto.js",
        "revision": "621dd3176307c237602b478b9e82b82b"
    },
    {
        "url": "sw.js",
        "revision": "8f4ce310da36d8ccaf8f9b6bbb1df6da"
    },
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
]);
//
