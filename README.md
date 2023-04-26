# XSS/XSRF Beispiele

[Wilkommensseite](http://localhost:8080/welcome)
[Wilkommensseite mit Namen](http://localhost:8080/welcome?name=Sarah)
[Wilkommensseite mit XSS](http://localhost:8080/welcome?name=Sarah<script>alert('hehe%20ich%20hab%20dich%20gehacked')</script>)

[Login-Seite](http://localhost:8080/)
[XSRF-Attack](http://localhost:9090/)
