#for local testing/or local docker container
image=docker-react-layout-manager
container=docker-layout-manager
port=3144
#should coming from git commit hash
version=1

docker stop $container
docker image rm $image
docker rm $container
docker build -t $image -f Dockerfile . --build-arg REACT_APP_VERSION=$version
docker run --restart=always --env PORT=80 -d -p $port:80 --name $container $image
