FROM public.ecr.aws/breezeware/ngnix:latest
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Docker build & run commands:
#   1. docker build -t dynamo-showcase-web .
#   2. docker run -it --rm --name dynamo-showcase-web -p 3000:80 dynamo-showcase-web
