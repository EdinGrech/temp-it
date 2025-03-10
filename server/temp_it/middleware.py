class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['Access-Control-Allow-Origin'] = '*' # Replace with your frontend origin
        response['Access-Control-Allow-Headers'] = '*' # Allow any custom headers
        response['Access-Control-Allow-Methods'] = '*' # Allow any HTTP methods
        return response