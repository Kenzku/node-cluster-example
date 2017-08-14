# node-cluster-example

`npm start` will start cluster mode at port 3001

`npm start -- port=3000 cluster=false` will start regular mode at port 3000

you can config your Nginx to serve different port

at file: `nginx.conf`
```conf
    # Fibonacci Test
    upstream FibonacciTestThroughput {
        server localhost:3000;
    }
    upstream FibonacciTestComputation {
        server localhost:3001;
    }
    server {
        listen       80;
        server_name  localhost;

        location / {
            # serving static files, fast routes etc
            proxy_pass http://FibonacciTestThroughput;
        }

        location /fast {
            # server fast route
            proxy_pass http://FibonacciTestThroughput;
        }

        location ~ ^/slow {
            proxy_pass http://FibonacciTestComputation;
        }

        location ~ ^/async {
            proxy_pass http://FibonacciTestComputation;
        }
    }
``` 