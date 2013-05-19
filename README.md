h2ash
=====

Guiding principles
==================
Use dictionaries and functions that work on these dictionaries.
  - This allows for code to be shared between the FE and BE and *simple* JSON transport
  

Milestone 1:
============
Website with method to create a new object at the BE.
BE to persist the item to the DB
FE to update movement of object client side
FE to synch with BE



Notes
======
* Caught by this vs that again
* Underscore rocks - Their each methods are much better than my own ones
* key in object : eg. x = {a:'a',b:'b'}, 'a' in x => true, 'd' in x => false 
* x = [] , x instanceof Array => true
* If i can get the same functionality with less code then the less code option should win. This might mean less
  features but the base is more solid.
  
ToDo
=====
* Have a look at what is the fastest way to get stuff into redis. hset or hsetall etc etc ...  
  

Usefull links
=============
* nginx load balancing : [http://wiki.nginx.org/LoadBalanceExample]
* installing phantonjs : [http://www.joyceleong.com/log/installing-phantomjs-on-ubuntu/]

Links to libraries used
=======================
* bootstrap : [http://twitter.github.com/bootstrap/index.html]
* casperjs : [http://casperjs.org/testing.html]


To get a local copy 
===================
1) checkout 
   git checkout ???

2) install dependencies
   npm install
   
   
