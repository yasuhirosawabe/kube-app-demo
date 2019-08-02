# README

## はじめに

本プロジェクトは下記資料向けに作成したサンプルアプリです。

https://docs.google.com/presentation/d/e/2PACX-1vQEFmAFyslw29r_20izfO_aUWH_vUG4oJ5LYi8jgBqjaSTXQor0yt1uaywCGP6DvLir4nisYXyYskKT/pub?start=false&loop=false&delayms=1000

本アプリを利用する際は、上記スライドを参照してからの方がより理解しやすいと思います。

## アプリの仕様と構成

![アプリの仕様と構成](assets/image01.png)

### 仕様と構成

* 顧客情報を登録して一覧表示できるWebアプリ
* Webアプリはnodejs(express)、DBはmongodb
* Webアプリは高可用性/負荷分散のため2台構成
* DBのデータはマシン上のHDDに永続化(NFSとか使ってない)

###  その他

* WebアプリのデプロイではRolling Update(無停止更新)が試せる

## デプロイ手順

アプリのデプロイ手順について説明します。

### DBのデプロイ

1. Volumeの作成  
PersistentVolumeとPersistentVolumeClaimの作成
1. Databaseのデプロイ  
Deploymentの作成してReplicaSetとPodを生成する
1. Databaseのエンドポイント(ネットワーク経路)作成  
Serviceの作成

#### Volumeの作成

下記のコマンドを実行してVolumeを作成する。

```
$ kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/db/volume.yaml
```

作成に成功すると、下記のコマンドで「PersistentVolume」と「PersistentVolumeClaim」が作成されていることが確認できる。

```
$ kubectl get pv
NAME      CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS    CLAIM        STORAGECLASS   REASON    AGE
db        10Gi       RWO            Delete           Bound     default/db   hostpath                 1d
```

```
$ kubectl get pvc
NAME      STATUS    VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS   AGE
db        Bound     db        10Gi       RWO            hostpath       1d
```

上が「PersistentVolume」下が「PersistentVolumeClaim」

「PersistentVolume」では「hostpath(マシンのHDD上)」に10GBのストレージ領域を確保し、  
「PersistentVolumeClaim」で上記10GBのストレージ領域のうち、10GB(すべての領域)を「Pod」の「Volume」として利用できるよう確保(要求)している。


#### Databaseのデプロイ

下記のコマンドでDatabaseをデプロイする。

```
$ kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/db/deployment.yaml
```

デプロイすると、「Deployment」「ReplicaSet」「Pod」がそれぞれ１つずつ作成される。作成されたかどうかは下記のコマンドで確認することができる。

```
$ kubectl get all
NAME                       READY     STATUS    RESTARTS   AGE
pod/db-7dbc64fdd5-cbmsf    1/1       Running   0          1d

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          1d

NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/db    1         1         1            1           1d

NAME                             DESIRED   CURRENT   READY     AGE
replicaset.apps/db-7dbc64fdd5    1         1         1         1d
```

Deployment「deployment.apps/db」、ReplicaSet「replicaset.apps/db-7dbc64fdd5」、Pod「pod/db-7dbc64fdd5-cbmsf」が作成されているのがわかる。

なお、上記Pod内では、先ほど作った「PersistentVolumeClaim」と「Volume」の紐づけが行われている。  
紐づけの定義だが「Deployment」で行われている。マニフェストファイル(deployment.yaml)でいうとちょうど下記にあたる。


```yaml
volumes:
- name: mongo-db
  persistentVolumeClaim:
    claimName: db
```

これにより「Pod」内に「mongo-db」という「Volume」が作られ、

```yaml
containers:
- name: mongo
(...中略...)
volumeMounts:
- name: mongo-db
    mountPath: /data/db
```

上記定義により「Pod」内の「mongo」というコンテナの「/data/db」にマウントしている。

これらにより、Databaseのデータが永続化される。


#### Databaseのエンドポイント(ネットワーク経路)作成

下記のコマンドで他の「Pod」からDatabaseの「Pod」に参照できるようエンドポイントを作成する。

```
$ kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/db/service.yaml
```


```
$ kubectl get all
NAME                       READY     STATUS    RESTARTS   AGE
pod/db-7dbc64fdd5-cbmsf    1/1       Running   0          1d

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/db           ClusterIP      10.96.78.37     <none>        27017/TCP        1d
service/kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          1d

NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/db    1         1         1            1           1d

NAME                             DESIRED   CURRENT   READY     AGE
replicaset.apps/db-7dbc64fdd5    1         1         1         1d
```

Service「service/db」が作成されているのがわかる。

なお、他の「Pod」からアクセスする場合は「db」というホスト名でアクセスすることができるようになる。


### WEBのデプロイ

DBのデプロイとは「Volume」の作成がないだけで、大きく違いはないので詳細な説明は省く。  
下記のコマンドで「Deployment」と「Service」を作成する。

```
$ kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/web/deployment.yaml
$ kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/web/service.yaml
```

```
$ kubectl get all
NAME                       READY     STATUS    RESTARTS   AGE
pod/db-7dbc64fdd5-cbmsf    1/1       Running   0          1d
pod/web-6cbccb5c8c-vhpmx   1/1       Running   0          1d
pod/web-6cbccb5c8c-xv2td   1/1       Running   0          1d

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/db           ClusterIP      10.96.78.37     <none>        27017/TCP        1d
service/kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          1d
service/web          LoadBalancer   10.109.33.168   localhost     3000:32416/TCP   1d

NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/db    1         1         1            1           1d
deployment.apps/web   2         2         2            2           1d

NAME                             DESIRED   CURRENT   READY     AGE
replicaset.apps/db-7dbc64fdd5    1         1         1         1d
replicaset.apps/web-5674b7d8d6   2         2         2         1d
```

Deployment「deployment.apps/web」とReplicaSet「replicaset.apps/web-5674b7d8d6」が作成され、replica数を２つに指定しているのでPodが「pod/web-6cbccb5c8c-vhpmx」と「pod/web-6cbccb5c8c-xv2td」の２つ作成されているのがわかる。

また、Service「service/web」も作成されているのがわかる。ここで注目すべきは「Service」のTypeが「LoadBalancer」になっている点。

「ClusterIP」の場合はK8sクラスタ内で公開できるようネットワークが構成されるが、「LoadBalancer」の場合はクラスタ外部からアクセスできるようになる。

「http://localhost:3000」でアプリにアクセスすることができる。

![キャプチャ](assets/image02.png)


## アップデート

```
# kubectl apply -f https://raw.githubusercontent.com/yasuhirosawabe/sample-app-for-kube-deploy/master/deploy/web/deployment-update.yaml
```

## DBとWEBの削除

```
# kubectl delete service db web
# kubectl delete deployment db web
# kubectl delete pvc db
# kubectl delete pv db
```