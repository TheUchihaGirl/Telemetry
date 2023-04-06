<h1>Node Server</h1>
<h2>Setup DB</h2>

Have a docker database setup in localhost. No need to change the port 1433<br>
No need to mention that in code<br>
Database name is grafana

<h2>Grafana</h2>
Install <a href="https://jhooq.com/prometheous-grafan-setup/">Grafana</a>.
By default it should be running in localhost:3000<br>
Default credentials are admin|1234<br>
Add datasource. Could be prometheus or sql server<br>
Create a required dashboard and add panels to it<br>
Make sure to save the panel!!
