import time

class ResponseTimeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        response["X-Response-Time-ms"] = f"{(time.perf_counter() - start) * 1000:.2f}"
        return response

from django.db import connection

class DBQueryCountMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        response["X-DB-Queries"] = str(len(connection.queries))
        if connection.queries:
            response["X-DB-Time-ms"] = str(
                sum(float(q["time"]) for q in connection.queries) * 1000
            )

        return response
