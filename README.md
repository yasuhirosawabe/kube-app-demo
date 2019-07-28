# 使い方

## DBのデプロイ

```
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/deployment-db.yaml
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/service-db.yaml
# kubectl get all
```

## WEBのデプロイ

```
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/deployment-web.yaml
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/service-web.yaml
# kubectl get all
```

## DBとWEBの削除

```
# kubectl delete service db web
# kubectl delete deployment db web
```