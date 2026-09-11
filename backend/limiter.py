"""
Rate Limiter Configuration Module.

Instantiates SlowAPI limiter using client IP address for endpoint rate limiting.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Global Rate Limiter instance relying on remote address IP
limiter = Limiter(key_func=get_remote_address)
