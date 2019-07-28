# 使い方

## DBのデプロイ

```
# kubectl apply -f deploy/deployment-db.yaml
# kubectl apply -f deploy/service-db.yaml
```

## WEBのデプロイ

```
# kubectl apply -f deploy/deployment-web.yaml
# kubectl apply -f deploy/service-web.yaml
```

## DBとWEBの削除

```
# kubectl delete service db web
# kubectl delete deployment db web
```