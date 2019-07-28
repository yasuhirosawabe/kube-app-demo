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

## アップデート

```
# kubectl edit deployment web
image: usalab/kube-app-demo-web:0.0.1
 ↓↓↓変更↓↓↓
image: usalab/kube-app-demo-web:0.0.2
```

## DBとWEBの削除

```
# kubectl delete service db web
# kubectl delete deployment db web
# kubectl delete pvc db-pvc
```