# 使い方

## DBのデプロイ

```
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/db/volume.yaml
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/db/deployment.yaml
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/db/service.yaml
# kubectl get all
```

## WEBのデプロイ

```
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/web/deployment.yaml
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/kube-app-demo/master/deploy/web/service.yaml
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
# kubectl delete pvc db
# kubectl delete pv db
```