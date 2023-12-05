# CrimeMiner

## Install NodeJS
- Download & Install Node.js 18.18.1 LTS
- Open CMD, go to path of the project and run this command `npm install`

## Install Python
- Download & Install Python version 3.11.5 Ad oggi se si installa la versione 3.12.0 di python non ci consente di scaricare la libreria django-neomodel utile per django.
- Open CMD, go to path of the project and run this command `pip install -r requirements.txt`

## Install JDK 17 
- Download & Install JDK on this link https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Create new variable JAVA_HOME and set value as "C:\Program Files\ `JDK 17`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `JDK 17`\bin"

## Install Neo4j on Windows (Versione semplificata con neo4j già fornito)
- Download Neo4j Community 5.12.0 folder on this link https://drive.google.com/file/d/1P3TJL8pJirJEB7Pw_XHCD1eqwhVjK-ZP/view?usp=sharing
- Move the downloaded `<neo4j_folder>` to C:\Program Files to grant access to neo4j files
- Create new variable NEO4J_HOME and set value as "C:\Program Files\ `<neo4j_folder>`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `<neo4j_folder>`\bin"

## Install Neo4j on Windows Secondo caso (Nel caso in cui neo4j folder non sià più disponibile. Non seguire questi passi se sono stati realizzati quelli precedenti)
- Download Neo4j Community 5.12.0 folder
- Move the downloaded `<neo4j_folder>` to C:\Program Files to grant access to neo4j files
- Create new variable NEO4J_HOME and set value as "C:\Program Files\ `<neo4j_folder>`" in System Variables
- Go to System Enviroment Variables and modify 'Path' Variable 
- Add "C:\Program Files\ `<neo4j_folder>`\bin"
- Open CMD and run the following command: "cd C:\Program Files\neo4j\bin"
- Now run the command: "neo4j install-service" and service will be installed
- Now install some plugins for the graph:
    - Download [APOC Library 5.12.0](https://github.com/neo4j/apoc/releases/tag/5.12.0)
    - Download [Graph Data Science 2.5.0](https://github.com/neo4j/graph-data-science/releases/tag/2.5.0)
    - Add downloaded libraries into <neo4j_folder>\plugins
    - Add following line at the bottom of file <neo4j_folder>\conf\neo4j.conf "dbms.security.procedures.unrestricted=algo.\*,apoc.\*" If you open the README on a editor don't use this "\" in algo. and apoc.
- Now go to "C:\Program Files\ `<neo4j_folder>`\data\dumps"
- Insert the file "neo4j.dump" and open CMD (contact the administrators for neo4j.dump file)
- Now run the command: "neo4j-admin database load --overwrite-destination=true neo4j" and the database is populated



## Start Neo4j
- Open CMD as Administrator and just execute `<neo4j_folder>\bin\neo4j console` and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Credentials username: "neo4j" and password: "neo44%*j" for enter db on URL

## Start Neo4j Secondo caso(Non fare se eseguito il precedente Start Neo4j)
- Open CMD as Administrator and just execute `<neo4j_folder>\bin\neo4j console` and Neo4j will start listening on the default port with URL "localhost:7474/browser"
- Enter init credentials username: "neo4j" and password: "neo4j"
- Neo4j will redirect you to a new password web-page and here you have to enter the project password: "neo44%*j"

## Install Project in VSCode
- Download the projet with zip on GitHub and the open the folder of the project on VSCode (Not the zip).

## CrimeMiner Start Application
- Open CMD, go to path of the project 
- Then run the following command: "neo4j console"
- After neo4j is running, open another CMD and run the following command: "npm run full" (Nota non eseguire npm run full prima di neo4j console altrimenti le metriche del progetto non andranno)
- Open Browser and write "localhost:8000/CrimeMiner/"
- For stop server use command ctrl+c

## Struttura del progetto
  E' stato utilizzato un modello MTV che corrisponde al MVC
  Per comprendere la struttura del progetto visitare il seguente link https://medium.com/@samueleresca/developing-mvc-using-django-and-visual-studio-2015-part-1-fdcca754d310