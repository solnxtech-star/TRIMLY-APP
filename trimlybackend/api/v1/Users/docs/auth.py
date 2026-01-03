from drf_spectacular.utils import extend_schema
from api.v1.Users.serializers import (
    EmailLoginSerializer,
    CustomRegisterSerializer,
)

login_schema = extend_schema(
    request=EmailLoginSerializer,
    responses={200: None},
    description="Login using email and password",
)

register_schema = extend_schema(
    request=CustomRegisterSerializer,
    responses={201: None},
    description="Register using email and password",
)
